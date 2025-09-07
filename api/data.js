// GitHub Issues 数据API
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'PRISMX-TD';
const GITHUB_REPO = 'PRISM.X';
const DATA_ISSUE_TITLE = 'PRISM X Accounts Data';

export default async function handler(req, res) {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // 获取数据
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
                    res.status(200).json(data);
                    return;
                }
            }
            
            res.status(200).json({ accounts: [], categories: [], system: {} });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else if (req.method === 'POST') {
        // 保存数据并触发GitHub Actions
        try {
            const data = req.body;
            
            // 获取现有 Issues
            const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!getResponse.ok) {
                throw new Error('Failed to fetch issues');
            }

            const issues = await getResponse.json();
            const existingIssue = issues.find(issue => issue.title === DATA_ISSUE_TITLE);

            const issueBody = `# PRISM X 账户数据

这是 PRISM X 系统的账户数据存储。请勿手动修改此 Issue 的内容。

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

---
*最后更新：${new Date().toLocaleString()}*`;

            if (existingIssue) {
                // 更新现有 Issue
                const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${existingIssue.number}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        body: issueBody
                    })
                });

                if (updateResponse.ok) {
                    // 触发GitHub Actions重新部署
                    await triggerGitHubActions();
                    res.status(200).json({ success: true, message: 'Data updated successfully' });
                } else {
                    throw new Error('Failed to update issue');
                }
            } else {
                // 创建新 Issue
                const createResponse = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: DATA_ISSUE_TITLE,
                        body: issueBody
                    })
                });

                if (createResponse.ok) {
                    // 触发GitHub Actions重新部署
                    await triggerGitHubActions();
                    res.status(200).json({ success: true, message: 'Data created successfully' });
                } else {
                    throw new Error('Failed to create issue');
                }
            }
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Failed to save data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

// 触发GitHub Actions重新部署
async function triggerGitHubActions() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'data-updated',
                client_payload: {
                    timestamp: new Date().toISOString(),
                    message: 'Data updated, triggering redeployment'
                }
            })
        });

        if (response.ok) {
            console.log('GitHub Actions triggered successfully');
        } else {
            console.error('Failed to trigger GitHub Actions:', response.status);
        }
    } catch (error) {
        console.error('Error triggering GitHub Actions:', error);
    }
}
