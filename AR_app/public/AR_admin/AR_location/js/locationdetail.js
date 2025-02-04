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
                        <p>ID</p>
                        ${locationid}
                    </div>

                    <div class="address">
                        <p>住所</p>
                        ${address}
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
                            <div class="mdlname">
                                <label for="mdlname">モデル名</label>
                                ${model.mdlname}
                            </div>

                            <div class="mdlid">
                                <label for="mdlid">モデルID</label>
                                ${model.mdlid}
                            </div>

                            <div class="mdl">
                                <div class="Dmdl">
                                    <label for="3Dmdl">3Dモデル</label>
                                    ${model.mdlname}
                                </div>

                                <div class="mdlimage">
                                    <button class="viewer-btn" data-mdlimage="${model.mdlimage}">3Dモデル表示</button><br>
                                </div>
                            </div>

                            <div class="mkname">
                                <label for="mkname">マーカー名</label>
                                ${model.mkname}
                            </div>

                            <div class="patt">
                                <label for="patt">パターン</label>
                                ${model.patt}
                            </div>

                            <div class="mkimage">
                                <label for="mkimage">マーカ画像</label>
                                <img src="/Content/markerimage/${model.mkimage}" alt="${model.mkimage}" width="200">
                            </div>

                            <div class="list">
                                <div class="soundfile">
                                    <a class="link" href="../../AR_admin/AR_napisy/napisylist.html?mdltext=${model.mdltext}"><button>字幕ファイル</button></a></br>
                                    ${model.textfiles.length > 0 ? model.textfiles.map(file => `<span class="textli">${file}</span><br>`).join('') : 'なし'}
                                </div>
                                <div class="textfile">
                                    <a class="link" href="../../AR_admin/AR_sound/soundlist.html?mdlsound=${model.mdlsound}"><button>音声ファイル</button></a></br>
                                    ${model.soundfiles.length > 0 ? model.soundfiles.map(file => `<span class="textli">${file}</span><br>`).join('') : 'なし'}
                                </div>
                            </div>
                        <button class="edit-btn" data-mdlid="${mdlid}">編集</button>
                        <button class="delete-btn" data-mdlid="${mdlid}">削除</button>
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
