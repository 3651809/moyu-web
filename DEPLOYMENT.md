# 摸鱼资讯项目 Docker 部署指南

本指南将帮助您使用 Docker 部署摸鱼资讯项目。

## 目录
- [准备工作](#准备工作)
- [本地构建和运行](#本地构建和运行)
- [从云仓库拉取镜像并运行](#从云仓库拉取镜像并运行)
- [配置说明](#配置说明)
- [常用命令](#常用命令)
- [常见问题](#常见问题)

## 准备工作

1. 确保已安装 Docker 和 Docker Compose
2. 获取 API 凭证（API_ID 和 API_KEY）：前往 [接口盒子](https://www.apihz.cn/) 注册获取
3. 在 `backend` 目录下创建 `.env` 文件，并填入您的 API 凭证：
   ```
   API_ID=您的API_ID
   API_KEY=您的API_KEY
   ```

## 本地构建和运行

### 使用 Docker Compose

1. 在项目根目录下执行以下命令构建和启动服务：
   ```bash
   docker-compose up -d --build
   ```

2. 或者使用专用的构建配置文件：
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
   ```

3. 访问 `http://localhost:3636` 查看应用

### 手动构建镜像

1. 构建 Docker 镜像：
   ```bash
   docker build -t moyu-web:latest .
   ```

2. 运行容器：
   ```bash
   docker run -d --name moyu-web -p 3636:3636 -v ./backend/.env:/app/.env:ro --restart unless-stopped moyu-web:latest
   ```

## 从云仓库拉取镜像并运行

如果您已经将镜像推送到了云仓库（如 Docker Hub、阿里云容器镜像服务等），可以直接拉取镜像并运行。

### 使用 Docker Compose

1. 修改 `docker-compose.yml` 文件，使用云仓库的镜像地址：
   ```yaml
   version: "3.9"
   services:
     moyu-web:
       # 注释掉 build 部分
       # build: .
       # 使用云仓库镜像
       image: docker.io/3651809/moyu-web:latest
   # 或者简化为 (Docker Hub 是默认仓库)
   # image: 3651809/moyu-web:latest
       container_name: moyu-web
       ports:
         - "3636:3636"
       restart: unless-stopped
       volumes:
         - ./backend/.env:/app/.env:ro
   ```

2. 执行以下命令拉取并运行：
   ```bash
   docker-compose up -d
   ```

### 手动拉取并运行

1. 拉取镜像：
   ```bash
   docker pull docker.io/3651809/moyu-web:latest
   # 或者简化为
   # docker pull 3651809/moyu-web:latest
   ```

2. 运行容器：
   ```bash
   docker run -d --name moyu-web -p 3636:3636 -v ./backend/.env:/app/.env:ro --restart unless-stopped docker.io/3651809/moyu-web:latest
   # 或者简化为
   # docker run -d --name moyu-web -p 3636:3636 -v ./backend/.env:/app/.env:ro --restart unless-stopped 3651809/moyu-web:latest
   ```

## 配置说明

### 环境变量

项目使用以下环境变量：

- `API_ID`: 接口盒子的 API ID
- `API_KEY`: 接口盒子的 API Key
- `PORT`: 服务端口（默认为 3636）

这些环境变量应该放在 `backend/.env` 文件中，而不是直接写在 `docker-compose.yml` 中，以保证安全。

### 数据持久化

当前项目主要是 API 代理服务，不需要复杂的数据持久化。但是，如果您需要自定义前端文件，可以通过挂载卷来实现：

```yaml
volumes:
  - ./index.html:/app/index.html:ro
  # 如果需要自定义其他前端文件，也可以类似挂载
```

## 常用命令

### 查看容器状态
```bash
docker ps -a
```

### 查看容器日志
```bash
docker logs moyu-web
# 实时查看日志
# docker logs -f moyu-web
```

### 进入容器
```bash
docker exec -it moyu-web /bin/sh
```

### 停止并删除容器
```bash
docker-compose down
# 或者手动停止和删除
# docker stop moyu-web
# docker rm moyu-web
```

### 重新构建镜像
```bash
docker-compose build --no-cache
```

## 常见问题

### 1. 服务启动后无法访问
- 检查容器是否正常运行：`docker ps -a`
- 查看容器日志：`docker logs moyu-web`
- 确认端口映射是否正确：`docker port moyu-web`

### 2. API 请求失败
- 检查 API 凭证是否正确设置
- 查看容器日志，确认请求 URL 和错误信息
- 确认网络连接是否正常

### 3. 如何更新镜像
- 本地构建：修改代码后重新构建并运行
- 从云仓库拉取：确保云仓库有新的镜像版本，然后使用 `docker-compose pull` 和 `docker-compose up -d` 更新

### 4. 如何优化镜像大小
- 当前使用的是 Alpine 版本的 Node.js 镜像，已较为轻量
- 仅安装生产依赖（已在 Dockerfile 中实现）
- 可以考虑使用多阶段构建进一步减小镜像大小