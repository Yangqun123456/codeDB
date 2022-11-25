// 导入数据库操作模块
const db = require('../db/index')
const { ignoreErrorAttr } = require('../config/basicLibrary');
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    const userinfo = req.body;
    const sqlStr = `select * from user where username=?`;
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 判断用户名是否被占用
        if (ignoreErrorAttr(results, 'length') > 0) {
            return res.cc("用户名已被使用，请更换其他用户名！");
        }
        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 定义插入新用户的 SQL 语句
        const sql = "insert into user set ?";
        db.query(sql, {
            'username': userinfo.username,
            'password': userinfo.password,
        }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1)
                return res.cc("注册用户失败，请稍后再试！");
            // 注册用户成功
            res.send({
                status: 0,
                message: '注册用户成功！'
            });
        });
    });
}

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

        // TODO：判断密码是否正确
        const compareResult = bcrypt.compareSync(
            userinfo.password,
            results[0].password
        );
        if (!compareResult) return res.cc("密码不正确！");
        else {
            res.send({
                status: 0,
                message: "登录成功！",
            });
        }
    });
}

exports.postCurrentData = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sql = `insert into dataTable set ?`;
    db.query(sql, {
        username: userinfo.username,
        tempture: String(userinfo.tempture),
        humidity: String(userinfo.humidity),
        illumination: String(userinfo.illumination),
        co2: String(userinfo.co2),
        time: userinfo.time,
    }, (err, results) => {
        // 判断 SQL 语句是否执行成功
        if (err) return res.cc(err);
        // 判断影响行数是否为 1
        if (results.affectedRows !== 1)
            return res.cc("更新dataTable失败，请稍后再试！");
        res.send({
            status: 0,
            message: "插入感知数据成功！",
        });
    });
}

exports.historyData = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    // 定义 SQL 语句
    const sql = `select * from dataTable where username=? order by id desc limit 100`;
    db.query(sql, userinfo.username, (err, results) => {
        // 判断 SQL 语句是否执行成功
        if (err) return res.cc(err);
        if (results.length < 1) return res.cc("用户数据不存在！");
        res.send({
            status: 0,
            data: results.reverse(),
            message: "获取感知数据成功！",
        });
    });
}

exports.getCurrentData = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    // 定义 SQL 语句
    const sql = `select * from dataTable where username=? order by id desc limit 1`;
    db.query(sql, userinfo.username, (err, results) => {
        // 判断 SQL 语句是否执行成功
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("用户数据不存在！");
        res.send({
            status: 0,
            data: results[0],
            message: "获取感知数据成功！",
        });
    });
}

exports.getTarget = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    // 定义 SQL 语句
    const sql = `select * from targetTable where username=? limit 1`;
    db.query(sql, userinfo.username, (err, results) => {
        // 判断 SQL 语句是否执行成功
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("用户数据不存在！");
        res.send({
            status: 0,
            data: results[0],
            message: "获取感知数据成功！",
        });
    });
}

exports.postTarget = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    const sqlStr = `select * from targetTable where username=?`;
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 判断用户名是否被占用
        if (ignoreErrorAttr(results, 'length') === 0) {
            // 定义 SQL 语句
            const sql = `insert into targetTable set ?`;
            if (userinfo.setAttribute === 'tempture') {
                db.query(sql, {
                    'username': userinfo.username,
                    'tempture': String(userinfo.targetValue),
                }, (err, results) => {// 判断 SQL 语句是否执行成功
                    if (err) return res.cc(err);
                    if (results.affectedRows !== 1) return res.cc("插入目标失败！");
                    res.send({
                        status: 0,
                        message: "插入目标成功！",
                    });
                })
            } else if (userinfo.setAttribute === 'humidity') {
                db.query(sql, {
                    'username': userinfo.username,
                    'humidity': String(userinfo.targetValue),
                }, (err, results) => {// 判断 SQL 语句是否执行成功
                    if (err) return res.cc(err);
                    if (results.affectedRows !== 1) return res.cc("插入目标失败！");
                    res.send({
                        status: 0,
                        message: "插入目标成功！",
                    });
                })
            } else if (userinfo.setAttribute === 'illumination') {
                db.query(sql, {
                    'username': userinfo.username,
                    'illumination': String(userinfo.targetValue),
                }, (err, results) => {// 判断 SQL 语句是否执行成功
                    if (err) return res.cc(err);
                    if (results.affectedRows !== 1) return res.cc("插入目标失败！");
                    res.send({
                        status: 0,
                        message: "插入目标成功！",
                    });
                })
            } else if (userinfo.setAttribute === 'CO2') {
                db.query(sql, {
                    'username': userinfo.username,
                    'co2': String(userinfo.targetValue),
                }, (err, results) => {// 判断 SQL 语句是否执行成功
                    if (err) return res.cc(err);
                    if (results.affectedRows !== 1) return res.cc("插入目标失败！");
                    res.send({
                        status: 0,
                        message: "插入目标成功！",
                    });
                })
            }
        } else {
            let sql = '';
            if (userinfo.setAttribute === 'tempture') sql = `update targetTable set tempture=? where username=?`;
            else if (userinfo.setAttribute === 'humidity') sql = `update targetTable set humidity=? where username=?`;
            else if (userinfo.setAttribute === 'illumination') sql = `update targetTable set illumination=? where username=?`;
            else if (userinfo.setAttribute === 'CO2') sql = `update targetTable set co2=? where username=?`;
            db.query(sql, [String(userinfo.targetValue), userinfo.username], (err, results) => {
                // 判断 SQL 语句是否执行成功
                if (err) return res.cc(err);
                if (results.affectedRows !== 1) return res.cc("更新目标失败！");
                res.send({
                    status: 0,
                    message: "更新目标成功！",
                });
            });
        }
    });
}