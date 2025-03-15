(function() {
    'use strict';
    
    const url = $request.url;
    
    if ($response.status === 200) {
        try {
            let body = JSON.parse($response.body);
            
            const modify = (obj) => {
                if (!obj || typeof obj !== 'object') return;
                for (const key in obj) {
                    if (key === 'isFreeListen') {
                        obj[key] = 0;
                    } else if (obj[key] && typeof obj[key] === 'object') {
                        modify(obj[key]);
                    }
                }
                if (Array.isArray(obj)) {
                    obj.forEach(item => modify(item));
                }
            };
            
            modify(body);
            $done({ body: JSON.stringify(body) });
            
        } catch (error) {
            console.log(`处理失败: ${error}`);
            $done();
        }
    } else {
        $done();
    }
})();
