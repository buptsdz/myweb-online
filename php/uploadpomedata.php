<?php
// 数据库连接信息
$servername = "localhost";
$username = "sdzbupt_xbedrock";
$password = "yArHc7FHcJxGzmLA";
$database = "sdzbupt_xbedrock";

// 创建数据库连接
$conn = new mysqli($servername, $username, $password, $database);

// 检查连接是否成功
if ($conn->connect_error) {
    // 在生产环境中，不应该直接把错误详情返回给用户,即删除$conn->connect_error
    die("数据库连接失败".$conn->connect_error);
}

// 获取请求体中的原始 JSON 数据
$json = file_get_contents('php://input');

// 将 JSON 转换为 PHP 关联数组（这样你就可以通过键来访问数据）
$poemsData = json_decode($json, true);

//检查解码是否成功
if (json_last_error() != JSON_ERROR_NONE) {
    // 设置 HTTP 状态码为 500
    http_response_code(500);
    die(json_encode(["error" => "JSON 解析错误: " . json_last_error_msg()]));
}

$response = []; // 创建一个用于响应的数组

// 准备 SQL 语句，防止 SQL 注入
$stmt = $conn->prepare("INSERT INTO pomesdata (id, number, name, contson, scenes) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    die("准备 SQL 语句失败");
}

// 遍历 JSON 数据并插入到数据库
foreach ($poemsData as $data) {
    $id = $data["id"];
    $b = $data["b"];
    $contson = $data["contson"];
    $scenes = implode(", ", $data["scenes"]); // 将场景数组合并为逗号分隔的字符串

    // 拆分 $b 字段
    list($num, $name) = explode(".", $b, 2);

    // 绑定参数到预处理语句并执行
    $stmt->bind_param("sssss", $id, $num, $name, $contson, $scenes);
    if ($stmt->execute()) {
        // 插入成功，将成功信息添加到响应数组中
        $response[] = ['id' => $id, 'status' => 'success', 'message' => '数据成功插入'];
    } else {
        // 插入失败，将错误信息添加到响应数组中
        $response[] = ['id' => $id, 'status' => 'failed', 'message' => '数据插入失败'];
    }
}

// 关闭预处理语句和数据库连接
$stmt->close();
$conn->close();

// 发送 JSON 响应
header('Content-type: application/json');
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>