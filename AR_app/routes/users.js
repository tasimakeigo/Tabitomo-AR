const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../config');

// ログインエンドポイント
router.post('/userlogin', (req, res) => {
    const { username, password } = req.body;

    // ユーザー情報取得クエリ（パスワードハッシュ含む）
    const query = 'SELECT * FROM users WHERE name = $1;';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('データベースエラー:', err);
            return res.status(500).send('サーバーエラー');
        }

        if (results.rows.length === 0) {
            // ユーザーが存在しない場合
            return res.status(401).send('認証に失敗しました');
        }

        const user = results.rows[0];

        // パスワードの照合
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // 認証成功
                res.redirect(`/AR_user/home.html?username=${encodeURIComponent(username)}`);
            } else {
                // パスワードが一致しない場合
                res.status(401).send('認証に失敗しました');
            }
        } catch (compareError) {
            console.error('パスワード比較エラー:', compareError);
            res.status(500).send('サーバーエラー');
        }
    });
});

module.exports = router;
