// 读取响应体
let body = $response.body;

// 解析 JSON
let obj = JSON.parse(body);

// 递归修改所有 isFreeListen 值为 1
function modifyIsFreeListen(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(item => modifyIsFreeListen(item));
    } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach(key => {
            if (key === "isFreeListen") {
                obj[key] = 1;
            } else {
                modifyIsFreeListen(obj[key]);
            }
        });
    }
}

// 执行修改
modifyIsFreeListen(obj);

// 重新转换回 JSON 并返回
$done({ body: JSON.stringify(obj) });
