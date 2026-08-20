import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip',
  '.md': 'text/markdown; charset=utf-8'
};

function serveFile(res, filePath, contentType = null) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return serveFile(res, indexPath);
    }
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Directory Listing Denied');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = contentType || MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache'
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

function handleApiGames(req, res) {
  const gamesDir = path.join(rootDir, 'games');
  const games = [];

  if (fs.existsSync(gamesDir)) {
    const folders = fs.readdirSync(gamesDir);
    for (const folder of folders) {
      const folderPath = path.join(gamesDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const metaPath = path.join(folderPath, 'metadata.json');
        let meta = {
          id: folder,
          title: folder.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          genre: 'arcade',
          version: '0.1.0',
          status: 'ready'
        };

        if (fs.existsSync(metaPath)) {
          try {
            meta = Object.assign(meta, JSON.parse(fs.readFileSync(metaPath, 'utf8')));
          } catch (e) {}
        }

        // Check if ZIP exists
        const zipPath = path.join(folderPath, 'build', `${folder}.zip`);
        meta.hasZip = fs.existsSync(zipPath);

        // Check for reports
        const reportsDir = path.join(folderPath, 'reports');
        meta.reports = [];
        if (fs.existsSync(reportsDir)) {
          meta.reports = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.md'));
        }

        games.push(meta);
      }
    }
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, games }));
}

function handleApiGameDetails(req, res, gameId) {
  const gameDir = path.join(rootDir, 'games', gameId);
  if (!fs.existsSync(gameDir)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Game not found' }));
    return;
  }

  const readDoc = (fileName) => {
    const p = path.join(gameDir, fileName);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };

  const metaPath = path.join(gameDir, 'metadata.json');
  let meta = { id: gameId };
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    } catch (e) {}
  }

  const responseData = {
    success: true,
    game: meta,
    docs: {
      brief: readDoc('game-brief.md'),
      design: readDoc('game-design.md'),
      art: readDoc('art-direction.md'),
      technical: readDoc('technical-plan.md')
    }
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(responseData));
}

function handleApiBuild(req, res, gameId) {
  const scriptPath = path.join(rootDir, 'scripts', 'build-game.js');
  exec(`node "${scriptPath}" ${gameId}`, { cwd: rootDir }, (error, stdout, stderr) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: !error,
        logs: stdout + '\n' + (stderr || ''),
        error: error ? error.message : null
      })
    );
  });
}

function handleDownloadZip(req, res, gameId) {
  const zipPath = path.join(rootDir, 'games', gameId, 'build', `${gameId}.zip`);
  if (!fs.existsSync(zipPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('ZIP not found. Please build the game first.');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${gameId}.zip"`,
    'Content-Length': fs.statSync(zipPath).size
  });

  fs.createReadStream(zipPath).pipe(res);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // REST API Endpoints
  if (pathname === '/api/games' && req.method === 'GET') {
    return handleApiGames(req, res);
  }

  const detailsMatch = pathname.match(/^\/api\/games\/([^/]+)$/);
  if (detailsMatch && req.method === 'GET') {
    return handleApiGameDetails(req, res, detailsMatch[1]);
  }

  const buildMatch = pathname.match(/^\/api\/games\/([^/]+)\/build$/);
  if (buildMatch && req.method === 'POST') {
    return handleApiBuild(req, res, buildMatch[1]);
  }

  const downloadMatch = pathname.match(/^\/api\/games\/([^/]+)\/download$/);
  if (downloadMatch && req.method === 'GET') {
    return handleDownloadZip(req, res, downloadMatch[1]);
  }

  // Static Game, Engine, and Studio routing
  if (pathname.startsWith('/games/')) {
    const relativePath = pathname.replace(/^\/games\//, '');
    const fullPath = path.join(rootDir, 'games', relativePath);
    return serveFile(res, fullPath);
  }

  if (pathname.startsWith('/engine/')) {
    const relativePath = pathname.replace(/^\/engine\//, '');
    const fullPath = path.join(rootDir, 'engine', relativePath);
    return serveFile(res, fullPath);
  }

  if (pathname.startsWith('/studio/')) {
    const relativePath = pathname.replace(/^\/studio\//, '');
    const fullPath = path.join(rootDir, 'studio', relativePath);
    return serveFile(res, fullPath);
  }

  // Default: Serve studio UI
  let filePath = path.join(rootDir, 'studio', pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(rootDir, pathname === '/' ? 'index.html' : pathname);
  }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎮 AI Game Factory Studio running at: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
