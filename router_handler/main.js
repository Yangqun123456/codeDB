// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");

// 注册新用户的处理函数
exports.register = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 定义 SQL 语句，查询用户名是否被占用
    const sqlStr = "select * from user where username=? or email=?";
    db.query(sqlStr, [userinfo.username, userinfo.email], (err, results) => {
        // 执行 SQL 语句失败
        if (err) { res.cc(err); }
        // 判断用户名是否被占用
        if (results.length > 0) { return res.cc("用户名或邮箱已被使用，请更换其他用户名或邮箱！"); }
        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义插入新用户的 SQL 语句
        const sql = "insert into user set ?";
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password,
            email: userinfo.email,
            Registered_Date: new Date().Format("yyyy-MM-dd HH:mm:ss"),
        }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1) return res.cc("注册用户失败，请稍后再试！");
            else res.cc("注册成功！", 0);
        });
    });
};

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sql = `select * from user where username=?`;
    // 执行 SQL 语句，根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) return res.cc("用户名不存在！");
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(
            userinfo.password,
            results[0].password
        );
        if (!compareResult) return res.cc("密码不正确！");
        else res.cc("登陆成功！", 0);
    });
};

// 日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}