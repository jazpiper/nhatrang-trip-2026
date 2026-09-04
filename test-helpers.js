/**
 * ============================================================================
 * Nha Trang Trip 2026 - Formatting & UI Helpers Unit Test Suite
 * File: test-helpers.js
 * ============================================================================
 *
 * Dedicated test suite verifying `formatVND` utility function behavior:
 * 1. Falsy/missing values (0, null, undefined, '', NaN, false)
 * 2. Positive numeric inputs (small, medium, large integers)
 * 3. String representations of numeric values
 * 4. Floating point numbers
 * 5. Negative numbers
 * ============================================================================
 */

const { TestRunner } = require('./test-harness.js');
const app = require('./js/app.js');

const runner = new TestRunner({
  summaryTitle: 'Formatting & UI Helpers Test Execution Summary',
  failureHeader: 'Helpers Test Suite Failures:',
  failureFooter: 'Helpers Test Suite Failed.',
  successMessage: (totalSuites) => `✨ All ${totalSuites} Formatting & UI Helpers Test Suites Passed Successfully!`,
  exitOnFailure: true,
  exitOnSuccess: true
});

runner.suite('formatVND Falsy and Missing Inputs');

runner.test('formatVND returns "0 VND" for 0', () => {
  runner.assertEqual(app.formatVND(0), '0 VND');
});

runner.test('formatVND returns "0 VND" for null', () => {
  runner.assertEqual(app.formatVND(null), '0 VND');
});

runner.test('formatVND returns "0 VND" for undefined', () => {
  runner.assertEqual(app.formatVND(undefined), '0 VND');
});

runner.test('formatVND returns "0 VND" for empty string', () => {
  runner.assertEqual(app.formatVND(''), '0 VND');
});

runner.test('formatVND returns "0 VND" for NaN', () => {
  runner.assertEqual(app.formatVND(NaN), '0 VND');
});

runner.test('formatVND returns "0 VND" for false', () => {
  runner.assertEqual(app.formatVND(false), '0 VND');
});

runner.suite('formatVND Valid Numeric Inputs');

runner.test('formatVND formats positive integer correctly (e.g. 1000)', () => {
  runner.assertEqual(app.formatVND(1000), (1000).toLocaleString() + ' VND');
});

runner.test('formatVND formats standard price correctly (e.g. 45000)', () => {
  runner.assertEqual(app.formatVND(45000), (45000).toLocaleString() + ' VND');
});

runner.test('formatVND formats large numbers correctly (e.g. 1000000)', () => {
  runner.assertEqual(app.formatVND(1000000), (1000000).toLocaleString() + ' VND');
});

runner.test('formatVND handles string number inputs correctly (e.g. "45000")', () => {
  runner.assertEqual(app.formatVND('45000'), (45000).toLocaleString() + ' VND');
  runner.assertEqual(app.formatVND('1000000'), (1000000).toLocaleString() + ' VND');
});

runner.test('formatVND handles floating point numbers correctly (e.g. 1234.56)', () => {
  runner.assertEqual(app.formatVND(1234.56), (1234.56).toLocaleString() + ' VND');
});

runner.test('formatVND handles negative numbers correctly (e.g. -5000)', () => {
  runner.assertEqual(app.formatVND(-5000), (-5000).toLocaleString() + ' VND');
});



runner.suite("copyTextToClipboard Helper Tests");

runner.test("copyTextToClipboard exists as exported function", () => {
  runner.assertEqual(typeof app.copyTextToClipboard, "function");
});

runner.test("copyTextToClipboard does nothing if text is empty or falsy", () => {
  let called = false;
  app.copyTextToClipboard("", () => { called = true; });
  app.copyTextToClipboard(null, () => { called = true; });
  runner.assertEqual(called, false);
});

runner.test("copyTextToClipboard invokes navigator.clipboard.writeText if available", async () => {
  let writtenText = null;
  let callbackCalled = false;

  // Backup navigator
  const origNav = global.navigator;
  global.navigator = {
    clipboard: {
      writeText: (txt) => {
        writtenText = txt;
        return Promise.resolve();
      }
    }
  };

  app.copyTextToClipboard("Hello World", () => { callbackCalled = true; });

  // wait for promise tick
  await new Promise(r => setTimeout(r, 10));

  runner.assertEqual(writtenText, "Hello World");
  runner.assertEqual(callbackCalled, true);

  // Restore navigator
  global.navigator = origNav;
});

runner.test("copyTextToClipboard falls back to fallbackCopy if writeText rejects", async () => {
  let callbackCalled = false;
  const origNav = global.navigator;
  const origDocument = global.document;

  global.navigator = {
    clipboard: {
      writeText: () => Promise.reject(new Error("Permission denied"))
    }
  };

  let createdElement = null;
  global.document = {
    createElement: (tag) => {
      createdElement = {
        value: "",
        style: {},
        select: () => {},
        remove: () => {}
      };
      return createdElement;
    },
    body: {
      appendChild: () => {}
    },
    execCommand: () => true
  };

  app.copyTextToClipboard("Fallback Text", () => { callbackCalled = true; });

  await new Promise(r => setTimeout(r, 10));

  runner.assertEqual(createdElement.value, "Fallback Text");
  runner.assertEqual(callbackCalled, true);

  global.navigator = origNav;
  global.document = origDocument;
});

runner.summary();
