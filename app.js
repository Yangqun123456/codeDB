// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()

var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

// 导入并配置 cors 中间件
const cors = require('cors');
app.use(cors());
// 托管静态html页面
app.use(express.static('views'));

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({
    limit: '20mb',
    extended: true
}));

// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
    // status 默认值为 1，表示失败的情况
    // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next();
})

// 导入并使用索引的路由模块
const indexRounter = require('./router/index')
app.use(indexRounter);
// 导入并使用主应用的路由模块
const mainRounter = require('./router/main')
app.use('/api', mainRounter);

app.use((req, res, next) => {
    res.render('404Page.html')
})

// 启动服务器
app.listen(4002, () => {
    console.log(`api server running at http://127.0.0.1:4002`)
})