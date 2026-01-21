const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Parse URL to remove query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  
  if (filePath.endsWith('.md')) {
    // For .md files, go to project root
    filePath = path.resolve(__dirname, '../../', filePath.substring(1));
  } else {
    // For other files, stay in wiki directory
    filePath = path.join(__dirname, filePath);
  }

  console.log('Requested:', req.url, '-> Resolved:', filePath);

  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript', 
    '.css': 'text/css',
    '.md': 'text/plain'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('File not found:', filePath);
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(3000, () => console.log('Wiki at http://localhost:3000'));