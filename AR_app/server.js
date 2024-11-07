const express = require('express');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config(); // .envファイルを読み込む
const bodyParser = require('body-parser');  // body-parserモジュールをインポート

const app = express();
const PORT = process.env.PORT || 8080;  // RenderのPORT環境変数を使用

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AR_login', 'html')); // viewsフォルダの指定

// PostgreSQLクライアントの設定
const client = new Client({
  connectionString: process.env.DATABASE_URL, // .envファイルから接続情報を取得
  ssl: {
    rejectUnauthorized: false, // Renderで必要な設定
  }
});

// PostgreSQLデータベースに接続
client.connect()
  .then(() => {
    console.log('PostgreSQLデータベースに接続しました');
  })
  .catch(err => {
    console.error('データベース接続エラー:', err.stack);
  });

// JSONボディをパースするためのミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname)));  // 'AR_app'ディレクトリを静的ファイルのルートに指定

// /loginエンドポイントを追加
app.post('/login', (req, res) => {
  const { adminname, password } = req.body;

  // SQLクエリを準備
  const query = 'SELECT * FROM admin WHERE name = $1 AND password = $2';  // プレースホルダーを使用

  
  // PostgreSQLにクエリを実行
  client.query(query, [adminname, password])
    .then(result => {
      if (result.rows.length > 0) {
        // EJSを使ってsuccess.ejsをレンダリング
        res.render('success', { adminname: adminname, password: password });
      } else {
        res.status(401).send('ユーザー名またはパスワードが間違っています'); // ログイン失敗メッセージ
      }
    })
    .catch(err => {
      console.error('データベースエラー:', err);
      res.status(500).send('サーバーエラー');
    });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがhttp://localhost:${PORT}で実行中`);
});
