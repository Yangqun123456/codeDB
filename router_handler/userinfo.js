// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");

exports.getUserBalance = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.query;
    // 定义 SQL 语句，查询邮箱是否被占用
    const sqlStr = "select balance from user where email=?";
    db.query(sqlStr, userinfo.email, (err, results) => {
        // 执行 SQL 语句失败
        if (err) { res.cc(err); }
        // 判断邮箱是否被占用
        if (results.length == 0) return res.cc("用户不存在！");
        else res.send({
            status: 0,
            message: "获取用户余额信息成功！",
            balance: results[0].balance,
        })
    });
}