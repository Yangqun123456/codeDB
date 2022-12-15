const express = require('express')
const router = express.Router()
const main_hander = require('../router_handler/main')

// 1. 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { login_schema, register_schema } = require("../schema/schema");

router.post('/login', expressJoi(login_schema), main_hander.login)
router.post('/register', expressJoi(register_schema), main_hander.register)

module.exports = router