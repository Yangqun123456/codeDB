import { getUrlParam, alertmess, init, ignoreErrorAttr, correctBuyButtonHref } from "./basicLibrary.js";

function init_index(username, email) {
    // 今日精选食物
    $.get('http://127.0.0.1:4003/api/todayFeaturedFoods', async function (data) {
        if (data.status === 0) {
            const foodData = data.data;
            for (var key = 0; key < ignoreErrorAttr(foodData, 'length'); key++) {
                if (key < 2) {
                    $("#featuredFoodList").append(
                        `<li class="grid1"><img src="${foodData[key].picturePath}" class="img-responsive" alt="" />
                            <p>${foodData[key].detail}</p>
                            <div class="price">Price:<span class="actual"> ${foodData[key].price} 元</span></div>
                            <div class="but1"><a href="${correctBuyButtonHref(username, email, foodData[key].id)}">Buy Now</a></div>
                        </li>`
                    )
                } else if (key == 2) {
                    $("#featuredFoodList").append(
                        `<li class="grid2"><img src="${foodData[key].picturePath}" class="img-responsive" alt="" />
                            <p>${foodData[key].detail}</p>
                            <div class="price">Price: <span class="actual"> ${foodData[key].price} 元</span></div>
                            <div class="but1"><a href="${correctBuyButtonHref(username, email, foodData[key].id)}">Buy Now</a></div>
                        </li>`
                    )
                }
            }
            $("#featuredFoodList").append(`<div class="clearfix"> </div>`)
        }
    })
    // 热门食物
    $.get('http://127.0.0.1:4003/api/popularFoods', async function (data) {
        if (data.status === 0) {
            const foodData = data.data;
            for (var key = 0; key < 4 && key < ignoreErrorAttr(foodData, 'length'); key++) {
                $("#popularFoodList_1").append(
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
            for (var key = 4; key < ignoreErrorAttr(foodData, 'length') && key < 8; key++) {
                $("#popularFoodList_2").append(
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
        }
    })
    // 分类信息
    $.get('http://127.0.0.1:4003/api/categoryInfo', async function (data) {
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
        }
    })
}

const username = getUrlParam('username');
const email = getUrlParam('email');
init(username, email);
init_index(username, email);
