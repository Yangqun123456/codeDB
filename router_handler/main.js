// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");

// 更新订单总价
function updateTotalPrice(req, res, id) {
    const sql = `select SUM(food.price*orderfoods.foodNumber) sumPrice from food,orderfoods where orderfoods.id=? and orderfoods.food_id=food.id`;
    db.query(sql, id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) return res.cc("计算总价失败！");
        else {
            const totalPrice = results[0].sumPrice.toFixed(2);
            const sql = `update orderinfo set totalPrice=? where id=?`
            db.query(sql, [totalPrice, id], (err, results) => {
                // 执行 SQL 语句失败
                if (err) return res.cc(err);
                // 影响的行数是否等于 1
                if (results.affectedRows !== 1) return res.cc("更新预购食物信息失败!");
                else res.cc("更新预购食物信息成功!", 0);
            });
        }
    });
};

// 注册新用户的处理函数
exports.register = (req, res) => {
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 定义 SQL 语句，查询邮箱是否被占用
    const sqlStr = "select * from user where email=?";
    db.query(sqlStr, userinfo.email, (err, results) => {
        // 执行 SQL 语句失败
        if (err) { res.cc(err); }
        // 判断邮箱是否被占用
        if (results.length > 0) { return res.cc("该邮箱已被使用，请更换其他邮箱！"); }
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
    const sql = `select * from user where email=?`;
    // 执行 SQL 语句，根据用户名查询用户的信息
    db.query(sql, userinfo.email, (err, results) => {
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
        else res.send({
            status: 0,
            message: "登录成功！",
            username: results[0].username,
        })
    });
};

// 提交预购食物信息
exports.buyFoods = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    // 定义 SQL 语句
    const sql = `select * from user where email=?`;
    // 执行 SQL 语句，根据用户名查询用户的信息
    db.query(sql, userinfo.email, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if (results.length !== 1) return res.cc("用户名不存在！");
        else {
            const sql = `select * from orderinfo where email=? and type='reserve' limit 1`;
            db.query(sql, userinfo.email, (err, results) => {
                // 执行 SQL 语句失败
                if (err) return res.cc(err);
                // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
                if (results.length !== 1) {
                    const sql = `select price from food where id=? limit 1`
                    db.query(sql, userinfo.food_id, (err, results) => {
                        // 执行 SQL 语句失败
                        if (err) return res.cc(err);
                        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
                        if (results.length !== 1) res.cc("获取食物价格失败！");
                        else {
                            const foodPrice = results[0].price;
                            const sql = `insert into orderinfo set ?`;
                            db.query(sql, {
                                email: userinfo.email,
                                totalPrice: (parseInt(userinfo.food_number) * parseFloat(foodPrice)).toFixed(2),
                                datetime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
                            }, (err, results) => {
                                // 判断 SQL 语句是否执行成功
                                if (err) return res.cc(err);
                                // 判断影响行数是否为 1
                                if (results.affectedRows !== 1) return res.cc("插入订单失败，请稍后重试！");
                                else {
                                    const orderId = results.insertId;
                                    const sql = `insert into orderfoods set ?`
                                    db.query(sql, {
                                        id: orderId,
                                        food_id: userinfo.food_id,
                                        foodNumber: userinfo.food_number
                                    }, (err, results) => {
                                        // 判断 SQL 语句是否执行成功
                                        if (err) return res.cc(err);
                                        // 判断影响行数是否为 1
                                        if (results.affectedRows !== 1) return res.cc("插入订单失败，请稍后重试！");
                                        else res.cc("插入预购订单成功", 0);
                                    })
                                }
                            });
                        }
                    })
                } else {
                    const orderId = results[0].id;
                    const sql = `select * from orderfoods where id=? and food_id=? limit 1`
                    db.query(sql, [orderId, userinfo.food_id], (err, results) => {
                        // 执行 SQL 语句失败
                        if (err) { res.cc(err); }
                        if (results.length !== 0) {
                            const sql = `update orderfoods set foodNumber=foodNumber+? where id=? and food_id=?`
                            db.query(sql, [userinfo.food_number, orderId, userinfo.food_id], (err, results) => {
                                // 执行 SQL 语句失败
                                if (err) return res.cc(err);
                                // 影响的行数是否等于 1
                                if (results.affectedRows !== 1) return res.cc("更新预购食物信息失败!");
                                updateTotalPrice(req, res, orderId);
                            });
                        } else {
                            const sql = `insert into orderfoods set ?`;
                            db.query(sql, {
                                id: orderId,
                                food_id: userinfo.food_id,
                                foodNumber: userinfo.food_number
                            }, (err, results) => {
                                // 判断 SQL 语句是否执行成功
                                if (err) return res.cc(err);
                                // 判断影响行数是否为 1
                                if (results.affectedRows !== 1) return res.cc("插入订单失败，请稍后重试！");
                                updateTotalPrice(req, res, orderId);
                            });
                        }
                    })
                }
            });
        }
    });
};

exports.submitOrder = (req, res) => {
    // 接收表单的数据
    const userinfo = req.body;
    const sql = `update orderinfo set type='submit',datetime=? where id=? and email=?`
    db.query(sql, [new Date().Format("yyyy-MM-dd HH:mm:ss"), userinfo.orderId, userinfo.email], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 影响的行数是否等于 1
        if (results.affectedRows !== 1) return res.cc("提交订单失败!");
        else res.cc("提交订单成功!", 0);
    });
};

exports.todayFeaturedFoods = (req, res) => {
    const sqlStr = "select * from food where featured=1 order by id limit 3";
    db.query(sqlStr, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 1) return res.cc('当前不存在精选食物')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取精选食物信息成功!',
            data: results,
        })
    });
};

exports.popularFoods = (req, res) => {
    const sqlStr = "select * from food where popular=1 order by id limit 8";
    db.query(sqlStr, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 1) return res.cc('当前不存在热门食物')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取热门食物信息成功!',
            data: results,
        })
    });
};

exports.typeFoods = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    const sqlStr = "select * from food where type_id=? order by id limit 8";
    db.query(sqlStr, userinfo.type_id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 1) return res.cc('当前不存在该类型的食物')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取指定类型的食物信息成功!',
            data: results,
        })
    });
};

exports.categoryInfo = (req, res) => {
    const sqlStr = "select * from typeinfo";
    db.query(sqlStr, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length < 1) return res.cc('当前不存在分类信息')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取分类信息成功!',
            data: results,
        })
    });
}

exports.nameFood = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    const sqlStr = "select * from food where name=? order by id limit 1";
    db.query(sqlStr, userinfo.foodName, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('该食物不存在哦！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取指定食物信息成功!',
            data: results[0],
        })
    });
}

exports.idFood = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    const sqlStr = "select * from food where id=? order by id limit 1";
    db.query(sqlStr, userinfo.food_id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('该食物不存在哦！')
        // 用户信息获取成功
        res.send({
            status: 0,
            message: '获取指定食物信息成功!',
            data: results[0],
        })
    });
}

exports.orderInfo = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    const sqlStr = "select * from orderinfo where email=? order by id desc limit 1";
    db.query(sqlStr, userinfo.email, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('获取当前订单信息失败！')
        else {
            const orderId = results[0].id;
            const sql = `select * from orderfoods,food where orderfoods.id=? and orderfoods.food_id=food.id`;
            db.query(sql, orderId, (err, results) => {
                // 执行 SQL 语句失败
                if (err) return res.cc(err)
                // 执行 SQL 语句成功，但是查询的结果可能为空
                if (results.length < 1) return res.cc('当前订单还未点餐！')
                // 用户信息获取成功
                res.send({
                    status: 0,
                    message: '获取订单信息成功!',
                    data: results,
                })
            })
        }
    });
};

exports.orderTotalPrice = (req, res) => {
    // 接收表单的数据
    const userinfo = req.query;
    const sqlStr = "select id,totalPrice from orderinfo where email=? and type='reserve' limit 1";
    db.query(sqlStr, userinfo.email, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询的结果可能为空
        if (results.length !== 1) return res.cc('无预提交订单！');
        else res.send({
            status: 0,
            message: "获取订单总价成功！",
            orderId: results[0].id,
            price: results[0].totalPrice,
        });
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