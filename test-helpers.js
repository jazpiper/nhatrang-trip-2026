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

const assert = require('assert');
const { TestRunner } = require('./test-harness.js');
const { installDom, uninstallDom } = require('./test-dom-stub.js');
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


runner.suite('fallbackCopy Error Path & Exception Handling');

runner.test('fallbackCopy prompts user with address text when execCommand throws an error', () => {
  const dom = installDom();
  let promptCalledWith = null;
  globalThis.prompt = (msg, text) => {
    promptCalledWith = { msg, text };
  };
  document.execCommand = () => {
    throw new Error('execCommand copy disabled or blocked');
  };

  app.fallbackCopy('https://maps.google.com/?q=NhaTrang', null);

  assert.deepStrictEqual(promptCalledWith, {
    msg: '주소를 복사하세요:',
    text: 'https://maps.google.com/?q=NhaTrang'
  });
  runner.assertEqual(document.body.children.length, 0, 'Textarea element should be removed from DOM after error');
  uninstallDom();
});

runner.suite('fallbackCopy Success Path');

runner.test('fallbackCopy invokes callback when execCommand succeeds', () => {
  const dom = installDom();
  let callbackInvoked = false;
  document.execCommand = (cmd) => {
    if (cmd === 'copy') return true;
    throw new Error('Unexpected command');
  };

  app.fallbackCopy('https://maps.google.com/?q=NhaTrang', () => {
    callbackInvoked = true;
  });

  runner.assertEqual(callbackInvoked, true);
  runner.assertEqual(document.body.children.length, 0, 'Textarea element should be removed from DOM after success');
  uninstallDom();
});

runner.test('fallbackCopy displays default toast notification when no callback is provided', () => {
  const dom = installDom();
  document.execCommand = (cmd) => {
    if (cmd === 'copy') return true;
    throw new Error('Unexpected command');
  };

  app.fallbackCopy('https://maps.google.com/?q=NhaTrang');

  const toastContainer = document.getElementById('toastContainer');
  runner.assertTruthy(!!toastContainer, 'Toast container should be created');
  runner.assertEqual(toastContainer.children.length, 1);
  runner.assertEqual(toastContainer.children[0].textContent, '📋 주소가 복사되었습니다!');
  uninstallDom();
});

runner.summary();
