// napisy_list.js
document.addEventListener('DOMContentLoaded', function () {
  const mdlID = new URLSearchParams(window.location.search).get('mdlID'); // URLから mdlID を取得

  // モデル詳細情報を取得
  fetch(`/api/napisylist?mdlID=${mdlID}`)
    .then(response => response.json())  // JSONレスポンスを取得
    .then(data => {
      const mdlIDElement = document.getElementById('mdlID');
      const subtitlesList = document.getElementById('subtitlesList');

      // モデルIDを表示
      mdlIDElement.textContent = `mdlID: ${mdlID}`;

      // 取得した字幕情報をリストに表示
      data.forEach(row => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
                  <p>字幕ID: ${row.mdltext}</p>
                  <p>言語名: ${row.languagename}</p>
                  <p>字幕ファイル: <a href="/path/to/subtitles/${row.napisyfile}">${row.napisyfile}</a></p>
              `;
        subtitlesList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('字幕情報の取得中にエラーが発生しました:', error);
      alert('字幕情報の取得に失敗しました。');
    });
});
