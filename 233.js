let body = $response.body;
let obj = JSON.parse(body);

// 遍历数据结构，修改所有 isFreeListen 的值
function modifyIsFreeListen(data) {
    if (Array.isArray(data)) {
        data.forEach(item => modifyIsFreeListen(item)); // 如果是数组，递归遍历每个项
    } else if (typeof data === "object") {
        for (let key in data) {
            if (key === "isFreeListen") {
                data[key] = 1; // 强制修改为 1
            } else if (key === "courseChapterRspList") {
                // 针对章节列表，遍历每个章节
                data[key].forEach(chapter => {
                    if (chapter.chapterDetailRspList) {
                        chapter.chapterDetailRspList.forEach(detail => {
                            if (detail.isFreeListen !== undefined) {
                                detail.isFreeListen = 1; // 修改章节详情中的 isFreeListen 字段
                            }
                        });
                    }
                });
            } else if (Array.isArray(data[key])) {
                modifyIsFreeListen(data[key]); // 如果是数组，递归遍历数组中的元素
            } else if (typeof data[key] === "object") {
                modifyIsFreeListen(data[key]); // 如果是对象，递归遍历对象中的字段
            }
        }
    }
}

// 修改响应数据
modifyIsFreeListen(obj);

// 返回修改后的数据
$done({ body: JSON.stringify(obj) });
