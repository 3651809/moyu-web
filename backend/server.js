const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 加载环境变量
// 为Docker环境添加特定的配置
// 直接使用完整路径以确保读取到正确的.env文件
const envPath = path.join(__dirname, '.env');
console.log('尝试加载.env文件路径:', envPath);
dotenv.config({ path: envPath });

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

// 辅助函数：获取客户端真实IP地址
const getClientIp = (req) => {
  // 从X-Forwarded-For头获取IP（如果有反向代理）
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // X-Forwarded-For可能包含多个IP，第一个是客户端真实IP
    return xForwardedFor.split(',')[0].trim();
  }
  // 从X-Real-IP头获取IP
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  // 直接从连接获取IP（REMOTE_ADDR）
  return req.connection.remoteAddress || req.socket.remoteAddress || req.ip;
};

app.get('/api/ip', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    console.log('请求IP信息API，客户端IP:', clientIp);
    
    // 检查API是否支持传递ip参数
    // 我们可以尝试两种方式：一种是带ip参数，一种是不带
    let apiUrlWithIp = `https://cn.apihz.cn/api/ip/chaapi.php?id=${API_ID}&key=${API_KEY}&ip=${clientIp}`;
    let apiUrlWithoutIp = `https://cn.apihz.cn/api/ip/chaapi.php?id=${API_ID}&key=${API_KEY}`;
    
    try {
        // 首先尝试带客户端IP的API调用
        console.log('尝试使用带客户端IP的API调用:', apiUrlWithIp);
        let response = await axios.get(apiUrlWithIp);
        
        // 检查API是否返回了基于客户端IP的结果
        if (response.data && response.data.ip) {
          console.log('API返回IP信息:', response.data.ip);
          // 添加客户端真实IP到响应中，方便对比
          response.data.clientIp = clientIp;
          response.data.apiCallType = 'with-client-ip';
          res.json(response.data);
          return;
        }
      } catch (withIpError) {
        console.warn('带IP参数的API调用失败，尝试不带IP参数的调用:', withIpError.message);
      }
      
      try {
        // 如果带IP参数的调用失败，尝试不带IP参数的调用
        console.log('尝试不带客户端IP的API调用:', apiUrlWithoutIp);
        const response = await axios.get(apiUrlWithoutIp);
        
        // 添加客户端真实IP到响应中
        response.data.clientIp = clientIp;
        response.data.apiCallType = 'without-client-ip';
        response.data.note = 'API可能返回的是服务器IP，clientIp字段显示的是您的真实客户端IP';
        res.json(response.data);
      } catch (withoutIpError) {
        // 如果两种API调用都失败，返回客户端IP作为备选响应
        console.warn('所有API调用都失败，返回客户端原始IP信息');
        res.json({
          clientIp: clientIp,
          note: 'API调用失败，直接返回客户端IP信息',
          timestamp: new Date().toISOString()
        });
      }
  } catch (error) {
    console.error('获取IP信息失败:', error.message);
    console.error('错误详情:', error);
    const clientIp = getClientIp(req);
    res.status(200).json({
      clientIp: clientIp,
      note: 'API调用出错，返回客户端直接IP信息',
      timestamp: new Date().toISOString()
    });
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