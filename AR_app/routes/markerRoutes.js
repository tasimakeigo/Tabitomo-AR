// routes/markerRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../config'); // PostgreSQLの接続設定

// markerinfoエンドポイント
router.get('/markerinfo', async (req, res) => {
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
            <link rel="stylesheet" href="static/server.css"> <!-- 静的ファイルのパス -->
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
                            <li>image: <img src="/path/to/images/${row.mkimage}" alt="Image"></li> <!-- 画像のパス調整 -->
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

module.exports = router;
