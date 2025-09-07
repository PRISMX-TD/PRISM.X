// 最简单的描述API
export default function handler(req, res) {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // 返回测试描述数据
        res.status(200).json({
            'test-account-1': '这是一个测试账户的描述信息'
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
