import { getUrlParam, init, ignoreErrorAttr, alertmess } from "./basicLibrary.js";

function changeImagePath(path) {
    $('#etalage_source_image').attr('src', path);
    $('#etalage_thumb_image').attr('src', path);
    $('#etalage_image').attr('src', path);
    $('.etalage_zoom_img').attr('src', path);
}

function init_single(username, email, food_id) {
    // 分类信息
    $.get('http://127.0.0.1:4002/api/categoryInfo', async function (data) {
        if (data.status === 0) {
            const typeData = data.data;
            for (var key = 0; key < ignoreErrorAttr(typeData, 'length'); key++) {
                if (username !== null && email !== null) {
                    $('#category').append(
                        `<li><a href="menu?username=${username}&email=${email}&type_id=${typeData[key].type_id}">${typeData[key].type}</a></li>`
                    )
                } else {
                    $('#category').append(
                        `<li><a href="menu?type_id=${typeData[key].type_id}">${typeData[key].type}</a></li>`
                    )
                }
            }
        } else alert(data.message);
    });
    // 食物信息
    $.get('http://127.0.0.1:4002/api/idFood', { food_id: food_id }, async function (data) {
        if (data.status === 0) {
            const foodData = data.data;
            changeImagePath(foodData.picturePath);
            $('#foodName').html(foodData.name);
            $('#foodDetails').html(foodData.detail);
            if (foodData.original_price !== null) $('#original_price').html(`原价:  ${foodData.original_price}`);
            $('#now_price').html(`现价: $ ${foodData.price}`);
            $('#foodDetailsContent').html(foodData.detail);
        } else alert(data.message);
    })
    // 购买事件绑定
    $('#buyButton').click(function () {
        if (username == null || email == null) location.href = 'account'
        else {
            const food_number = parseInt($('#input-num').val());
            if (food_number !== 0) {
                $.post('http://127.0.0.1:4002/api/buyFoods', {
                    email: email,
                    food_id: food_id,
                    food_number: food_number,
                }, async function (data) {
                    console.log(data);
                    if (data.status === 0) {
                        alertmess("已添加到我的订单当中。")
                    } else alert(data.message);
                });
            }
        }
    });
}

const username = getUrlParam('username');
const email = getUrlParam('email');
const food_id = getUrlParam('id');
init(username, email);
init_single(username, email, food_id);