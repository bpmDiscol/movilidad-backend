const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const verifyToken = require('../jwt/verify')

router.post('/', verifyToken,UserController.create)
router.get('/',verifyToken, UserController.getUsers)
router.get('/role/:role', verifyToken,UserController.getUsersByRole)
router.delete('/:id',verifyToken,UserController.delete)

module.exports = router