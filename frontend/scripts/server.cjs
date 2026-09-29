const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const port = 5500;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};

http.createServer((request, response) => {
  const requested = decodeURIComponent(request.url.split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  const file = path.resolve(root, `.${relative}`);
  if (!file.startsWith(root)) return response.writeHead(403).end('Forbidden');
  fs.stat(file, (error, info) => {
    const target = !error && info.isDirectory() ? path.join(file, 'index.html') : file;
    fs.readFile(target, (readError, data) => {
      if (readError) return response.writeHead(404).end('Página não encontrada');
      response.writeHead(200, {'Content-Type':types[path.extname(target).toLowerCase()] || 'application/octet-stream'});
      response.end(data);
    });
  });
}).listen(port, () => console.log(`Front disponível em http://localhost:${port}`));
