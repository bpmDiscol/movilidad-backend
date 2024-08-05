
const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/upload');
const upload = require('../config/multer');
const verifyToken = require('../jwt/verify');

router.post('/', upload.single('file'), verifyToken ,UploadController.uploadDocument)

module.exports = router;

