# 摸鱼资讯API代理服务

一个简易的API代理服务，用于隐藏API密钥，支持Docker部署。

## 功能特性
- 🚀 隐藏敏感的API密钥
- 🌐 支持新闻、IP信息、天气三种API请求转发
- 🐳 支持Docker和Docker Compose部署
- 🛡️ 启用CORS，允许跨域请求
- 📁 直接读取根目录的前端文件，无需额外复制操作

## 快速开始

### 本地开发

1. 克隆项目（或复制相关文件）

2. 安装依赖
```bash
cd backend
npm install
```

3. 配置环境变量
   - 复制 `.env.example` 到 `.env`
   - 编辑 `.env` 文件，填入你的API凭证

4. 启动开发服务器
```bash
npm run dev
```

5. 服务将运行在 http://localhost:3636

### 使用Docker部署

项目支持三种部署方式：

1. **使用Docker Compose（推荐）**
   ```bash
   # 在项目根目录下执行
   docker-compose up -d --build
   ```

2. **使用启动脚本**
   ```bash
   # Linux/Mac
   ./start-docker.sh --build
   
   # Windows
   start-docker.bat --build
   ```

3. **手动构建和运行**
   ```bash
   # 在项目根目录下执行
   docker build -t moyu-web:latest .
   docker run -d --name moyu-web -p 3636:3636 -v ./backend/.env:/app/backend/.env:ro --restart unless-stopped moyu-web:latest
   ```

请参考项目根目录下的DEPLOYMENT.md文件，了解更详细的Docker部署指南。

## API路由

- `GET /api/news` - 获取新闻信息
- `GET /api/ip` - 获取IP信息
- `GET /api/weather?sheng=省份&place=城市` - 获取天气信息
- `GET /health` - 健康检查

## 前端集成

修改前端代码，将原来直接调用的API地址改为调用我们的代理服务：

```javascript
// 原代码
const newsUrl = 'https://cn.apihz.cn/api/xinwen/toutiao.php?id=xxxx&key=xxxxxx';

// 修改为
const newsUrl = 'http://localhost:3636/api/news';
```

## 环境变量

> **注意**：API_ID和API_KEY需要前往 [接口盒子](https://www.apihz.cn/) 网站自行注册获取，示例值仅供参考

### .env文件配置

在`backend`目录下创建`.env`文件，并填入以下内容：
```
API_ID=你的API_ID
API_KEY=你的API_KEY
PORT=3636
```

### 变量说明

| 变量名 | 描述 | 默认值 |
|-------|------|--------|
| API_ID | 接口盒子的API ID | xxxxx |
| API_KEY | 接口盒子的API密钥 | xxxxx |
| PORT | 服务器端口 | 3636 |

## 注意事项
- 请妥善保管你的 `.env` 文件，不要将其提交到代码仓库
- 部署到生产环境时，建议修改默认的API凭证
- 确保Docker服务正在运行
- 项目使用Node.js 16.18.0版本开发和测试

## 故障排除
- 检查环境变量是否正确配置
- 查看Docker容器日志：`docker logs moyu-web` 或使用启动脚本 `./start-docker.sh --logs`
- 确保端口未被其他程序占用
- 检查Docker容器状态：`docker ps -a`
- 查看健康检查端点：`http://localhost:3636/health`