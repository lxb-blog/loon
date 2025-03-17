const targetURL = 'https://japi.233.com/ess-study-api/learn/do/list-chapter-by-version-id';

if ($response.status === 200 && $request.url.indexOf(targetURL) !== -1) {
    try {
        let body = JSON.parse($response.body);
        deepModify(body, 'isFreeListen', 1);
        $done({ body: JSON.stringify(body) });
    } catch (error) {
        console.log(`Error processing response: ${error}`);
        $done({});
    }
} else {
    $done({});
}

// 递归遍历对象修改指定属性
function deepModify(obj, targetKey, newValue) {
    if (obj instanceof Array) {
        obj.forEach(item => deepModify(item, targetKey, newValue));
    } else if (obj instanceof Object) {
        for (const key in obj) {
            if (key === targetKey) {
                obj[key] = newValue;
            } else {
                deepModify(obj[key], targetKey, newValue);
            }
        }
    }
}
