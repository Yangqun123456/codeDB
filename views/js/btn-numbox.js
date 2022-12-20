var num_jia = document.getElementById("num-jia");
var num_jian = document.getElementById("num-jian");
var input_num = document.getElementById("input-num");

input_num.value = 1;
num_jia.onclick = function () {
    input_num.value = parseInt(input_num.value) + 1;
}

num_jian.onclick = function () {
    if (input_num.value <= 1) {
        input_num.value = 1;
    } else {
        input_num.value = parseInt(input_num.value) - 1;
    }
}