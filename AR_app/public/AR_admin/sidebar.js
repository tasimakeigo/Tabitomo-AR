// sidebar.js
document.addEventListener('DOMContentLoaded', function () {
    // サイドバーを挿入する場所
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerUserName = document.querySelector('header p');  // ヘッダーのユーザー名部分

    // メニュー項目（必要に応じて編集）
    const menuItems = [
        { text: 'メニュー', href: 'menu.html' },
        { text: '管理者情報', href: 'AR_user/user.html' },
        { text: '字幕管理', href: 'AR_napisy/napisy.html' },
        { text: '音声管理', href: 'AR_sound/sound.html' },
        { text: 'マップ管理', href: 'AR_map/location.html' },
        { text: '場所 3Dモデル 管理', href: 'AR_location/location.html' }
    ];

    // URLパラメータまたはローカルストレージからadminnameを取得
    const urlParams = new URLSearchParams(window.location.search);
    let adminname = urlParams.get('adminname');

    if (adminname) {
        localStorage.setItem('adminname', adminname);
    } else {
        adminname = localStorage.getItem('adminname');
    }

    // ヘッダーにユーザー名を表示
    if (adminname) {
        headerUserName.textContent = `ユーザー名: ${adminname}`;
    }

    // サイドバーを作成する関数
    function createSidebar(menuItems) {
        const sidebar = document.createElement('div');
        sidebar.className = 'sideber';

        const container = document.createElement('div');
        container.className = 'sideber-container';

        menuItems.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            const button = document.createElement('button');
            button.textContent = item.text;
            link.appendChild(button);
            container.appendChild(link);
        });

        sidebar.appendChild(container);
        sidebarContainer.appendChild(sidebar);
    }

    // サイドバーを作成
    createSidebar(menuItems);
});
