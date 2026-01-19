function welcome() {
    let welcome_text = '欢迎光临本站！';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) welcome_text = '早上好，一日之计在于晨！';
    else if (hour >= 11 && hour < 13) welcome_text = '该吃午饭了，记得多吃肉！';
    else if (hour >= 13 && hour < 17) welcome_text = '下午好，喝杯咖啡提提神吧！';
    else if (hour >= 17 && hour < 19) welcome_text = '夕阳无限好，即将下班啦！';
    else if (hour >= 19 && hour < 24) welcome_text = '晚上好，今天过得开心吗？';
    else welcome_text = '夜深了，快去休息吧，明天也是美好的一天。';

    const welcomeInfo = document.querySelector('.card-info-data'); // 插入到数据上方或头像下方
    if (welcomeInfo) {
        // 创建气泡元素
        const bubble = document.createElement('div');
        bubble.className = 'welcome-bubble';
        bubble.innerText = welcome_text;

        const cardAuthor = document.querySelector('.card-widget.card-info');
        if (cardAuthor) {
            // 插入到卡片顶部，或者头像上方
            // 查看 Heo 风格，气泡在最顶部
            cardAuthor.insertBefore(bubble, cardAuthor.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', welcome);
// 适配 PJAX
document.addEventListener('pjax:complete', welcome);
