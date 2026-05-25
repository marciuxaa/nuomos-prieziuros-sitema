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
    } else if (role === 'technician') {
        query += ' WHERE technician_id = ?';
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
    const userId = req.user.id;

    db.query('SELECT status FROM maintenance_tickets WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Klaida' });

        const oldStatus = result[0].status;

        db.query(
            'UPDATE maintenance_tickets SET status = ? WHERE id = ?',
            [status, id],
            (err) => {
                if (err) return res.status(500).json({ message: 'Klaida keiciant statusa' });

                db.query(
                    'INSERT INTO ticket_history (ticket_id, status_from, status_to, changed_by) VALUES (?, ?, ?, ?)',
                    [id, oldStatus, status, userId],
                    (err) => {
                        if (err) console.log('Istorijos klaida: ' + err.message);
                    }
                );

                res.json({ message: 'Statusas pakeistas' });
            }
        );
    });
};
const assignTechnician = (req, res) => {
    const { technician_id } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE maintenance_tickets SET technician_id = ?, status = "assigned" WHERE id = ?',
        [technician_id, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida priskiriant techniką' });
            res.json({ message: 'Technikas priskirtas' });
        }
    );
};
const getTicketHistory = (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT th.*, u.full_name FROM ticket_history th JOIN users u ON th.changed_by = u.id WHERE th.ticket_id = ? ORDER BY th.changed_at DESC',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida gaunant istorija' });
            res.json(result);
        }
    );
};
module.exports = { createTicket, getTickets, updateStatus, assignTechnician, getTicketHistory };