const express = require('express');
const router = express.Router();
const connection = require('../config'); // PostgreSQLの接続設定

// modellistエンドポイント - モデル情報をJSONとして返す
router.get('/', async (req, res) => {
    try {
        // SQLクエリの例: napisyテーブルからすべてのデータを取得
        const result = await connection.query('SELECT * FROM napisy');
        res.json(result.rows);  // データをJSONとして返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'モデル情報の取得中にエラーが発生しました' });
    }
});

module.exports = router;
