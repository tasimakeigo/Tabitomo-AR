const express = require('express');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config(); // .envファイルを読み込む
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;  // ローカルのPORT

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'SQL_test', 'AR_login','html'));  // AR_admin内にmenu.ejsがある場合

// PostgreSQLクライアントの設定
const connection = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'tabitomo',  // ここにデータベース名を入力
  password: 'kashi0001',
  port: 5432,
});

// PostgreSQLデータベースに接続
connection.connect()
  .then(() => {
    console.log('PostgreSQLデータベースに接続しました');
  })
  .catch(err => {
    console.error('データベース接続エラー:', err.stack);
  });

// JSONボディをパースするためのミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// /loginエンドポイントを追加
app.post('/login', (req, res) => {
  const { adminname, password } = req.body;

  // SQLクエリを準備
  const query = 'SELECT * FROM ADMIN WHERE name = $1 AND password = $2';
  connection.query(query, [adminname, password], (err, results) => {
      if (err) {
          console.error('データベースエラー:', err);
          return res.status(500).send('サーバーエラー');
      }

      // 結果に応じてレスポンスを返す
      if (results.rows.length > 0) {  // results.rowsにデータが入っているか確認
          res.render('success', { adminname: adminname, password: password });
      } else {
          res.status(401).send('ユーザー名またはパスワードが間違っています'); // ログイン失敗メッセージ
      }
  });
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で実行中です`);
});
