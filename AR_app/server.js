const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
