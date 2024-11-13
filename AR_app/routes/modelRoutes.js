// routes/modelRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../config');

// モデル情報エンドポイント
router.get('/modellist', async (req, res) => {
    try {
        const result = await connection.query('SELECT mdlid, mkid, mdlname, mdlimage, mdlsound, mdltext FROM model_info');
        res.send(`<html lang="ja">...${result.rows.map(row => `
          <li>モデルID: ${row.mdlid}</li>
          <li>マーカーID: ${row.mkid}</li>
          <li>モデル名: ${row.mdlname}</li>
          <li>3Dモデル: ${row.mdlimage}</li>
          <li>音声ID: ${row.mdlsound}</li>
          <li>字幕ID: ${row.mdltext}</li>
        `).join('')}</html>`);
    } catch (error) {
        console.error('Error fetching model info:', error);
        res.status(500).send('Error fetching model info');
    }
});

// モデル名エンドポイント
router.get('/modelname', async (req, res) => {
    try {
        const result = await connection.query('SELECT mdlname, mdlid FROM model_info');
        res.send(`<html lang="ja">...${result.rows.map(row => `
          <li><a href="/model_detail?mdlID=${row.mdlid}">${row.mdlname}</a></li>
        `).join('')}</html>`);
    } catch (error) {
        console.error('Error fetching model info:', error);
        res.status(500).send('Error fetching model info');
    }
});

module.exports = router;
