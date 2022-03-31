const mysql = require('mysql');
const util = require("util");
var url = "http://127.0.0.1:3000";
let codes = {
    "badCode" : 400,
    "goodCode" : 200
};
var mysql_pool  = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'eda_edet'
});
mysql_pool.query=util.promisify(mysql_pool.query);
module.exports= {
    db : mysql_pool,
    url : url,
    codes : codes
}

