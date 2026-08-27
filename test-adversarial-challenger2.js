/**
 * ============================================================================
 * Challenger 2 Adversarial Test Harness: DOM XSS, Sanitizers & ReDoS Stress
 * Nha Trang Trip 2026 SPA Security Audit
 * File: test-adversarial-challenger2.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { performance } = require('perf_hooks');

console.log('======================================================================');
console.log(' Challenger 2: Adversarial Security & ReDoS Stress Test Suite');
console.log('======================================================================\n');

// Load built bundle / modules
const app = require('./js/app.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(title, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✔ PASS: ${title}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${title}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
    failures.push({ title, error: err.message, stack: err.stack });
  }
}

// ============================================================================
// SUITE 1: 50+ Adversarial XSS Vectors against escapeHtml, sanitizeUrl, sanitizeImageUrl
// ============================================================================
console.log('--- Suite 1: 50+ Adversarial XSS Vectors (Protocols, Encodings & Payloads) ---');

const XSS_VECTORS = [
  // 1. Classic script tags
  { type: 'script_basic', payload: '<script>alert(1)</script>' },
  { type: 'script_case', payload: '<sCrIpt src="https://evil.com/x.js"></ScRiPt>' },
  { type: 'script_nested', payload: '<<script>script>alert(1)<</script>/script>' },
  { type: 'script_newline', payload: '<script\n>alert(1)\n</script>' },
  { type: 'script_null', payload: '<script\x00>alert(1)</script>' },

  // 2. Event handlers on various tags
  { type: 'event_img_onerror', payload: '<img src=x onerror=alert(1)>' },
  { type: 'event_img_quotes', payload: '<img src="x" onerror="alert(1)">' },
  { type: 'event_svg_onload', payload: '<svg onload=alert(1)>' },
  { type: 'event_svg_slash', payload: '<svg/onload=alert(1)>' },
  { type: 'event_body_onload', payload: '<body onload=alert(1)>' },
  { type: 'event_iframe_src', payload: '<iframe src="javascript:alert(1)"></iframe>' },
  { type: 'event_details_toggle', payload: '<details open ontoggle=alert(1)>' },
  { type: 'event_input_focus', payload: '<input autofocus onfocus=alert(1)>' },
  { type: 'event_video_onerror', payload: '<video><source onerror="alert(1)">' },
  { type: 'event_audio_onerror', payload: '<audio src=x onerror=alert(1)>' },

  // 3. Attribute breakout attempts
  { type: 'breakout_dq', payload: '"><script>alert(1)</script>' },
  { type: 'breakout_sq', payload: "'><script>alert(1)</script>" },
  { type: 'breakout_attr_dq', payload: '" onmouseover="alert(1)" data-foo="' },
  { type: 'breakout_attr_sq', payload: "' onmouseover='alert(1)' data-foo='" },
  { type: 'breakout_style', payload: '"><style>body{background:red}</style>' },

  // 4. javascript: pseudo-protocol variants
  { type: 'js_basic', payload: 'javascript:alert(1)' },
  { type: 'js_mixed_case', payload: 'JaVaScRiPt:alert(1)' },
  { type: 'js_uppercase', payload: 'JAVASCRIPT:alert(1)' },
  { type: 'js_null_byte', payload: 'java\x00script:alert(1)' },
  { type: 'js_unicode_null', payload: 'java\u0000script:alert(1)' },
  { type: 'js_control_01', payload: 'java\x01script:alert(1)' },
  { type: 'js_control_1f', payload: 'java\x1fscript:alert(1)' },
  { type: 'js_tab', payload: 'java\tscript:alert(1)' },
  { type: 'js_newline', payload: 'java\nscript:alert(1)' },
  { type: 'js_cr', payload: 'java\rscript:alert(1)' },
  { type: 'js_spaces', payload: '  javascript  :  alert(1)  ' },

  // 5. HTML Entity bypasses in URL schemes
  { type: 'entity_hex_a', payload: 'jav&#x61;script:alert(1)' },
  { type: 'entity_dec_a', payload: 'jav&#97;script:alert(1)' },
  { type: 'entity_full_dec', payload: '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert(1)' },
  { type: 'entity_full_hex', payload: '&#x6a;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3a;alert(1)' },
  { type: 'entity_colon_named', payload: 'javascript&colon;alert(1)' },
  { type: 'entity_colon_no_semi', payload: 'javascript&colonalert(1)' },
  { type: 'entity_colon_upper', payload: 'JAVASCRIPT&COLONalert(1)' },
  { type: 'entity_colon_dec', payload: 'javascript&#58;alert(1)' },
  { type: 'entity_colon_dec_no_semi', payload: 'javascript&#58alert(1)' },
  { type: 'entity_colon_hex', payload: 'javascript&#x3a;alert(1)' },
  { type: 'entity_colon_hex_padded', payload: 'javascript&#x0003a;alert(1)' },
  { type: 'entity_tab', payload: '&Tab;javascript:alert(1)' },
  { type: 'entity_tab_no_semi', payload: '&Tabjavascript:alert(1)' },
  { type: 'entity_newline', payload: '&NewLine;javascript:alert(1)' },
  { type: 'entity_newline_no_semi', payload: '&NewLinejavascript:alert(1)' },
  { type: 'entity_cr_hex', payload: 'jav&#x0D;ascript:alert(1)' },
  { type: 'entity_lf_hex', payload: 'jav&#x0A;ascript:alert(1)' },
  { type: 'entity_null_hex', payload: 'jav&#x00;ascript:alert(1)' },

  // 6. Alternate dangerous protocols
  { type: 'proto_vbscript', payload: 'vbscript:msgbox(1)' },
  { type: 'proto_vbscript_case', payload: 'VBSCRIPT:msgbox(1)' },
  { type: 'proto_livescript', payload: 'livescript:alert(1)' },
  { type: 'proto_mocha', payload: 'mocha:alert(1)' },
  { type: 'proto_data_html', payload: 'data:text/html,<script>alert(1)</script>' },
  { type: 'proto_data_b64', payload: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==' },
  { type: 'proto_data_svg_utf8', payload: 'data:image/svg+xml;utf8,<svg onload=alert(1)>' },
  { type: 'proto_data_svg_b64', payload: 'data:image/svg+xml;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMSk+' },
  { type: 'proto_file', payload: 'file:///etc/passwd' },
  { type: 'proto_blob', payload: 'blob:https://evil.com/1234-5678' },

  // 7. Protocol-relative and slash/backslash evasions
  { type: 'rel_double_slash', payload: '//evil.com/phish' },
  { type: 'rel_double_slash_space', payload: '  //evil.com/phish  ' },
  { type: 'rel_double_backslash', payload: '\\\\evil.com/phish' },
  { type: 'rel_slash_backslash', payload: '/\\evil.com' },
  { type: 'rel_backslash_slash', payload: '\\/evil.com' },
  { type: 'rel_triple_slash', payload: '///evil.com' },
  { type: 'rel_entity_sol_sol', payload: '&sol;&sol;evil.com' },
  { type: 'rel_entity_sol_bsol', payload: '&sol;&bsol;evil.com' },
  { type: 'rel_entity_sol_sol_nosemi', payload: '&sol&solevil.com' },
  { type: 'rel_entity_bsol_bsol_nosemi', payload: '&bsol&bsolevil.com' },
  { type: 'rel_entity_sol_raw_bsol', payload: '&sol;\\evil.com' },
  { type: 'rel_entity_sol_nosemi_raw_bsol', payload: '&sol\\evil.com' },
  { type: 'rel_entity_dec_slash', payload: '&#47;&#47;evil.com' },
  { type: 'rel_entity_dec_slash_nosemi', payload: '&#47&#47evil.com' },
  { type: 'rel_entity_hex_slash', payload: '&#x2F;&#x2F;evil.com' },
  { type: 'rel_entity_hex_bslash', payload: '&#x5C;&#x5C;evil.com' },
  { type: 'rel_entity_hex_mixed', payload: '&#x2F;&#x5C;evil.com' },
  { type: 'proto_missing_slash_https', payload: 'https:evil.com/phish' },
  { type: 'proto_missing_slash_http', payload: 'http:evil.com/phish' }
];

test(`Verify vector inventory count (expected >= 50, actual: ${XSS_VECTORS.length})`, () => {
  assert.ok(XSS_VECTORS.length >= 50, `Expected at least 50 test vectors, got ${XSS_VECTORS.length}`);
});

test('escapeHtml neutralizes all 60+ XSS vectors into safe HTML entities', () => {
  XSS_VECTORS.forEach((vec, idx) => {
    const escaped = app.escapeHtml(vec.payload);
    assert.strictEqual(typeof escaped, 'string');
    // Ensure all HTML syntax characters are converted to entity equivalents
    assert.ok(!escaped.includes('<'), `Vector #${idx + 1} (${vec.type}) contains unescaped <`);
    assert.ok(!escaped.includes('>'), `Vector #${idx + 1} (${vec.type}) contains unescaped >`);
    assert.ok(!escaped.includes('"'), `Vector #${idx + 1} (${vec.type}) contains unescaped "`);
    assert.ok(!escaped.includes("'"), `Vector #${idx + 1} (${vec.type}) contains unescaped '`);
    // Ensure non-entity ampersands are escaped
    const unescapedAmp = escaped.replace(/&(?:amp|lt|gt|quot|#039|colon|sol|bsol|tab|newline|#x[0-9a-f]+|#[0-9]+);?/gi, '');
    assert.ok(!unescapedAmp.includes('&'), `Vector #${idx + 1} (${vec.type}) contains raw unescaped &`);
  });
});

test('sanitizeUrl neutralizes all malicious protocol & entity vectors to fallback', () => {
  XSS_VECTORS.forEach((vec, idx) => {
    const sanitized = app.sanitizeUrl(vec.payload, '#');
    assert.strictEqual(
      sanitized, '#',
      `Vector #${idx + 1} (${vec.type}) was NOT blocked by sanitizeUrl: got "${sanitized}"`
    );
  });
});

test('sanitizeImageUrl neutralizes all malicious protocol & entity vectors to empty fallback', () => {
  XSS_VECTORS.forEach((vec, idx) => {
    const sanitized = app.sanitizeImageUrl(vec.payload, '');
    assert.strictEqual(
      sanitized, '',
      `Vector #${idx + 1} (${vec.type}) was NOT blocked by sanitizeImageUrl: got "${sanitized}"`
    );
  });
});

// ============================================================================
// SUITE 2: SVG Data URI Exploits vs Safe Raster Images Verification
// ============================================================================
console.log('\n--- Suite 2: SVG Data URI Exploits vs Safe Raster Images ---');

const DANGEROUS_DATA_URIS = [
  'data:image/svg+xml;utf8,<svg onload=alert(1)>',
  'data:image/svg+xml;utf-8,<svg/onload=alert(1)>',
  'data:image/svg+xml;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMSk+',
  'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoMSk8L3NjcmlwdD48L3N2Zz4=',
  'DATA:IMAGE/SVG+XML;BASE64,PHN2Zy9vbmxvYWQ9YWxlcnQoMSk+',
  'data:text/html,<script>alert(1)</script>',
  'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
  'data:text/javascript,alert(1)',
  'data:application/javascript,alert(1)',
  'data:application/xhtml+xml,<html xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></html>',
  'data:image/png;utf8,<svg onload=alert(1)>',
  'data:image/png;base64,not_valid_base64_payload$$$',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==<script>alert(1)</script>'
];

const SAFE_RASTER_DATA_URIS = [
  {
    name: '1x1 Transparent PNG',
    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  },
  {
    name: '1x1 JPEG',
    url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
  },
  {
    name: '1x1 JPG (alternative MIME)',
    url: 'data:image/jpg;base64,/9j/4AAQSkZJRg=='
  },
  {
    name: '1x1 WebP',
    url: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  },
  {
    name: '1x1 GIF',
    url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
];

test('sanitizeImageUrl blocks all dangerous SVG data URIs, executable data schemes, and invalid base64', () => {
  DANGEROUS_DATA_URIS.forEach((uri, idx) => {
    const res = app.sanitizeImageUrl(uri, '');
    assert.strictEqual(
      res, '',
      `Dangerous data URI #${idx + 1} was allowed: "${uri}"`
    );
  });
});

test('sanitizeImageUrl permits only legitimate raster base64 data URIs (PNG, JPEG, JPG, WEBP, GIF)', () => {
  SAFE_RASTER_DATA_URIS.forEach(raster => {
    const res = app.sanitizeImageUrl(raster.url, '');
    assert.strictEqual(
      res, raster.url,
      `Safe raster image ${raster.name} was unexpectedly rejected: "${res}"`
    );
  });
});

test('sanitizeUrl strictly blocks ALL data: URIs (including raster images) for anchor links', () => {
  SAFE_RASTER_DATA_URIS.forEach(raster => {
    const res = app.sanitizeUrl(raster.url, '#');
    assert.strictEqual(
      res, '#',
      `data: URI should NEVER be allowed in anchor href, but was accepted: "${res}"`
    );
  });
});

// ============================================================================
// SUITE 3: Card & Modal Template Poisoning / DOM Breakout Adversarial Audit
// ============================================================================
console.log('\n--- Suite 3: Card & Modal Template Poisoning & DOM Breakout ---');

// Mock a deeply poisoned item object with aggressive XSS in every property
const POISONED_ITEM = {
  id: 'test_xss_1"><script>alert(1)</script>',
  title: 'Poisoned Title <img src=x onerror=alert(2)>',
  titleEn: 'Poisoned Title En <svg onload=alert(3)>',
  name: 'Poisoned Name <iframe src=javascript:alert(4)>',
  nameKo: 'Poisoned NameKo \'" onmouseover="alert(5)"',
  nameVi: 'Poisoned NameVi <details open ontoggle=alert(6)>',
  nameEn: 'Poisoned NameEn <input autofocus onfocus=alert(7)>',
  hotelName: 'Poisoned Hotel <script>alert(8)</script>',
  badge: 'Poisoned Badge <b onmouseover=alert(9)>',
  category: 'Poisoned Cat"><script>alert(10)</script>',
  categoryLabel: 'Poisoned CatLabel <script>alert(11)</script>',
  qualityTier: 'Poisoned Quality <script>alert(12)</script>',
  duration: 'Poisoned Duration <script>alert(13)</script>',
  location: 'Poisoned Location <script>alert(14)</script>',
  area: 'Poisoned Area <script>alert(15)</script>',
  address: 'Poisoned Address <script>alert(16)</script>',
  addressVi: 'Poisoned AddressVi <script>alert(17)</script>',
  priceVnd: 100000,
  avgPriceVnd: 200000,
  pricePerNightVnd: 300000,
  pricePer: '1인"><script>alert(18)</script>',
  rating: 4.9,
  reviewCount: 999,
  openHours: '09:00 - 22:00 <script>alert(19)</script>',
  priceRange: '10만동 <script>alert(20)</script>',
  priceRangeVnd: '10만동 <script>alert(21)</script>',
  highlight: 'Poisoned Highlight <script>alert(22)</script>',
  description: 'Poisoned Description <script>alert(23)</script>',
  localTip: 'Poisoned Tip <script>alert(24)</script>',
  coupleTip: 'Poisoned CoupleTip <script>alert(25)</script>',
  travelerTip: 'Poisoned TravelerTip <script>alert(26)</script>',
  imageUrl: 'javascript:alert(27)',
  coverImage: 'data:image/svg+xml;utf8,<svg onload=alert(28)>',
  images: [
    'javascript:alert(29)',
    'data:image/svg+xml;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMzApPg==',
    '//evil.com/pic.png'
  ],
  photos: [
    'javascript:alert(31)',
    '\\\\evil.com/pic.jpg'
  ],
  tags: [
    'Tag1"><script>alert(32)</script>',
    '<img src=x onerror=alert(33)>',
    'Tag3\' onfocus=\'alert(34)'
  ],
  amenities: [
    'Amenity1 <script>alert(35)</script>',
    'Amenity2"><script>alert(36)</script>'
  ],
  highlights: [
    'Highlight1 <script>alert(37)</script>'
  ],
  nearbySpots: [
    'Spot1 <script>alert(38)</script>'
  ],
  facilities: [
    'Facility1 <script>alert(39)</script>'
  ],
  paymentMethods: [
    'Pay1 <script>alert(40)</script>'
  ],
  supportedCards: [
    'Card1"><script>alert(41)</script>',
    'Card2 <svg/onload=alert(42)>'
  ],
  signatureMenu: [
    'Menu1 <script>alert(43)</script>',
    { name: 'SigName <script>alert(44)</script>', desc: 'SigDesc <script>alert(45)</script>', price: '10k <script>alert(46)</script>' }
  ],
  signatureItems: [
    'Item1 <script>alert(47)</script>'
  ],
  bargainingGuide: [
    { item: 'BargainItem <script>alert(48)</script>', askingPrice: '100k <script>alert(49)</script>', targetPrice: '50k <script>alert(50)</script>', tip: 'Tip <script>alert(51)</script>' }
  ],
  sentimentAnalysis: {
    pros: ['Pro1 <script>alert(52)</script>'],
    cons: ['Con1 <script>alert(53)</script>'],
    communityVerdict: 'Verdict <script>alert(54)</script>',
    scamWarning: 'Warning <script>alert(55)</script>'
  },
  courses: [
    { name: 'Course1 <script>alert(56)</script>', durationMin: 90, priceVnd: 500000, priceKrw: 27000, description: 'Desc <script>alert(57)</script>' }
  ],
  exchangePerks: [
    'Perk1 <script>alert(58)</script>'
  ],
  supportedCurrencies: [
    'USD <script>alert(59)</script>'
  ],
  withdrawalLimit: '500만동 <script>alert(60)</script>',
  feePolicy: '무료 <script>alert(61)</script>',
  customsCaution: 'Caution <script>alert(62)</script>',
  dressCode: 'Casual <script>alert(63)</script>',
  reservationRequired: 'Yes <script>alert(64)</script>',
  phone: '0123456789 <script>alert(65)</script>',
  pickupDropoff: 'Free <script>alert(66)</script>',
  tipPolicy: 'Included <script>alert(67)</script>',
  luggageShower: { details: 'Luggage <script>alert(68)</script>' },
  googleMapUrl: 'javascript:alert(69)',
  googlePhotosUrl: 'javascript:alert(70)',
  officialUrl: 'javascript:alert(71)',
  bookingUrl: 'javascript:alert(72)',
  reserveUrl: 'javascript:alert(73)'
};

// Set state notes with XSS payload
app.state.notes = { [POISONED_ITEM.id]: '<script>alert("note_xss_1")</script>' };
app.state.gourmetNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_2")</script>' };
app.state.stayNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_3")</script>' };
app.state.hoteldiningNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_4")</script>' };
app.state.spaNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_5")</script>' };
app.state.shoppingNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_6")</script>' };
app.state.currencyNotes = { [POISONED_ITEM.id]: '<script>alert("note_xss_7")</script>' };

function extractElementAttributes(tagStr) {
  const inner = tagStr.replace(/^<[a-zA-Z0-9-]+/, '').replace(/\/?>$/, '');
  const attrs = [];
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /\s/.test(inner[i])) i++;
    if (i >= inner.length) break;

    const nameStart = i;
    while (i < inner.length && !/[\s=>]/.test(inner[i])) i++;
    const attrName = inner.slice(nameStart, i);

    while (i < inner.length && /\s/.test(inner[i])) i++;

    let attrVal = '';
    if (i < inner.length && inner[i] === '=') {
      i++; // skip '='
      while (i < inner.length && /\s/.test(inner[i])) i++;
      if (i < inner.length && (inner[i] === '"' || inner[i] === "'")) {
        const quote = inner[i];
        i++; // skip quote
        const valStart = i;
        while (i < inner.length && inner[i] !== quote) i++;
        attrVal = inner.slice(valStart, i);
        if (i < inner.length && inner[i] === quote) i++;
      } else {
        const valStart = i;
        while (i < inner.length && !/\s/.test(inner[i])) i++;
        attrVal = inner.slice(valStart, i);
      }
    }
    if (attrName) attrs.push({ name: attrName, value: attrVal });
  }
  return attrs;
}

// Helper to assert that generated HTML properly encapsulates all dynamic user inputs
function assertSafeHtml(html, context) {
  assert.strictEqual(typeof html, 'string', `${context} must return string`);

  // 1. Check for unescaped active tag injection (e.g. <script, <iframe, <svg, unescaped <img)
  const tagMatches = html.match(/<([a-zA-Z0-9-]+)(?:[^"'>]|"[^"]*"|'[^']*')*>/g) || [];
  tagMatches.forEach(tag => {
    const tagMatch = tag.match(/^<([a-zA-Z0-9-]+)/i);
    if (!tagMatch) return;
    const tagName = tagMatch[1].toLowerCase();

    assert.ok(
      ['div', 'span', 'button', 'img', 'article', 'p', 'h2', 'h3', 'h4', 'ul', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'b', 'a', 'section', 'input', 'nav', 'main', 'option', 'select'].includes(tagName),
      `SECURITY FLAW in ${context}: Disallowed HTML element <${tagName}> was generated: ${tag}`
    );

    const attrs = extractElementAttributes(tag);
    attrs.forEach(attr => {
      const lowerName = attr.name.toLowerCase();

      // Check for user-injected event handlers (on* attributes outside the static fallback onerror on img)
      if (lowerName.startsWith('on')) {
        const isStaticImgFallback = lowerName === 'onerror' &&
          (attr.value.includes('images.unsplash.com') || attr.value.includes('this.remove()'));
        assert.ok(
          isStaticImgFallback,
          `SECURITY FLAW in ${context}: Injected event handler found on tag: ${attr.name}="${attr.value}" in ${tag}`
        );
      }

      // Check href attributes for dangerous schemes
      if (lowerName === 'href') {
        assert.ok(
          !/^(?:javascript|data|vbscript|file|blob|livescript|mocha):/i.test(attr.value),
          `SECURITY FLAW in ${context}: Dangerous href scheme detected: ${attr.value}`
        );
        assert.ok(
          !/^[/\\\\]{2}/.test(attr.value),
          `SECURITY FLAW in ${context}: Protocol-relative href detected: ${attr.value}`
        );
      }

      // Check src attributes for dangerous schemes
      if (lowerName === 'src') {
        assert.ok(
          !/^(?:javascript|vbscript|file|blob|livescript|mocha):/i.test(attr.value),
          `SECURITY FLAW in ${context}: Dangerous src scheme detected: ${attr.value}`
        );
        assert.ok(
          !/^data:image\/svg/i.test(attr.value),
          `SECURITY FLAW in ${context}: SVG data URI src detected: ${attr.value}`
        );
        assert.ok(
          !/^[/\\\\]{2}/.test(attr.value),
          `SECURITY FLAW in ${context}: Protocol-relative src detected: ${attr.value}`
        );
      }
    });
  });

  // 2. Check that no unescaped user quotes broke out of attributes
  assert.ok(
    !html.includes('data-id="test_xss_1"><script>'),
    `SECURITY FLAW in ${context}: Attribute breakout detected in data-id`
  );
  assert.ok(
    !html.includes('<script>alert('),
    `SECURITY FLAW in ${context}: Unescaped <script> tag detected in output`
  );
}

// Extract template functions from app.js by reading source slices or evaluating
const srcJsDir = path.resolve(__dirname, 'src', 'js');
const storageJs = fs.readFileSync(path.join(srcJsDir, '01_storage.js'), 'utf8');
const helpersJs = fs.readFileSync(path.join(srcJsDir, '02_helpers.js'), 'utf8');
const stateJs = fs.readFileSync(path.join(srcJsDir, '03_state_and_common.js'), 'utf8');
const actJs = fs.readFileSync(path.join(srcJsDir, '04_domain_activities.js'), 'utf8');
const gourmetJs = fs.readFileSync(path.join(srcJsDir, '05_domain_gourmet.js'), 'utf8');
const stayJs = fs.readFileSync(path.join(srcJsDir, '06_domain_stays.js'), 'utf8');
const shopJs = fs.readFileSync(path.join(srcJsDir, '07_domain_shopping.js'), 'utf8');
const currJs = fs.readFileSync(path.join(srcJsDir, '08_domain_currency.js'), 'utf8');
const hotelJs = fs.readFileSync(path.join(srcJsDir, '08b_domain_hoteldining.js'), 'utf8');
const spaJs = fs.readFileSync(path.join(srcJsDir, '09_domain_spa.js'), 'utf8');
const guideJs = fs.readFileSync(path.join(srcJsDir, '10_domain_guide.js'), 'utf8');
const registryJs = fs.readFileSync(path.join(srcJsDir, '11_registry.js'), 'utf8');

// Create sandbox VM with DOM stub to execute all templates
const vm = require('vm');

const domSandbox = {
  console,
  setTimeout,
  clearTimeout,
  DEFAULT_EXCHANGE_RATE: 0.054,
  document: {
    getElementById: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, addEventListener: () => {} }),
    head: { appendChild: () => {} }
  },
  window: {
    dispatchEvent: () => {}
  }
};

const fullCode = [
  storageJs,
  helpersJs,
  stateJs,
  actJs,
  gourmetJs,
  stayJs,
  shopJs,
  currJs,
  hotelJs,
  spaJs,
  guideJs,
  registryJs
].join('\n');

const scriptContext = vm.createContext(domSandbox);
vm.runInContext(fullCode, scriptContext);

test('Activities card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`activityCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'activityCardTemplate');

  const rowHtml = vm.runInContext(`activityRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'activityRowTemplate');
});

test('Gourmet card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`gourmetCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'gourmetCardTemplate');

  const rowHtml = vm.runInContext(`gourmetRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'gourmetRowTemplate');
});

test('Stays card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`stayCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'stayCardTemplate');

  const rowHtml = vm.runInContext(`stayRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'stayRowTemplate');
});

test('Shopping card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`shoppingCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'shoppingCardTemplate');

  const rowHtml = vm.runInContext(`shoppingRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'shoppingRowTemplate');
});

test('Hotel Dining card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`hoteldiningCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'hoteldiningCardTemplate');

  const rowHtml = vm.runInContext(`hoteldiningRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'hoteldiningRowTemplate');
});

test('Spa card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`spaCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'spaCardTemplate');

  const rowHtml = vm.runInContext(`spaRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'spaRowTemplate');
});

test('Currency card & row templates sanitize poisoned input', () => {
  const cardHtml = vm.runInContext(`currencyCardTemplate(${JSON.stringify(POISONED_ITEM)})`, scriptContext);
  assertSafeHtml(cardHtml, 'currencyCardTemplate');

  const rowHtml = vm.runInContext(`currencyRowTemplate(${JSON.stringify(POISONED_ITEM)}, 0)`, scriptContext);
  assertSafeHtml(rowHtml, 'currencyRowTemplate');
});

test('Generic itemRowHTML sanitizes all passed fields and prevents mapUrl injection', () => {
  const rowHtml = vm.runInContext(`itemRowHTML({
    id: ${JSON.stringify(POISONED_ITEM.id)},
    rank: 1,
    imgUrl: ${JSON.stringify(POISONED_ITEM.imageUrl)},
    emoji: '<script>alert(1)</script>',
    name: ${JSON.stringify(POISONED_ITEM.name)},
    tags: [{ label: '<img src=x onerror=alert(1)>', hot: true }],
    rating: 4.8,
    reviewCount: 100,
    openState: true,
    metaParts: ['<script>alert(1)</script>'],
    sigLabel: '<script>alert(1)</script>',
    sigValue: '<script>alert(1)</script>',
    subText: '<script>alert(1)</script>',
    priceMain: '100000',
    priceKrw: '5400',
    priceUnit: '1인',
    isWish: true,
    note: '<script>alert(1)</script>',
    mapUrl: 'javascript:alert(1)'
  })`, scriptContext);
  assertSafeHtml(rowHtml, 'itemRowHTML');
});

// ============================================================================
// SUITE 4: ReDoS Stress Testing on All Regular Expressions in src/js/
// ============================================================================
console.log('\n--- Suite 4: ReDoS Stress Testing on All Regular Expressions ---');

const REGEX_COLLECTION = [
  { name: 'escapeHtml amp', regex: /&/g, trigger: '&'.repeat(50000) },
  { name: 'escapeHtml lt', regex: /</g, trigger: '<'.repeat(50000) },
  { name: 'escapeHtml gt', regex: />/g, trigger: '>'.repeat(50000) },
  { name: 'escapeHtml dq', regex: /"/g, trigger: '"'.repeat(50000) },
  { name: 'escapeHtml sq', regex: /'/g, trigger: "'".repeat(50000) },

  {
    name: 'decodeHtmlEntities named entities',
    regex: /&(?:colon|sol|bsol|tab|newline|amp|quot|apos|lt|gt);?/gi,
    trigger: '&colon;&sol;&bsol;&tab;&newline;&amp;&quot;&apos;&lt;&gt;'.repeat(5000)
  },
  {
    name: 'decodeHtmlEntities hex entities',
    regex: /&#x([0-9a-f]+);?/gi,
    trigger: '&#x003a;&#x0041;&#x6a;&#x61;'.repeat(10000)
  },
  {
    name: 'decodeHtmlEntities dec entities',
    regex: /&#([0-9]+);?/g,
    trigger: '&#58;&#97;&#106;&#118;'.repeat(10000)
  },
  {
    name: 'sanitizeUrl control chars & whitespace',
    regex: /[\x00-\x1f\x7f-\x9f\s]/g,
    trigger: ' \t\r\n\x00\x01\x1f\x7f\x80\x9f'.repeat(5000)
  },
  {
    name: 'sanitizeUrl dangerous schemes check',
    regex: /^(?:javascript|vbscript|data|file|blob|livescript|mocha):/i,
    trigger: 'java'.repeat(10000) + 'script:alert(1)'
  },
  {
    name: 'sanitizeUrl double slash / backslash prefix',
    regex: /^[/\\\\]{2}/,
    trigger: '/\\/\\'.repeat(12500)
  },
  {
    name: 'sanitizeUrl scheme match',
    regex: /^([a-z0-9+.-]+):/i,
    trigger: 'a+.-'.repeat(12500) + ':'
  },
  {
    name: 'sanitizeUrl http(s) prefix check',
    regex: /^(?:https?:\/\/)/i,
    trigger: 'http'.repeat(12500) + '://example.com'
  },
  {
    name: 'sanitizeUrl relative prefix check',
    regex: /^(?:#|\/|\.\/|\.\.\/|\?)/,
    trigger: '.././../?#'.repeat(10000)
  },
  {
    name: 'sanitizeUrl safe char whitelist test',
    regex: /^[a-zA-Z0-9_.~!*();@&=+$,/?%#[\]-]+$/,
    trigger: 'a-b_c~d!e*f(g)h;i@j&k=l+m$n,o/p?q%r#s[t]u'.repeat(2000)
  },
  {
    name: 'sanitizeImageUrl base64 raster image validator',
    regex: /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-zA-Z0-9+/=]+$/i,
    trigger: 'data:image/png;base64,' + 'A'.repeat(50000) + '!'
  },
  {
    name: 'isOpenNow 24h detector',
    regex: /24\s*시간|24h|24\/7/i,
    trigger: '24 ' + ' '.repeat(50000) + '시간'
  },
  {
    name: 'isOpenNow time parser',
    regex: /(\d{1,2}):(\d{2})/g,
    trigger: '12:34 23:59 00:00 '.repeat(3500)
  },
  {
    name: 'parseSignature currency matcher',
    regex: /([\d.,]+\s*(?:VND|₫|동))/i,
    trigger: '123,456,789.00 ' + ' '.repeat(10000) + 'VND'
  },
  {
    name: 'parseSignature parentheses stripper',
    regex: /\s*\(.*\)\s*$/,
    trigger: 'Menu Name (' + 'a'.repeat(50000) + ')'
  },
  {
    name: 'currency calculator number sanitizer',
    regex: /[^0-9]/g,
    trigger: 'abc!@#$%^&*()_+~` '.repeat(3000)
  },
  {
    name: 'whitespace split / replace',
    regex: /\s+/g,
    trigger: ' \t\r\n'.repeat(12500)
  }
];

test(`Verify ReDoS regex catalog count (expected >= 15, actual: ${REGEX_COLLECTION.length})`, () => {
  assert.ok(REGEX_COLLECTION.length >= 15, `Expected at least 15 regexes, got ${REGEX_COLLECTION.length}`);
});

REGEX_COLLECTION.forEach(item => {
  test(`ReDoS Stress: "${item.name}" with 50,000+ chars completes in <50ms`, () => {
    const start = performance.now();
    
    // Execute multiple operations to thoroughly stress the pattern engine
    if (item.regex.global) {
      item.trigger.match(item.regex);
      item.trigger.replace(item.regex, '');
    } else {
      item.regex.test(item.trigger);
    }
    
    const duration = performance.now() - start;
    assert.ok(
      duration < 50,
      `ReDoS FAILURE: Regex "${item.name}" took ${duration.toFixed(2)}ms (exceeded 50ms budget)`
    );
  });
});

// ============================================================================
// SUITE 5: Full Application Pipeline Stress Test with 50,000-char Payload Strings
// ============================================================================
console.log('\n--- Suite 5: Full Sanitizer Stress Test with 50k-char Strings ---');

test('sanitizeUrl executes with 50,000-char string in <50ms without crashing or hanging', () => {
  const evilUrl = 'javascript:' + 'a'.repeat(50000);
  const start = performance.now();
  const res = app.sanitizeUrl(evilUrl);
  const duration = performance.now() - start;
  assert.strictEqual(res, '#');
  assert.ok(duration < 50, `sanitizeUrl took ${duration.toFixed(2)}ms`);
});

test('sanitizeImageUrl executes with 50,000-char string in <50ms without crashing or hanging', () => {
  const evilImgUrl = 'data:image/svg+xml;base64,' + 'A'.repeat(50000);
  const start = performance.now();
  const res = app.sanitizeImageUrl(evilImgUrl);
  const duration = performance.now() - start;
  assert.strictEqual(res, '');
  assert.ok(duration < 50, `sanitizeImageUrl took ${duration.toFixed(2)}ms`);
});

test('escapeHtml executes with 50,000-char string in <50ms without crashing or hanging', () => {
  const evilHtml = '<script>' + 'alert(1);'.repeat(5000) + '</script>';
  const start = performance.now();
  const res = app.escapeHtml(evilHtml);
  const duration = performance.now() - start;
  assert.ok(!res.includes('<script>'));
  assert.ok(duration < 50, `escapeHtml took ${duration.toFixed(2)}ms`);
});

// ============================================================================
// Final Summary & Report
// ============================================================================
console.log('\n======================================================================');
console.log(` Challenger 2 Execution Results: ${passedTests} / ${totalTests} Passed`);
if (failedTests > 0) {
  console.log(` Failures: ${failedTests}`);
  failures.forEach((f, i) => console.log(`   ${i + 1}) ${f.title}: ${f.error}`));
  console.log(' VERDICT: REJECT ❌');
  console.log('======================================================================\n');
  process.exit(1);
} else {
  console.log(' VERDICT: APPROVE (100% PASS) ✨');
  console.log(' Zero DOM XSS Vulnerabilities, Zero ReDoS Flaws, Full Escaping Verified');
  console.log('======================================================================\n');
  process.exit(0);
}
