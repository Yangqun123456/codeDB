export function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(decodeURI(r[2]));
    return null; //返回参数值
}

function updateWebsiteHref(username, email) {
    $("a[href='account.html']").attr('href', 'account?username=' + username + '&email=' + email);
    $("a[href='contact.html']").attr('href', 'contact?username=' + username + '&email=' + email);
    $("a[href='menu.html']").attr('href', 'menu?username=' + username + '&email=' + email);
    $("a[href='index.html']").attr('href', 'index?username=' + username + '&email=' + email);
    $("a[href='products.html']").attr('href', 'products?username=' + username + '&email=' + email);
    $("a[href='register.html']").attr('href', 'register?username=' + username + '&email=' + email);
    $("a[href='single.html']").attr('href', 'single?username=' + username + '&email=' + email);
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

export function ignoreErrorAttr(obj, search = "", re = 0) {
    const arr = search.split(".");
    if (!obj) {
        return re;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf("[") >= 0 && arr[i].indexOf("]") >= 0) {
            let index = arr[i].split("[")[1].split("]")[0]
            obj = obj[index];
        } else {
            obj = obj[arr[i]];
        }
        if (obj === undefined) {
            return re;
        }
    }
    return obj;
}

export function correctBuyButtonHref(username, email, id) {
    if (username !== null && email !== null && id !== null) return `single?username=${username}&email=${email}&id=${id}`;
    else if (id !== null) return `single?id=${id}`;
}

export function init(username, email) {
    if (username !== null) { $('#username').html(username); }
    if (email !== null && username !== null) {
        updateWebsiteHref(username, email);
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