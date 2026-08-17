import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const gameId = process.argv[2];
if (!gameId) {
  console.error('Usage: node scripts/validate-design.js <game-id>');
  process.exit(1);
}

const gameDir = path.join(rootDir, 'games', gameId);
if (!fs.existsSync(gameDir)) {
  console.error(`Error: Game directory not found at ${gameDir}`);
  process.exit(1);
}

console.log('======================================================');
console.log(`🎯 [DESIGN VALIDATOR] Auditing Design Intent: ${gameId}`);
console.log('======================================================\n');

const checks = [];
let passCount = 0;

function check(description, pass, details = '') {
  checks.push({ description, pass, details });
  if (pass) {
    passCount++;
    console.log(`✓ [PASS] ${description}`);
  } else {
    console.error(`❌ [FAIL] ${description} ${details ? `(${details})` : ''}`);
  }
}

// 1. game-design-intent.md verification
const intentPath = path.join(gameDir, 'game-design-intent.md');
if (fs.existsSync(intentPath)) {
  const content = fs.readFileSync(intentPath, 'utf8');
  check('Game Design Intent document exists', true);
  check('Core Experience defined', /Core Experience/i.test(content));
  check('Core Gameplay Loop defined', /Core (Gameplay )?Loop/i.test(content));
  check('Primary Player Verb defined', /Primary (Player )?Verb/i.test(content));
  check('Mechanic Purpose Contract present', /Mechanic Purpose Contract|PURPOSE/i.test(content));
  check('Player Learning Progression present', /First 30 Seconds|Player Learning/i.test(content));
} else {
  // If game-design.md exists with these sections, accept as legacy compatibility with warning
  const designPath = path.join(gameDir, 'game-design.md');
  if (fs.existsSync(designPath)) {
    const content = fs.readFileSync(designPath, 'utf8');
    check('Game Design document exists', true);
    check('Core Loop & Mechanics defined in game-design.md', /Core Loop|Mechanics/i.test(content));
    check('Kinematics defined in game-design.md', /Kinematics|Jump|Speed/i.test(content));
  } else {
    check('Game Design Intent document exists', false, 'Missing game-design-intent.md or game-design.md');
  }
}

// 2. game-contract.json verification
const contractPath = path.join(gameDir, 'game-contract.json');
if (fs.existsSync(contractPath)) {
  try {
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    check('Game Contract exists and is valid JSON', true);
    check('Kinematics defined in contract', !!(contract.kinematics && contract.kinematics.maxRunSpeed));
    check('Controls defined in contract', !!(contract.controls && contract.controls.jump));
    check('Rules defined in contract', !!contract.rules);
  } catch (e) {
    check('Game Contract is valid JSON', false, e.message);
  }
} else {
  check('Game Contract exists', false, 'Missing game-contract.json');
}

// 3. content-requirements.json verification
const contentPath = path.join(gameDir, 'content-requirements.json');
if (fs.existsSync(contentPath)) {
  try {
    const reqs = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    check('Content Requirements exists and is valid JSON', true);
    check('Target Rooms / Levels budget defined', !!(reqs.world || reqs.levels || reqs.rooms));
  } catch (e) {
    check('Content Requirements is valid JSON', false, e.message);
  }
} else {
  check('Content Requirements exists', false, 'Missing content-requirements.json');
}

console.log('\n======================================================');
const totalChecks = checks.length;
const passed = passCount === totalChecks;

if (passed) {
  console.log(`🎉 [DESIGN VALIDATION PASSED] ${passCount}/${totalChecks} Design Gates Verified`);
  console.log('======================================================');
  process.exit(0);
} else {
  console.error(`❌ [DESIGN VALIDATION FAILED] ${totalChecks - passCount} Failed Design Gate(s)`);
  console.log('======================================================');
  process.exit(1);
}
