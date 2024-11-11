// server.js
const express = require('express');
const { Client } = require('pg');
const path = require('path');
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

// 静的ファイルの提供
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

// /markerinfoエンドポイント
app.get('/markerinfo', async (req, res) => {
  try {
    // markerテーブルからデータを取得
    const result = await connection.query('SELECT mkid, mkname, patt, mkimage FROM marker');

    // HTMLを生成してレスポンスを送信
    res.send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>マーカー情報</title>
            <link rel="stylesheet" href="static/server.css">
        </head>
        <body>
            <header>
                <h1>マーカー情報</h1>
            </header>

            <main>
                <div class="markerinfo">
                    <ul>
                        ${result.rows.map(row => `
                            <li>ID: ${row.mkid}</li>
                            <li>名前: ${row.mkname}</li>
                            <li>patt: ${row.patt}</li>
                            <li>image: <img src="path/to/images/${row.mkimage}" alt="Image"></li>
                        `).join('')}
                    </ul>
                </div>
            </main>

            <footer>
                <p>© 2024 TIC 大原学園 C-2</p>
            </footer>
        </body>
        </html>`);
  } catch (error) {
    console.error('Error fetching marker info:', error);
    res.status(500).send('Error fetching marker info');
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で実行中です`);
});
