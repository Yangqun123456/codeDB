const express = require('express')
const router = express.Router()
const index_hander = require('../router_handler/index')

router.get('/index', index_hander.index)
router.get('/register', index_hander.register)
router.get('/account', index_hander.account)
router.get('/contact', index_hander.contact)

module.exports = router