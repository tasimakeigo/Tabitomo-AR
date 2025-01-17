document.getElementById('login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('login-name').value;
    const password = document.getElementById('login-pass').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/userlogin', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        console.log('XHR Status:', xhr.status);
        console.log('XHR Response:', xhr.responseText);

        if (xhr.status === 200) {
            window.location.href = '../home.html?username=' + encodeURIComponent(username);
        } else {
            let errorMessage = 'ログイン失敗: ユーザー名またはパスワードが間違っています';

            // ステータスコードに応じてエラーメッセージを変更
            if (xhr.status === 304) {
                errorMessage = 'リソースは変更されていません。キャッシュを確認してください。';
            } else if (xhr.status === 400) {
                errorMessage = 'リクエストが不正です。';
            } else if (xhr.status === 401) {
                errorMessage = '認証に失敗しました。';
            } else if (xhr.status === 404) {
                errorMessage = '指定されたリソースが見つかりませんでした。';
            } else if (xhr.status >= 500) {
                errorMessage = 'サーバーエラーが発生しました。';
            }

            alert(errorMessage);
        }
    };

    xhr.onerror = function () {
        // ネットワークエラーなどが発生した場合の処理
        alert('通信エラーが発生しました。');
    };

    xhr.send(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
});
