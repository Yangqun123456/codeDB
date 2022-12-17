import { alertmess } from "./basicLibrary.js";

function clearInput() {
    $('#login-email').val('');
    $('#login-password').val('');
}

$('#login-button').click(function () {
    $.post('http://127.0.0.1:4002/api/login', {
        email: $('#login-email').val(),
        password: $('#login-password').val(),
    }, async function (data) {
        if (data.status == 0) {
            clearInput();
            $('#username').html(data.username);
            alertmess(data.message);
            
        } else alert(data.message);
    });
});