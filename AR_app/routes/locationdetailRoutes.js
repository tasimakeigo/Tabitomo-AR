// C:\Tabitomo-AR\AR_app\routes\locationdetailRoutes.js
const express = require('express');  // expressモジュールのインポート
const router = express.Router();     // express.Router() でルーターを定義
const connection = require('../config');  // PostgreSQLの接続設定


router.get('/', async (req, res) => {
    const locationid = req.query.locationid;

    if (!locationid) {
        return res.status(400).json({ error: 'locationidが指定されていません。' });
    }

    try {
        // MODEL2, sound, napisyテーブルを結合してデータ取得
        const query = `
            SELECT 
                m.mdlname,
                m.mdlid,
                m.mdlimage,
                m.mkname,
                m.patt,
                m.mkimage,
                s.languagename,
                s.soundfile,
                n.napisyfile
            FROM 
                model2 m
            LEFT JOIN  
                sound s ON m.mdlsound = s.mdlsound 
            LEFT JOIN  
                napisy n ON m.mdltext = n.mdltext AND s.languagename = n.languagename
            WHERE 
                m.locationid = $1
            ORDER BY
                m.mdlid, s.languagename;
        `;

        const result = await connection.query(query, [locationid]);

        // データをJSON形式で返す
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'データの取得中にエラーが発生しました。' });
    }
});

module.exports = router;  // ルーターをエクスポート
