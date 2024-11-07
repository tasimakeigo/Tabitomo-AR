const express = require('express');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config(); // .envファイルを読み込む

const app = express();
const PORT = process.env.PORT || 8080;  // RenderのPORT環境変数を使用

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

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));  // 'public'ディレクトリを静的ファイルのルートに指定


// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがhttp://localhost:${PORT}で実行中`);
});
