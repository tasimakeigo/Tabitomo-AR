document.addEventListener('DOMContentLoaded', function () {
    // モデル情報を取得するためのAPI呼び出し
    fetch('/location')  // モデル情報を取得するエンドポイント
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークエラー: ' + response.status);
            }
            return response.json();  // JSONレスポンスを取得
        })
        .then(data => {
            const location = document.querySelector('.location ul');  // モデル情報を表示する要素を選択

            // 取得したモデル情報をリストに表示
            data.forEach(model => {
                const listItem = document.createElement('li');

                // モデル情報をリスト項目に挿入
                listItem.textContent = ` ${model.locationname} `;
                listItem.innerHTML = `
                <a href="locationdetail.html?locationid=${model.locationid}" class="locationid">
                    ${model.locationname},${model.address}
                </a>
                <button class="delete-btn" data-locationid="${model.locationid}">削除</button>
            `;

                location.appendChild(listItem); // リストに追加
            });

        })
        .catch(error => {
            console.error('モデル情報の取得中にエラーが発生しました:', error);
            alert('モデル情報の取得に失敗しました。');
        });
});
