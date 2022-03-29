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
    let data=req.body;
    if (checkExist(data.login) && checkExist(data.pass) && checkExist(data.email)) {
        login = String(data.login);
        pass = String(data.pass);
        email = String(data.email);

        salt = await bcrypt.genSalt(saltRounds);
        hash = await bcrypt.hash(pass,salt);
        /* Получили данные и создали хэш с солью */

        let ifExist = await getUserByLog(login).catch(err => {throw err});
        if (isEmptyObject(ifExist)) {
            let user=await db.query(`
                    INSERT INTO users (login,email,pass_hash,pass_salt,user_type) 
                    VALUES ('${login}', '${email}' ,'${hash}','${salt}','${userTypes.unverified}')`).catch(err => {throw err});

            let userId=user.insertId;
            let regData=await bcrypt.genSalt(saltRounds);

            let fin=await db.query(`INSERT INTO user_verification (user_id,data) VALUES ('${userId}','${regData}')`);

            let mailAns = await mailer.sendVerificationMessage(email,
                "Подверждение почты в edaedet",
                `Пожалуйста, подвердите ваш аккаунт по ссылке: ${database.url}/verification?login=${login}&data=${regData}`);

            return {
                "code" : codes.goodCode
            };
        }
    }
    return {
        "code" : codes.badCode
    };

}
async function log(req) {
 let data=reg.query;

}
async function verification(req) {x``
}
module.exports = {
    register : reg,
    login    :  log,
    verify   : verification
};