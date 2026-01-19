// 魔法右键菜单逻辑
let rightMenu;

function initRightMenu() {
    rightMenu = document.createElement('div');
    rightMenu.id = 'rightMenu';
    rightMenu.innerHTML = `
        <a class="menu-item" href="javascript:history.back();"><i class="fa-solid fa-arrow-left"></i>返回上一页</a>
        <a class="menu-item" href="javascript:history.forward();"><i class="fa-solid fa-arrow-right"></i>前进下一页</a>
        <a class="menu-item" href="javascript:location.reload();"><i class="fa-solid fa-rotate-right"></i>刷新页面</a>
        <hr>
        <a class="menu-item" href="/"><i class="fa-solid fa-house"></i>回到首页</a>
        <a class="menu-item" href="javascript:rmf.copySelect();"><i class="fa-solid fa-copy"></i>复制内容</a>
        <hr>
        <a class="menu-item" href="javascript:rmf.toggleDarkMode();"><i class="fa-solid fa-moon"></i>切换模式</a>
    `;
    document.body.appendChild(rightMenu);

    window.rmf = {
        copySelect: function () {
            document.execCommand('Copy');
            btf.snackbarShow('复制成功！');
            rightMenu.style.display = 'none';
        },
        toggleDarkMode: function () {
            const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            if (nowMode === 'light') {
                activateDarkMode();
                saveToLocal.set('theme', 'dark', 2);
                GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
            } else {
                activateLightMode();
                saveToLocal.set('theme', 'light', 2);
                GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
            }
            rightMenu.style.display = 'none';
        }
    };

    window.oncontextmenu = function (event) {
        event.preventDefault();
        rightMenu.style.display = 'block';
        rightMenu.style.left = event.clientX + 'px';
        rightMenu.style.top = event.clientY + 'px';

        // 边界检测：防止菜单超出屏幕
        if (event.clientX + rightMenu.offsetWidth > window.innerWidth) {
            rightMenu.style.left = (window.innerWidth - rightMenu.offsetWidth - 10) + 'px';
        }
        if (event.clientY + rightMenu.offsetHeight > window.innerHeight) {
            rightMenu.style.top = (window.innerHeight - rightMenu.offsetHeight - 10) + 'px';
        }
    };

    window.onclick = function () {
        rightMenu.style.display = 'none';
    };
}

document.addEventListener('DOMContentLoaded', initRightMenu);
