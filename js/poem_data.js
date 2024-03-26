// 当前显示的诗歌索引和每页显示的诗歌数量
let currentPageIndex = 0;//当前页码是从0开始的索引
const poemsPerPage = 4;

// 获取诗歌容器和导航栏链接
const poemContainer = document.querySelector(".poem-container");
//const poemContainer = document.getElementById("poem-container");
const pageLinks = document.querySelector(".pagination-bar");


function goToPage(e) {
	e.preventDefault();
	var pageInput = document.getElementById("page-Input").value;
	var maxLimit = Math.ceil(poemsData.length / poemsPerPage); // 修改最大值
	console.log("页码：", pageInput);
	if (pageInput >= 1 && pageInput <= maxLimit) {
		// 输入在有效范围内，继续跳转逻辑
		currentPageIndex = parseInt(pageInput) - 1;
		setTimeout(function() {
			updatePoems(currentPageIndex);
			document.getElementById("page-Input").value = ''; // 清除输入框内容
		}, 150);
	} else {
		// 输入不在有效范围内，显示错误消息
		alert("请输入1到" + maxLimit + "之间的页码。");
	}
}

// 在页面加载时为所有具有.page-input类的输入字段应用最小和最大值限制
document.addEventListener("DOMContentLoaded", function() {
	var pageInputs = document.querySelectorAll(".page-Input");
	var minLimit = 1;
	var maxLimit = Math.ceil(poemsData.length / poemsPerPage);

	pageInputs.forEach(function(input) {
		input.setAttribute("min", minLimit);
		input.setAttribute("max", maxLimit);
	});
});

function updatePoems(currentPageIndex) {
	// var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=' + (
	// 	currentPageIndex + 1);
	// window.history.pushState({
	// 	path: newUrl
	// }, '', newUrl);
	const start = currentPageIndex * poemsPerPage;
	const end = start + poemsPerPage;
	const poemsToShow = poemsData.slice(start, end);

	// 清空诗歌容器
	poemContainer.innerHTML = "";
	// 清空导航栏链接
	pageLinks.innerHTML = "";
	// 延迟调用加载诗歌的函数和导航栏链接状态
	setTimeout(function() {
		loadPoems(poemsToShow);
		updatePageLinks();
	}, 90);
}


// 加载诗歌的函数
function loadPoems(poemsData) {
	poemsData.forEach(poem => {
		const scenesHtml = poem.scenes.map(scene => `<p>${scene}</p>`).join('');
		let contsonWithLinks = poem.contson;

		// 使用正则表达式查找并替换目标文字
		if (currentPageIndex == 18 && /枫红/g.test(contsonWithLinks)) {
			contsonWithLinks = contsonWithLinks.replace(/枫红/g,
				'<a href="#" class="customs-link" data-page="21">枫红</a>');
		}
		if (currentPageIndex == 20 && /枫红/g.test(contsonWithLinks)) {
			contsonWithLinks = contsonWithLinks.replace(/枫红/g,
				'<a href="#" class="customs-link" data-page="19">枫红</a>');
		}
		if (currentPageIndex == 10 && /甲帐/g.test(contsonWithLinks)) {
			contsonWithLinks = contsonWithLinks.replace(/甲帐/g,
				'<a href="#" class="customs-link" data-page="21">甲帐</a>');
		}
		if (currentPageIndex == 20 && /甲帐/g.test(contsonWithLinks)) {
			contsonWithLinks = contsonWithLinks.replace(/甲帐/g,
				'<a href="#" class="customs-link" data-page="11">甲帐</a>');
		}
		const poemHtml = `
            <div class="sons">
                <div class="cont">
                    <div id="${poem.id}">
                        <p><a href="detail/${poem.id}.html" target="_blank"><b>${poem.b}</b></a></p>
                        <div class="contson">${contsonWithLinks}</div>
                    </div>
                    <div class="scene">
                        ${scenesHtml}
                    </div>
                </div>
            </div>
        `;

		poemContainer.innerHTML += poemHtml;

		// 为所有带有 "custom-link" 类的链接添加点击事件处理程序
		const customLinks = document.querySelectorAll(".customs-link");
		customLinks.forEach(link => {
			link.addEventListener("click", function(event) {
				// 获取参数
				// 阻止默认行为，即不进行实际的页面跳转
				event.preventDefault();
				const datapage = event.target.getAttribute("data-page");
				currentPageIndex = parseInt(datapage) - 1;
				// 调用带有参数的函数
				setTimeout(function() {
					updatePoems(currentPageIndex);
				}, 120);
			});
		});
	});
}


// 更新导航栏链接
function updatePageLinks() {
	// 计算总页数
	const totalPages = Math.ceil(poemsData.length / poemsPerPage);

	// 最多显示的页码链接数量
	const maxPageLinks = 5; // 可根据需求调整

	// 计算起始和结束页码
	let startPage = Math.max(currentPageIndex - Math.floor(maxPageLinks / 2), 0);
	let endPage = Math.min(startPage + maxPageLinks - 1, totalPages - 1);

	// 如果末尾页数接近总页数，则调整起始页码
	if (endPage - startPage < maxPageLinks - 1) {
		startPage = Math.max(endPage - maxPageLinks + 1, 0);
	}

	// 创建首页链接
	const firstPageLink = document.createElement("a");
	firstPageLink.textContent = "首页"; // 修改为中文“首页”
	firstPageLink.addEventListener("click", function() {
		currentPageIndex = 0;
		setTimeout(function() {
			updatePoems(currentPageIndex);
		}, 150);
	});
	pageLinks.appendChild(firstPageLink);

	// 创建前一页链接
	const previousPageLink = document.createElement("a");
	previousPageLink.textContent = "<"; // 修改为中文“上一页”
	previousPageLink.addEventListener("click", function() {
		if (currentPageIndex > 0) {
			currentPageIndex--;
			setTimeout(function() {
				updatePoems(currentPageIndex);
			}, 150);
		}
	});
	pageLinks.appendChild(previousPageLink);

	// // 创建省略号（如果需要）
	// if (startPage > 1) {
	// 	const ellipsisStart = document.createElement("span");
	// 	ellipsisStart.textContent = "...";
	// 	pageLinks.appendChild(ellipsisStart);
	// }

	// 创建页码链接
	for (let i = startPage; i <= endPage; i++) {
		const pageLink = document.createElement("a");
		pageLink.textContent = i + 1;

		if (i === currentPageIndex) {
			pageLink.classList.add("active", "disabled");
		}

		// 添加点击事件监听器
		pageLink.addEventListener("click", function() {
			currentPageIndex = i;
			setTimeout(function() {
				updatePoems(currentPageIndex);
			}, 150);
		});

		pageLinks.appendChild(pageLink);
	}

	// // 创建省略号（如果需要）
	// if (endPage < totalPages - 1) {
	// 	const ellipsisEnd = document.createElement("span");
	// 	ellipsisEnd.textContent = "...";
	// 	pageLinks.appendChild(ellipsisEnd);
	// }

	// 创建下一页链接
	const nextPageLink = document.createElement("a");
	nextPageLink.textContent = ">"; // 修改为中文“下一页”
	nextPageLink.addEventListener("click", function() {
		if (currentPageIndex < totalPages - 1) {
			currentPageIndex++;
			setTimeout(function() {
				updatePoems(currentPageIndex);
			}, 150);
		}
	});
	pageLinks.appendChild(nextPageLink);

	// 创建末页链接
	const lastPageLink = document.createElement("a");
	lastPageLink.textContent = "尾页"; // 修改为中文“末页”
	lastPageLink.addEventListener("click", function() {
		currentPageIndex = totalPages - 1;
		setTimeout(function() {
			updatePoems(currentPageIndex);
		}, 150);
	});
	pageLinks.appendChild(lastPageLink);
}
//随机加载诗歌
function torandom() {
	// 在这里执行点击时要触发的操作
	var minLimit = 9;
	var maxLimit = Math.ceil(poemsData.length / poemsPerPage);

	// 生成介于 minLimit 和 maxLimit 之间的随机数
	var randomPage = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
	currentPageIndex = randomPage - 1;
	console.log('randompage:', randomPage);
	// 将随机数传递给 updatePoems 函数
	setTimeout(function() {
		updatePoems(currentPageIndex);
	}, 150);
	// 如果需要执行其他操作，可以在这里添加代码
}

//诗歌数据
const poemsData = [{
		id: "qiuyueye",
		b: "1.秋月谒",
		contson: "寒渚月三更，残秋雁影沉。<br>思汝如满月，清辉照我身。<br>晓梦觅无踪，迷蝶知天冷。<br>卧看银河月，千里作游魂。<br>",
		scenes: ["2019.10.18"],
	},
	{
		id: "guirenfu",
		b: "2.归人赋",
		contson: "平羌雁声回边碛，岭上花落谢秋柯。<br>寒霜似雪衰草凝，北风如刀万壑割。<br>长空报更鹤城外，月影独留车马辙。<br>恍尔听风催马行，且向秋波唱离歌。<br>",
		scenes: ["2019.10.22", "第二个场景的日期"],
	},
	{
		id: "yuegui",
		b: "3.月桂",
		contson: "寒风九卷寒入肠，吹来一夜桂枝香。<br>遥看宵光蟾宫满，回望觉凄加衣裳。<br>",
		scenes: ["2019.10"],
	},
	{
		id: "wuyeti",
		b: "4.乌夜啼",
		contson: "愁心接天一片，晚恨堆，无奈西山落雁几时回？<br>春花谢，随流水，无边泪，八班门口裴回只此悔！<br>",
		scenes: ["2019.10"],
	},
	{
		id: "shiyuehuaiwang",
		b: "5.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.1"],
	},
	{
		id: "shiyuehuaiwang",
		b: "6.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "7.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "8.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "9.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "10.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "11.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "12.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "13.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "14.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "15.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "16.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "17.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "18.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "19.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "20.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "21.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "22.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "23.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "24.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "25.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "26.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "27.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "28.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "29.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "30.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "31.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "shiyuehuaiwang",
		b: "32.十月怀往",
		contson: "九月忽辞去，清秋梦冯虚。<br>十年寒窗后，共赴花江曲。<br> 		",
		scenes: ["2019.10.12"],
	},
	{
		id: "jiaoyue",
		b: "33.皎月",
		contson: "皎月皎月，清扬婉兮。<br>有女如荼，匿于后方。<br>皎月皎月，无以说兮。<br>有美一人，婉如清扬，<br>皎月皎月，何处见兮。<br>思虽如荼，与子同梦。<br>彼姝者兮，青丝楚楚。<br>洵美且朴，立于后方。<br>既见君子，胡为不喜。<br>岂不尔思，子不我即！",
		scenes: ["2019 十月初"],
	},
	{
		id: "jiangchengzishaonianyou",
		b: "34.江城子·少年游",
		contson: "&nbsp &nbsp少年游时轻且狂，北泽广，望澄江。不识吴地，湍流千层浪。妄教诗情作飞卿，洒潘江，尽思量。<br><br>&nbsp &nbsp十年犹记度雁荡，旅夜长，烂柯殇。歧路依旧，与月话凄凉。归思幽愈何处寄？扪左心，应断肠。",
		scenes: ["2019.11.19"],
	},
	{
		id: "dongzhi",
		b: "35.冬至",
		contson: "天风吞吐寒意深，云海苍茫蔽三辰。<br>断鸿秋朝悲流年，冷蝉声噤落空尘。<br>七弦直出振长风，万里吹度送佳人。<br>一夜静寥无雨声，却堆黄花满纷纶。",
		scenes: ["2019.11.29"],
	},
	{
		id: "yanbudangqiyi",
		b: "36.雁不荡(其一)",
		contson: "&nbsp &nbsp星河暗转，榻里独眠似小船。只道舟不动。却传，鱼鸟梦，钱塘湾。<br><br>&nbsp &nbsp乍度夜阑，古道又见雁荡山。十年红尘路。谁堪？一小楫，水千万。",
		scenes: ["2019.12.6"],
	},
	{
		id: "yanbudangyuexiacangxiuqier",
		b: "37.雁不荡·月下藏修(其二)",
		contson: "&nbsp &nbsp月傍藏修，空里残光泛层楼。西风吹不去。依旧，寒鸦飞，杨柳瘦。<br><br>&nbsp &nbsp欲罢还休，且向何处寻好逑？人从梦中过。悠悠，菱歌远，煮红豆。",
		scenes: ["2019.12.9"],
	},
	{
		id: "yanbudangqisan",
		b: "38.雁不荡(其三)",
		contson: "&nbsp &nbsp月涌西楼，万里放舟怎得收？蜷卧枕还冰。温酒，吟李篇，诗百首。<br><br>&nbsp &nbsp稳泛沧流，今夜方知来日久。指入银波碎。回首，罢吾竿，不系舟。",
		scenes: ["2019.12.10"],
	},
	{
		id: "youxin",
		b: "39.忧心",
		contson: "何处归去？忧心愈愈，<br>人以我扤，讹言我瘉。<br>何处归去？忧心惸惸，(qióng)<br>彼其之人，莫知我心。<br>何处归去？忧心悁悁，<br>且徂且止，愿迩夫人。<br>何处归去，忧心忉忉，<br>金玉尔颜，倩莫遐心。<br>何处归去，忧心怛怛，<br>风月无期，嘉思难弭！",
		scenes: ["2019 十月初"],
	},
	{
		id: "yesi",
		b: "40.夜思",
		contson: "子兮子兮，秋水盈盈，<br>笑靥轻轻，缱绻微蹙。<br>子兮子兮，颜如舜华，<br>我觏之子，亦将眼垂。<br>子兮子兮，在其一方，<br>不能餐兮，维子之故！",
		scenes: ["2019 十月初"],
	},
	{
		id: "mengzhongfanzhou",
		b: "41.梦中泛舟",
		contson: "月出清婉色，半面薄雾遮。<br>心随湖舟往，悠悠泛菱歌。",
		scenes: ["2019.12.10"],
	},
	{
		id: "yanbudangqisi",
		b: "42.雁不荡(其四)",
		contson: "&nbsp &nbsp云端清圆，僇人只作客中看。白霜天地满。留与，寸心间，拂还乱。<br><br>&nbsp &nbsp墨瓦青砖，江南江北万重山。回日非甲帐。难谙，人世事，风雨翻。",
		scenes: ["2019.12.10"],
	},
	{
		id: "shiliulianyouhui",
		b: "43.食榴莲有悔",
		contson: "小儿不止忖，教室啖榴莲。<br>怨人玷其爱？固是过在先。",
		scenes: ["2019.12.11"],
	},
	{
		id: "shuidouge",
		b: "44.水痘歌",
		contson: "水痘一时劲，摧杀少年才。<br>问君何还家？但因水痘信其狂。<br>永昼夜无眠，三更汗惊踏衾息。<br>膺背更无半余地，溽气长殢江水滞。<br>九天昏梦梦，胡言不支力。<br>烈疮生满口，淋巴不虞汙。<br>卧榻僵骨冻，噎逆颙望回六龙。<br>幸得日光耀大块，几觉鲁公挥断日。<br>疏勒城，耿恭将，<br>匈奴百围与绝粮。<br>愿凭丹心在，鬼关之门尚得开。<br>今我不过一旬半，何须朝菌之疾将我瘉？<br>只合与君点银釭，白门月下相思长。",
		scenes: ["2019.12.15"],
	},
	{
		id: "yuyesigu",
		b: "45.雨夜思故",
		contson: "淮左连夜雨，悄溅细入梦。<br>飘飘耳畔缠，绵绵岸柳沾。<br>丝绪何也往？落叶在他乡。<br>南岭多烟瘴，燕方有冰霜。<br>彻眼故园道，北风然浩荡。<br>遥望少年郎，数载羁客殇。",
		scenes: ["2019.12.19"],
	},
	{
		id: "youjianruoxiyougan",
		b: "46.又见若兮有感",
		contson: "昨夜潮信到，忽忆涪江遥。<br>今我泽畔望，昔日白鹤老。<br>万舟水相送，玉汐夹凤箫。<br>未忘《杨叛儿》，一江愁难消。",
		scenes: ["2019.12.20"],
	},
	{
		id: "shuilongyin",
		b: "47.水龙吟",
		contson: "&nbsp &nbsp 冬至近寒，无端。伫风里，碎波迭岸。凝眸谢黄，看罢细草，燕子呢喃。人意难解，梦断藏修，何处凭轩？且向天呼取，未肯折幡，暮云坠，行人泪。<br><br>&nbsp &nbsp 只恐兴意阑珊。秋雁蒙蒙几时逢？不忍惊扰，泪目相送，三江吹帆。秋水盈盈，寒星烁烁，难弭嘉思。可宽些尺度？莫能迎合，诗篇荒湛。",
		scenes: ["2019.12.24"],
	},
	{
		id: "wuerlai_yijiu",
		b: "48.无而来",
		contson: "&nbsp &nbsp 依旧不居留，日月迈迈，丝绪优游。忆经年，星河崔璨，遗梦孤舟。叹漫漫山岚，漠漠轻寒，行踽踽独步，蒙蒙熹光。都将来，化作多少烟云去，三万里，看今朝。<br><br>&nbsp &nbsp 几何韶华在？霜毛杂生，倍觉愁加。念来日，斗转参流，寒窗含晚。唏湝湝东水，渺渺泛无，度朝夕岁月，万帆竞流。拂衣罢，淡了眼前痴与笑，誓击楫，人未老。",
		scenes: ["2020.1.1", "（19不久留）"],
	},
	{
		id: "saishangwanwang",
		b: "49.塞上晚望",
		contson: "芜芜原上草，靡靡行人道。<br>沙走胡杨乱，北风应未消。<br>暑气灼丘土，苍鹰日西出。<br>长鸣含晚照，落霞对江潮。<br>塞上无片帆，还请望江南。",
		scenes: ["2020.4.17", "（疫情刚复课）"],
	},
	{
		id: "siyueshijiurichenguanwuyougan",
		b: "50.四月十九日晨观雾有感",
		contson: "淅淅沥沥声渐渐，百厦丛中生寒烟。<br>谷雨催来花满地，自在听风自在眠。",
		scenes: ["2020.4.19"],
	},
	{
		id: "yuwulouzhiren",
		b: "51.予五楼之人",
		contson: "暮光挟飞霞，潜藏远山间。<br>车骑归来迟，登阶独悠闲。<br>试问读书晚？细看唯此人。<br>顿然闻一语，犹听仙人语。<br>百日终鲜见，百日竟无言。<br>四目正相对，支吾趋步前。<br>独凭书几坐，历历在眼帘。<br>想得灯明时，暖照淡妆颜。<br>非有沉鱼貌，美玉自心田。<br>莫识当年君，扬镳便缘尽。<br>今我实有幸，再谢当年情。<br>无以聊赠君，愿祝千里行。",
		scenes: ["2020 春"],
	},
	{
		id: "siguisanshouqiyi",
		b: "52.思归三首(其一)",
		contson: "南土有佳人，幽居藏修上。<br>秋水怅天色，冷暖共风知。<br>喧喧世间音，烦忧多未止。<br>倦卧凭几瞑，郁郁飞心思.",
		scenes: ["2020.5.6"],
	},
	{
		id: "siguisanshouqier",
		b: "53.思归三首(其二)",
		contson: "皎皎明月夜，哙哙斗牛清。<br>明月已如荼，思作故梦情。<br>故梦应犹在，旧时月与星。<br>青丝寻不见，再梦便轻盈。",
		scenes: ["2020.5.6"],
	},
	{
		id: "siguisanshouqisan",
		b: "54.思归三首(其三)",
		contson: "冷月凝西风，愁云暗星辰。<br>相失不逾百，霜落心头深。<br>渺渺寒更泪，情绝白发生。<br>多少爱与恨，都来思念真！",
		scenes: ["2020.5.9"],
	},
	{
		id: "zengmoumou",
		b: "55.赠某某",
		contson: "寻觅重寻觅，往日烂舟楫。<br>浮沉沧波里，玉音杳难期。<br>",
		scenes: ["2020.5.13"],
	},
	{
		id: "wuyueershiyisiyinjie",
		b: "56.五月二十一思音节",
		contson: "晚风细吹犬声稀，树影暗摇月光明。<br>不知东水何处尽，涓涓流长寄吾心。<br>",
		scenes: ["2020.5.21"],
	},
	{
		id: "xiayingchunxiaoyu",
		b: "57.夏迎春·小雨",
		contson: "珠雨声碎，慢滴我窗，晴空悠悠。<br>今时明日何相异？漉湿花丛中。",
		scenes: ["2020.5.25"],
	},
	{
		id: "zaju_routi",
		b: "58.杂句",
		contson: "柔荑不禁风，白云净无尘。<br>若得君一顾，一目尽余生。",
		scenes: ["2020.5.27"],
	},
	{
		id: "mengzhongchou",
		b: "59.梦中愁",
		contson: "&nbsp &nbsp 白蘋茫茫，倚看寒月一钩。独吟多景楼头，难回首，沙洲鹭起，泊船忆旧游。<br> <br>&nbsp &nbsp 乡梦知否？梦中谁似我愁？滴沥，滴沥，小雨不休。望君不见，泪空流。吹笳声远，船尾燕飞去。<br>",
		scenes: ["2020.初秋"],
	},
	{
		id: "qiuci",
		b: "60.秋词",
		contson: "桐叶未肯解，秋风响寒蝉。<br>潮气随夜生，江月带霜来。<br>",
		scenes: ["2020.9.17"],
	},
	{
		id: "qiuyeshuhuai",
		b: "61.秋夜抒怀",
		contson: "桂香飘溢秋月清，东风又动故人襟。<br>笑语盈盈多乐颜，金丝如瀑满目情。<br>",
		scenes: ["2020.9.25"],
	},
	{
		id: "wuerlai_chunqu",
		b: "62.无而来",
		contson: "春去谁可留，桂香旋落，弹指三秋。<br>烟云明灭枕深秋。<br>多景今犹在，故我为诗，遗梦孤舟。<br> <br>语数物化生，未要折幡，吟罢《行路难》。<br>曾记数学折磨，竟夕寐叹。<br> <br>何必苦言愁，凭轩上善，落叶聚还散。<br>独听疏蝉幽怨。<br>流光几徘徊，池月照影，皎皎其娈。<br>",
		scenes: ["2020.10.19"],
	},
	{
		id: "sumuzhegengziqiu",
		b: "63.苏幕遮·庚子秋",
		contson: "&nbsp &nbsp 碧云天，黄叶地，烟云悄逝，明灭几时留？桂香摇落水微波，流光徘徊，池月枕深秋。<br> <br>&nbsp &nbsp 棹轻楫，梦上善，作客瓜洲，不负少年游。曾记多景望断，白汀悠悠，未有蒹葭愁。<br>",
		scenes: ["2020.10.25", "——高中最后一首情诗"],
	},
	{
		id: "yannanfei",
		b: "64.雁南飞",
		contson: "&nbsp &nbsp 雪默销，几多天风。醉晚尘蒙重，千里凝眸，黯然魂收。枯荷何须枕寒流？不语，孤伫小汀中。<br> <br>&nbsp &nbsp 云幕远，白镜青空。想浙江潮平，两三星火，已是瓜洲。池畔垂下无叶柳。北望，雁别茫茫秋。<br>",
		scenes: ["2020.12.31"],
	},
	{
		id: "bashengguazhou",
		b: "65.八声瓜洲",
		contson: "秋茫茫冷夕垂远天，无语下山肩。<br>两三灯火稀，白汀烟笼，蒹恨葭愁。<br>流光年年照此，池月共吟游。<br>惟有扬子水，未肯淹留。<br>洪涛去去无声，念浙江潮起，一星如豆。<br>泊船见瓜洲，上善傍藏修。<br>轻楫慢，银波悠悠，几回梦、几回茫茫秋！<br>",
		scenes: ["2021.2.29"],
	},
	{
		id: "siyueganhuai",
		b: "66.四月感怀",
		contson: "旧忆江东万兜鍪，未料前生此兜兜。<br>不及泪辞万里去，舍弟难吐一言留。<br>时日飞似窗外景，南泠再梦无期虞。<br>天高总有明月在，几掩几清几生愁。<br>",
		scenes: ["2021.4.13"],
	},
	{
		id: "beiguganhuai",
		b: "67.北固感怀",
		contson: "寒潭平如镜，放目北固巅。<br>沙汀渺接江，水天际无边。<br>为诗烦多景，莫若梦南岭。<br>一朝名金榜，更须倾酒杯。<br>",
		scenes: ["2021.4.13"],
	},
	{
		id: "youyandangshan",
		b: "68.游雁荡山",
		contson: "玉苍云如带，直入青云端。<br>遥望苍山南，雁荡风尘在。<br>绝壁生幽谷，素崖百丈悬。<br>不可惜往日，十年教谁堪？<br>",
		scenes: ["2021.4.14"],
	},
	{
		id: "ruiyange",
		b: "69.瑞岩歌",
		contson: "赤阳灼辣辣，乡路当午烫脚丫。<br>青山恹恹似无力，尘土压低蒸海璧。<br>林鸟疏有啼，夏蝉对天鸣。<br>白棚翻浪杂土腥，杨梅那辨有虫泥。<br>夏蝉年年死复生，林鸟代代飞又还。<br>虫泥如今寻何处，何处不过烂斧柯。<br>可怜青山原不动，温岭一出无山拦。<br>",
		scenes: ["2021.4.15"],
	},
	{
		id: "shueryao",
		b: "70.树儿摇",
		contson: "树儿摇，树儿摇，暖阳皦皦流光照。<br>鸟雀飞入忽不见，熙风徐徐立树梢。<br>看树摇，看树摇，空霭浑如蜡一片。<br>青冥荡荡云不辨。<br>暗云一与万，抱闷在此端。<br>",
		scenes: ["2021.4.18"],
	},
	{
		id: "siyuehuaiwang",
		b: "71.四月怀往",
		contson: "移舟细草岸，春涨悠悠水漫漫。<br>长空风来金黄动，山河炽暖光欲融。<br>江天蓝如湛，一番洗心忧。<br>再望江天断，长路多峰峦。<br>风吟处，芦芽正短，汀上立白鹭。<br>",
		scenes: ["2021.4.21"],
	},
	{
		id: "guolinyin",
		b: "72.过林荫",
		contson: "快风无意下林荫，绿叶婆娑互喃呢。<br>春山一道泼青墨，蔓长草木又经年。<br>",
		scenes: ["2021.4.24"],
	},
	{
		id: "guanfeng",
		b: "73.观风",
		contson: "晴空一洗碧，直望白云端。<br>绿影飘摇尽，杪舞逐风转。<br>流光正抚慰，阳昏分暖凉。<br>欲眠上善里，清风又穿堂。<br>",
		scenes: ["2021.4.29", "作于一节化学课"],
	},
	{
		id: "chunyu",
		b: "74.春雨",
		contson: "潮气夜生浸窗寒，淡云剪破孤玉盘。<br>星河隐没星辉落，人间灯火人声多。<br>愁眼不望山万重，此中无意待枫红。<br>今夜未知春气暖，一场春雨一场凉。<br>",
		scenes: ["2021.5.3", "作于二模前一天晚自习"],
	},
	{
		id: "yesi",
		b: "75.夜思",
		contson: "凉风起兮思成絮，飘飘随波自东西。<br>怅看暮云南山矮，夕阳淡挂林月稀。<br>平生笔下江流频，江流流去人代冥。<br>死生千古谁究竟，晨风依旧啭流莺。<br>",
		scenes: ["2021.5.4", "作于二模第一天晚自习"],
	},
	{
		id: "yan",
		b: "76.燕",
		contson: "晨曦唤晓雾，来去巢此屋。<br>啄毛啼自在，舐羽饮清渚。<br>春月等秋月，漫漫渐羽丰。<br>风吹日夜过，别时念吾庐。<br>",
		scenes: ["2021.5.6"],
	},
	{
		id: "xiayingchunchen",
		b: "77.夏迎春·晨",
		contson: "几星浅夜色，白鱼出平明。<br>苍苍雾天沉，许许凉风沾。<br>叶滴涵凼水，鸟声飞来回。<br>清气空林满，吐纳游冯虚。<br>",
		scenes: ["2021.5.13"],
	},
	{
		id: "xiayingchunyu",
		b: "78.夏迎春·雨",
		contson: "小雨轻点梦，沥沥溅微寒。<br>深浅积镜明，望去照天低。<br>昏眠风亦寝，回头树不摇。<br>万籁失言寂，只惟此声稠。<br>",
		scenes: ["2021.5.26", "作于三模第一天的午休"],
	},
	{
		id: "gaokaoqianerriyougan",
		b: "79.高考前二日有感",
		contson: "春夏不知数光阴，白云飘转空复晴。<br>蝉声高低催时日，莫使往去作愁情。<br>",
		scenes: ["2021.6.5", "作于晴朗的下午", "望向窗外的大杨树"],
	},
	{
		id: "zaju_chouya",
		b: "80.杂句",
		contson: "&nbsp &nbsp愁鸦栖上晚树，恨啼青空，日下依旧。<br>&nbsp &nbsp双手归置何处？笔唯默沉，欲言无由。<br>",
		scenes: ["2021.6.7", "作于数学考完后"],
	},
	{
		id: "gaokaoyougan",
		b: "81.高考有感",
		contson: "聚散如秋叶，吹风凋满楼。<br>我言枫红时，此身不应留。<br>长江滚滚东，何时反溯流？<br>诸事已流水，沽客听浪潮。<br>五弦自长夜，挥手一离别。<br>烟云明灭矣，归鸿目送吾。<br>",
		scenes: ["2021.6.10"],
	},
	{
		id: "liuyueershisanzhigan",
		b: "82.六月二十三之感",
		contson: "此间三年别京口，断望南山上善中。<br>转身弹指一卷毕，六月年年余热风。<br>",
		scenes: ["2021.6.23", "作于离开镇江回乡下的大巴上"],
	},
	{
		id: "yijiangnan_banchi",
		b: "83.忆江南",
		contson: "半尺明月半尺光，夜风泠泠扣小窗。<br>水月倾下江流寂，心事几许泪痕长。<br>楼台经年圮甲帐，清圆他乡僇人望。<br>淮水从此无归鸿，雁荡乍入谁梦乡？<br>",
		scenes: ["2021.6.29", "作于镇江乡下书桌窗前"],
	},
	{
		id: "xinchouliqiuzhishandongyougan",
		b: "84.辛丑立秋至山东有感",
		contson: "立秋忽已至，才觉夏蝉息。<br>秋风吹山石，风车迟缓缓。<br>今夜无江月，寒霜亦侵人。<br>行行千百里，愈遥竟无思。<br>遗憾曲江花，尽散天各涯。<br>只念庭前树，岁月何轻饶？<br>",
		scenes: ["2021.8.16", "作于火车上"],
	},
	{
		id: "bayuebanxiang",
		b: "85.八月半想",
		contson: "北都十五夜，月色漫孤云。<br>凉风吹襟动，路灯照不暖。<br>举头玉盘远，烟笼潭水寒。<br>星光几点闪，知是苍天泪。<br>",
		scenes: ["2021.9.21", "(农历八月十五)"],
	},
	{
		id: "wuti_beixiang",
		b: "86.无题",
		contson: "北向不记浙江海，月光倚斜照楼台。<br>萧萧风吹秋时雁，寒星明明降霜白。<br>",
		scenes: ["2021.10.24", "作于午夜", "望着窗外有感而发"],
	},
	{
		id: "yujinwanximenyiren",
		b: "87.予今晚西门一人",
		contson: "泠泠夜风响，潮气几多浓。<br>长道分北邮，灯黄似诉愁。<br>人来去又往，惟影伴相随。<br>空向此中泣，桃眼泪重重。<br>",
		scenes: ["2021.11.5", "作于北邮沙河校区"],
	},
	{
		id: "sixiaoqiyougan",
		b: "88.思小奇有感",
		contson: "凛冬偷将去，蛰惊嫌风寒。<br>只作京口别，朔雪看销尽。<br>千里遗憾事，不过苦向前。<br>人生如其快，一生是一世。<br>何须采鲜花，无花堪久岁。<br>时节吹花谢，灰烬满相思。<br>胜景盼看透，细水犹长流。<br>",
		scenes: ["2022.2.22", "作于山东"],
	},
	{
		id: "yefengjinan",
		b: "89.夜风寄南",
		contson: "星光泪点闪小窗，脉脉长河不见语。<br>寂寞孤身悲怆然，红目迷迷滞暗暝。<br>犹原今夜露水重，恋梦即场变为空。<br>白发只搔千丝乱，更如眠去数鹧鸪。<br>",
		scenes: ["2022.3.5", "作于一个伤心的午夜", "作于山东"],
	},
	{
		id: "putao",
		b: "90.葡萄",
		contson: "年盛如花开，瞑时欲重再。<br>十年苦心灌，他木不与栽。<br>问道何时熟？葡萄须静候。<br>失收早或知，吾非待结果。<br>遗憾千万种，世人皆不同。<br>岁月牵藤来，匆匆慨长唉。<br>",
		scenes: ["2022.3.7"],
	},
	{
		id: "jiayue",
		b: "91.佳月",
		contson: "(受gj所托，为他在前两句诗下补全此诗)<br>蟾宫月桂荫，佳人共此镜。<br>浮笑枕独臂，夜凉梦虚清。<br>",
		scenes: ["2022.4.22"],
	},
	{
		id: "wumianyexiang",
		b: "92.无眠夜想",
		contson: "两三夜蛙声，栖蝉远树鸣。<br>寐想时日近，天旷月一灯。<br>",
		scenes: ["2022.6.15", "(时日指模电考试)"],
	},
	{
		id: "shangxinqu",
		b: "93.伤心曲",
		contson: "暑日偷去秋微凉，夜风吹干泪面僵。<br>漆色怖怖星点隐，琉璃明明白灯辉。<br>闲来弄书看无心，遑卧翻覆未可眠。<br>谁谓伤心画不成？昏昏提笔诉几言。<br>",
		scenes: ["2022.8.24", "作于山东", "一个伤心的午夜"],
	},
	{
		id: "wuti_fengqiu",
		b: "94.无题",
		contson: "逢秋便知一岁少，旧忆凭栏叹江涛。<br>悲风吹去觉忽寄，长夜听霜凝芳草。<br>江水广怀空俗尘，蜉蝣汲营哀晦朝。<br>莫怪我辈惜金缕，也如浑碌随人潮。<br>",
		scenes: ["2022.9.23"],
	},
	{
		id: "qiusi",
		b: "95.秋思",
		contson: "黄叶荡入溪，天光渐已暝。<br>骤有大风起，土色俱飘零。<br>啧嘘行路难，秋深寒意兴。<br>旧忆多此景，望乡共天晴。<br>",
		scenes: ["2022.10.29", "作于大物期中考(结果只考了80)"],
	},
	{
		id: "chuchunyin",
		b: "96.初春吟",
		contson: "东风尚可劲，水面连波漪。<br>银杏芽未见，寒风画檐冰。<br>曦出送昏暝，飞雀始作嘤。<br>暖日尽其力，出门望晴星。<br>明年依旧景，共说小河听。<br>",
		scenes: ["2023.2.15", "作于工数期末考(考了100)"],
	},
	{
		id: "youwuyi",
		b: "97.游五一",
		contson: "春光正好看天云，山头叠乱四望青。<br>风来欲意拂热燥，倒向此风借点清。<br>",
		scenes: ["2023.5.2"],
	},
	{
		id: "xinglunan",
		b: "98.行路难",
		contson: "繁叶说夏至，吾徒感伤时。<br>此方想光景，七年当游子。<br>行行路道远，回望思无边。<br>无边复无边，彼自有际遇。<br>多少平常日，未知是别时。<br>只道求学去，浮云再不会。<br>今夜案牍前，苦恨愁路难。<br>但愿君相伴，使我斩荆棘。<br>",
		scenes: ["2023.5.17"],
	},
	{
		id: "bayueshisanwangyue",
		b: "99.八月十三望月",
		contson: "明月明，幽夜蓝，几度回首几度叹。<br>淡云斜去，黄灯吹发，凉多梦潇然。<br>",
		scenes: ["2023.9.27 11:33"],
	},
	{
		id: "wuti_choulai",
		b: "100.无题",
		contson: "愁来似水断续流，身飘无根不尽忧。<br>嘻看去年笑颜盛，十五月明告以秋。<br>",
		scenes: ["2023.9.28 凌晨"],
	},
	{
		id: "shengshengmanzhongqiu",
		b: "101.声声慢·中秋",
		contson: "&nbsp &nbsp酌杯酒，愁路难，天意何处，无数苦泪自消受。<br>&nbsp &nbsp秋花谁怜？败叶满地。西风也笑我，不如放声歌。<br>",
		scenes: ["2023.9.28 凌晨"],
	},
	{
		id: "zhegutianqiuci",
		b: "102.鹧鸪天·秋词",
		contson: "&nbsp &nbsp秋高天蓝空如练，眺望云缓，倦卧无心意。<br>&nbsp &nbsp歌台来远声，久滞目。清风不知忧，只是催人眠。<br>",
		scenes: ["2023.9.30 下午"],
	},
	{
		id: "hanyedusi",
		b: "103.寒夜独思",
		contson: "冰冬日三竿，醒来先唤安。<br>急急看新信，无言稍失兴。<br>时刻待朱点，掩闲弄百般。<br>绿标终沉寂，苦闷开又关。<br>流媒上下去，抱幻还回看。<br>忽觉伤神处，沉溺在无端。<br>唉唉向天问，无声唯有寒。",
		scenes: ["2023.12.18 凌晨1:41"],
	},
	{
		id: "rangmo",
		b: "104.让墨",
		contson: "圆月朦胧洒素光，独望明月倚小窗。<br>夜来长谈欲秉烛，时雨忽至天恸哭。<br>哀雨声声多杂愁，风雷暴啸石乱走。<br>含泪裹衾谁人知，骤觉全让墨色吞。<br>二十岁月尽说与，不如下言加餐食。",
		scenes: ["2023.12.30 凌晨"],
	},
	{
		id: "wuti_bitian",
		b: "105.无题",
		contson: "碧天染墨云月清，微风拂面动银铃。<br>息息吹耳悄声诉，千万想念萦冰心。<br>会面哪知期何日，梦中顾君不愿醒。<br>思来明年春花笑，思去处处唯是君。",
		scenes: ["2024.1.1 凌晨"],
	},
];