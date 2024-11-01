const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AR_login', 'html')); // viewsフォルダの指定

// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Iwai1218',
    database: 'tabitomo'
});

// MySQLに接続
connection.connect((err) => {
    if (err) {
        console.error('MySQLへの接続エラー:', err.stack);
        return;
    }
    console.log('MySQLに接続しました。接続ID:', connection.threadId);
});

// JSONボディをパースするためのミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// /loginエンドポイントを追加
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // SQLクエリを準備
    const query = 'SELECT * FROM ADMIN WHERE name = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('データベースエラー:', err);
            return res.status(500).send('サーバーエラー');
        }

        // 結果に応じてレスポンスを返す
        if (results.length > 0) {
            // EJSを使ってsuccess.ejsをレンダリング
            res.render('success', { username: username, password: password });
        } else {
            res.status(401).send('ユーザー名またはパスワードが間違っています'); // ログイン失敗メッセージ
        }
    });
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で実行中です`);
});
