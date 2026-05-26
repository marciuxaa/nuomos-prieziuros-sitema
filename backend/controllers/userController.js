const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createTenant = (req, res) => {
    const { full_name, email, password } = req.body;

    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'Toks el. paštas jau egzistuoja' });
        }

        const hash = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, "tenant")',
            [full_name, email, hash],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Klaida kuriant vartotoją' });
                res.json({ message: 'Nuomininkas sukurtas' });
            }
        );
    });
};

const getTenants = (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }

    db.query('SELECT id, full_name, email FROM users WHERE role = "tenant"', (err, result) => {
        if (err) return res.status(500).json({ message: 'Klaida' });
        res.json(result);
    });
};

const deleteTenant = (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }

    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ? AND role = "tenant"', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Klaida trinant vartotoją' });
        res.json({ message: 'Nuomininkas ištrintas' });
    });
};
const createTechnician = (req, res) => {
    const { full_name, email, password } = req.body;

    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'Toks el. paštas jau egzistuoja' });
        }

        const hash = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, "technician")',
            [full_name, email, hash],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Klaida kuriant techniką' });
                res.json({ message: 'Technikas sukurtas' });
            }
        );
    });
};

const getTechnicians = (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }

    db.query('SELECT id, full_name, email FROM users WHERE role = "technician"', (err, result) => {
        if (err) return res.status(500).json({ message: 'Klaida' });
        res.json(result);
    });
};
const deleteTechnician = (req, res) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Nėra teisių' });
    }
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ? AND role = "technician"', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Klaida trinant techniką' });
        res.json({ message: 'Technikas ištrintas' });
    });
};
module.exports = { createTenant, getTenants, deleteTenant, createTechnician, getTechnicians, deleteTechnician };