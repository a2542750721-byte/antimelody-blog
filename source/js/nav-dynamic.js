/* 双胶囊导航栏脚本 - 首页封面感知版 */
const initNav = () => {
    const nav = document.getElementById('nav');
    const header = document.getElementById('page-header');

    if (!nav) return;

    let ticking = false;

    function updateNav() {
        const currentTop = window.scrollY || document.documentElement.scrollTop;
        // 稍微早一点触发动画，减少视觉上的“突跳”
        const threshold = header ? header.offsetHeight - 90 : 60;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (currentTop > threshold) {
                    nav.classList.add('nav-fixed');
                } else {
                    nav.classList.remove('nav-fixed');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
};

document.addEventListener('DOMContentLoaded', initNav);
document.addEventListener('pjax:complete', initNav);
