/**
 * ============================================================================
 * Nha Trang Trip 2026 - Formatting & UI Helpers Unit Test Suite
 * File: test-helpers.js
 * ============================================================================
 *
 * Dedicated test suite verifying `formatVND` and `showToast` utility function behavior:
 * 1. formatVND: Falsy/missing values (0, null, undefined, '', NaN, false)
 * 2. formatVND: Positive numeric inputs (small, medium, large integers)
 * 3. formatVND: String representations of numeric values
 * 4. formatVND: Floating point numbers
 * 5. formatVND: Negative numbers
 * 6. showToast: DOM element creation and styling
 * 7. showToast: Container reuse on multiple calls
 * 8. showToast: Timer delays and DOM removal lifecycle
 * ============================================================================
 */

const { TestRunner } = require('./test-harness.js');
const { installDom, uninstallDom } = require('./test-dom-stub.js');

// Install DOM stub before requiring app.js so document is accessible for showToast tests
const dom = installDom();
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

runner.suite('showToast DOM Element Creation & Container Management');

runner.test('showToast creates #toastContainer and toast-msg element with given text', () => {
  dom.reset();
  app.showToast('Test Toast Notification');

  const container = dom.doc.getElementById('toastContainer');
  runner.assertTruthy(container, 'toastContainer element should be created');
  runner.assertEqual(container.children.length, 1, 'Container should contain 1 toast child');

  const toast = container.children[0];
  runner.assertEqual(toast.className, 'toast-msg', 'Toast element should have class "toast-msg"');
  runner.assertEqual(toast.textContent, 'Test Toast Notification', 'Toast content should match message');
});

runner.test('showToast reuses existing #toastContainer and appends multiple toast messages', () => {
  dom.reset();
  app.showToast('Message 1');
  app.showToast('Message 2');
  app.showToast('Message 3');

  const container = dom.doc.getElementById('toastContainer');
  runner.assertTruthy(container, 'toastContainer should exist');
  runner.assertEqual(container.children.length, 3, 'Container should contain 3 toast children');
  runner.assertEqual(container.children[0].textContent, 'Message 1');
  runner.assertEqual(container.children[1].textContent, 'Message 2');
  runner.assertEqual(container.children[2].textContent, 'Message 3');
});

runner.suite('showToast Timer & FadeOut Animation Lifecycle');

runner.test('showToast schedules fadeOut animation and removal with custom duration', () => {
  dom.reset();

  // Fake timers mock to test nested setTimeout callbacks
  const timers = [];
  const origSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (cb, delay) => {
    const id = timers.length + 1;
    timers.push({ id, cb, delay });
    return id;
  };

  try {
    app.showToast('Timer Test', 1500);

    const container = dom.doc.getElementById('toastContainer');
    runner.assertEqual(container.children.length, 1);
    const toast = container.children[0];

    runner.assertEqual(timers.length, 1, 'Initial timer should be scheduled for toast duration');
    runner.assertEqual(timers[0].delay, 1500, 'Scheduled delay should match custom duration (1500ms)');

    // Trigger initial timer (duration elapsed)
    const firstTimer = timers[0];
    firstTimer.cb();

    runner.assertEqual(toast.style.animation, 'fadeOut 0.3s ease forwards', 'Toast animation should be set to fadeOut');
    runner.assertEqual(timers.length, 2, 'Second timer for element removal (300ms) should be scheduled');
    runner.assertEqual(timers[1].delay, 300, 'Removal timer delay should be 300ms');

    // Trigger second timer (removal timer)
    const secondTimer = timers[1];
    secondTimer.cb();

    runner.assertEqual(container.children.length, 0, 'Toast element should be removed from DOM container');
  } finally {
    globalThis.setTimeout = origSetTimeout;
  }
});

runner.test('showToast uses default duration of 2500ms when not specified', () => {
  dom.reset();
  let scheduledDelay = null;
  const origSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (cb, delay) => {
    if (scheduledDelay === null) scheduledDelay = delay;
    return origSetTimeout(cb, delay);
  };

  try {
    app.showToast('Default Duration Test');
    runner.assertEqual(scheduledDelay, 2500, 'Default duration should be 2500ms');
  } finally {
    globalThis.setTimeout = origSetTimeout;
  }
});

// Clean up DOM stub
uninstallDom();

runner.summary();
