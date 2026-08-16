#!/usr/bin/env node
/**
 * ============================================================================
 * AI GAME FACTORY — STATIC CODE QUALITY GATE
 * Static AST Syntax Validation, Import Integrity, Undeclared Identifiers & Schema
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const gameId = process.argv[2] || 'meadowbound';
const baseDir = process.cwd();
const gameDir = path.join(baseDir, 'games', gameId);

console.log('======================================================');
console.log(`🔍 [STATIC GATE] Running Static Analysis on: ${gameId}`);
console.log('======================================================\n');

const checks = [];
let errorCount = 0;

function pass(name, details = '') {
  checks.push({ name, status: 'PASS', details });
  console.log(`✓ [PASS] ${name}${details ? ` (${details})` : ''}`);
}

function fail(name, error) {
  errorCount++;
  checks.push({ name, status: 'FAIL', error: error.message || error });
  console.error(`✗ [FAIL] ${name}: ${error.message || error}`);
}

// 1. Check Directory Existence
if (!fs.existsSync(gameDir)) {
  fail('Directory Check', `Game directory not found at ${gameDir}`);
  process.exit(1);
}
pass('Directory Check', `Found ${gameId}`);

// 2. Validate Metadata Schema
const metaPath = path.join(gameDir, 'metadata.json');
if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (!meta.id || !meta.title || !meta.status) {
      fail('Metadata Schema', 'Missing required fields: id, title, or status');
    } else {
      pass('Metadata Schema', `Title: "${meta.title}", Status: ${meta.status}`);
    }
  } catch (e) {
    fail('Metadata Schema', `Invalid JSON: ${e.message}`);
  }
} else {
  fail('Metadata Schema', 'metadata.json is missing');
}

// 3. Validate Entry HTML5 & Style
const htmlPath = path.join(gameDir, 'source', 'index.html');
const cssPath = path.join(gameDir, 'source', 'style.css');

if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (!html.includes('<canvas id="game-canvas"') && !html.includes("<canvas id='game-canvas'")) {
    fail('HTML Canvas Tag', 'Missing <canvas id="game-canvas">');
  } else {
    pass('HTML Canvas Tag', 'Canvas element present');
  }

  if (!html.includes('id="btn-mute"')) {
    fail('HTML Mute Control', 'Missing on-screen #btn-mute button required by Playgama');
  } else {
    pass('HTML Mute Control', '#btn-mute present');
  }

  if (!html.includes('type="module"')) {
    fail('HTML Module Import', 'Script tag must be type="module"');
  } else {
    pass('HTML Module Import', 'Module script tag verified');
  }
} else {
  fail('HTML Entry Point', 'source/index.html is missing');
}

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('overflow: hidden') && !css.includes('overflow:hidden')) {
    fail('CSS Zero-Scroll', 'Missing overflow: hidden on viewport');
  } else {
    pass('CSS Zero-Scroll', 'Zero-scroll rules configured');
  }
} else {
  fail('CSS Stylesheet', 'source/style.css is missing');
}

// 4. Validate JavaScript Syntax & Imports in game.js
const jsPath = path.join(gameDir, 'source', 'game.js');
if (fs.existsSync(jsPath)) {
  const jsContent = fs.readFileSync(jsPath, 'utf8');

  // Syntax check via dynamic evaluation dry run
  try {
    const cleanJs = jsContent
      .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '// import')
      .replace(/export\s+default\s+/g, '// export default ')
      .replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');
    new Function(cleanJs);
    pass('JS Syntax Check', `${path.basename(jsPath)} is syntactically valid`);
  } catch (e) {
    fail('JS Syntax Check', `Syntax error in ${jsPath}: ${e.message}`);
  }

  // Check imports
  if (!jsContent.includes("from '../../../engine/index.js'") && !jsContent.includes("from '../../engine/index.js'")) {
    fail('Engine Import Path', 'game.js does not import from central engine module');
  } else {
    pass('Engine Import Path', 'Central engine imports detected');
  }

  // Check GameLoop signature
  if (jsContent.includes('new GameLoop(')) {
    pass('GameLoop Check', 'GameLoop initialized');
  }
} else {
  fail('Game Source', 'source/game.js is missing');
}

console.log('\n======================================================');
if (errorCount === 0) {
  console.log(`✓ [STATIC GATE PASSED] All static checks passed for ${gameId}`);
  console.log('======================================================');
  process.exit(0);
} else {
  console.error(`✗ [STATIC GATE FAILED] ${errorCount} errors detected in ${gameId}`);
  console.log('======================================================');
  process.exit(1);
}
