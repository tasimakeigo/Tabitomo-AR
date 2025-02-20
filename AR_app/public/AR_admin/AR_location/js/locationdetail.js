document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const locationid = urlParams.get('locationid');
    const locationname = urlParams.get('locationname');
    const address = urlParams.get('address');

    if (locationid) {
        fetch(`/locationdetail?locationid=${locationid}`)
            .then(response => response.json())
            .then(data => {
                const locationDetails = document.getElementById('location-details');
                let detailsHtml = `

                    <div class="locationname">
                        <h2>場所: ${locationname}</h2>
                    </div>

                    <div class="locationid">
                        <p>ID: ${locationid}</p>
                    </div>

                    <div class="address">
                        <p>住所: ${address}</p>
                    </div>
                        
                    `;

                const models = {};

                // データをモデルごとにグループ化
                data.forEach(item => {
                    if (!models[item.mdlid]) {
                        models[item.mdlid] = {
                            mdlname: item.mdlname,
                            mdlid: item.mdlid,
                            mdlimage: item.mdlimage,
                            mkname: item.mkname,
                            patt: item.patt,
                            mkimage: item.mkimage,
                            mdltext: item.mdltext,
                            mdlsound: item.mdlsound,
                            soundfiles: [],
                            textfiles: [],
                        };
                    }
                    models[item.mdlid].soundfiles.push(item.soundfile);
                    models[item.mdlid].textfiles.push(item.napisyfile);
                });

                // HTML生成
                for (const mdlid in models) {
                    const model = models[mdlid];
                    detailsHtml += `
                        <button class="edit-btn" data-mdlid="${mdlid}">編集</button>
                        <button class="delete-btn" data-mdlid="${mdlid}">削除</button><br>
                        <p class="model-info">
                            <strong>モデル名: <span>${model.mdlname}</span></strong><br>
                            <strong>モデルID: <span>${model.mdlid}</span></strong><br>
                            <strong>3Dモデル: <span>${model.mdlname}</span></strong><br>
                            <button class="viewer-btn" data-mdlimage="${model.mdlimage}">3Dモデル表示</button><br>
                            <strong>マーカー名: <span>${model.mkname}</span></strong><br>
                            <strong>パターン: <span>${model.patt}</span></strong><br>
                            <strong>マーカー画像</strong><img src="/Content/markerimage/${model.mkimage}" alt="${model.mkimage}" width="200"><br>
                        </p>
                        <div class="files-list">
                            <div class="file-group">
                                <strong><a href="../../AR_admin/AR_sound/soundlist.html?mdlsound=${model.mdlsound}">音声ファイル</a></strong><br>
                                ${model.soundfiles.length > 0 ? model.soundfiles.map(file => `<span>${file}</span><br>`).join('') : '<span>なし</span>'}
                            </div>
                            <div class="file-group">
                                <strong><a href="../../AR_admin/AR_napisy/napisylist.html?mdltext=${model.mdltext}">テキストファイル</a></strong><br>
                                ${model.textfiles.length > 0 ? model.textfiles.map(file => `<span>${file}</span><br>`).join('') : '<span>なし</span>'}
                            </div>
                        </div>

                    `;
                }

                // テキスト、音声逆

                locationDetails.innerHTML = detailsHtml;
                // 編集・削除ボタンのイベントリスナー
                document.querySelectorAll('.viewer-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const mdlimage = this.dataset.mdlimage;
                        window.location.href = `/AR_admin/AR_location/3DmodelViewer.html?model=${encodeURIComponent(mdlimage)}`;
                    });
                });
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const mdlid = this.dataset.mdlid;
                        window.location.href = `/AR_admin/AR_location/modeledit.html?mdlid=${encodeURIComponent(mdlid)}`;
                    });
                });
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {

                        if (confirm('関連するすべてのデータを削除しますか？')) {
                            fetch(`/locationdetail/modeldel?locationid=${encodeURIComponent(locationid)}`, {
                                method: 'DELETE',
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.message === '関連データの削除が完了しました。') {
                                        alert('関連データが削除されました。');
                                        window.location.href = `/AR_admin/AR_location/location.html`;
                                    } else {
                                        alert('削除に失敗しました: ' + data.message);
                                    }
                                })
                                .catch(error => {
                                    console.error('削除中にエラーが発生しました:', error);
                                    alert('削除中にエラーが発生しました。');
                                });
                        }
                    });
                });
            })
            .catch(error => {
                console.error('データの取得中にエラーが発生しました:', error);
                alert('データの取得中にエラーが発生しました。');
            });
    } else {
        alert('場所IDが指定されていません。');
    }
});
