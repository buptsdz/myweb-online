const fetch = require("node-fetch"); //vs端调试
// 定义要请求的 URL
const url = "https://sdzbupt.xbedrock.com/php/uploadpomedata.php"; // 将 URL 替换为你的 PHP 脚本的 URL

// 定义要发送的数据
const poemsData = [
  {
    id: "qiuyueye",
    b: "5.秋月谒",
    contson:
      "寒渚月三更，残秋雁影沉。<br>思汝如满月，清辉照我身。<br>晓梦觅无踪，迷蝶知天冷。<br>卧看银河月，千里作游魂。<br>",
    scenes: ["2019.10.18"],
  },
  {
    id: "guirenfu",
    b: "6.归人赋",
    contson:
      "平羌雁声回边碛，岭上花落谢秋柯。<br>寒霜似雪衰草凝，北风如刀万壑割。<br>长空报更鹤城外，月影独留车马辙。<br>恍尔听风催马行，且向秋波唱离歌。<br>",
    scenes: ["2019.10.22", "第二个场景的日期"],
  },
  {
    id: "yuegui",
    b: "3.月桂",
    contson:
      "寒风九卷寒入肠，吹来一夜桂枝香。<br>遥看宵光蟾宫满，回望觉凄加衣裳。<br>",
    scenes: ["2019.10"],
  },
];

// 使用 fetch 发起 POST 请求
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // 如果需要其他请求头，请在此处添加
  },
  body: JSON.stringify(poemsData), // 将数据转换为 JSON 格式
})
  .then((response) => {
    // 检查 HTTP 状态码
    if (response.ok) {
      return response.text(); // 解析 JSON 响应
    } else {
      throw new Error("请求失败，状态码为 " + response.status);
    }
  })
  .then((data) => {
    console.log(data); // 处理响应数据
  })
  .catch((error) => {
    console.error("请求出错: ", error); // 处理请求错误
  });
