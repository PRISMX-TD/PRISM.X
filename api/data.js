// 最简单的数据API
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
        // 返回测试数据
        res.status(200).json({
            accounts: [
                {
                    id: 'test-account-1',
                    name: '测试账户1',
                    description: '这是一个测试账户',
                    balance: 10000,
                    gain: 15.5,
                    monthly: 2.3,
                    daily: 0.8,
                    drawdown: 3.2,
                    status: 'active',
                    category: 'balanced',
                    emoji: '📈',
                    tags: ['测试', '稳定']
                }
            ],
            categories: [
                {
                    id: 'balanced',
                    name: '平衡策略',
                    color: '#8b5cf6'
                }
            ],
            system: {
                lastUpdate: new Date().toISOString()
            }
        });
    } else if (req.method === 'POST') {
        // 保存数据（简单返回成功）
        console.log('收到数据:', req.body);
        res.status(200).json({ 
            success: true, 
            message: '数据保存成功',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
