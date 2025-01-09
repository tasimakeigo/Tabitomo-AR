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
            const locationIdList = document.querySelector('.locationid ul');  // モデル情報を表示する要素を選択

            if (!locationIdList) {
                console.error('指定された .locationid ul が見つかりません。HTMLを確認してください。');
                return;
            }

            // locationid の重複を除外
            const uniqueLocationIds = [...new Set(data.map(model => model.locationid))];

            uniqueLocationIds.forEach(id => {
                const listItem = document.createElement('li');
                listItem.textContent = id;  // locationid をリスト項目として表示

                locationIdList.appendChild(listItem); // リストに追加
            });

        })
        .catch(error => {
            console.error('モデル情報の取得中にエラーが発生しました:', error);
            alert('モデル情報の取得に失敗しました。');
        });
});
