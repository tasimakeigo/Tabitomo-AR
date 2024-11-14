fetch('/api/markerinfo2')
    .then(response => response.json())
    .then(data => {
        console.log('取得したデータ:', data);  // データをコンソールに出力して確認
        const markerList = document.querySelector('.markerinfo ul');
        
        if (!Array.isArray(data)) {
            console.error('データ形式が正しくありません。');
            alert('不正なデータ形式です。');
            return;
        }

        data.forEach(marker => {
            // リストアイテムを生成
            const listItem = document.createElement('li');

            // ID
            const idPara = document.createElement('p');
            idPara.textContent = `ID: ${marker.mkid.trim()}`;
            listItem.appendChild(idPara);

            // 名前
            const namePara = document.createElement('p');
            namePara.textContent = `名前: ${marker.mkname}`;
            listItem.appendChild(namePara);

            // patt
            const pattPara = document.createElement('p');
            pattPara.textContent = `patt: ${marker.patt}`;
            listItem.appendChild(pattPara);

            // 画像
            const imgPara = document.createElement('p');
            const img = document.createElement('img');
            img.src = `/path/to/images/${marker.mkimage}`;
            img.alt = "Image";
            imgPara.appendChild(img);
            listItem.appendChild(imgPara);

            // リストにアイテムを追加
            markerList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('エラー:', error);
        alert('マーカー情報の取得に失敗しました。');
    });
