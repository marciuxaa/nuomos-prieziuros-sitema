const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
    const { full_name, email, password, role } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'Toks el. pastas jau egzistuoja' });
        }

        const hash = bcrypt.hashSync(password, 10);

        db.query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [full_name, email, hash, role],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Klaida kuriant vartotoja' });
                res.json({ message: 'Vartotojas sukurtas' });
            }
        );
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (result.length === 0) {
            return res.status(400).json({ message: 'Neteisingas el. pastas arba slaptazodis' });
        }

        const user = result[0];
        const passwordMatch = bcrypt.compareSync(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Neteisingas el. pastas arba slaptazodis' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role, name: user.full_name });
    });
};

module.exports = { register, login };