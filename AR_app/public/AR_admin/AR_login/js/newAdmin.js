// パスワード表示/非表示の切り替え
function togglePassword() {
    const passwordField = document.getElementById("login-pass");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}


document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const adminname = document.getElementById('login-name').value;
    const password = document.getElementById('login-pass').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/newadmin', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = `/AR_admin/menu.html?adminname=${encodeURIComponent(adminname)}`;
        } else {
            alert('ログイン失敗: ユーザー名またはパスワードが間違っています');
        }
    };

    xhr.send(`adminname=${encodeURIComponent(adminname)}&password=${encodeURIComponent(password)}`);
});
