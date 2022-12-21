// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
const email = joi.string().email();
// 定义验证注册和登录表单数据的规则对象
exports.login_schema = {
    body: {
        email,
        password,
    },
}
exports.register_schema = {
    body: {
        username,
        password,
        email,
    },
}

exports.buyFoods_schema = {
    body: {
        email,
        food_id: joi.number(),
        food_number: joi.number(),
    },
}

exports.submitOrder_schema = {
    body: {
        email,
    },
}

exports.changeFoodsNumber_schema = {
    body: {
        email,
        food_id: joi.number(),
        foodNumber: joi.number(),
    },
}