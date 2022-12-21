import { getUrlParam, init, ignoreErrorAttr, changeFoodsNumber } from "./basicLibrary.js";

function init_myorder(username, email) {
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
        }
    })
    // 获取订单信息
    $.get('http://127.0.0.1:4002/api/orderInfo', { email: email }, async function (data) {
        if (data.status === 0) {
            const foodData = data.data;
            for (var key = 0; key < ignoreErrorAttr(foodData, 'length'); key++) {
                $('#orderFoodList').append(`
                        <ul class="feature_grid">
							<li class="grid1"><img src="${foodData[key].picturePath}" class="img-responsive" alt="" /></li>
							<h4>${foodData[key].name}</h4>
							<span><span style="font-weight: bold">Detail:</span><span>${foodData[key].detail}</span></span>
							<ul class="btn-numbox">
								<li style="width:40px;"><span class="number">数量 :</span></li>
								<li width="200px">
									<ul class="count" style="width: 120px;">
										<li>
											<span id="num-jian_${foodData[key].id}" class="num-jian">-</span>
											<input type="text" class="input-num" id="input-num_${foodData[key].id}" value="${foodData[key].foodNumber}"
												readonly="readonly">
											<span id="num-jia_${foodData[key].id}" class="num-jia">+</span>
										</li>
									</ul>
								</li>
							</ul>
							<div class="price" style="font-size: 16px;"><span style="color:red;font-weight: bold;">Price:
								</span><span class="actual" id="singleTotalPrice_${foodData[key].id}"> &nbsp&nbsp&nbsp$&nbsp${(foodData[key].price * foodData[key].foodNumber).toFixed(2)}</span></div>
							<div class="clearfix"> </div>
						</ul>
                `);
                $(`#num-jia_${foodData[key].id}`).click(function () {
                    const id = this.id.split('_')[1];
                    $(`#input-num_${id}`).val(parseInt($(`#input-num_${id}`).val()) + 1);
                    changeFoodsNumber(username, email, id, $(`#input-num_${id}`).val());
                })
                $(`#num-jian_${foodData[key].id}`).click(function () {
                    const id = this.id.split('_')[1];
                    if ($(`#input-num_${id}`).val() <= 0) {
                        $(`#input-num_${id}`).val(0);
                    } else {
                        $(`#input-num_${id}`).val(parseInt($(`#input-num_${id}`).val()) - 1);
                        changeFoodsNumber(username, email, id, $(`#input-num_${id}`).val());
                    }
                })
            }
        } else alert(data.message);
    });
}

const username = getUrlParam('username');
const email = getUrlParam('email');
if (username !== null && email !== null) {
    init(username, email);
    init_myorder(username, email);
} else location.href = 'account';