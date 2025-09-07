// GitHub Issues 描述数据API
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'PRISMX-TD';
const GITHUB_REPO = 'PRISM.X';
const DATA_ISSUE_TITLE = 'PRISM X Accounts Data';

export default async function handler(req, res) {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch issues');
            }

            const issues = await response.json();
            const dataIssue = issues.find(issue => issue.title === DATA_ISSUE_TITLE);
            
            if (dataIssue && dataIssue.body) {
                const jsonMatch = dataIssue.body.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[1]);
                    // 提取描述数据
                    const descriptions = {};
                    if (data.accounts) {
                        data.accounts.forEach(account => {
                            if (account.description) {
                                descriptions[account.id] = account.description;
                            }
                        });
                    }
                    res.status(200).json(descriptions);
                    return;
                }
            }
            
            res.status(200).json({});
        } catch (error) {
            console.error('Error fetching descriptions:', error);
            res.status(500).json({ error: 'Failed to fetch descriptions' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
