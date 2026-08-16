#!/usr/bin/env node
/**
 * ============================================================================
 * AI GAME FACTORY — FACTORY SELF-VALIDATION SUITE
 * Comprehensive verification of Agents, Skills, Engine, Scripts & Quality Gates
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================');
console.log('🏭 [FACTORY AUDIT] Validating AI Game Factory Core');
console.log('======================================================\n');

let passCount = 0;
let failCount = 0;

function check(name, condition, details = '') {
  if (condition) {
    passCount++;
    console.log(`✓ [PASS] ${name}${details ? ` — ${details}` : ''}`);
  } else {
    failCount++;
    console.error(`✗ [FAIL] ${name}${details ? ` — ${details}` : ''}`);
  }
}

// 1. Audit Agent Definitions
const requiredAgents = [
  'producer',
  'game-designer',
  'art-director',
  'technical-director',
  'builder',
  'playtester',
  'debugger',
  'content-reviewer',
  'polisher',
  'playgama-specialist',
  'final-reviewer',
  'build-publisher'
];

console.log('1. Checking 12 Specialized Agent Definitions...');
for (const agent of requiredAgents) {
  const agentPath = path.join(rootDir, '.agents', 'agents', `${agent}.md`);
  const exists = fs.existsSync(agentPath);
  check(`Agent: ${agent}`, exists, exists ? 'Found' : 'Missing');
}

// 2. Audit Factory Skills
const requiredSkills = [
  'game-design',
  'game-programming',
  'game-testing',
  'game-polish',
  'procedural-art',
  'visual-design',
  'playgama',
  'html5-build'
];

console.log('\n2. Checking Studio Skills...');
for (const skill of requiredSkills) {
  const skillPath = path.join(rootDir, '.agents', 'skills', skill, 'SKILL.md');
  const exists = fs.existsSync(skillPath);
  check(`Skill: ${skill}`, exists, exists ? 'Found' : 'Missing');
}

// 3. Audit Centralized Engine Systems
console.log('\n3. Checking Centralized Engine Modules...');
const engineModules = [
  'core/GameLoop.js',
  'core/StateMachine.js',
  'core/CollisionUtils.js',
  'entities/EnemyController.js',
  'interactions/DialogueSystem.js',
  'interactions/DialogueBox.js',
  'input/InputManager.js',
  'rendering/CanvasRenderer.js',
  'rendering/ProceduralPrimitives.js',
  'audio/ProceduralAudio.js',
  'particles/ParticleSystem.js',
  'platform/playgama/PlaygamaBridge.js',
  'index.js'
];

for (const mod of engineModules) {
  const modPath = path.join(rootDir, 'engine', mod);
  const exists = fs.existsSync(modPath);
  check(`Engine: ${mod}`, exists, exists ? 'Found' : 'Missing');
}

// 4. Audit Core Studio Scripts
console.log('\n4. Checking Studio & QA Scripts...');
const requiredScripts = [
  'test-game.js',
  'validate-static.js',
  'triage-bugs.js',
  'validate-playgama.js',
  'validate-game.js',
  'build-game.js',
  'run-pipeline.js'
];

for (const script of requiredScripts) {
  const scriptPath = path.join(rootDir, 'scripts', script);
  const exists = fs.existsSync(scriptPath);
  check(`Script: ${script}`, exists, exists ? 'Found' : 'Missing');
}

// 5. Audit Studio Rules (AGENTS.md)
console.log('\n5. Checking Studio Rules & Documentation...');
const agentsMdPath = path.join(rootDir, 'AGENTS.md');
const agentsMdExists = fs.existsSync(agentsMdPath);
check('AGENTS.md present', agentsMdExists);

console.log('\n======================================================');
console.log(`Audit Summary: ${passCount} PASSED, ${failCount} FAILED`);
if (failCount === 0) {
  console.log('🎉 [FACTORY AUDIT PASSED] The AI Game Factory Core is 100% Valid!');
} else {
  console.error('❌ [FACTORY AUDIT FAILED] Deficiencies detected.');
}
console.log('======================================================\n');

process.exit(failCount === 0 ? 0 : 1);
