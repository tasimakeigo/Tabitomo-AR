// C:\Tabitomo-AR\AR_app\public\AR_admin\AR_marker\js\marker.js

document.addEventListener('DOMContentLoaded', function () {
    // マーカー情報を取得するためのAPI呼び出し
    fetch('/api/markerinfo2')
        .then(response => response.json()) // JSONレスポンスを取得
        .then(data => {
            const markerList = document.querySelector('.markerinfo ul');

            // 取得したマーカー情報をリストに表示
            data.forEach(marker => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p>ID: ${marker.mkid}</p>
                    <p>名前: ${marker.mkname}</p>
                    <p>patt: ${marker.patt}</p>
                    <p>画像: <img src="/path/to/images/${marker.mkimage}" alt="${marker.mkname}"></p>
                `;
                markerList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('エラー:', error);
            alert('マーカー情報の取得に失敗しました。');
        });
});
