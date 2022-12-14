const express = require('express')
const router = express.Router()
const index_hander = require('../router_handler/index')

router.get('/index', index_hander.index)

module.exports = router