// Zero-dependency static file server for production (Render).
// Serves the built dist/ folder with SPA fallback for client-side routing.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'text/xml',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Try to serve the file as-is
  let filePath = path.join(root, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    
    // Cache headers
    if (urlPath.startsWith('/assets/') && ext !== '.html') {
      // Hashed static assets: long-term immutable caching
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (ext === '.html') {
      // HTML: no cache (SPA fallback)
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      // Other static files: moderate caching
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback: serve index.html for unknown non-asset routes
  if (!path.extname(urlPath)) {
    filePath = path.join(root, 'index.html');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
