const container = document.querySelector('#container');
const signInButton = document.querySelector('#signIn');
const signUpButton = document.querySelector('#signUp');

const signUp = document.getElementById('signup');
const signIn = document.getElementById('signin');

import { alertmess } from './basicLibrary.js';

signIn.onclick = () => {
    const username = $('#username2').val()
    const password = $('#password2').val()
    $.post('http://localhost:4002/api/login', {
        username: username,
        password: password
    }, async function (data) {
        if (data.status == 0) {
            await alertmess('登陆成功')
            // location.href = 'http://localhost:4002/mainpage?username=' + username
        } else alert(data.message)
    })
    return false;
}

signUp.onclick = () => {
    const username = $('#username1').val();
    const password = $('#password1').val();
    const email = $('#email1').val();
    $.post('http://127.0.0.1:4002/api/register', {
        username: username,
        password: password,
        email: email,
    }, function (data) {
        if (data.status == 0) {
            alertmess('注册成功')
            // location.href = 'http://localhost:4002/mainpage?username=' + username
        } else alert(data.message)
    })
    return false;
}

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
})
signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
})