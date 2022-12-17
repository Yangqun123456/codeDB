function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(decodeURI(r[2]));
    return null; //返回参数值
}

export function alertmess(mess) {
    $('#alertmess').html(mess); // 填入要显示的文字
    $('#alertmess').show(); // 显示弹框
    return new Promise((resolve, reject) => {
        setTimeout(() => { // 倒计时
            $('#alertmess').html(''); // 清空文本
            $('#alertmess').hide(); // 隐藏弹框
            resolve()
        }, 5000); // 1秒
    })
}

export function init() {
    const username = getUrlParam('username');
    const email = getUrlParam('email');
    if (username !== null) { $('#username').html(username); }
    if (email !== null) {
        // 获取用户余额
        $.get('http://127.0.0.1:4002/userinfo/getUserBalance', {
            email: email,
        }, async function (data) {
            if (data.status == 0) {
                $('#balance').html(`<span>$ ${data.balance.toFixed(2)}</span>`);
            } else alert(data.message);
        });
    }
}