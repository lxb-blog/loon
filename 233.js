// 这个脚本将修改响应体中的 `isFreeListen` 为 0
(function() {
    var body = $response.body;
    var json = JSON.parse(body);

    // 遍历所有章节
    if (json.data && json.data.courseChapterRspList) {
        json.data.courseChapterRspList.forEach(function(chapter) {
            if (chapter.chapterDetailRspList) {
                // 修改每个章节中的 `isFreeListen` 属性
                chapter.chapterDetailRspList.forEach(function(detail) {
                    detail.isFreeListen = 0;
                });
            }
        });
    }

    // 返回修改后的响应体
    $done({body: JSON.stringify(json)});
})();
