const express = require('express');
const router = express.Router();
const connection = require('../config');

// ユーザー名変更エンドポイント
router.post('/updateusername', (req, res) => {
    const { username, newusername } = req.body;

    const query = 'UPDATE users SET name = $1 WHERE name = $2';
    connection.query(query, [newusername, username], (err, result) => {
        if (err) {
            console.error('データベースエラー:', err);
            return res.status(500).send('サーバーエラー');
        }

        if (result.rowCount > 0) {
            res.status(200).send({ status: 'success' });
        } else {
            res.status(404).send({ status: 'fail', message: 'ユーザーが見つかりません' });
        }
    });
});

module.exports = router;
