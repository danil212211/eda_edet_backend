const database = require("./db.js");
const mailer = require("./email");
const bcrypt = require('bcrypt');
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
function checkExist(a) {
    return typeof a != "undefined" && a != null;
}
async function getUserByLog(login) {
    return await db.query(`SELECT * FROM users WHERE login ='${login}'`).catch(err => {throw err});
}
let db= database.db;
let saltRounds=10;
let userTypes = {
    unverified : "UNVERIFIED",
    verified : "VERIFIED"
}
let codes = {
    "badCode" : 400,
    "goodCode" : 200
};

async function reg(req) {

}
async function log(req) {

}
async function verification(req) {x``
}
module.exports = {
    register : reg,
    login    :  log,
    verify   : verification
};