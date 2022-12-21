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
    $("a[href='myorder.html']").attr('href', 'myorder?username=' + username + '&email=' + email);
    $("a[href='addcredit.html']").attr('href', 'addcredit?username=' + username + '&email=' + email);
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

function correctOrderTotalPrice(username, email) {
    if (username !== null && email !== null) {
        $.get('http://127.0.0.1:4002/api/orderTotalPrice', { email: email }, async function (data) {
            if (data.status == 0) {
                const totalPrice = data.price;
                $('#totalPrice').html(` &nbsp&nbsp$&nbsp&nbsp${totalPrice}`)
            }
        });
    }
}

export function getOrderTotalPrice(username, email) {
    if (username !== null && email !== null) {
        $.get('http://127.0.0.1:4002/api/orderTotalPrice', { email: email }, async function (data) {
            if (data.status == 0) {
                const totalPrice = data.price;
                // 添加订单总价html元素
                $('#main-container').append(`<div id="totalPrice-bottom" class="col-md-6 navbar-fixed-bottom col-md-offset-4">
                    <ul class="feature_grid">
                    <li style="margin-top:5px">
                    <div class="price" style="font-size: 20px;"><span
                        style="color:red;font-weight: bold;">总价:
                    </span><span class="actual" id="totalPrice"> &nbsp&nbsp$&nbsp&nbsp${totalPrice}</span></div>
                    </li>
                    <li style="float: right;"><a id="order-submit" class="acount-btn" style="float: right;width: 160px;"> Submit </a></li>
                    <div class="clearfix"> </div>
                    </ul>`
                );
                submitClick(email);
            } else preventChangeNumber(email);
        });
    }
}

// 绑定提交Order事件
function submitClick(email) {
    if (email !== null) {
        $('#order-submit').click(function () {
            $.post('http://127.0.0.1:4002/api/submitOrder', { email: email }, async function (data) {
                console.log(data);
                if (data.status == 0) {
                    $('#totalPrice-bottom').hide();
                    preventChangeNumber(email);
                    getUserBalance(email);
                    alertmess("提交订单成功！");
                } else { alert(data.message); getUserBalance(email); }
            })
        });
    }
}

export function changeFoodsNumber(username, email, food_id, foodNumber) {
    if (username !== null && email !== null) {
        $.post('http://127.0.0.1:4002/api/changeFoodsNumber', {
            email: email,
            food_id: food_id,
            foodNumber: foodNumber,
        }, async function (data) {
            if (data.status == 0) {
                correctMyOrderPriceView(username, email);
                correctOrderTotalPrice(username, email);
            } else alert(data.message);
        })
    }
}

export function correctMyOrderPriceView(username, email) {
    if (username !== null && email !== null) {
        // 获取订单信息
        $.get('http://127.0.0.1:4002/api/orderInfo', { email: email }, async function (data) {
            if (data.status === 0) {
                const foodData = data.data;
                for (var key = 0; key < ignoreErrorAttr(foodData, 'length'); key++) {
                    $(`#singleTotalPrice_${foodData[key].id}`).html(` &nbsp&nbsp&nbsp$&nbsp${(foodData[key].price * foodData[key].foodNumber).toFixed(2)}`)
                }
            } else alert(data.message);
        });
    }
}

// 有错误
function preventChangeNumber(email) {
    $.get('http://127.0.0.1:4002/api/orderInfo', { email: email }, async function (data) {
        if (data.status === 0) {
            const foodData = data.data;
            for (var key = 0; key < ignoreErrorAttr(foodData, 'length'); key++) {
                $(`#num-jia_${foodData[key].id}`).addClass("notclick");
                $(`#num-jian_${foodData[key].id}`).addClass("notclick");
            }
        }
    });
}

export function getUserBalance(email) {
    // 获取用户余额
    $.get('http://127.0.0.1:4002/userinfo/getUserBalance', {
        email: email,
    }, async function (data) {
        if (data.status == 0) {
            $('#balance').html(`<span>$ ${data.balance.toFixed(2)}</span>`);
        } else alert(data.message);
    });
}

export function init(username, email) {
    if (username !== null) { $('#username').html(username); }
    if (email === null || username === null) { $("a[href='myorder.html']").attr('href', 'account'); $("a[href='addcredit.html']").attr('href', 'account'); }
    if (email !== null && username !== null) {
        updateWebsiteHref(username, email);
        getUserBalance(email);
    }
    // 绑定搜索事件
    $('#searchButton').click(function () {
        const foodName = $('#search-input').val();
        $.get('http://127.0.0.1:4002/api/nameFood', { foodName: foodName }, async function (data) {
            if (data.status === 0) {
                const foodData = data.data;
                if (username !== null && email !== null) location.href = 'http://localhost:4002/single?username=' + username + '&email=' + email + '&id=' + foodData.id;
                else location.href = 'http://localhost:4002/single?id=' + foodData.id;
            } else alert(data.message);
        });
    });
    getOrderTotalPrice(username, email);
}
