const express = require('express')
const router = express.Router()
const DocumentController = require('../controllers/document')
const verifyToken = require('../jwt/verify')

router.get('/type/:type',verifyToken, DocumentController.getDocuments )
router.post('/analyze/:id',verifyToken, DocumentController.analyzeDocument )

module.exports = router