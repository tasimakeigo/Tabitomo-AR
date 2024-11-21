const express = require('express');
const router = express.Router();
const connection = require('../config'); // PostgreSQLの接続設定

// /api/napisylist エンドポイント
router.get('/soundlist', async (req, res) => {
    const mdlID = req.query.mdlID; // クエリから mdlID を取得

    try {
        // model_info テーブルから mdltext を取得
        const modelInfo = await connection.query('SELECT mdltext FROM model_info WHERE mdlid = $1', [mdlID]);

        if (modelInfo.rows.length > 0) {
            const mdltext = modelInfo.rows[0].mdltext;

            // mdlsound を基に sound テーブルから関連するデータを取得
            const result = await connection.query('SELECT mdltext, languagename, soundfile FROM sound WHERE mdlsound = $1', [mdlsound]);

            if (result.rows.length > 0) {
                res.json(result.rows); // 取得したデータをJSONとして返す
            } else {
                res.status(404).json({ error: '指定された字幕が見つかりません' });
            }
        } else {
            res.status(404).json({ error: '指定されたモデルIDが見つかりません' });
        }
    } catch (error) {
        console.error('エラーが発生しました:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
});

module.exports = router;
