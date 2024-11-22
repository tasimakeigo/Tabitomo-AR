document.addEventListener('DOMContentLoaded', function () {
    // 削除ボタンがクリックされたときのイベントリスナー
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const mdlsound = this.getAttribute('data-mdlsound');  // data-mdlsound を取得
            const languagename = this.getAttribute('data-languagename');  // data-languagename を取得

            // 削除確認ページに遷移
            window.location.href = `/deleteConfirm?mdlsound=${mdlsound}&languagename=${languagename}`;
        });
    });

    app.get('/deleteConfirm', (req, res) => {
        const { mdlsound, languagename } = req.query;
        // 削除確認画面に必要な情報をテンプレートに渡す
        res.render('deleteConfirm', { mdlsound, languagename });
    });
});