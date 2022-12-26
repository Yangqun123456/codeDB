import { alertmess, getUrlParam, init, getUserBalance } from "./basicLibrary.js";

function clearInput() {
    $('#addCredit-password').val('');
    $('#addCredit-confirmPassword').val('');
    $('#addCredit-credit').val('');
}

function init_addCreditor(username, email) {
    // 绑定充值按钮
    $('#addCredit-button').click(function () {
        const password = $('#addCredit-password').val();
        const confirmPassword = $('#addCredit-confirmPassword').val();
        const credit = $('#addCredit-credit').val();
        if (password !== confirmPassword) alert('两次输入的密码不一样');
        else {
            $.post('http://127.0.0.1:4003/api/addCredit', {
                email: email,
                password: password,
                credit: credit,
            }, async function (data) {
                if (data.status == 0) {
                    clearInput();
                    getUserBalance(email);
                    alertmess("充值成功！");
                } else alert(data.message);
            });
        }
    });
}

const username = getUrlParam('username');
const email = getUrlParam('email');
if (username !== null && email !== null) {
    init(username, email);
    init_addCreditor(username, email);
} else location.href = 'account';