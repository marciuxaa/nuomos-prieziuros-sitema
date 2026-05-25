const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadAttachment = (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'Failas nepasirinktas' });
    }

    db.query(
        'INSERT INTO ticket_attachments (ticket_id, file_path) VALUES (?, ?)',
        [id, req.file.filename],
        (err) => {
            if (err) return res.status(500).json({ message: 'Klaida įkeliant failą' });
            res.json({ message: 'Failas įkeltas', filename: req.file.filename });
        }
    );
};

const getAttachments = (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT * FROM ticket_attachments WHERE ticket_id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Klaida gaunant priedus' });
            res.json(result);
        }
    );
};

module.exports = { upload, uploadAttachment, getAttachments };