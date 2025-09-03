# 使用Node.js 16.18.0作为基础镜像
FROM node:16.18.0-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY backend/package*.json ./

# 安装依赖
RUN npm install --production

# 复制后端代码
COPY backend/server.js ./

# 复制前端文件（根据.dockerignore，只复制必要的HTML文件）
COPY index.html ./

# 创建.env文件（如果不存在）
RUN touch .env

# 暴露端口
EXPOSE 3636

# 启动命令
CMD ["node", "server.js"]