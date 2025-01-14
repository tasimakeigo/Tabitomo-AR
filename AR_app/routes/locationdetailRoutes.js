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
                m.mdlsound,
                m.mdltext,
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

// モデル削除のAPI
// モデル削除のAPI
router.delete('/modeldel', async (req, res) => {
    const mdlid = req.query.mdlid; // モデルID
    if (!mdlid) {
        return res.status(400).send('モデルIDが指定されていません。');
    }

    try {
        // トランザクションの開始
        await connection.query('BEGIN');

        // 1. model2テーブルから関連データを取得
        const modelDataResult = await connection.query('SELECT locationID, mdlsound, mdltext FROM model2 WHERE mdlid = $1', [mdlid]);

        if (modelDataResult.rows.length === 0) {
            return res.status(404).send('指定されたモデルIDのデータが見つかりません。');
        }

        const { locationID, mdlsound, mdltext } = modelDataResult.rows[0];

        // 2. soundテーブルの関連データを削除
        await connection.query('DELETE FROM sound WHERE mdlsound = $1', [mdlsound]);

        // 3. napisyテーブルの関連データを削除
        await connection.query('DELETE FROM napisy WHERE mdltext = $1', [mdltext]);

        // 4. model2テーブルからデータを削除
        await connection.query('DELETE FROM model2 WHERE mdlid = $1', [mdlid]);

        // 5. locationテーブルから関連するデータを削除
        await connection.query('DELETE FROM location WHERE locationID = $1', [locationID]);

        // 6. トランザクションのコミット
        await connection.query('COMMIT');

        res.status(200).json({ message: '関連データの削除が完了しました。' });
    } catch (error) {
        // エラーが発生した場合、ロールバック
        await connection.query('ROLLBACK');
        console.error('削除中にエラーが発生しました:', error);
        res.status(500).json({ message: '削除中にエラーが発生しました。' });
    }
});


module.exports = router;  // ルーターをエクスポート
