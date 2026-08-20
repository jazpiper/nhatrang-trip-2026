/**
 * ============================================================================
 * Nha Trang Trip 2026 - Shared Test Harness
 * File: test-harness.js
 * ============================================================================
 *
 * Common denominator extracted from the TestRunner classes duplicated across
 * test-activity.js, test-gourmet.js, test-stays.js, test-spa.js,
 * test-shopping.js and test-currency.js. Those six files shared an identical
 * constructor/suite()/test() implementation and only diverged in:
 *   - a few summary() strings (header title, failure header, failure footer,
 *     success message) — some of which need the live totalSuites/failedTests
 *     count baked in, so those options may be a plain string OR a function
 *     that receives the count.
 *   - whether summary() calls process.exit() itself (shopping, currency) or
 *     returns a boolean and lets the caller decide (activity, gourmet, stays,
 *     spa) — preserved via the exitOnFailure/exitOnSuccess options so every
 *     call site keeps its original console output AND exit code.
 *
 * test-guide.js's TestRunner is NOT folded in here: it accumulates errors as
 * `{ suite, description, error }` (not `{ description, message, stack }`),
 * renders a differently-shaped summary block, and always calls process.exit()
 * with no boolean return — a genuine difference in aggregation/reporting, not
 * just wording, so it stays standalone per file (still uses the shared
 * `colors` table below).
 * ============================================================================
 */

// Terminal ANSI styling. Superset of every per-file `colors` object that
// existed before this extraction (some files only declared a 6-key subset);
// every file only ever referenced bright/cyan/green/red/reset/yellow, so the
// unused extra keys here are inert for all of them.
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const assert = require('assert');

class TestRunner {
  constructor(options = {}) {
    this.totalSuites = 0;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.errors = [];
    this.startTime = Date.now();

    // summary() text. `failureHeader` and `successMessage` may be a plain
    // string or a function(count) for the call sites that bake a live count
    // into the message (e.g. Currency's "Failures & Discrepancies Detected
    // (${n}):" or Shopping's "All ${totalSuites} Shopping Test Suites...").
    this.summaryTitle = options.summaryTitle || 'Test Execution Summary';
    this.failureHeader = options.failureHeader || 'Failures Detected:';
    this.failureFooter = options.failureFooter || 'Test Suite Failed.';
    this.successMessage = options.successMessage || '✨ All Test Suites Passed Successfully!';

    // Some call sites exit the process from inside summary() instead of
    // returning a boolean for the caller to act on. Default to the
    // return-a-boolean behavior since it's the more common shape.
    this.exitOnFailure = !!options.exitOnFailure;
    this.exitOnSuccess = !!options.exitOnSuccess;
  }

  suite(name) {
    this.totalSuites++;
    console.log(`\n${colors.bright}${colors.cyan}=== Suite ${this.totalSuites}: ${name} ===${colors.reset}`);
  }

  test(description, fn) {
    this.totalTests++;
    try {
      fn();
      this.passedTests++;
      console.log(`  ${colors.green}✔ PASS:${colors.reset} ${description}`);
    } catch (err) {
      this.failedTests++;
      console.log(`  ${colors.red}✖ FAIL:${colors.reset} ${description}`);
      console.log(`    ${colors.yellow}Error: ${err.message}${colors.reset}`);
      this.errors.push({ description, message: err.message, stack: err.stack });
    }
  }

  // Convenience assertions used by test-currency.js. Harmless additions for
  // every other file, which never call them.
  assertEqual(actual, expected, message) {
    assert.strictEqual(actual, expected, message);
  }

  assertTrue(value, message) {
    assert.strictEqual(value, true, message);
  }

  assertTruthy(value, message) {
    assert.ok(value, message);
  }

  assertFalse(value, message) {
    assert.strictEqual(value, false, message);
  }

  assertIncludes(haystack, needle, message) {
    assert.ok(haystack.includes(needle), message || `Expected '${haystack}' to include '${needle}'`);
  }

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log(`\n${colors.bright}====================================================${colors.reset}`);
    console.log(`${colors.bright}${this.summaryTitle} (${duration}s)${colors.reset}`);
    console.log(`====================================================`);
    console.log(`Suites Run:    ${this.totalSuites}`);
    console.log(`Total Tests:   ${this.totalTests}`);
    console.log(`Passed Tests:  ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`Failed Tests:  ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);

    if (this.failedTests > 0) {
      const header = typeof this.failureHeader === 'function' ? this.failureHeader(this.failedTests) : this.failureHeader;
      console.log(`\n${colors.red}${colors.bright}${header}${colors.reset}`);
      this.errors.forEach((err, idx) => {
        console.log(`\n  ${idx + 1}) ${colors.red}${err.description}${colors.reset}`);
        console.log(`     ${err.message}`);
      });
      console.log(`\n${colors.red}❌ ${this.failureFooter}${colors.reset}\n`);
      if (this.exitOnFailure) {
        process.exit(1);
      }
      return false;
    } else {
      const msg = typeof this.successMessage === 'function' ? this.successMessage(this.totalSuites) : this.successMessage;
      console.log(`\n${colors.green}${colors.bright}${msg}${colors.reset}\n`);
      if (this.exitOnSuccess) {
        process.exit(0);
      }
      return true;
    }
  }
}

module.exports = { TestRunner, colors };
