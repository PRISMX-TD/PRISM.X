// GitHub Issues 代理服务器
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 从环境变量获取 GitHub Token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'PRISMX-TD';
const GITHUB_REPO = 'PRISM.X';
const DATA_ISSUE_TITLE = 'PRISM X Accounts Data';

// 获取数据
app.get('/api/data', async (req, res) => {
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
                res.json(data);
                return;
            }
        }
        
        res.json({ accounts: [], categories: [], system: {} });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// 保存数据
app.post('/api/data', async (req, res) => {
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
                res.json({ success: true, message: 'Data updated successfully' });
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
                res.json({ success: true, message: 'Data created successfully' });
            } else {
                throw new Error('Failed to create issue');
            }
        }
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
