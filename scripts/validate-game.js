import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function validateGame(gameId) {
  if (!gameId) {
    console.error('Error: Please specify a game ID. Example: node scripts/validate-game.js tiny-road');
    process.exit(1);
  }

  const gameDir = path.join(rootDir, 'games', gameId);
  console.log(`\n--- Validating Game: ${gameId} ---`);

  const checks = [
    { name: 'Metadata file (metadata.json)', path: path.join(gameDir, 'metadata.json'), required: true },
    { name: 'Game brief (game-brief.md)', path: path.join(gameDir, 'game-brief.md'), required: true },
    { name: 'Game design (game-design.md)', path: path.join(gameDir, 'game-design.md'), required: true },
    { name: 'Art direction (art-direction.md)', path: path.join(gameDir, 'art-direction.md'), required: true },
    { name: 'Technical plan (technical-plan.md)', path: path.join(gameDir, 'technical-plan.md'), required: true },
    { name: 'Source directory', path: path.join(gameDir, 'source'), required: true },
    { name: 'Source index.html', path: path.join(gameDir, 'source', 'index.html'), required: true },
    { name: 'Production ZIP', path: path.join(gameDir, 'build', `${gameId}.zip`), required: false }
  ];

  let passed = true;
  for (const check of checks) {
    const exists = fs.existsSync(check.path);
    if (exists) {
      console.log(`✓ ${check.name}`);
    } else if (check.required) {
      console.error(`✗ MISSING REQUIRED: ${check.name} (${check.path})`);
      passed = false;
    } else {
      console.warn(`! PENDING: ${check.name}`);
    }
  }

  if (!passed) {
    console.error('\nValidation Failed.');
    process.exit(1);
  } else {
    console.log('\nAll required structural checks passed!\n');
  }
}

const gameArg = process.argv[2];
validateGame(gameArg);
