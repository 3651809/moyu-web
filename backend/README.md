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

#### 方法一：直接使用Docker

1. 构建Docker镜像
```bash
docker build -t moyu-api-proxy .
```

2. 运行Docker容器
```bash
docker run -p 3636:3636 --env-file .env --name moyu-api-proxy -d moyu-api-proxy
```

#### 方法二：使用Docker Compose

1. 创建 `.env` 文件（从 `.env.example` 复制）

2. 启动服务
```bash
docker-compose up -d
```

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

| 变量名 | 描述 | 默认值 |
|-------|------|--------|
| API_ID | API的ID | xxxxx |
| API_KEY | API的密钥 | xxxxx |
| PORT | 服务器端口 | 3636 |

## 注意事项
- 请妥善保管你的 `.env` 文件
- 部署到生产环境时，建议修改默认的API凭证
- 确保Docker服务正在运行

## 故障排除
- 检查环境变量是否正确配置
- 查看Docker容器日志：`docker logs moyu-api-proxy`
- 确保端口未被其他程序占用