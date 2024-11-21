document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mdlID = urlParams.get('mdlid');  // クエリパラメータからmdlIDを取得
    if (mdlID) {
        // mdlIDを使って字幕情報を取得するAPIを呼び出す
        fetch(`/api/soundlist?mdlID=${mdlID}`)
            .then(response => response.json())  // JSONレスポンスを取得
            .then(data => {
                const soundListElement = document.querySelector('.sound ul');  // モデル情報を表示する要素を選択
                soundListElement.innerHTML = ''; // 初期化

                if (data.length > 0) {
                    // 取得した字幕情報をリストに表示
                    data.forEach(sound => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <p><strong>音声:</strong> ${sound.languagename}</p>
                            <p><strong>音声ファイル:</strong> ${sound.soundfile}</p>
                        `;
                        soundListElement.appendChild(listItem);
                    });
                } else {
                    soundListElement.innerHTML = '<p>関連する音声が見つかりません。</p>';
                }
            })
            .catch(error => {
                console.error('音声情報の取得中にエラーが発生しました:', error);
                document.querySelector('.sound ul').innerHTML = `<p>${error.message}</p>`;
            });
    } else {
        alert('モデルIDが指定されていません');
    }
});
