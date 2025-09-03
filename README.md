# 摸鱼资讯 - 完整项目说明
[![GitHub](https://img.shields.io/badge/GitHub-3651809/moyu-web?logo=github)](https://github.com/3651809/moyu-web)
[![Docker](https://img.shields.io/badge/Docker-一键部署-blue?logo=docker)](https://github.com/github.com/3651809/moyu-web)
[![License](https://img.shields.io/badge/License-仅供学习-red.svg)](#️-版权声明与使用条款)
 ![visitors](https://visitor-badge.laobi.icu/badge?page_id=3651809/moyu-web)
一个集成了天气信息、新闻资讯、IP归属地查询和摸鱼指数计算的应用程序，使用Node.js后端服务来隐藏敏感的API凭证，并支持Docker单容器部署。


项目在线体验地址：[摸鱼资讯](https://moyu.3651809.cn:724/)


## 项目结构

```
moyu-web/
├── index.html           # 前端界面 (后端直接读取)
├── moyu.html            # 纯前端版本（不推荐，API密钥会暴露）
├── README.md            # 项目说明文档
├── DEPLOYMENT.md        # Docker部署详细指南
├── PUSH_TO_DOCKERHUB.md # Docker镜像推送指南
├── Dockerfile           # Docker构建文件
├── .dockerignore        # Docker忽略文件
├── docker-compose.yml   # Docker Compose配置
├── docker-compose.build.yml # 专用构建配置
├── start-docker.sh      # Linux/Mac启动脚本
├── start-docker.bat     # Windows启动脚本
└── backend/             # 后端API代理服务
    ├── server.js        # 服务器主文件
    ├── package.json     # 项目依赖
    ├── .env             # 环境变量文件（需自行创建）
    ├── .env.example     # 环境变量模板
    └── README.md        # 后端服务文档
```

## 安全提示与部署建议

> **重要安全警告**：项目中提供的API密钥和ID仅用于演示目的，实际使用时请务必替换为您自己的凭证。

> **环境变量配置**：请将 `.env.example` 文件复制为 `.env`，并填写您从接口盒子获取的API密钥和ID。

### 两种部署方式对比

**1. 单页面直接部署（不推荐）**
- 使用文件：`moyu.html`
- 特点：无后端服务，所有API请求直接在浏览器中发起
- **风险**：API密钥和ID会直接暴露在前端代码中，容易被他人获取和滥用
- 适用场景：仅在内网环境或个人本地环境临时使用

**2. Docker容器部署（强烈推荐）**
- 使用方式：通过 `docker-compose up -d --build` 命令启动
- 特点：整合前后端，所有API请求通过后端服务转发
- **优势**：API密钥和ID安全地存储在服务器环境变量中，前端无法直接访问
- 适用场景：所有生产环境和需要保护API凭证的场景


## 功能介绍

### 前端功能
- 📊 摸鱼指数显示
- 📰 新闻资讯展示
- 📍 IP归属地信息
- 🌤️ 天气预报
- ⏰ 下班倒计时
- 📅 周末和节假日倒计时
- 🎯 工作进度条

### 后端功能
- 🔒 隐藏敏感API密钥
- 🔄 API请求转发
- 🐳 支持Docker单容器部署（整合前后端）
- 🌐 启用CORS跨域支持
- 📁 直接读取根目录的前端文件，无需额外复制

## 快速开始

### 步骤1：配置后端服务

1. 进入后端目录
```bash
cd backend
```

2. 复制环境变量模板
```bash
cp .env.example .env
```

3. 编辑 `.env` 文件，填入你的API凭证
   > **注意**：API_ID和API_KEY需要前往 [接口盒子](https://www.apihz.cn/) 网站自行注册获取，示例值仅供参考

### 步骤2：启动应用

#### 使用Docker Compose启动（推荐，整合前后端）

在项目根目录下运行：

```bash
git clone '代码地址'
docker-compose up -d --build
```

这将：
1. 构建包含前后端的Docker镜像
2. 启动容器
3. 应用将在 http://localhost:3636 可用

#### 本地开发模式

在`backend`目录下安装依赖并启动服务：

```bash
cd backend
npm install
npm run dev
```

这将：
1. 直接读取根目录的index.html文件
2. 启动后端服务（使用nodemon自动重载）
3. 应用将在 http://localhost:3636 启动

**注意**：修改前端index.html文件后无需额外操作，刷新浏览器即可看到更新。

### 步骤3：访问应用

打开浏览器，访问 http://localhost:3636 即可使用整合了前后端的摸鱼工具。

## 部署指南

### 开发环境
1. 按照上述快速开始步骤操作
2. 前端通过后端服务访问或直接在浏览器中打开
3. 后端服务通过Node.js或Docker运行

### 生产环境
1. 使用Docker Compose（单容器部署）
```bash
git clone '代码地址'
docker-compose up -d --build
```

这将构建包含前后端的Docker镜像并启动容器，应用将在 http://localhost:3636 可用。

## 技术栈

- **前端**: HTML, JavaScript, Tailwind CSS, Font Awesome
- **后端**: Node.js (16.18.0), Express, Axios
- **容器化**: Docker, Docker Compose

## 故障排除

1. **API调用失败**
   - 检查后端服务是否正常运行：`http://localhost:3636/health`
   - 查看Docker容器日志：`docker-compose logs`
   - 确认环境变量配置正确

2. **跨域问题**
   - 确保后端服务已启用CORS
   - 检查浏览器控制台错误信息

3. **部署到服务器**
   - 确保服务器安全组/防火墙已开放相应端口
   - 考虑使用HTTPS增强安全性

## 注意事项
- 本项目使用Node.js 16.18.0版本开发和测试
- 请妥善保管 `.env` 文件
- Docker构建时会保留项目结构，后端直接读取根目录的前端文件
- 定期更新依赖包以确保安全性
- 在生产环境中，建议使用HTTPS协议




## ⚖️ 版权声明与使用条款

### 📋 重要声明

**本项目仅供学习和研究使用，严禁商业用途！**

### 🚫 使用限制

- ❌ **禁止商业使用** - 本项目及其衍生作品不得用于任何商业目的
- ❌ **禁止销售** - 不得以任何形式销售本项目或基于本项目的服务
- ❌ **禁止盈利** - 不得通过本项目进行任何形式的盈利活动
- ❌ **禁止违法使用** - 不得将本项目用于任何违法违规活动

### ✅ 允许使用

- ✅ **学习研究** - 可用于个人学习和技术研究
- ✅ **非商业分享** - 可在非商业环境下分享和讨论
- ✅ **开源贡献** - 欢迎为项目贡献代码和改进

### 📝 使用要求

如果您使用、修改或分发本项目，必须：

1. **保留原作者信息** - 必须在显著位置标注原作者和项目来源
2. **保留版权声明** - 不得删除或修改本版权声明
3. **注明修改内容** - 如有修改，需明确标注修改部分
4. **遵守开源协议** - 严格遵守项目的开源许可协议

### ⚠️ 免责声明

1. **使用风险自负** - 使用本项目产生的任何风险由使用者自行承担
2. **无质量保证** - 本项目按"现状"提供，不提供任何明示或暗示的保证
3. **责任限制** - 作者不对使用本项目造成的任何损失承担责任
4. **合规使用** - 使用者需确保使用行为符合当地法律法规


**⚖️ 使用本项目即表示您已阅读、理解并同意遵守以上所有条款。**


**请记住：仅限学习使用，禁止商业用途！**