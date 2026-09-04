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


runner.suite("decodeHtmlEntities Invalid and Falsy Inputs");

runner.test("decodeHtmlEntities returns empty string for null/undefined/falsy", () => {
  runner.assertEqual(app.decodeHtmlEntities(null), "");
  runner.assertEqual(app.decodeHtmlEntities(undefined), "");
  runner.assertEqual(app.decodeHtmlEntities(""), "");
  runner.assertEqual(app.decodeHtmlEntities(0), "");
  runner.assertEqual(app.decodeHtmlEntities(false), "");
});

runner.test("decodeHtmlEntities returns empty string for non-string inputs", () => {
  runner.assertEqual(app.decodeHtmlEntities(123), "");
  runner.assertEqual(app.decodeHtmlEntities({ key: "val" }), "");
  runner.assertEqual(app.decodeHtmlEntities(["a", "b"]), "");
});

runner.suite("decodeHtmlEntities Plain Strings and Named Entities");

runner.test("decodeHtmlEntities returns unchanged string if no ampersand present", () => {
  runner.assertEqual(app.decodeHtmlEntities("Hello World 123!"), "Hello World 123!");
});

runner.test("decodeHtmlEntities decodes standard named entities", () => {
  runner.assertEqual(app.decodeHtmlEntities("&amp;"), "&");
  runner.assertEqual(app.decodeHtmlEntities("&lt;"), "<");
  runner.assertEqual(app.decodeHtmlEntities("&gt;"), ">");
  runner.assertEqual(app.decodeHtmlEntities("&quot;"), "\"");
  runner.assertEqual(app.decodeHtmlEntities("&apos;"), "'");
  runner.assertEqual(app.decodeHtmlEntities("&colon;"), ":");
  runner.assertEqual(app.decodeHtmlEntities("&sol;"), "/");
  runner.assertEqual(app.decodeHtmlEntities("&bsol;"), "\\");
});

runner.test("decodeHtmlEntities decodes whitespace named entities tab/newline to empty string", () => {
  runner.assertEqual(app.decodeHtmlEntities("a&tab;b"), "ab");
  runner.assertEqual(app.decodeHtmlEntities("a&newline;b"), "ab");
});

runner.test("decodeHtmlEntities handles case-insensitivity and optional trailing semicolons", () => {
  runner.assertEqual(app.decodeHtmlEntities("&AMP;"), "&");
  runner.assertEqual(app.decodeHtmlEntities("&Lt;"), "<");
  runner.assertEqual(app.decodeHtmlEntities("&quot"), "\"");
  runner.assertEqual(app.decodeHtmlEntities("&colon"), ":");
});

runner.suite("decodeHtmlEntities Numeric Entities and Edge Cases");

runner.test("decodeHtmlEntities decodes decimal numeric entities", () => {
  runner.assertEqual(app.decodeHtmlEntities("&#38;"), "&");
  runner.assertEqual(app.decodeHtmlEntities("&#60;"), "<");
  runner.assertEqual(app.decodeHtmlEntities("&#62;"), ">");
  runner.assertEqual(app.decodeHtmlEntities("&#58;"), ":");
});

runner.test("decodeHtmlEntities decodes hexadecimal numeric entities", () => {
  runner.assertEqual(app.decodeHtmlEntities("&#x26;"), "&");
  runner.assertEqual(app.decodeHtmlEntities("&#X3C;"), "<");
  runner.assertEqual(app.decodeHtmlEntities("&#x3E;"), ">");
  runner.assertEqual(app.decodeHtmlEntities("&#x3A;"), ":");
});

runner.test("decodeHtmlEntities handles recursive / multi-pass entity decoding", () => {
  runner.assertEqual(app.decodeHtmlEntities("&amp;amp;"), "&");
  runner.assertEqual(app.decodeHtmlEntities("&amp;lt;"), "<");
  runner.assertEqual(app.decodeHtmlEntities("&#38;#60;"), "<");
});

runner.test("decodeHtmlEntities preserves unmapped or invalid entity patterns", () => {
  runner.assertEqual(app.decodeHtmlEntities("&unknown;"), "&unknown;");
  runner.assertEqual(app.decodeHtmlEntities("&123;"), "&123;");
  runner.assertEqual(app.decodeHtmlEntities("foo & bar"), "foo & bar");
});

runner.summary();
