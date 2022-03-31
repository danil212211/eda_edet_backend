const database = require("./db.js");
const mailer = require("./email");
const bcrypt = require('bcrypt');
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
function checkExist(a) {
    return typeof a !== "undefined" && a !== null;
}
async function getUserByLog(login) {
    return await db.query(`SELECT * FROM users WHERE login ='${login}' OR email='${login}'`).catch(err => {throw err});
}
let db= database.db;
let codes=database.codes;
let saltRounds=10;
let userTypes = {
    unverified : "UNVERIFIED",
    verified : "VERIFIED"
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
        console.log(email);
        let ifExist = await getUserByLog(login).catch(err => {throw err});
        let ifExist2 = await getUserByLog(email).catch(err => {throw err});

        if (isEmptyObject(ifExist) && isEmptyObject(ifExist2)) {
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
async function verification(req) {
    let data= req.query;
    let login=data.login;
    let verificationData=data.data;                            // Получили данные
    let user = await getUserByLog(login).catch(err => {throw err});
    if (isEmptyObject(user)) {
        return {
            "code" : 400
        };
    }
    let userId = user[0].id;
    let ver = await db.query(`SELECT * FROM user_verification WHERE user_id ='${userId}'`).catch(err => {throw err});
    let verData = ver[0].data;
    let verId= ver[0].id;

    if (verData===verificationData) {                  // Получили хэш из базы данных, сверяем. Если одинаковы - подверждаем почту
        await db.query (`UPDATE users SET user_type='${userTypes.verified}' WHERE login='${login}'`).catch(err => {throw err});
        await db.query (`DELETE FROM user_verification WHERE id='${verId}'`).catch(err => {throw err});
        return {
            "code" : codes.goodCode
        }
    }


}

async function log(req) {
    let data= req.query;
    let login=data.email;
    let password=data.pass;
    let user = await getUserByLog(login).catch(err => {throw err});
    if (!isEmptyObject(user)) {
        let hash = user[0].pass_hash;
        let ifGood= await bcrypt.compare(password,hash);
        if (ifGood) {
            return {
                "code" : codes.goodCode,
                "hash" : hash
            };
        }
    }
    return {
        "code" : codes.badCode
    };
}
module.exports = {
    register : reg,
    login    :  log,
    verify   : verification
};