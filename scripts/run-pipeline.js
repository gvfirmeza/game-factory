#!/usr/bin/env node
/**
 * ============================================================================
 * AI GAME FACTORY — 15-STAGE DESIGN-FIRST AUTONOMOUS PIPELINE ORCHESTRATOR
 * State machine manager enforcing Design Gates, Reachability, Quality Budgets, and Playgama
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const gameId = process.argv[2] || 'tidebound';
const baseDir = process.cwd();
const gameDir = path.join(baseDir, 'games', gameId);

console.log('======================================================');
console.log(`🏭 [PIPELINE ORCHESTRATOR] Design-First Studio Pipeline: ${gameId}`);
console.log('======================================================\n');

export const PipelineStages = [
  'DESIGN_INTENT',
  'LEVEL_GRAPH',
  'DESIGN_REVIEW',
  'REACHABILITY_GATE',
  'ART_AND_TECH',
  'IMPLEMENT',
  'STATIC_VALIDATION',
  'LEVEL_VALIDATION',
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

    console.log(`1. Running Pre-Build Design Intent & Mechanic Contract Gate...`);
    const designRes = this.runCommand(`node scripts/validate-design.js ${this.gameId}`, 'DESIGN_REVIEW');
    if (!designRes.success) {
      console.error('✗ Pre-build design intent validation failed. Blocking implementation.');
      process.exit(1);
    }

    console.log(`\n2. Running Mathematical Reachability & Traversal Gate...`);
    const reachRes = this.runCommand(`node scripts/validate-reachability.js ${this.gameId}`, 'REACHABILITY_GATE');
    if (!reachRes.success) {
      console.error('✗ Reachability validation failed. Blocking implementation.');
      process.exit(1);
    }

    console.log(`\n3. Running Static Quality Gate...`);
    const staticRes = this.runCommand(`node scripts/validate-static.js ${this.gameId}`, 'STATIC_VALIDATION');
    if (!staticRes.success) {
      console.error('✗ Static quality gate failed. Blocking pipeline.');
      process.exit(1);
    }

    console.log(`\n4. Running Empirical Runtime Test Harness...`);
    const runtimeRes = this.runCommand(`node scripts/test-game.js ${this.gameId}`, 'RUNTIME_TEST');
    if (!runtimeRes.success) {
      console.error('✗ Runtime testing failed. Routing to Debugger.');
      process.exit(1);
    }

    console.log(`\n5. Running Bug Triage & Quality Budget Evaluation...`);
    const triageRes = this.runCommand(`node scripts/triage-bugs.js ${this.gameId}`, 'BUG_TRIAGE');
    if (!triageRes.success) {
      console.error('✗ Quality budget exceeded. Blocking release.');
      process.exit(1);
    }

    console.log(`\n6. Running Playgama Publishing QA & Manifest Validation...`);
    const playgamaRes = this.runCommand(`node scripts/validate-playgama.js ${this.gameId}`, 'PLAYGAMA_QA');
    if (!playgamaRes.success) {
      console.error('✗ Playgama platform validation failed.');
      process.exit(1);
    }

    console.log(`\n7. Running Build & Standalone Distribution Packaging...`);
    const buildRes = this.runCommand(`node scripts/build-game.js ${this.gameId}`, 'BUILD_RELEASE');
    if (!buildRes.success) {
      console.error('✗ Build packaging failed.');
      process.exit(1);
    }

    console.log('\n======================================================');
    console.log(`🎉 [PIPELINE SUCCESS] ${this.gameId} cleared all Design & Runtime Quality Gates!`);
    console.log('======================================================\n');
  }
}

const orchestrator = new PipelineOrchestrator(gameId);
orchestrator.execute();
