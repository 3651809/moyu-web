const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 加载环境变量
// 为Docker环境添加特定的配置
try {
  // 首先尝试默认的.env位置（本地开发环境）
  dotenv.config();
  console.log('正在使用默认的.env文件');
} catch (error) {
  // 如果失败，尝试Docker容器中的路径
  console.log('尝试加载Docker环境的.env文件');
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// 输出当前工作目录和__dirname用于调试
console.log('当前工作目录:', process.cwd());
console.log('__dirname:', __dirname);
console.log('index.html路径:', path.join(__dirname, '..', 'index.html'));
console.log('静态文件目录:', path.join(__dirname, '..'));

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3636;

// 获取环境变量中的API凭证
const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;

console.log('API_ID:', API_ID ? '已设置' : '未设置');
console.log('API_KEY:', API_KEY ? '已设置 (隐藏)' : '未设置');

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 提供静态文件服务 - 直接使用根目录的前端文件
app.use(express.static(path.join(__dirname, '..')));

// API代理路由
app.get('/api/news', async (req, res) => {
  try {
    console.log('请求新闻API');
    const response = await axios.get(
      `https://cn.apihz.cn/api/xinwen/toutiao.php?id=${API_ID}&key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('获取新闻失败:', error.message);
    console.error('错误详情:', error.response?.data || error);
    console.error('请求URL:', `https://cn.apihz.cn/api/xinwen/toutiao.php?id=${API_ID}&key=${API_KEY}`);
    res.status(500).json({ code: 500, message: '获取新闻失败', error: error.message });
  }
});

app.get('/api/ip', async (req, res) => {
  try {
    console.log('请求IP信息API');
    const response = await axios.get(
      `https://cn.apihz.cn/api/ip/chaapi.php?id=${API_ID}&key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('获取IP信息失败:', error.message);
    console.error('错误详情:', error.response?.data || error);
    console.error('请求URL:', `https://cn.apihz.cn/api/ip/chaapi.php?id=${API_ID}&key=${API_KEY}`);
    res.status(500).json({ code: 500, message: '获取IP信息失败', error: error.message });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const { sheng, place } = req.query;
    console.log('请求天气API:', { sheng, place });
    
    if (!sheng || !place) {
      return res.status(400).json({ code: 400, message: '缺少省份或城市参数' });
    }
    
    const response = await axios.get(
      `https://cn.apihz.cn/api/tianqi/tqyb.php?id=${API_ID}&key=${API_KEY}&sheng=${encodeURIComponent(sheng)}&place=${encodeURIComponent(place)}&day=1&hourtype=1`
    );
    res.json(response.data);
  } catch (error) {
    console.error('获取天气信息失败:', error.message);
    console.error('错误详情:', error.response?.data || error);
    console.error('请求URL:', `https://cn.apihz.cn/api/tianqi/tqyb.php?id=${API_ID}&key=${API_KEY}&sheng=${req.query.sheng}&place=${req.query.place}&day=1&hourtype=1`);
    res.status(500).json({ code: 500, message: '获取天气信息失败', error: error.message });
  }
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    API_ID: API_ID ? '已配置' : '未配置',
    version: '1.0.0'
  });
});

// 根路径直接返回index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('可用API路由:');
  console.log('  GET / - 前端界面');
  console.log('  GET /api/news - 获取新闻信息');
  console.log('  GET /api/ip - 获取IP信息');
  console.log('  GET /api/weather?sheng=省份&place=城市 - 获取天气信息');
  console.log('  GET /health - 健康检查');
});