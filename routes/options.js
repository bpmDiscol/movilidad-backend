const express = require('express')
const OptionController = require('../controllers/option')
const verifyToken = require('../jwt/verify')
const router = express.Router()

router.post('/', verifyToken,OptionController.createOrUpdate)
router.get('/',verifyToken, OptionController.getOptions)

module.exports = router