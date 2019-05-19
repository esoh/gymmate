const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.get('/', accountController.listUsers)
router.post('/', accountController.registerUser)

module.exports = router
