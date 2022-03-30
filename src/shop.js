const database = require("./db.js");
let db= database.db;

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
function checkExist(a) {
    return typeof a != "undefined" && a != null;
}
async function getUserByLog(login) {
    return await db.query(`SELECT * FROM users WHERE login ='${login}' OR email='${login}'`).catch(err => {throw err});
}
async function getShops(toId) {
    return await db.query(`SELECT * FROM shops WHERE id<${toId}`);
}
async function getDiscounts(toId) {
    return await db.query(`SELECT * FROM discounts WHERE id<${toId}`);
}
module.exports= {
    getShops : getShops,
    getDiscounts : getDiscounts
};