const mysql = require('mysql2');

// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',    // MySQLサーバーのホスト名
    user: 'root', // MySQLユーザー名
    password: 'Iwai1218', // MySQLパスワード
    database: 'tabitomo' // 使用するデータベース名
});

// 接続

// 接続を終了
connection.end();