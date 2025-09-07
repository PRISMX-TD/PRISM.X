// 简单的测试API
export default function handler(req, res) {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        res.status(200).json({ 
            success: true, 
            message: 'Vercel API 工作正常',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}