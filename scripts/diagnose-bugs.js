import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function diagnose() {
  console.log('=== FORENSIC DIAGNOSIS ===\n');

  const gameJsPath = path.join(rootDir, 'games', 'grove-odyssey', 'source', 'game.js');
  const gameJs = fs.readFileSync(gameJsPath, 'utf8');

  // 1. ENEMY MOVEMENT DIAGNOSIS
  console.log('--- Diagnosing Enemy Movement ---');
  // Check thorn_beetle charge code
  const beetleSection = gameJs.slice(gameJs.indexOf("enemy.type === 'thorn_beetle'"), gameJs.indexOf("enemy.type === 'thorn_beetle'") + 1000);
  console.log('Beetle logic snippet:\n', beetleSection);

  // Check slime logic
  const slimeSection = gameJs.slice(gameJs.indexOf("enemy.type === 'bramble_slime'"), gameJs.indexOf("enemy.type === 'bramble_slime'") + 1000);
  console.log('Slime logic snippet:\n', slimeSection);

  // 2. DIALOGUE SYSTEM DIAGNOSIS
  console.log('\n--- Diagnosing Dialogue Box Overwriting ---');
  const dialogueBoxPath = path.join(rootDir, 'engine', 'interactions', 'DialogueBox.js');
  const dialogueJs = fs.readFileSync(dialogueBoxPath, 'utf8');
  console.log('DialogueBox.render snippet:\n', dialogueJs.slice(dialogueJs.indexOf('render(ctx)'), dialogueJs.indexOf('render(ctx)') + 1200));

}

diagnose();
