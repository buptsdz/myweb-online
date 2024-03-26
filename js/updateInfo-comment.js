// JavaScript 代码
var currentTab = 'tab2';
var currentIndex = 1;
var tabs = [
    { name: 'tab1', title: '更新日志' },
    { name: 'tab2', title: '收到的评论' }
];

function sliderStyle() {
    var style = `width: calc(100% / ${tabs.length}); transform: translateX(${currentIndex * 100}%); transition: transform 0.3s ease; height: 100%; position: absolute; top: 0; border-radius: 20px;`;
    return style;
}

function setCurrentTab(name, index) {
    currentTab = name;
    currentIndex = index;
    console.log(currentTab);
    // 更新 Tabs 和滑块
    updateTabsAndSlider();

    // 显示或隐藏不同的内容部分
    var tab1Content = document.getElementById('tab1-content');
    var tab2Content = document.getElementById('tab2-content');

    if (currentTab === 'tab1') {
        tab1Content.style.display = 'flex';
        tab2Content.style.display = 'none';
    } else if (currentTab === 'tab2') {
        tab1Content.style.display = 'none';
        tab2Content.style.display = 'block';
    }
}

function updateTabsAndSlider() {
    var container = document.querySelector('.switch-container');

    // 先移除所有 switch-button 元素
    var existingButtons = container.querySelectorAll('.switch-button');
    existingButtons.forEach(function(button) {
        container.removeChild(button);
    });

    // 重新创建 tab 元素
    tabs.forEach(function(tab, index) {
        var button = document.createElement('div');
        button.className = 'switch-button';
        button.onclick = function() { setCurrentTab(tab.name, index); };

        var content = document.createElement('div');
        content.className = 'button-content' + (currentTab === tab.name ? ' active' : '');
        content.textContent = tab.title;

        button.appendChild(content);
        container.appendChild(button);
    });

    // 更新滑块的样式，而不是重新添加滑块
    var slider = container.querySelector('.slider');
    slider.style = sliderStyle();
}

// 初始化 tabs 和滑块
document.addEventListener('DOMContentLoaded', function() {
    // 在文档加载完成时，设置初始的 tab
    setCurrentTab(currentTab, currentIndex);
});
