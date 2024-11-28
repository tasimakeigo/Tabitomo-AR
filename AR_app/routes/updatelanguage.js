// C:\Tabitomo-AR\AR_app\routes\updatelanguage.js
const express = require('express');
const router = express.Router();
const connection = require('../config');

// ユーザーの言語設定を更新するエンドポイント
router.post('/updatelanguage', (req, res) => {
    const { username, language } = req.body;

    if (!username || !language) {
        return res.status(400).send('ユーザー名と言語は必須です');
    }

    const query = 'UPDATE users SET languagename = $1 WHERE name = $2';
    connection.query(query, [language, username], (err, result) => {
        if (err) {
            console.error('データベースエラー:', err);
            return res.status(500).send('サーバーエラー');
        }

        if (result.rowCount > 0) {
            res.status(200).send('言語設定が更新されました');
        } else {
            res.status(404).send('ユーザーが見つかりません');
        }
    });
});

module.exports = router;