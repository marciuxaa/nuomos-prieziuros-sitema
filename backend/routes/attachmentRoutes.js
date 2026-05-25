const express = require('express');
const router = express.Router();
const { upload, uploadAttachment, getAttachments, deleteAttachment } = require('../controllers/attachmentController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/:id/attachments', verifyToken, upload.single('file'), uploadAttachment);
router.get('/:id/attachments', verifyToken, getAttachments);
router.delete('/attachments/:id', verifyToken, deleteAttachment);

module.exports = router;