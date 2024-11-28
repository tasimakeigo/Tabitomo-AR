const express = require('express');
const router = express.Router();
const connection = require('../config');
const bcrypt = require('bcrypt'); // パスワードハッシュ化用

// 新規管理者登録エンドポイント
router.post('/newUser', async (req, res) => {
    const { username, password, passwordConfirm, languagename } = req.body;

    // パスワード確認
    if (password !== passwordConfirm) {
        return res.status(400).send('パスワードが一致しません');
    }

    try {
        // ユーザーが既に存在するか確認
        const checkAdminQuery = 'SELECT * FROM users WHERE name = $1';
        const checkResult = await connection.query(checkAdminQuery, [username]);
        if (checkResult.rows.length > 0) {
            return res.status(400).send('このユーザー名は既に使用されています');
        }

        // 最大useridを取得して新しいIDを生成
        const getMaxIdQuery = 'SELECT MAX(CAST(userid AS INT)) AS max_id FROM users';
        const maxIdResult = await connection.query(getMaxIdQuery);
        const maxId = maxIdResult.rows[0]?.max_id || 0; // NULLチェック
        const newId = (maxId + 1).toString().padStart(2, '0'); // 2桁にゼロ埋め

        // パスワードをハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // 新規管理者のデータを登録
        const insertAdminQuery = `
            INSERT INTO users (userid, name, password, languagename, delflag)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await connection.query(insertAdminQuery, [newId, username, hashedPassword, languagename, false]);

        res.status(200).send('新規登録が成功しました');
    } catch (err) {
        console.error('サーバーエラー:', err);
        res.status(500).send('サーバーエラーが発生しました');
    }
});

module.exports = router;
