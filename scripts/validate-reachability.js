import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ReachabilityValidator } from '../engine/level/ReachabilityValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const gameId = process.argv[2];
if (!gameId) {
  console.error('Usage: node scripts/validate-reachability.js <game-id>');
  process.exit(1);
}

const gameDir = path.join(rootDir, 'games', gameId);
if (!fs.existsSync(gameDir)) {
  console.error(`Error: Game directory not found at ${gameDir}`);
  process.exit(1);
}

console.log('======================================================');
console.log(`📐 [REACHABILITY VALIDATOR] Auditing Geometry: ${gameId}`);
console.log('======================================================\n');

// 1. Check for game-contract.json to extract kinematics
let kinematics = {
  maxRunSpeed: 200,
  jumpImpulse: -390,
  jumpCutVelocity: -140,
  gravity: 980,
  dashSpeed: 450,
  dashDuration: 0.18
};

const contractPath = path.join(gameDir, 'game-contract.json');
if (fs.existsSync(contractPath)) {
  try {
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    if (contract.kinematics) {
      kinematics = { ...kinematics, ...contract.kinematics };
    }
  } catch (e) {
    console.warn(`Warning: Could not parse game-contract.json: ${e.message}`);
  }
}

const validator = new ReachabilityValidator(kinematics);

console.log('Kinematic Reach Profile:');
console.log(`- Max Ballistic Jump Height: ${validator.maxBallisticJumpHeight.toFixed(1)}px (Safe limit: ${validator.safeMaxJumpHeight.toFixed(1)}px)`);
console.log(`- Max Horizontal Jump: ${validator.maxHorizontalJumpReach.toFixed(1)}px (Safe limit: ${validator.safeMaxHorizontalJump.toFixed(1)}px)`);
console.log(`- Max Horizontal With Dash: ${validator.maxHorizontalWithDash.toFixed(1)}px (Safe limit: ${validator.safeMaxHorizontalWithDash.toFixed(1)}px)\n`);

// 2. Check for level-graph.json
const graphPath = path.join(gameDir, 'level-graph.json');
let levelsToAudit = [];

if (fs.existsSync(graphPath)) {
  try {
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    levelsToAudit = Array.isArray(graph) ? graph : (graph.levels || graph.rooms || [graph]);
  } catch (e) {
    console.error(`Error reading level-graph.json: ${e.message}`);
    process.exit(1);
  }
}

let totalErrors = 0;

if (levelsToAudit.length > 0) {
  console.log(`Auditing ${levelsToAudit.length} level graphs...`);
  for (const lvl of levelsToAudit) {
    const audit = validator.auditLevel(lvl, { hasDash: true });
    console.log(`\n--- Level: ${audit.levelName} (Platforms: ${audit.platformsAudited}, Collectibles: ${audit.collectiblesAudited}, Enemies: ${audit.enemiesAudited}) ---`);
    if (!audit.passed) {
      totalErrors += audit.traversalErrors.length + audit.placementErrors.length + audit.encounterErrors.length;
      audit.traversalErrors.forEach(err => console.error(`❌ [TRAVERSAL ERROR] ${err}`));
      audit.placementErrors.forEach(err => console.error(`❌ [PLACEMENT ERROR] ${err}`));
      audit.encounterErrors.forEach(err => console.error(`❌ [ENCOUNTER ERROR] ${err}`));
    } else {
      console.log(`✓ All geometry, placements, and encounters verified reachable and safe.`);
    }
  }
} else {
  console.log('✓ Kinematic validation model ready for level design graph inspection.');
}

console.log('\n======================================================');
if (totalErrors === 0) {
  console.log('🎉 [REACHABILITY VALIDATION PASSED] 0 Geometry Defects');
  console.log('======================================================');
  process.exit(0);
} else {
  console.error(`❌ [REACHABILITY VALIDATION FAILED] ${totalErrors} Geometry Defect(s) Found`);
  console.log('======================================================');
  process.exit(1);
}
