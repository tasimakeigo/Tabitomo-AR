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
                let detailsHtml = `<h2>場所: ${locationname}</h2> <p>ID: ${locationid}</p> <p>ID: ${address}</p>`;

                data.forEach(model => {
                    detailsHtml += `
                        <p>                                    
                            <strong>モデル名:</strong> ${model.mdlname}<br>
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
            .catch(error => {
                console.error('モデル情報の取得中にエラーが発生しました:', error);
                alert('モデル情報の取得に失敗しました。');
            });

        // 新規モデル追加ボタンのイベントリスナー追加
        document.querySelector('.add-btn').addEventListener('click', function () {
            window.location.href = `/AR_admin/AR_location/modeladd.html?locationid=${encodeURIComponent(locationid)}`;
        });
    } else {
        alert('場所IDが指定されていません。');
    }
});