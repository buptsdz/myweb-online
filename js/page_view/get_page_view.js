// 获取浏览量的函数
// fetchViewCount.js
window.fetchViewCount = async function (pageName) {
    try {
        const response = await fetch(
            `http://sue.sparkflare.cn/sdz_web/record_page_view/?page_name=${encodeURIComponent(pageName)}`
        );

        if (!response.ok) {
            throw new Error('网络错误，无法获取数据');
        }

        const data = await response.json();

        // 假设返回的数据格式为 { name: string, view_count: number }
        const viewCount = data.data.view_count;

        // 更新浏览量显示
        document.getElementById("view_count").innerText = viewCount;

        // 更新 tooltip 显示的时间
        const tooltipText = document.querySelector(".tooltiptext2");
        tooltipText.innerText = `页面浏览次数: ${viewCount}`;
    } catch (error) {
        console.error('获取浏览量时出错:', error);
        document.getElementById("view_count").innerText = '获取失败';
    }
};