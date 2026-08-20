import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const gamesDir = path.join(process.cwd(), 'games');
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

        const zipPath = path.join(folderPath, 'build', `${folder}.zip`);
        meta.hasZip = fs.existsSync(zipPath);

        const reportsDir = path.join(folderPath, 'reports');
        meta.reports = [];
        if (fs.existsSync(reportsDir)) {
          meta.reports = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.md'));
        }

        games.push(meta);
      }
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ success: true, games });
}
