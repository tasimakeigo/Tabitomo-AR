const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config'); // データベース接続をインポート
const router = express.Router();

// ファイルアップロード設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'mdlimage') cb(null, 'C:/Tabitomo-AR/AR_app/public/Content/.glb');
    else if (file.fieldname === 'patt') cb(null, 'C:/Tabitomo-AR/AR_app/public/Content/.patt');
    else if (file.fieldname === 'mkimage') cb(null, 'C:/Tabitomo-AR/AR_app/public/Content/markerimage');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now(); // タイムスタンプを一意の識別子として使用
    const originalName = path.basename(file.originalname, path.extname(file.originalname)); // 拡張子を除いた元のファイル名
    cb(null, `${originalName}-${uniqueSuffix}${path.extname(file.originalname)}`); // "元の名前-タイムスタンプ.拡張子" の形式
  },
});

const upload = multer({ storage });

router.post('/model2', upload.fields([
  { name: 'mdlimage', maxCount: 1 },
  { name: 'patt', maxCount: 1 },
  { name: 'mkimage', maxCount: 1 },
]), async (req, res) => {
  const { mdlname, mkname } = req.body;
  const mdlimage = req.files['mdlimage'][0].filename;
  const patt = req.files['patt'][0].filename;
  const mkimage = req.files['mkimage'][0].filename;

  const locationID = new URLSearchParams(req.headers.referer.split('?')[1]).get('locationid');

  try {
    const result = await db.query(`
      SELECT MAX(CAST(SUBSTRING(mdlID FROM 4) AS INTEGER)) AS max_id,
             MAX(CAST(SUBSTRING(mdlsound FROM 2) AS INTEGER)) AS max_sound,
             MAX(CAST(SUBSTRING(mdltext FROM 2) AS INTEGER)) AS max_text
      FROM MODEL2
    `);

    const mdlID = `mdl${String(result.rows[0].max_id + 1).padStart(4, '0')}`;
    const mdlsound = `s${String(result.rows[0].max_sound + 1).padStart(2, '0')}`;
    const mdltext = `t${String(result.rows[0].max_text + 1).padStart(2, '0')}`;

    await db.query(`
      INSERT INTO MODEL2 (mdlID, locationID, mdlname, mdlimage, mkname, patt, mkimage, mdlsound, mdltext)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [mdlID, locationID, mdlname, mdlimage, mkname, patt, mkimage, mdlsound, mdltext]);

    res.status(200).send('モデルが登録されました');
  } catch (err) {
    console.error(err);
    res.status(500).send('エラーが発生しました');
  }
});

module.exports = router;
