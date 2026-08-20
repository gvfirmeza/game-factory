import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  const gameDir = path.join(process.cwd(), 'games', id);

  if (!fs.existsSync(gameDir)) {
    return res.status(404).json({ success: false, error: 'Game not found' });
  }

  const readDoc = (fileName) => {
    const p = path.join(gameDir, fileName);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };

  const metaPath = path.join(gameDir, 'metadata.json');
  let meta = { id };
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

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(responseData);
}
