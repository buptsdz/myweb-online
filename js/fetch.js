let lastLikeTime = 0; // 记录上一次点赞的时间戳
const LIKE_COOLDOWN = 1500; // 冷却时间，单位为毫秒，这里设为2秒
const true_url = "http://test.sparkflare.cn/sdz_web";
const test_url = "http://127.0.0.1:60608";
let base_url = true_url;

// 用户点击链接
function trackClick(pageName) {
	console.log(`"click page ${pageName}"`)
	fetch(`${base_url}/link_click_tracking/`, { // 替换为你的后端API路径
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded', // 使用表单编码类型
			},
			body: new URLSearchParams({
				page_name: pageName, // 传递页面名称作为参数
			}),
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			// 这里可以处理后台返回的数据
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

// 获取点赞状态
function fetchLikeStatus(itemId, likeIconId, totalLikesId) {
    fetch(`${base_url}/get_like_status/?item_id=${itemId}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(data => handleResponse(data, likeIconId, totalLikesId))
        .catch(error => showModal("点赞状态请求失败：", error.message));
}

// 进行点赞操作
function toggleLike(itemId, likeIconId, totalLikesId) {
    const currentTime = Date.now();
    if (currentTime - lastLikeTime < LIKE_COOLDOWN) {
        showModal("操作频繁", "请稍后再试");
        return;
    }

    lastLikeTime = currentTime; // 更新上一次点赞时间

    fetch(`${base_url}/like_toggle/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken()
        },
        body: `item_id=${encodeURIComponent(itemId)}`
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => handleResponse(data, likeIconId, totalLikesId))
    .catch(error => showModal("点赞失败：", error.message));
}

// 前端处理点赞响应
function handleResponse(response, likeIconId, totalLikesId) {
    const likeMessage = document.getElementById(totalLikesId);
    if (response.status === "success") {
        // 根据点赞状态更新图标和总数
        document.getElementById(likeIconId).src = response.is_liked ? 'assets/images/tubiao/liked.png' : 'assets/images/tubiao/like.png';
        likeMessage.innerText = response.is_liked ? `${response.total_likes}人点赞` : '若觉得不错，就点个赞吧';
    } else {
        showModal("操作失败：", response.message);
    }
}

// 获取 CSRF 令牌
function getCSRFToken() {
    const name = "csrftoken";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return "";
}
