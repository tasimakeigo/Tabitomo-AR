document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // フォームデータを取得
    const adminname = document.getElementById('login-name').value;
    const password = document.getElementById('login-pass').value;

    // エラーメッセージを初期化
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = '';  // エラーメッセージをリセット

    // AJAXリクエストの作成
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // レスポンスの処理
    xhr.onload = function () {
        if (xhr.status === 200) {
            // レスポンスが成功した場合
            window.location.href = '/AR_admin/menu.html'; // 成功したらmenu.htmlに遷移
        } else {
            // エラーメッセージを表示
            errorMessageElement.textContent = 'ログイン失敗: ユーザー名またはパスワードが間違っています';
        }
    };

    // リクエストを送信
    xhr.send(`adminname=${encodeURIComponent(adminname)}&password=${encodeURIComponent(password)}`);
});
