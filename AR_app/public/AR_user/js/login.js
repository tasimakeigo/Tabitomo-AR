// パスワード表示/非表示の切り替え
function togglePassword() {
    const passwordField = document.getElementById("login-pass");
    if (passwordField) {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    }

    const passwordConfirmField = document.getElementById("password-confirm");
    if (passwordConfirmField) {
        passwordConfirmField.type = passwordConfirmField.type === "password" ? "text" : "password";
    }
}

// 新規登録フォームの処理
document.getElementById('registration-form')?.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const passwordConfirm = document.getElementById('password-confirm').value.trim();
        const languagename = document.getElementById('languagename').value;

        // 入力チェック
        if (password !== passwordConfirm) {
            alert('パスワードが一致しません');
            return;
        }

        if (!username || !languagename) {
            alert('すべてのフィールドを正しく入力してください');
            return;
        }

        // 確認画面へ遷移
        window.location.href = `confirmation.html?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&languagename=${encodeURIComponent(languagename)}`;
    });

    // 確認画面の処理
    if (window.location.pathname.includes('confirmation.html')) {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        const password = params.get('password');
        const languagename = params.get('languagename');

        document.getElementById('confirm-username').textContent = username;
        document.getElementById('confirm-password').textContent = '********'; // パスワードは伏せる
        document.getElementById('confirm-languagename').textContent = languagename;

        // 登録ボタンの処理
        document.getElementById('confirm-register')?.addEventListener('click', () => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/newUser', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    window.location.href = 'success.html';
                } else {
                    alert('登録に失敗しました。再試行してください');
                }
            };

            xhr.send(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&passwordConfirm=${encodeURIComponent(password)}&languagename=${encodeURIComponent(languagename)}`);
        });
    }

// ログインフォームの処理
document.getElementById('login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('login-name').value;
    const password = document.getElementById('login-pass').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/userlogin', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = `/AR_user/home.html?username=${encodeURIComponent(username)}`;
        } else {
            alert('ログイン失敗: ユーザー名またはパスワードが間違っています');
        }
    };

    xhr.send(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
});
