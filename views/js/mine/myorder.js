import { getUrlParam, init } from "./basicLibrary.js";

function init_myorder(username, email) {

}

const username = getUrlParam('username');
const email = getUrlParam('email');
init(username, email);
init_myorder(username, email);