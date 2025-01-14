// C:\Tabitomo-AR\AR_app\routes\locationdetailRoutes.js
const express = require('express');  // expressモジュールのインポート
const router = express.Router();     // express.Router() でルーターを定義
const connection = require('../config');  // PostgreSQLの接続設定

// locationdetail のルート設定
router.get('/', async (req, res) => {
    const locationid = req.query.locationid;  // クエリパラメータからlocationidを取得

    if (!locationid) {
        return res.status(400).json({ error: 'locationidが指定されていません。' });
    }

    try {
        // `locationid` に関連するデータを取得するSQL
        const result = await connection.query('SELECT * FROM model2 WHERE locationid = $1', [locationid]);
        res.json(result.rows);  // 取得したデータを返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データの取得中にエラーが発生しました' });
    }
});

// sound2 のルート設定
router.get('/sound2', async (req, res) => {
    const mdlsound = req.query.mdlsound;  // クエリパラメータからmdlsoundを取得

    try {
        let query = 'SELECT * FROM sound';
        const params = [];

        if (mdlsound) {
            query += ' WHERE mdlsound = $1';
            params.push(mdlsound);
        }

        const result = await connection.query(query, params);
        res.json(result.rows);  // 取得したデータを返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データの取得中にエラーが発生しました' });
    }
});

module.exports = router;  // ルーターをエクスポート
