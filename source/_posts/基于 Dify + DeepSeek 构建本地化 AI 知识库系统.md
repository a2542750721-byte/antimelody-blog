---
title: 基于 Dify + DeepSeek 构建本地化 AI 知识库系统
date: 2026-01-20 08:22:21
tags: [AI]
categories: [AI]
cover: http://youke.xn--y7xa690gmna.cn/s1/2026/01/19/696e0be10db1f.png
abbrlink: Dify + DeepSeek
---
**项目背景**：旨在通过 Docker 容器化技术在本地部署 LLM 应用开发平台 Dify，并接入当前最流行的 DeepSeek 模型，实现一个完整的 AI 聊天助手。 **环境**：Windows / Linux (Docker 环境)

## 第一章：环境准备 (Prerequisites)

在开始之前，确保本地环境满足以下要求，这是地基。

1. **Docker 环境**：
    
    - 安装 Docker Desktop (Windows/Mac) 或 Docker Engine (Linux)。
	[Docker官网](https://www.docker.com/products/docker-desktop/)
    - _笔记重点_：验证安装是否成功，终端运行 `docker --version` 和 `docker compose version`。
        
    - _资源分配_：如果在本地跑模型（Ollama），建议在 Docker Desktop 设置中给 Docker 分配至少 4GB RAM（虽然 Dify 只需要 2GB 左右，但为了流畅建议多给点）。
        
2. **Git 工具**：
    
    - 用于拉取 Dify 源码。

## 第二章：Dify 的本地化部署 (Docker Compose)



### 1. 获取源码

选择你需要部署的文件夹，打开PowerShell。直接从官方仓库拉取最新稳定版。

Bash

```
git clone https://github.com/langgenius/dify.git
cd dify/docker
```

### 2. 环境配置 (关键步骤)

Dify 依赖很多中间件（Redis, Postgres, Weaviate 等），配置都在 `.env` 文件里。

- **复制配置文件**：
    
    
    ```
    cp .env.example .env
    ```
    
- **修改端口 (解决冲突)**：
    
    - _笔记技巧_：默认 Dify 使用 80 端口。如果你电脑开着 IIS 或 Nginx，80 端口肯定被占用了。
        
    - 编辑 `.env` 文件，找到以下几行进行修改（比如改为 8080）：
        
        
        ```
        # 宿主机映射端口
        EXPOSE_NGINX_PORT=8080
        EXPOSE_NGINX_SSL_PORT=8443
        ```
        
	- 如果看不到.env文件。可以直接在终端输入 CODE .env(用VS Code打开)，NotePad和Vim同理。
### 3. 启动容器群

执行启动命令，Dify 会自动拉取约 7-9 个容器镜像。

Bash

```
docker compose up -d
```

- _检查状态_：运行 `docker compose ps`，确保所有容器状态都是 `Up`。
    

### 4. 初始化

浏览器访问 `http://localhost:8080`（或者你设置的端口）。首次进入需要设置管理员账号（Email）和密码。

## 第三章：DeepSeek 模型接入

### 分支 A：硬核本地派 (Ollama + DeepSeek-R1)

_适合显卡尚可（8G显存推荐），追求完全隐私和离线运行的场景。_

1. **安装 Ollama**：前往 [ollama.com](https://ollama.com) 下载安装。
    
2. **运行模型**：在终端执行：
    
    Bash
    
    ```
    ollama run deepseek-r1:7b
    # 或者 deepseek-r1:1.5b (低配电脑专用)
    ```
    
3. **Dify 连接 Ollama (网络配置坑点)**：
    
    - 在 Dify 界面：`设置` -> `模型供应商` -> `Ollama` -> `添加模型`。
        
    - **模型名称**：`deepseek-r1:7b` (必须精准匹配)。
        
    - **基础 URL**：此处不能填 `localhost`！
        
        - 因为 Dify 运行在 Docker 容器内部，容器内的 `localhost` 指的是容器自己，而不是你的电脑。
            
        - **正确写法**：
            
            - **Mac/Windows**: **`http://host.docker.internal:11434`**
                
            - **Linux**: `http://172.17.0.1:11434` (默认 Docker 网桥 IP)
                

### 分支 B：高性能 API 派 (DeepSeek 官方 API)

_适合电脑配置一般，或者追求满血版 DeepSeek-V3 效果的场景。_

1. **申请 Key**：在 [DeepSeek 开放平台](https://platform.deepseek.com/) 获取 API Key。
    
2. **Dify 配置**：
    
    - 在 `模型供应商` 中找到 `DeepSeek`。
        
    - 直接粘贴 Key。

[成果图](http://youke.xn--y7xa690gmna.cn/s1/2026/01/19/696dd5da04969.png)


## 第五章：技术总结与踩坑记录

1. **网络拓扑理解**：
    
    - Docker 容器与宿主机（你的电脑）之间的网络是隔离的。Dify 访问本地 Ollama 必须“穿透”这层隔离，所以用到了 `host.docker.internal` 这个特殊的 DNS 别名。
        
2. **数据持久化**：
    
    - Dify 的数据（你创建的应用、上传的知识库）都存储在 `dify/docker/volumes` 目录下。只要不删这个目录，重启 Docker 数据不会丢。