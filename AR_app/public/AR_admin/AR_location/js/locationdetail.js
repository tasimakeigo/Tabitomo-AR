document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const locationid = urlParams.get('locationid');
    const locationname = urlParams.get('locationname');
    const address = urlParams.get('address');

    if (locationid) {

        // モデル情報を取得して表示
        fetch(`/locationdetail?locationid=${locationid}`)
            .then(response => response.json())
            .then(data => {
                const locationDetails = document.getElementById('location-details');
                let detailsHtml = `<h2>場所: ${locationname}</h2> <p>ID: ${locationid}</p> <p>住所: ${address}</p>`;


                data.forEach(model => {
                    detailsHtml += `
                            <p>                                  
                                <strong>モデル名:</strong> ${model.mdlname}<br>
                                <strong>モデルID:</strong> ${model.mdlid}<br>
                                <strong>画像:</strong> <img src="${model.mdlimage}" alt="${model.mdlimage}" width="200"><br>
                                <strong>マーカー名:</strong> ${model.mkname}<br>
                                <strong>パターン:</strong> ${model.patt}<br>
                                <strong>マーカー画像:</strong> <img src="${model.mkimage}" alt="${model.mkname}" width="200"><br>
                                <strong>音声ファイル:</strong> ${model.mdlsound}<br>
                                <strong>モデルテキスト:</strong> ${model.mdltext}
                            </p>
                            <button class="edit-btn" data-mdlid="${model.mdlid}">編集</button>
                            <button class="delete-btn" data-mdlid="${model.mdlid}">削除</button>
                        `;
                });


                locationDetails.innerHTML = detailsHtml;

                // 編集ボタンのイベントリスナー追加
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const mdlid = this.dataset.mdlid;
                        window.location.href = `/AR_admin/AR_location/modeledit.html?mdlid=${encodeURIComponent(mdlid)}`;
                    });
                });

                // 削除ボタンのイベントリスナー追加
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const mdlid = this.dataset.mdlid;
                        window.location.href = `/AR_admin/AR_location/modeldel.html?mdlid=${encodeURIComponent(mdlid)}`;
                    });
                });



            })


        // 新規モデル追加ボタンのイベントリスナー追加
        document.querySelector('.add-btn').addEventListener('click', function () {
            window.location.href = `/AR_admin/AR_location/modeladd.html?locationid=${encodeURIComponent(locationid)}`;
        });
    } else {
        alert('場所IDが指定されていません。');
    }
});
document.addEventListener('DOMContentLoaded', function () {

    fetch('/sound')  // /soundからデータを取得
        .then(response => response.json())  // JSONレスポンスを取得
        .then(data => {
            data.forEach(model => {
                const mdlsound = model.mdlsound;  // 音声ファイル名取得

                // 音声ファイル名をもとに `sound` テーブルを参照する
                fetch(`/sound?mdlsound=${mdlsound}`)
                    .then(response => response.json())  // `sound` テーブルからのレスポンスを取得
                    .then(soundData => {
                        soundData.forEach(soundItem => {
                            const listItem = document.createElement('div');  // divを使ってリストアイテムを作成

                            listItem.innerHTML = `
                                <p>音声テキスト: ${soundItem.mdlsound}</p>
                                <p>言語: ${soundItem.languagename}</p>
                                <p>音声ファイル詳細: ${soundItem.mdlsound}</p>
                            `;

                            // 任意の要素にリストアイテムを追加
                            document.body.appendChild(listItem);  // ここでリストアイテムを追加
                        });
                    })
                    .catch(error => {
                        console.error('soundテーブルの取得中にエラーが発生しました:', error);
                    });
            });
        })
        .catch(error => {
            console.error('モデル情報の取得中にエラーが発生しました:', error);
        });
});
