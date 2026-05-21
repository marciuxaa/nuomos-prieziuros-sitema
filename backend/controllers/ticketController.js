const db = require('../config/db');

const createTicket = (req, res) => {
    const { title, description, priority, property_id } = req.body;
    const tenant_id = req.user.id;

    db.query(
        'INSERT INTO maintenance_tickets (title, description, priority, status, property_id, tenant_id) VALUES (?, ?, ?, "new", ?, ?)',
        [title, description, priority, property_id, tenant_id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida kuriant uzklausą' });
            res.json({ message: 'Užklausa sukurta', id: result.insertId });
        }
    );
};

const getTickets = (req, res) => {
    const { role, id } = req.user;

    let query = 'SELECT * FROM maintenance_tickets';
    let params = [];

    if (role === 'tenant') {
        query += ' WHERE tenant_id = ?';
        params.push(id);
    }

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ message: 'Klaida gaunant uzklausas' });
        res.json(result);
    });
};

const updateStatus = (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE maintenance_tickets SET status = ? WHERE id = ?',
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida keiciant statusa' });
            res.json({ message: 'Statusas pakeistas' });
        }
    );
};

module.exports = { createTicket, getTickets, updateStatus };