const express = require('express');
const router = express.Router();
const { createTenant, getTenants, deleteTenant } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/tenants', verifyToken, createTenant);
router.get('/tenants', verifyToken, getTenants);
router.delete('/tenants/:id', verifyToken, deleteTenant);

module.exports = router;