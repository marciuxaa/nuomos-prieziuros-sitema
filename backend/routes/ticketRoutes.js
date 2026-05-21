const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateStatus } = require('../controllers/ticketController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, createTicket);
router.get('/', verifyToken, getTickets);
router.put('/:id/status', verifyToken, updateStatus);

module.exports = router;