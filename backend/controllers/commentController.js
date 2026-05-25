const db = require('../config/db');

const addComment = (req, res) => {
    const { comment_text } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    db.query(
        'INSERT INTO ticket_comments (ticket_id, user_id, comment_text) VALUES (?, ?, ?)',
        [id, userId, comment_text],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida pridedant komentarą' });
            res.json({ message: 'Komentaras pridėtas' });
        }
    );
};

const getComments = (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT tc.*, u.full_name FROM ticket_comments tc JOIN users u ON tc.user_id = u.id WHERE tc.ticket_id = ? ORDER BY tc.created_at ASC',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida gaunant komentarus' });
            res.json(result);
        }
    );
};

module.exports = { addComment, getComments };