# 使用Node.js 16.18.0作为基础镜像
FROM node:16.18.0-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY backend/package*.json ./

# 安装依赖
RUN npm install --production

# 创建项目目录结构，保持与本地开发环境一致
RUN mkdir -p backend

# 复制后端代码到相应的目录
COPY backend/server.js ./backend/

# 复制前端文件到根目录
COPY index.html ./

# 复制环境变量示例文件（用户需要自己创建.env文件）
COPY backend/.env.example ./backend/

# 创建.env文件（如果不存在）
RUN touch ./backend/.env

# 暴露端口
EXPOSE 3636

# 启动命令 - 从正确的目录运行
CMD ["node", "backend/server.js"]