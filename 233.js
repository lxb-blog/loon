(function() {
    'use strict';
    
    // 调试标识
    const DEBUG = true;
    const TARGET_KEY = 'isFreeListen';
    
    function log(...args) {
        DEBUG && console.log(`[FreeListen]`, ...args);
    }
    
    // 主处理函数
    function processResponse() {
        try {
            // 仅处理200响应
            if ($response.status !== 200) {
                log(`跳过非200响应：${$response.status}`);
                return $done();
            }
            
            // 解析JSON
            let body = JSON.parse($response.body);
            log(`原始数据解析成功`);
            
            // 深度遍历修改
            const stack = [body];
            let modified = 0;
            
            while (stack.length) {
                const obj = stack.pop();
                
                if (Array.isArray(obj)) {
                    stack.push(...obj);
                    continue;
                }
                
                if (obj && typeof obj === 'object') {
                    for (const key in obj) {
                        if (key === TARGET_KEY) {
                            if (obj[key] !== 0) {
                                obj[key] = 0;
                                modified++;
                            }
                        } else {
                            stack.push(obj[key]);
                        }
                    }
                }
            }
            
            log(`共修改 ${modified} 处 ${TARGET_KEY} 字段`);
            return $done({body: JSON.stringify(body)});
            
        } catch (e) {
            log(`处理失败：${e}`);
            return $done();
        }
    }
    
    // 执行入口
    if ($response.body) {
        log(`开始处理请求：${$request.url}`);
        processResponse();
    } else {
        log(`无响应体，跳过处理`);
        $done();
    }
})();
