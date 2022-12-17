const express = require('express')
const router = express.Router()
const userinfo_hander = require('../router_handler/userinfo')

router.get('/getUserBalance', userinfo_hander.getUserBalance)

module.exports = router