// sql.js
const { Client } = require('pg');
require('dotenv').config(); // .envファイルを読み込む

// PostgreSQLクライアントの設定
const client = new Client({
  connectionString: process.env.DATABASE_URL, // .envファイルから接続情報を取得
  ssl: {
    rejectUnauthorized: false, // Renderで必要な設定
  }
});

// PostgreSQLデータベースに接続
const connectToDb = () => {
  return client.connect()
    .then(() => {
      console.log('PostgreSQLデータベースに接続しました');
    })
    .catch(err => {
      console.error('データベース接続エラー:', err.stack);
    });
};

// adminテーブルのログインチェック関数
const checkAdminLogin = (adminname, password) => {
  const query = 'SELECT * FROM admin WHERE name = $1 AND password = $2'; // プレースホルダーを使用
  return client.query(query, [adminname, password]);
};

module.exports = { connectToDb, checkAdminLogin };
