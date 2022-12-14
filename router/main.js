const express = require('express')
const router = express.Router()
const main_hander = require('../router_handler/main')

// 1. 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { login_schema, register_schema, buyFoods_schema, submitOrder_schema, changeFoodsNumber_schema, addCredit_schema } = require("../schema/schema");

router.post('/login', expressJoi(login_schema), main_hander.login)
router.post('/register', expressJoi(register_schema), main_hander.register)
router.post('/buyFoods', expressJoi(buyFoods_schema), main_hander.buyFoods)
router.post('/submitOrder', expressJoi(submitOrder_schema), main_hander.submitOrder)
router.post('/changeFoodsNumber', expressJoi(changeFoodsNumber_schema), main_hander.changeFoodsNumber)
router.post('/addCredit', expressJoi(addCredit_schema), main_hander.addCredit)
router.get('/todayFeaturedFoods', main_hander.todayFeaturedFoods)
router.get('/popularFoods', main_hander.popularFoods)
router.get('/typeFoods', main_hander.typeFoods)
router.get('/categoryInfo', main_hander.categoryInfo)
router.get('/nameFood', main_hander.nameFood)
router.get('/idFood', main_hander.idFood)
router.get('/orderInfo', main_hander.orderInfo)
router.get('/orderTotalPrice', main_hander.orderTotalPrice)

module.exports = router