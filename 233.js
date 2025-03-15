let body = $response.body;

// 使用正则表达式匹配所有的 isFreeListen 字段并修改它们的值
body = body.replace(/("isFreeListen"\s*:\s*)\d+/g, '$1 1');  // 匹配所有的 isFreeListen 字段并把值改为 1

$done({ body });
