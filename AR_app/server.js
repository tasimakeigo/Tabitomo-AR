const express = require('express');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// PostgreSQLクライアントの設定
const connection = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'tabitomo',
  password: 'kashi0001',
  port: 5432,
});

// データベース接続
connection.connect()
  .then(() => {
    console.log('PostgreSQLデータベースに接続しました');
  })
  .catch(err => {
    console.error('データベース接続エラー:', err.stack);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// /loginエンドポイント
app.post('/login', (req, res) => {
  const { adminname, password } = req.body;
  const query = 'SELECT * FROM ADMIN WHERE name = $1 AND password = $2;';
  connection.query(query, [adminname, password], (err, results) => {
      if (err) {
          console.error('データベースエラー:', err);
          return res.status(500).send('サーバーエラー');
      }

      if (results.rows.length > 0) {
          res.redirect(`/AR_admin/menu.html?adminname=${encodeURIComponent(adminname)}`);
      } else {
          res.status(401).send('ユーザー名またはパスワードが間違っています');
      }
  });
});

app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で実行中です`);
});
