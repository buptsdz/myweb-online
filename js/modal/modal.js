document.addEventListener("DOMContentLoaded", function() {
	window.showModal = function(title, content) {
		// 设置模态框中的标题和内容
		document.getElementsByClassName('modal-title')[0].innerText = title;
		document.getElementsByClassName('modal-content')[0].innerText = content;

		// 显示模态框
		const modal = document.getElementById('modal');
		modal.showModal();
	};

	window.closeModal = function() {
		const modal = document.getElementById('modal');
		modal.close();
	};
});