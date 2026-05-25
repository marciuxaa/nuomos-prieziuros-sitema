const express = require('express');
const router = express.Router();
const { createTenant, getTenants, deleteTenant, createTechnician, getTechnicians } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/tenants', verifyToken, createTenant);
router.get('/tenants', verifyToken, getTenants);
router.delete('/tenants/:id', verifyToken, deleteTenant);
router.post('/technicians', verifyToken, createTechnician);
router.get('/technicians', verifyToken, getTechnicians);

module.exports = router;