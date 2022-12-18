import { getUrlParam, alertmess, init } from "./basicLibrary.js";

function clearInput() {
    $('#login-email').val('');
    $('#login-password').val('');
}

// 登陆
$('#login-button').click(function () {
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    $.post('http://127.0.0.1:4002/api/login', {
        email: email,
        password: password,
    }, async function (data) {
        if (data.status == 0) {
            const username = data.username;
            clearInput();
            $('#username').html(username);
            alertmess(data.message);
            location.href = 'http://localhost:4002/index?username=' + username + '&email=' + email;
        } else alert(data.message);
    });
});

const username = getUrlParam('username');
const email = getUrlParam('email');
init(username, email);