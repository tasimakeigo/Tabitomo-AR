app.get('/model_detail', async (req, res) => {
  const mdlID = req.query.mdlID; // URLクエリから mdlID を取得
  try {
    // model_info テーブルから mdltext を取得
    const modelInfo = await connection.query('SELECT mdltext FROM model_info WHERE mdlid = $1', [mdlID]);

    if (modelInfo.rows.length > 0) {
      const mdltext = modelInfo.rows[0].mdltext;

      // mdltext を基に napisy テーブルから関連するデータを取得
      const result = await connection.query('SELECT mdltext, languagename, napisyfile FROM napisy WHERE mdltext = $1', [mdltext]);

      if (result.rows.length > 0) {
        // 複数のデータがある場合、それらをリスト表示
        const subtitlesList = result.rows.map(row => `
            <li>
              <p>字幕ID: ${row.mdltext}</p>
              <p>言語名: ${row.languagename}</p>
              <p>字幕ファイル: <a href="/path/to/subtitles/${row.napisyfile}">${row.napisyfile}</a></p>
            </li>
          `).join('');

        // モデル詳細ページのHTMLを生成
        res.send(`
           
          `);
      } else {
        res.status(404).send('指定された字幕が見つかりません');
      }
    } else {
      res.status(404).send('指定されたモデルIDが見つかりません');
    }
  } catch (error) {
    console.error('Error fetching model details:', error);
    res.status(500).send('エラーが発生しました');
  }
});
