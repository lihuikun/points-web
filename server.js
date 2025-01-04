// server.js
const http = require('http-server');
const path = require('path');

const server = http.createServer({
    root: path.join(__dirname, 'dist'),
    port: 1998, // 自定义端口
    showDir: false,
    autoIndex: true,
});

server.listen(1998, () => {
    console.log('Vue project is running at http://localhost:8080');
});
