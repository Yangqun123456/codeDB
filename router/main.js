const express = require('express')
const router = express.Router()
const main_hander = require('../router_handler/main')

router.post('/login', main_hander.login)
router.post('/register', main_hander.register)

module.exports = router