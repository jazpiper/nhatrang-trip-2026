const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Security & Vulnerability Remediation Test Suite ===\n');

// 1. Load app exports
const app = require('./js/app.js');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

console.log('--- Suite 1: URL & Protocol Sanitization (XSS Prevention) ---');

test('sanitizeUrl blocks javascript: pseudo-protocol', () => {
  assert.strictEqual(app.sanitizeUrl('javascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('JAVASCRIPT:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript:void(0)'), '#');
});

test('sanitizeUrl blocks control character & whitespace protocol evasion', () => {
  assert.strictEqual(app.sanitizeUrl('java\x00script:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl(' java\tscript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('\r\njApp.javascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('vbscript:msgbox(1)'), '#');
});

test('sanitizeUrl blocks HTML entity obfuscation and colon entity bypasses', () => {
  assert.strictEqual(app.sanitizeUrl('jav&#x61;script:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('java&#09;script:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('jav&#97;script:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript&#58;alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript&#58alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript&#x3a;alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript&colon;alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('javascript&colonalert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('JAVASCRIPT&COLONalert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&Tab;javascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&Tabjavascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&NewLine;javascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&NewLinejavascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('jav&#x0D;ascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('jav&#x0A;ascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('jav&#x00;ascript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('&#x6a;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3a;alert(1)'), '#');
});

test('sanitizeUrl blocks data: text/html, file, blob, and executable schemes', () => {
  assert.strictEqual(app.sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.strictEqual(app.sanitizeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), '#');
  assert.strictEqual(app.sanitizeUrl('file:///etc/passwd'), '#');
  assert.strictEqual(app.sanitizeUrl('livescript:alert(1)'), '#');
  assert.strictEqual(app.sanitizeUrl('mocha:alert(1)'), '#');
});

test('sanitizeUrl blocks protocol-relative URLs and mixed slash/backslash evasions', () => {
  assert.strictEqual(app.sanitizeUrl('//evil.com/phish'), '#');
  assert.strictEqual(app.sanitizeUrl('  //evil.com/phish  '), '#');
  assert.strictEqual(app.sanitizeUrl('\\\\evil.com/phish'), '#');
  assert.strictEqual(app.sanitizeUrl('/\\evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('\\/evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&sol;&sol;evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&sol;&bsol;evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&sol&solevil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&bsol&bsolevil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&sol;\\evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&sol\\evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&#47;&#47;evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&#47&#47evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&#x2F;&#x2F;evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&#x5C;&#x5C;evil.com'), '#');
  assert.strictEqual(app.sanitizeUrl('&#x2F;&#x5C;evil.com'), '#');
});

test('sanitizeUrl allows safe HTTP, HTTPS, tel, mailto, anchor, and relative URLs', () => {
  assert.strictEqual(app.sanitizeUrl('https://www.google.com/maps'), 'https://www.google.com/maps');
  assert.strictEqual(app.sanitizeUrl('http://example.com'), 'http://example.com');
  assert.strictEqual(app.sanitizeUrl('tel:+84123456789'), 'tel:+84123456789');
  assert.strictEqual(app.sanitizeUrl('mailto:info@example.com'), 'mailto:info@example.com');
  assert.strictEqual(app.sanitizeUrl('#section'), '#section');
  assert.strictEqual(app.sanitizeUrl('/path/to/page'), '/path/to/page');
  assert.strictEqual(app.sanitizeUrl('./image.png'), './image.png');
  assert.strictEqual(app.sanitizeUrl('?query=123'), '?query=123');
});

test('sanitizeImageUrl blocks script schemes, dangerous SVGs, and protocol-relative evasion', () => {
  assert.strictEqual(app.sanitizeImageUrl('javascript:alert(1)'), '');
  assert.strictEqual(app.sanitizeImageUrl('jav&#x61;script:alert(1)'), '');
  assert.strictEqual(app.sanitizeImageUrl('javascript&colon;alert(1)'), '');
  assert.strictEqual(app.sanitizeImageUrl('javascript&colonalert(1)'), '');
  assert.strictEqual(app.sanitizeImageUrl('vbscript:msgbox(1)'), '');
  assert.strictEqual(app.sanitizeImageUrl('data:image/svg+xml;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMSk+'), '');
  assert.strictEqual(app.sanitizeImageUrl('data:text/html,<script>alert(1)</script>'), '');
  assert.strictEqual(app.sanitizeImageUrl('//evil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('\\\\evil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('/\\evil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('&sol;&sol;evil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('&sol&solevil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('&#x5C;&#x5C;evil.com/image.png'), '');
  assert.strictEqual(app.sanitizeImageUrl('https://images.unsplash.com/photo-123'), 'https://images.unsplash.com/photo-123');
  assert.strictEqual(app.sanitizeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=='), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==');
  assert.strictEqual(app.sanitizeImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg=='), 'data:image/jpeg;base64,/9j/4AAQSkZJRg==');
  assert.strictEqual(app.sanitizeImageUrl('./images/thumb.jpg'), './images/thumb.jpg');
});

test('escapeHtml sanitizes all dangerous HTML characters and attribute breakout payloads', () => {
  assert.strictEqual(app.escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.strictEqual(app.escapeHtml('" onmouseover="alert(1)"'), '&quot; onmouseover=&quot;alert(1)&quot;');
  assert.strictEqual(app.escapeHtml("' onerror='alert(1)'"), '&#039; onerror=&#039;alert(1)&#039;');
  assert.strictEqual(app.escapeHtml('foo & bar'), 'foo &amp; bar');
  assert.strictEqual(app.escapeHtml(null), '');
  assert.strictEqual(app.escapeHtml(undefined), '');
});

test('openSpaModal escapes HTML in course dynamic fields (XSS Prevention)', () => {
  const spaItem = {
    id: 'spa-xss-test',
    name: 'XSS Spa',
    nameKo: 'XSS 스파',
    categoryLabel: '스파',
    courses: [
      {
        name: '<script>alert("xss-name")</script>',
        durationMin: 60,
        priceVnd: 500000,
        priceKrw: 25000,
        description: '<img src=x onerror=alert("xss-desc")>'
      }
    ]
  };

  const { installDom } = require('./test-dom-stub.js');
  const dom = installDom();

  try {
    app.openSpaModal(spaItem);
    const tbody = dom.doc.getElementById('spaModalCourseTableBody');
    assert.ok(tbody, 'spaModalCourseTableBody must exist in DOM stub');
    assert.ok(tbody.innerHTML.includes('&lt;script&gt;alert(&quot;xss-name&quot;)&lt;/script&gt;'), 'Course name must be HTML escaped');
    assert.ok(tbody.innerHTML.includes('&lt;img src=x onerror=alert(&quot;xss-desc&quot;)&gt;'), 'Course description must be HTML escaped');
    assert.ok(!tbody.innerHTML.includes('<script>'), 'Unescaped script tag must not exist');
    assert.ok(!tbody.innerHTML.includes('<img src=x'), 'Unescaped img tag must not exist');
  } finally {
    dom.reset();
  }
});

test("guideFlashcardsHTML sanitizes malicious inputs in flashcard objects", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "src/js/10_domain_guide.js"), "utf8");
  assert.ok(src.includes("data-fc-id=\"${escapeHtml(fc.id)}\""), "fc.id must be escaped in data attribute");
  assert.ok(src.includes("${escapeHtml(fc.ko)}"), "fc.ko must be escaped");
  assert.ok(src.includes("${escapeHtml(fc.vi)}"), "fc.vi must be escaped");
  assert.ok(src.includes("${escapeHtml(fc.pronunciation)}"), "fc.pronunciation must be escaped");
  assert.ok(src.includes("${escapeHtml(fc.purpose)}"), "fc.purpose must be escaped");
  assert.ok(src.includes("data-fc-copy=\"${escapeHtml(fc.vi)}\""), "fc.vi in data attribute must be escaped");
});

console.log('\n--- Suite 2: LocalStorage Defense & Prototype Pollution Prevention ---');

test('Storage deserializer prevents Object prototype pollution and returns null-prototype dictionaries', () => {
  const payload = JSON.stringify({
    '__proto__': { 'polluted': 'yes' },
    'constructor': { 'prototype': { 'polluted': 'yes' } },
    'safeKey': 'safeValue',
    'numKey': 123
  });

  // Verify Object prototype is clean beforehand
  assert.strictEqual(Object.prototype.polluted, undefined);

  // Test sanitization using the exported function
  const clean = app.sanitizeStorageData(JSON.parse(payload), {});
  assert.strictEqual(Object.getPrototypeOf(clean), null);
  assert.strictEqual(clean.__proto__, undefined);
  assert.strictEqual(clean.toString, undefined);
  assert.strictEqual(clean.valueOf, undefined);
  assert.strictEqual(clean.safeKey, 'safeValue');
  assert.strictEqual(clean.numKey, '123');
  assert.strictEqual(Object.prototype.polluted, undefined);

  // Null/undefined input with object fallback also returns null-prototype object
  const cleanFallback = app.sanitizeStorageData(null, { defaultKey: 'val' });
  assert.strictEqual(Object.getPrototypeOf(cleanFallback), null);
  assert.strictEqual(cleanFallback.toString, undefined);
  assert.strictEqual(cleanFallback.defaultKey, 'val');
});

test('state view mode and density default to safe enum values and reject invalid values', () => {
  assert.ok(['list', 'grid'].includes(app.state.currentView));
  assert.ok(['tight', 'comfy'].includes(app.state.density));

  const origView = app.state.currentView;
  app.setViewMode('invalid_mode');
  assert.strictEqual(app.state.currentView, origView, 'Invalid view mode must be rejected');

  const origDensity = app.state.density;
  app.setDensity('invalid_density');
  assert.strictEqual(app.state.density, origDensity, 'Invalid density must be rejected');
});

test('saveToStorage returns boolean and rejects non-namespaced keys', () => {
  assert.strictEqual(app.saveToStorage('invalid_key', { a: 1 }), false);
  assert.strictEqual(app.saveToStorage(12345, { a: 1 }), false);
});

console.log('\n--- Suite 3: Vercel HTTP Security Headers Hardening ---');

const vercelJsonPath = path.resolve(__dirname, 'vercel.json');
const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

test('vercel.json specifies headers for all routes (/(.*))', () => {
  assert.ok(Array.isArray(vercelConfig.headers));
  const rootRoute = vercelConfig.headers.find(h => h.source === '/(.*)');
  assert.ok(rootRoute, 'Root route header mapping must exist');
});

test('Content-Security-Policy is strictly configured', () => {
  const headers = vercelConfig.headers[0].headers;
  const csp = headers.find(h => h.key === 'Content-Security-Policy');
  assert.ok(csp, 'Content-Security-Policy must be present');
  const val = csp.value;
  assert.ok(val.includes("default-src 'self'"), 'CSP must define default-src');
  assert.ok(val.includes("frame-ancestors 'none'"), 'CSP must block frame embedding');
  assert.ok(val.includes("object-src 'none'"), 'CSP must block plugins/Flash');
  assert.ok(val.includes("base-uri 'self'"), 'CSP must restrict base-uri');
});

test('Strict-Transport-Security (HSTS) is enabled with preload', () => {
  const headers = vercelConfig.headers[0].headers;
  const hsts = headers.find(h => h.key === 'Strict-Transport-Security');
  assert.ok(hsts, 'HSTS header must be present');
  assert.ok(hsts.value.includes('max-age=63072000'), 'HSTS max-age must be at least 2 years');
  assert.ok(hsts.value.includes('includeSubDomains'), 'HSTS must include subdomains');
  assert.ok(hsts.value.includes('preload'), 'HSTS must include preload');
});

test('X-Content-Type-Options and X-Frame-Options are strictly enforced', () => {
  const headers = vercelConfig.headers[0].headers;
  const nosniff = headers.find(h => h.key === 'X-Content-Type-Options');
  const frameOptions = headers.find(h => h.key === 'X-Frame-Options');
  assert.strictEqual(nosniff?.value, 'nosniff');
  assert.strictEqual(frameOptions?.value, 'DENY');
});

test('Permissions-Policy restricts dangerous hardware APIs', () => {
  const headers = vercelConfig.headers[0].headers;
  const perm = headers.find(h => h.key === 'Permissions-Policy');
  assert.ok(perm, 'Permissions-Policy must be present');
  assert.ok(perm.value.includes('camera=()'));
  assert.ok(perm.value.includes('microphone=()'));
  assert.ok(perm.value.includes('geolocation=()'));
});

test('Referrer-Policy header in vercel.json aligns with meta referrer tag in index.html', () => {
  const headers = vercelConfig.headers[0].headers;
  const referrerHeader = headers.find(h => h.key === 'Referrer-Policy');
  assert.strictEqual(referrerHeader?.value, 'strict-origin-when-cross-origin');

  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  assert.ok(
    indexHtml.includes('<meta name="referrer" content="strict-origin-when-cross-origin">'),
    'index.html must have strict-origin-when-cross-origin meta tag'
  );
});

console.log('\n--- Suite 4: Anchor Link Safety & Privacy Compliance ---');

test('All external target=_blank links in index.html have rel="noopener noreferrer"', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  const anchorRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/gi;
  let match;
  let count = 0;
  while ((match = anchorRegex.exec(indexHtml)) !== null) {
    count++;
    const tag = match[0];
    assert.ok(
      tag.includes('rel="noopener noreferrer"') || tag.includes("rel='noopener noreferrer'"),
      `External link missing rel="noopener noreferrer": ${tag}`
    );
  }
  assert.ok(count > 0, `Verified ${count} target=_blank anchors in index.html`);
});

test('No private names (와이프, 남편, 부부) leaked in user-facing HTML templates', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  assert.ok(!indexHtml.includes('와이프추천'), 'No 와이프추천 in user-facing HTML');
  assert.ok(!indexHtml.includes('남편'), 'No 남편 in user-facing HTML');
  assert.ok(!indexHtml.includes('부부'), 'No 부부 in user-facing HTML');
});

test('No local user paths or private absolute directories in index.html or js/app.js', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  const appJs = fs.readFileSync(path.resolve(__dirname, 'js/app.js'), 'utf8');
  assert.ok(!indexHtml.includes('/Users/'), 'No /Users/ path in index.html');
  assert.ok(!appJs.includes('/Users/'), 'No /Users/ path in js/app.js');
});

test('No inline alert() onclick handlers exist in index.html', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  assert.ok(!indexHtml.includes('onclick="alert('), 'No inline onclick alert handlers');
});

console.log(`\n========================================`);
console.log(`Results: ${passed} / ${total} passed`);
if (passed === total) {
  console.log('🎉 ALL SECURITY TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
