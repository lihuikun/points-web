const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 代理配置
app.use('/api', createProxyMiddleware({
    target: 'http://lihk.serv00.net:13381/api',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
}));

// 处理所有其他请求，返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
