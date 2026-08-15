import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * AI Game Factory Pipeline CLI Runner
 * Orchestrates the full lifecycle of a game concept through the state machine.
 */
async function runPipeline(gameId, conceptPrompt) {
  if (!gameId) {
    console.error('Usage: node scripts/run-pipeline.js <game-id> "[concept prompt]"');
    process.exit(1);
  }

  const gameDir = path.join(rootDir, 'games', gameId);
  const metadataPath = path.join(gameDir, 'metadata.json');

  console.log(`\n======================================================`);
  console.log(`🚀 [PIPELINE] Starting AI Game Factory for: ${gameId}`);
  console.log(`======================================================\n`);

  // Ensure game directory structure exists
  const subdirs = ['source', 'screenshots', 'reports', 'build'];
  for (const dir of subdirs) {
    fs.mkdirSync(path.join(gameDir, dir), { recursive: true });
  }

  // Update State: IDEA / DESIGNING
  let meta = {
    id: gameId,
    title: gameId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: conceptPrompt || 'An autonomous arcade game.',
    genre: 'arcade',
    version: '0.1.0',
    status: 'designing',
    orientation: 'portrait',
    pipeline: {
      design: 'in_progress',
      art: 'pending',
      technical: 'pending',
      implementation: 'pending',
      playtest: 'pending',
      polish: 'pending',
      review: 'pending',
      build: 'pending'
    }
  };

  fs.writeFileSync(metadataPath, JSON.stringify(meta, null, 2), 'utf8');
  console.log(`✓ [PRODUCER] Initialized workspace and metadata state machine.`);

  // Write initial brief if concept provided
  const briefPath = path.join(gameDir, 'game-brief.md');
  if (!fs.existsSync(briefPath)) {
    fs.writeFileSync(
      briefPath,
      `# Game Brief: ${meta.title}\n\n## Concept\n${conceptPrompt || 'Cross-street arcade action.'}\n`,
      'utf8'
    );
    console.log(`✓ [PRODUCER] Generated game-brief.md`);
  }

  console.log(`\nSpecialized Agent Pipeline Ready. You can invoke subagents or run build:`);
  console.log(`1. game-designer -> game-design.md`);
  console.log(`2. art-director -> art-direction.md + asset-manifest.json`);
  console.log(`3. technical-director -> technical-plan.md`);
  console.log(`4. builder -> source/index.html + source/game.js`);
  console.log(`5. playtester -> reports/playtest-01.md`);
  console.log(`6. polisher -> juice injection`);
  console.log(`7. final-reviewer -> reports/review-01.md`);
  console.log(`8. build-publisher -> node scripts/build-game.js ${gameId}\n`);
}

const args = process.argv.slice(2);
runPipeline(args[0], args[1]);
