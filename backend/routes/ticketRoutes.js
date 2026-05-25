const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateStatus, assignTechnician, getTicketHistory } = require('../controllers/ticketController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, createTicket);
router.get('/', verifyToken, getTickets);
router.put('/:id/status', verifyToken, updateStatus);
router.put('/:id/assign', verifyToken, assignTechnician);
router.get('/:id/history', verifyToken, getTicketHistory);

module.exports = router;