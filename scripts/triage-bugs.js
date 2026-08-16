#!/usr/bin/env node
/**
 * ============================================================================
 * AI GAME FACTORY — STRUCTURED BUG TRIAGE & QUALITY BUDGET SYSTEM
 * Formats defects, categorizes severity, and enforces zero-tolerance quality gates
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

export const BugSeverity = {
  CRITICAL: 'CRITICAL',   // Game crash, black screen, infinite freeze, fatal error
  BLOCKING: 'BLOCKING',   // Soft-lock, inability to reach objective, broken checkpoint/death
  MAJOR: 'MAJOR',         // Flying enemies, dialogue bleed/overlap, broken attacks, wrong controls
  MINOR: 'MINOR',         // Subtle timing glitch, non-blocking visual artifact
  COSMETIC: 'COSMETIC'    // Typo, slight color inconsistency
};

export class BugTriager {
  constructor(gameId) {
    this.gameId = gameId;
    this.bugs = [];
  }

  addBug({ id, severity, category, component, description, evidence, expected, actual, fixRouting }) {
    this.bugs.push({
      id: id || `BUG-${String(this.bugs.length + 1).padStart(3, '0')}`,
      severity: severity || BugSeverity.MAJOR,
      category: category || 'Gameplay',
      component: component || 'Core',
      description,
      evidence: evidence || 'Runtime simulation trace',
      expected: expected || 'Normal behavior',
      actual: actual || 'Defective behavior',
      fixRouting: fixRouting || 'debugger',
      status: 'OPEN',
      timestamp: new Date().toISOString()
    });
  }

  evaluateQualityBudget() {
    const criticalCount = this.bugs.filter(b => b.severity === BugSeverity.CRITICAL).length;
    const blockingCount = this.bugs.filter(b => b.severity === BugSeverity.BLOCKING).length;
    const majorCount = this.bugs.filter(b => b.severity === BugSeverity.MAJOR).length;
    const minorCount = this.bugs.filter(b => b.severity === BugSeverity.MINOR).length;
    const cosmeticCount = this.bugs.filter(b => b.severity === BugSeverity.COSMETIC).length;

    // Quality Budget: CRITICAL = 0, BLOCKING = 0, MAJOR = 0
    const passesQualityBudget = criticalCount === 0 && blockingCount === 0 && majorCount === 0;

    return {
      passed: passesQualityBudget,
      counts: {
        total: this.bugs.length,
        critical: criticalCount,
        blocking: blockingCount,
        major: majorCount,
        minor: minorCount,
        cosmetic: cosmeticCount
      }
    };
  }

  generateReportMarkdown() {
    const budget = this.evaluateQualityBudget();
    let md = `# Structured Bug Triage & Quality Budget Report: ${this.gameId}\n\n`;
    md += `**Timestamp:** ${new Date().toISOString()}\n`;
    md += `**Quality Budget Status:** ${budget.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    md += `### Bug Severity Summary\n`;
    md += `| Severity | Count | Allowed Budget | Status |\n`;
    md += `| :--- | :---: | :---: | :---: |\n`;
    md += `| **CRITICAL** | ${budget.counts.critical} | 0 | ${budget.counts.critical === 0 ? '✅ PASS' : '❌ FAIL'} |\n`;
    md += `| **BLOCKING** | ${budget.counts.blocking} | 0 | ${budget.counts.blocking === 0 ? '✅ PASS' : '❌ FAIL'} |\n`;
    md += `| **MAJOR** | ${budget.counts.major} | 0 | ${budget.counts.major === 0 ? '✅ PASS' : '❌ FAIL'} |\n`;
    md += `| **MINOR** | ${budget.counts.minor} | <= 3 | ${budget.counts.minor <= 3 ? '✅ PASS' : '⚠️ WARN'} |\n`;
    md += `| **COSMETIC** | ${budget.counts.cosmetic} | <= 5 | ${budget.counts.cosmetic <= 5 ? '✅ PASS' : '⚠️ WARN'} |\n\n`;

    if (this.bugs.length === 0) {
      md += `### Bug Inventory\n*Zero defects discovered. Release candidate approved.*\n`;
    } else {
      md += `### Bug Inventory\n\n`;
      for (const bug of this.bugs) {
        md += `#### [${bug.id}] [${bug.severity}] ${bug.description}\n`;
        md += `- **Component:** ${bug.component} (${bug.category})\n`;
        md += `- **Actual:** ${bug.actual}\n`;
        md += `- **Expected:** ${bug.expected}\n`;
        md += `- **Evidence:** ${bug.evidence}\n`;
        md += `- **Fix Routing:** \`${bug.fixRouting}\`\n\n`;
      }
    }
    return md;
  }
}

// CLI Execution Support
if (process.argv[1] && process.argv[1].endsWith('triage-bugs.js')) {
  const gameId = process.argv[2] || 'meadowbound';
  const triager = new BugTriager(gameId);
  const report = triager.generateReportMarkdown();
  console.log(report);
  const budget = triager.evaluateQualityBudget();
  process.exit(budget.passed ? 0 : 1);
}
