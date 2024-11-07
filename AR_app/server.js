const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  // body-parserモジュールをインポート
const { connectToDb, checkAdminLogin } = require('./sql'); // sql.jsから関数をインポート

const app = express();
const PORT = process.env.PORT || 8080;  // RenderのPORT環境変数を使用

// EJSの設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'AR_login', 'html')); // viewsフォルダの指定

// データベース接続を確立
connectToDb();

// JSONボディをパースするためのミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname)));  // 'AR_app'ディレクトリを静的ファイルのルートに指定

// /loginエンドポイントを追加
app.post('/login', (req, res) => {
  const { adminname, password } = req.body;

  // SQLクエリを実行
  checkAdminLogin(adminname, password)
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
// /loginエンドポイント終了

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがhttp://localhost:${PORT}で実行中`);
});
