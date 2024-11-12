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

// /modellistエンドポイント
app.get('/modellist', async (req, res) => {
  try {
    // model_infoテーブルからデータを取得
    const result = await connection.query('SELECT mdlid, mkid, mdlname, mdlimage, mdlsound, mdltext FROM model_info');

    // HTMLを生成してレスポンスを送信
    res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>モデル情報</title>
        <link rel="stylesheet" href="static/server.css">
      </head>
      <body>
        <header>
          <h1>モデル情報</h1>
        </header>

        <main>
          <div class="modellist">
            <ul>
              ${result.rows.map(row => `
                <li>モデルID: ${row.mdlid}</li>
                <li>マーカーID: ${row.mkid}</li>
                <li>モデル名: ${row.mdlname}</li>
                <li>3Dモデル: ${row.mdlimage}</li>
                <li>音声ID: ${row.mdlsound}</li>
                <li>字幕ID: ${row.mdltext}</li>
                <br>
              `).join('')}
            </ul>
          </div>
        </main>

        <footer>
          <p>© 2024 TIC 大原学園 C-2</p>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching model info:', error);
    res.status(500).send('Error fetching model info');
  }
});

// /modelnameエンドポイント
app.get('/modelname', async (req, res) => {
  try {
    // model_infoテーブルからモデル名とmdlIDを取得
    const result = await connection.query('SELECT mdlname, mdlid FROM model_info');

    // HTMLを生成してレスポンスを送信
    res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>モデル情報</title>
        <link rel="stylesheet" href="static/server.css">
      </head>
      <body>
        <header>
          <h1>モデル名一覧</h1>
        </header>

        <main>
          <div class="modellist">
            <ul>
              ${result.rows.map(row => `
                <li><a href="/model_detail?mdlID=${row.mdlid}">${row.mdlname}</a></li>
              `).join('')}
            </ul>
          </div>
        </main>

        <footer>
          <p>© 2024 TIC 大原学園 C-2</p>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching model info:', error);
    res.status(500).send('Error fetching model info');
  }
});



app.get('/model_detail', async (req, res) => {
  const mdlID = req.query.mdlID; // URLクエリから mdlID を取得
  try {
    // model_info テーブルから mdltext を取得
    const modelInfo = await connection.query('SELECT mdltext FROM model_info WHERE mdlid = $1', [mdlID]);

    if (modelInfo.rows.length > 0) {
      const mdltext = modelInfo.rows[0].mdltext;

      // mdltext を基に napisy テーブルから関連するデータを取得
      const result = await connection.query('SELECT mdltext, languagename, napisyfile FROM napisy WHERE mdltext = $1', [mdltext]);

      if (result.rows.length > 0) {
        // 複数のデータがある場合、それらをリスト表示
        const subtitlesList = result.rows.map(row => `
          <li>
            <p>字幕ID: ${row.mdltext}</p>
            <p>言語名: ${row.languagename}</p>
            <p>字幕ファイル: <a href="/path/to/subtitles/${row.napisyfile}">${row.napisyfile}</a></p>
          </li>
        `).join('');

        // モデル詳細ページのHTMLを生成
        res.send(`
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>モデル詳細</title>
            <link rel="stylesheet" href="static/server.css">
          </head>
          <body>
            <header>
              <h1>モデル詳細</h1>
            </header>

            <main>
              <h2>mdlID: ${mdlID}</h2>
              <ul>
                ${subtitlesList}
              </ul>
            </main>

            <footer>
              <p>© 2024 TIC 大原学園 C-2</p>
            </footer>
          </body>
          </html>
        `);
      } else {
        res.status(404).send('指定された字幕が見つかりません');
      }
    } else {
      res.status(404).send('指定されたモデルIDが見つかりません');
    }
  } catch (error) {
    console.error('Error fetching model details:', error);
    res.status(500).send('エラーが発生しました');
  }
});




// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で実行中です`);
});
