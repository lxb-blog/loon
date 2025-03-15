// Surge 脚本 - 修改 isFreeListen 为 1
let body = $response.body;
let obj = JSON.parse(body);

// 遍历数据结构，修改所有 isFreeListen 的值
function modifyIsFreeListen(data) {
    if (Array.isArray(data)) {
        data.forEach(item => modifyIsFreeListen(item));
    } else if (typeof data === "object") {
        for (let key in data) {
            if (key === "isFreeListen") {
                data[key] = 1; // 强制修改为 1
            } else {
                modifyIsFreeListen(data[key]); // 递归修改子对象
            }
        }
    }
}

// 修改响应数据
modifyIsFreeListen(obj);

// 返回修改后的数据
$done({ body: JSON.stringify(obj) });
