import { getUrlParam, alertmess, init, ignoreErrorAttr, correctBuyButtonHref } from "./basicLibrary.js";

function clearFoodList() {
    $("#foodList_1").html('');
    $("#foodList_2").html('');
}

function getTypeFoodsInfo(username, email, type_id) {
    clearFoodList();
    // 获取食物信息
    $.get('http://127.0.0.1:4003/api/typeFoods', { type_id: type_id }, async function (data) {
        const foodData = data.data;
        for (var key = 0; key < 4 && key < ignoreErrorAttr(foodData, 'length'); key++) {
            $("#foodList_1").append(
                `<div class="col-md-3">
                 <div class="content_box"><a href="${correctBuyButtonHref(username, email, foodData[key].id)}">
                    <div class="view view-fifth">
                        <img src="${foodData[key].picturePath}" class="img-responsive" alt="" />
                        <div class="content_box-grid">
                            <p class="m_1" style="font-weight: bold">${foodData[key].name}</p>
                            <p class="m_1">${foodData[key].detail}</p>
                            <div class="price">Price: <span class="actual"> ${foodData[key].price} 元</span></div>
                            <ul class="product_but">
                                <li class="but3">Buy</li>
                                <li class="like"><span>${foodData[key].likeNumber}</span><i class="like1"> </i></li>
                                <div class="clearfix"> </div>
                            </ul>
                            <div class="mask">
                                <div class="info">Quick View</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>`)
        }
        for (var key = 4; key < ignoreErrorAttr(foodData, 'length') && key < 8; key++) {
            $("#foodList_2").append(
                `<div class="col-md-3">
                <div class="content_box"><a href="${correctBuyButtonHref(username, email, foodData[key].id)}">
                        <div class="view view-fifth">
                            <img src="${foodData[key].picturePath}" class="img-responsive" alt="" />
                            <div class="content_box-grid">
                                <p class="m_1" style="font-weight: bold">${foodData[key].name}</p>
                                <p class="m_1">${foodData[key].detail}</p>
                                <div class="price">Price: <span class="actual"> ${foodData[key].price} 元</span></div>
                                <ul class="product_but">
                                    <li class="but3">Buy</li>
                                    <li class="like"><span>${foodData[key].likeNumber}</span><i class="like1"> </i></li>
                                    <div class="clearfix"> </div>
                                </ul>
                                <div class="mask">
                                    <div class="info">Quick View</div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>`
            )
        }
    })
}

function init_menu(username, email, id) {
    var type_id;
    if (id == null) type_id = 1;
    else type_id = id;
    getTypeFoodsInfo(username, email, type_id);
    // 分类信息
    $.get('http://127.0.0.1:4003/api/categoryInfo', async function (data) {
        if (data.status === 0) {
            const typeData = data.data;
            for (var key = 0; key < ignoreErrorAttr(typeData, 'length'); key++) {
                $('#category').append(
                    `<li><a id="type_${typeData[key].type_id}">${typeData[key].type}</a></li>`
                )
                $(`#type_${typeData[key].type_id}`).click(function () {
                    const type_id = this.id.split('_')[1];
                    getTypeFoodsInfo(username, email, type_id);
                })
            }
        }
    })
}

const username = getUrlParam('username');
const email = getUrlParam('email');
const id = getUrlParam('type_id');
init(username, email);
init_menu(username, email, id);