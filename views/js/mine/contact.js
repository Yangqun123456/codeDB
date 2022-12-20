import { getUrlParam, init } from "./basicLibrary.js";

const username = getUrlParam('username');
const email = getUrlParam('email');
init(username, email);