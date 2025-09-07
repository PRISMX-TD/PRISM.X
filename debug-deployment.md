# GitHub Actions 部署调试指南

## 问题诊断步骤

### 1. 检查GitHub Actions日志
1. 进入GitHub仓库
2. 点击 "Actions" 标签
3. 查看最新的部署工作流
4. 点击失败的步骤查看详细错误信息

### 2. 常见错误和解决方案

#### 错误1: Vercel Token 无效
```
Error: Invalid Vercel token
```
**解决方案:**
- 检查GitHub Secrets中的 `VERCEL_TOKEN` 是否正确
- 重新生成Vercel token并更新

#### 错误2: Vercel Org ID 或 Project ID 错误
```
Error: Invalid organization or project
```
**解决方案:**
- 检查 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 是否正确
- 在Vercel控制台获取正确的ID

#### 错误3: 权限问题
```
Error: Permission denied
```
**解决方案:**
- 确保Vercel token有正确的权限
- 检查GitHub Actions权限设置

### 3. 简化部署方案

如果Vercel部署持续失败，可以考虑以下替代方案：

#### 方案A: 只使用GitHub Pages
- 移除Vercel部署步骤
- 只部署到GitHub Pages
- 使用GitHub Issues作为数据存储

#### 方案B: 使用GitHub API直接存储
- 不依赖Vercel API
- 直接使用GitHub API存储数据
- 简化部署流程

### 4. 检查当前配置

请检查以下配置是否正确：

#### GitHub Secrets (在仓库设置中):
- `VERCEL_TOKEN`: Vercel访问令牌
- `VERCEL_ORG_ID`: Vercel组织ID  
- `VERCEL_PROJECT_ID`: Vercel项目ID

#### Vercel项目设置:
- 项目是否已正确创建
- 域名是否正确配置
- 环境变量是否设置

### 5. 临时解决方案

如果部署问题无法快速解决，可以：

1. **使用本地开发服务器**
   ```bash
   npx vercel dev
   ```

2. **手动部署到Vercel**
   - 使用Vercel CLI
   - 或通过Vercel控制台上传文件

3. **使用GitHub Pages作为主要部署**
   - 修改API调用指向GitHub API
   - 不依赖Vercel服务

## 下一步行动

请提供以下信息以便进一步诊断：

1. GitHub Actions的具体错误信息
2. 失败的步骤名称
3. 错误日志的完整内容

这样我可以提供更精确的解决方案。
