const express = require('express');
const router = express.Router();
const connection = require('../config');  // データベース接続
const axios = require('axios');  // HTTPリクエストを送るために使用

// /get_locationsエンドポイントで住所を取得
router.get('/get_locations', async (req, res) => {
    // SQLクエリでlocationテーブルから住所を取得
    const query = 'SELECT locationname, address FROM location';

    try {
        // データベースから情報を取得
        const result = await connection.query(query);

        // 住所を基に緯度・経度を取得
        const locationsWithCoordinates = await Promise.all(result.rows.map(async (location) => {
            const { locationname, address } = location;

            // OpenStreetMap APIを使って住所から緯度・経度を取得
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
            const response = await axios.get(geocodeUrl);

            const latitude = response.data[0]?.lat;
            const longitude = response.data[0]?.lon;

            return {
                locationNAME: locationname,
                address: address,
                latitude: latitude,
                longitude: longitude
            };
        }));

        // 取得したデータをJSON形式で返却
        res.json(locationsWithCoordinates);
    } catch (error) {
        console.error('エラー:', error);
        res.status(500).json({ error: 'データベースから情報を取得できませんでした' });
    }
});

module.exports = router;
