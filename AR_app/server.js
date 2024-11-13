// server.js
const express = require('express');
const path = require('path');
const app = express();
const markerRoutes = require('./routes/markerRoutes'); // markerRoutesをインポート

// public フォルダを静的ファイルの提供場所として指定
app.use(express.static(path.join(__dirname, 'public')));  // 'public' フォルダを静的ファイルとして公開

// データベースに関するルートを設定
app.use('/api', markerRoutes); // markerRoutes を /api パスにマウント

// サーバーの起動
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
