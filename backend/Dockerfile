# 使用Node.js官方镜像作为基础镜像（匹配用户的Node版本16.18.0）
FROM node:16.18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用程序代码
COPY . .

# 复制根目录的前端文件到当前工作目录
COPY ../index.html ./
COPY ../README.md ./

# 复制环境变量模板
COPY .env.example .env

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]