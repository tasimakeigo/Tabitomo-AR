// C:\Tabitomo-AR\AR_app\routes\locationdetailRoutes.js
const express = require('express');  // expressモジュールのインポート
const router = express.Router();     // express.Router() でルーターを定義
const connection = require('../config');  // PostgreSQLの接続設定

// ここでルートの設定
router.get('/', async (req, res) => {
    const locationid = req.query.locationid;  // クエリパラメータからmdltextを取得

    if (!locationid) {
        return res.status(400).json({ error: 'mdltextが指定されていません。' });
    }

    try {
        // `mdltext` に関連するデータを取得するSQL
        const result = await connection.query('SELECT * FROM model2 WHERE locationid = $1', [locationid]);
        res.json(result.rows);  // 取得したデータを返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データの取得中にエラーが発生しました' });
    }
});




module.exports = router;  // ルーターをエクスポート
