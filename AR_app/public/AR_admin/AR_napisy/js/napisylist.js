document.addEventListener('DOMContentLoaded', function () {
  // モデル情報を取得するためのAPI呼び出し
  fetch('/napisylist')  // サーバーからデータを取得
    .then(response => response.json())  // JSONレスポンスを取得
    .then(data => {
      const napisy = document.querySelector('.napisylist ul');  // モデル情報を表示する要素を選択

      // 取得したnapisy情報をリストに表示
      data.forEach(model => {
        const listItem = document.createElement('li');

        // モデル情報を表示する部分
        listItem.innerHTML = `
          <strong>モデルテキスト:</strong> ${model.mdltext} <br>
          <strong>言語名:</strong> ${model.languagename} <br>
          <strong>字幕ファイル:</strong> ${model.napisyfile} <br>
        `;

        napisy.appendChild(listItem);  // リストに追加
      });
    })
    .catch(error => {
      console.error('モデル情報の取得中にエラーが発生しました:', error);
      alert('モデル情報の取得に失敗しました。');
    });
});
