#!/usr/bin/env node
/**
 * ============================================================================
 * AI GAME FACTORY — 11-STAGE AUTONOMOUS PIPELINE ORCHESTRATOR
 * State machine manager enforcing quality gates, regression loops, and budgets
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const gameId = process.argv[2] || 'meadowbound';
const baseDir = process.cwd();
const gameDir = path.join(baseDir, 'games', gameId);

console.log('======================================================');
console.log(`🏭 [PIPELINE ORCHESTRATOR] Autonomous Studio Pipeline: ${gameId}`);
console.log('======================================================\n');

export const PipelineStages = [
  'DESIGN',
  'ART_AND_TECH',
  'IMPLEMENT',
  'STATIC_VALIDATION',
  'RUNTIME_TEST',
  'BUG_TRIAGE',
  'POLISH',
  'PLAYGAMA_QA',
  'FINAL_REVIEW',
  'BUILD_RELEASE'
];

class PipelineOrchestrator {
  constructor(gameId) {
    this.gameId = gameId;
    this.gameDir = path.join(baseDir, 'games', gameId);
    this.tracePath = path.join(this.gameDir, 'execution-trace.json');
    this.metaPath = path.join(this.gameDir, 'metadata.json');
  }

  runCommand(cmd, stageName) {
    console.log(`\n▶ [STAGE: ${stageName}] Running: ${cmd}`);
    try {
      const output = execSync(cmd, { cwd: baseDir, encoding: 'utf8', stdio: 'pipe' });
      console.log(output);
      return { success: true, output };
    } catch (e) {
      console.error(`✗ [STAGE FAILED: ${stageName}] ${e.message}`);
      if (e.stdout) console.log(e.stdout);
      if (e.stderr) console.error(e.stderr);
      return { success: false, error: e.message };
    }
  }

  execute() {
    if (!fs.existsSync(this.gameDir)) {
      console.error(`Error: Game directory does not exist at ${this.gameDir}`);
      process.exit(1);
    }

    console.log(`1. Validating Design & Contract Artifacts...`);
    const designPath = path.join(this.gameDir, 'game-design.md');
    const contractPath = path.join(this.gameDir, 'content-requirements.json');
    if (!fs.existsSync(designPath) || !fs.existsSync(contractPath)) {
      console.error('✗ Missing game-design.md or content-requirements.json');
      process.exit(1);
    }
    console.log('✓ Design & Contract artifacts present.');

    console.log(`\n2. Running Static Quality Gate...`);
    const staticRes = this.runCommand(`node scripts/validate-static.js ${this.gameId}`, 'STATIC_VALIDATION');
    if (!staticRes.success) {
      console.error('✗ Static quality gate failed. Blocking pipeline.');
      process.exit(1);
    }

    console.log(`\n3. Running Empirical Runtime Test Harness...`);
    const runtimeRes = this.runCommand(`node scripts/test-game.js ${this.gameId}`, 'RUNTIME_TEST');
    if (!runtimeRes.success) {
      console.error('✗ Runtime testing failed. Routing to Debugger.');
      process.exit(1);
    }

    console.log(`\n4. Running Bug Triage & Quality Budget Evaluation...`);
    const triageRes = this.runCommand(`node scripts/triage-bugs.js ${this.gameId}`, 'BUG_TRIAGE');
    if (!triageRes.success) {
      console.error('✗ Quality budget exceeded. Blocking release.');
      process.exit(1);
    }

    console.log(`\n5. Running Playgama Publishing QA & Manifest Validation...`);
    const playgamaRes = this.runCommand(`node scripts/validate-playgama.js ${this.gameId}`, 'PLAYGAMA_QA');
    if (!playgamaRes.success) {
      console.error('✗ Playgama platform validation failed.');
      process.exit(1);
    }

    console.log(`\n6. Running Build & Standalone Distribution Packaging...`);
    const buildRes = this.runCommand(`node scripts/build-game.js ${this.gameId}`, 'BUILD_RELEASE');
    if (!buildRes.success) {
      console.error('✗ Build packaging failed.');
      process.exit(1);
    }

    console.log('\n======================================================');
    console.log(`🎉 [PIPELINE SUCCESS] ${this.gameId} cleared all Quality Gates!`);
    console.log('======================================================\n');
  }
}

const orchestrator = new PipelineOrchestrator(gameId);
orchestrator.execute();
