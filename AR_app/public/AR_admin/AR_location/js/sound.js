document.addEventListener('DOMContentLoaded', function () {

    fetch('/sound')  // 
        .then(response => response.json())  // JSONレスポンスを取得
        .then(data => {
            const sound = document.querySelector('.sound ul');


            data.forEach(model => {
                const listItem = document.createElement('li');


                listItem.innerHTML = `
                    モデルID: ${model.mdlid}<br>
                    音声テキスト: <a href="soundlist.html?mdlsound=${model.mdlsound}" class="soundtext">
                        ${model.mdlsound}
                    </a>
                `;

                sound.appendChild(listItem); // リストに追加
            });

        })
        .catch(error => {
            console.error('モデル情報の取得中にエラーが発生しました:', error);
            alert('モデル情報の取得に失敗しました。');
        });
});
