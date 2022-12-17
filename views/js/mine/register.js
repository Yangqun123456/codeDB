import { alertmess } from "./basicLibrary.js";

function clearInput() {
    $('#register-last-name').val('');
    $('#register-first-name').val('');
    $('#register-email').val('');
    $('#register-password').val('');
    $('#register-password-confirm').val('');
}

$('#register-button').click(function () {
    const username = $('#register-last-name').val() + $('#register-first-name').val();
    const email = $('#register-email').val();
    const password = $('#register-password').val();
    const passwordConfirm = $('#register-password-confirm').val();
    if (password !== passwordConfirm) alert('两次输入的密码不一样');
    $.post('http://127.0.0.1:4002/api/register', {
        username: username,
        password: password,
        email: email,
    }, async function (data) {
        if (data.status == 0) {
            clearInput();
            alertmess(data.message);
        } else alert(data.message);
    });
});