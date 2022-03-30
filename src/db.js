const mysql = require('mysql');
const util = require("util");
var url = "http://127.0.0.1:3000";
var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eda_edet'
};

var connection;
function handleDisconnect() {      //Хэндл при ошибках в сети, разраба и т.д.
    connection = mysql.createConnection(db_config);
    connection.query = util.promisify(connection.query).bind(connection); //Создание обещаний для синтаксического сахара

    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db lost, handling');
            setTimeout(handleDisconnect ,2000);
    });
}
handleDisconnect();

module.exports= {
    db : connection,
    url : url
}

