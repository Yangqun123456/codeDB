const express = require('express')
const router = express.Router()
const index_hander = require('../router_handler/index')

router.get('/index', index_hander.index)
router.get('/menu', index_hander.menu)
router.get('/contact', index_hander.contact)
router.get('/login', index_hander.login)

module.exports = router