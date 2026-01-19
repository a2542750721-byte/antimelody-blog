# Hexo 博客静态部署指南

本指南提供了多种静态部署方案，帮助你将 ANTIMelody's Blogs 部署到各个平台。

## 📋 部署前准备

### 1. 更新配置文件

在部署之前，请先更新 `_config.yml` 中的 URL 配置：

```yaml
# _config.yml
url: https://your-domain.com  # 替换为你的实际域名
```

### 2. 构建静态文件

```bash
# 清理缓存
npm run clean

# 生成静态文件
npm run build
```

生成的静态文件将位于 `public/` 目录中。

---

## 🚀 部署方案

### 方案 1: Vercel 部署（推荐）⭐

Vercel 提供免费的静态网站托管，支持自动部署、HTTPS、CDN 加速等功能。

#### 优势
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ Git 集成，自动部署
- ✅ 免费额度足够个人博客使用

#### 部署步骤

**方法 A: 使用 Vercel CLI（快速）**

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 生产环境部署
vercel --prod
```

**方法 B: 使用 Git 集成（推荐）**

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的仓库
5. Vercel 会自动检测到 Hexo 项目并配置构建设置：
   - **Framework Preset**: Hexo
   - **Build Command**: `hexo generate`
   - **Output Directory**: `public`
6. 点击 "Deploy"

#### 配置说明

你的项目已经包含 `vercel.json` 配置文件，包含以下优化：

```json
{
  "framework": "hexo",
  "cleanUrls": true,          // 启用干净的 URL
  "regions": ["hkg1"],        // 香港区域（中国访问更快）
  "rewrites": [...],          // URL 重写规则
  "headers": [...]            // 缓存优化
}
```

#### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

### 方案 2: GitHub Pages 部署

#### 优势
- ✅ 完全免费
- ✅ 与 GitHub 深度集成
- ✅ 支持自定义域名

#### 部署步骤

1. **配置仓库信息**

编辑 `_config.yml`：

```yaml
# _config.yml
url: https://username.github.io/repo-name
root: /repo-name/  # 如果使用项目页面

deploy:
  type: git
  repo: git@github.com:username/repo-name.git
  branch: gh-pages
```

2. **部署**

```bash
# 构建并部署
npm run deploy
```

3. **启用 GitHub Pages**

- 进入仓库设置 → Pages
- 选择 `gh-pages` 分支
- 点击保存

#### 使用 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Hexo Blog

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

---

### 方案 3: Netlify 部署

#### 优势
- ✅ 免费托管
- ✅ 自动 HTTPS
- ✅ 表单处理功能
- ✅ 无服务器函数支持

#### 部署步骤

**方法 A: 拖放部署**

1. 运行 `npm run build`
2. 访问 [netlify.com](https://netlify.com)
3. 将 `public/` 文件夹拖放到 Netlify

**方法 B: Git 集成**

1. 访问 [netlify.com](https://netlify.com)
2. 点击 "New site from Git"
3. 连接你的 Git 仓库
4. 配置构建设置：
   - **Build command**: `hexo generate`
   - **Publish directory**: `public`
5. 点击 "Deploy site"

创建 `netlify.toml` 配置文件：

```toml
[build]
  command = "hexo generate"
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### 方案 4: Cloudflare Pages

#### 优势
- ✅ 免费无限带宽
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ 无限并发构建

#### 部署步骤

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 连接你的 Git 仓库
3. 配置构建设置：
   - **Framework preset**: Hexo
   - **Build command**: `hexo generate`
   - **Build output directory**: `public`
4. 点击 "Save and Deploy"

---

### 方案 5: 自定义服务器部署

#### 适用场景
- 你有自己的 VPS 或云服务器
- 需要完全控制服务器配置

#### 使用 Nginx 部署

1. **构建静态文件**

```bash
npm run build
```

2. **上传到服务器**

```bash
# 使用 rsync
rsync -avz --delete public/ user@your-server:/var/www/blog/

# 或使用 scp
scp -r public/* user@your-server:/var/www/blog/
```

3. **配置 Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/blog;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 处理 404
    error_page 404 /404.html;

    # 处理 URL
    location / {
        try_files $uri $uri/ =404;
    }
}
```

4. **配置 HTTPS（使用 Let's Encrypt）**

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

---

## 🔄 持续集成/持续部署 (CI/CD)

### 推荐工作流程

1. **本地开发** → 写文章、调整样式
2. **提交到 Git** → 推送到远程仓库
3. **自动部署** → CI/CD 自动构建和部署
4. **访问网站** → 查看最新内容

### Git 工作流示例

```bash
# 1. 创建新文章
hexo new post "My New Article"

# 2. 编辑文章
# 编辑 source/_posts/My-New-Article.md

# 3. 本地预览
npm run server

# 4. 提交更改
git add .
git commit -m "Add new article: My New Article"
git push origin main

# 5. 自动部署（如果配置了 CI/CD）
# 等待自动部署完成...
```

---

## 🛠️ 性能优化建议

### 1. 图片优化

- 使用 WebP 格式
- 压缩图片（使用 TinyPNG 或 ImageOptim）
- 使用图片 CDN（如 Cloudinary）

### 2. 代码优化

安装优化插件：

```bash
# 压缩 HTML
npm install hexo-html-minifier --save

# 压缩 CSS
npm install hexo-clean-css --save

# 压缩 JS
npm install hexo-uglify --save
```

在 `_config.yml` 中配置：

```yaml
html_minifier:
  enable: true
  exclude:
    - '*.min.html'

clean_css:
  enable: true
  exclude:
    - '*.min.css'

uglify:
  enable: true
  mangle: true
  compress:
    warnings: false
```

### 3. CDN 加速

在 `_config.butterfly.yml` 中配置 CDN：

```yaml
CDN:
  enable: true
  # 使用 jsDelivr CDN
  jquery: https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js
```

---

## 📊 部署平台对比

| 平台 | 免费额度 | 构建速度 | CDN | 自定义域名 | 推荐指数 |
|------|---------|---------|-----|-----------|---------|
| **Vercel** | 100GB 带宽/月 | ⚡⚡⚡ | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB 带宽/月 | ⚡⚡⚡ | ✅ 全球 | ✅ | ⭐⭐⭐⭐⭐ |
| **Cloudflare Pages** | 无限带宽 | ⚡⚡ | ✅ 全球 | ✅ | ⭐⭐⭐⭐ |
| **GitHub Pages** | 100GB 流量/月 | ⚡⚡ | ✅ 部分 | ✅ | ⭐⭐⭐⭐ |
| **自建服务器** | 取决于配置 | ⚡ | ❌ 需自建 | ✅ | ⭐⭐⭐ |

---

## 🎯 推荐方案

### 对于初学者
→ **Vercel** 或 **Netlify**：零配置，开箱即用

### 对于追求速度
→ **Cloudflare Pages**：无限带宽，全球最快的 CDN

### 对于 GitHub 用户
→ **GitHub Pages** + **GitHub Actions**：深度集成，完全免费

### 对于专业用户
→ **自建服务器** + **Nginx**：完全控制，高度定制

---

## ❓ 常见问题

### Q: 如何选择部署平台？
A: 对于个人博客，推荐 Vercel 或 Netlify，它们提供了最佳的开发体验和性能。

### Q: 是否需要购买服务器？
A: 不需要！上述所有云平台都提供免费托管，足够个人博客使用。

### Q: 如何配置自定义域名？
A: 在部署平台的设置中添加域名，然后在域名服务商处配置 DNS 记录即可。

### Q: 部署后多久生效？
A: 使用 Vercel/Netlify 通常 1-2 分钟即可生效，GitHub Pages 可能需要 5-10 分钟。

### Q: 如何更新网站内容？
A: 编写新文章后，提交到 Git 仓库，CI/CD 会自动构建和部署。

---

## 📚 相关资源

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com/)
- [GitHub Pages 指南](https://pages.github.com/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

## 🚦 下一步

1. ✅ 选择一个部署平台
2. ✅ 更新 `_config.yml` 中的 URL
3. ✅ 运行 `npm run build` 构建
4. ✅ 按照上述步骤部署
5. ✅ 配置自定义域名（可选）
6. ✅ 享受你的博客！

---

**注意事项**：
- 首次部署前建议先在本地运行 `hexo server` 确认一切正常
- 确保 `.gitignore` 包含 `node_modules/`、`public/`、`db.json` 等不需要提交的文件
- 部署后定期检查网站性能和可访问性
