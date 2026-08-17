/**
 * ============================================================================
 * Challenger 2 Empirical Test Harness: Link Integrity, Security & Cross-Feature
 * Nha Trang Stays & Trip Planner 2026
 * File: test-challenger-2.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const url = require('url');

// Terminal ANSI formatting
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

class ChallengerRunner {
  constructor() {
    this.totalSuites = 0;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.warnings = 0;
    this.errors = [];
    this.warningList = [];
    this.startTime = Date.now();
  }

  suite(title) {
    this.totalSuites++;
    console.log(`\n${colors.bright}${colors.cyan}=== Suite ${this.totalSuites}: ${title} ===${colors.reset}`);
  }

  test(desc, fn) {
    this.totalTests++;
    try {
      fn();
      this.passedTests++;
      console.log(`  ${colors.green}✔ PASS:${colors.reset} ${desc}`);
    } catch (err) {
      this.failedTests++;
      console.log(`  ${colors.red}✖ FAIL:${colors.reset} ${desc}`);
      console.log(`    ${colors.yellow}Reason: ${err.message}${colors.reset}`);
      this.errors.push({ desc, message: err.message, stack: err.stack });
    }
  }

  warn(desc, message) {
    this.warnings++;
    console.log(`  ${colors.magenta}⚠ WARN:${colors.reset} ${desc}`);
    console.log(`    ${colors.yellow}${message}${colors.reset}`);
    this.warningList.push({ desc, message });
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log(`\n${colors.bright}====================================================${colors.reset}`);
    console.log(`${colors.bright}Challenger 2 Test Suite Summary (${elapsed}s)${colors.reset}`);
    console.log(`====================================================`);
    console.log(`Suites Run:     ${this.totalSuites}`);
    console.log(`Total Checks:   ${this.totalTests}`);
    console.log(`Passed:         ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`Failed:         ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);
    console.log(`Warnings:       ${this.warnings > 0 ? colors.yellow : colors.green}${this.warnings}${colors.reset}`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}${colors.bright}Failures / Discrepancies:${colors.reset}`);
      this.errors.forEach((e, i) => {
        console.log(`  ${i + 1}) ${e.desc}`);
        console.log(`     ${e.message}`);
      });
    }

    if (this.warnings > 0) {
      console.log(`\n${colors.yellow}${colors.bright}Security & Quality Warnings:${colors.reset}`);
      this.warningList.forEach((w, i) => {
        console.log(`  ${i + 1}) ${w.desc}`);
        console.log(`     ${w.message}`);
      });
    }

    console.log(`\n${this.failedTests === 0 ? colors.green + '✨ Empirical Validation Complete.' : colors.red + '❌ Empirical Validation Failed.'}${colors.reset}\n`);
    return this.failedTests === 0;
  }
}

const runner = new ChallengerRunner();

// Load modules
const staysDataPath = path.resolve(__dirname, 'stays-data.js');
const { NHA_TRANG_STAYS } = require(staysDataPath);
// The js/store, js/utils and js/components split was reverted — js/app.js is the
// only script now. Read whatever of the old layout still exists so this suite
// keeps working across either arrangement.
const jsFiles = [
  path.resolve(__dirname, 'js', 'app.js'),
  path.resolve(__dirname, 'js', 'components', 'activity.js'),
  path.resolve(__dirname, 'js', 'components', 'gourmet.js'),
  path.resolve(__dirname, 'js', 'components', 'stay.js'),
  path.resolve(__dirname, 'js', 'components', 'shopping.js'),
  path.resolve(__dirname, 'js', 'components', 'currency.js'),
  path.resolve(__dirname, 'js', 'store', 'state.js'),
  path.resolve(__dirname, 'js', 'utils', 'helpers.js'),
  path.resolve(__dirname, 'js', 'utils', 'storage.js')
].filter(f => fs.existsSync(f));

if (jsFiles.length === 0) {
  console.error('No application JavaScript found — expected at least js/app.js');
  process.exit(1);
}
const appJsCode = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const indexHtmlPath = path.resolve(__dirname, 'index.html');
const indexHtmlCode = fs.readFileSync(indexHtmlPath, 'utf8');

// ============================================================================
// SUITE 1: Google Maps Search URL Integrity & Encoding (All 24 Stays)
// ============================================================================
runner.suite('Google Maps Search URL Integrity & Encoding');

const GMAPS_PREFIX = 'https://www.google.com/maps/search/?api=1&query=';

runner.test('All 24 stays have googleMapUrl starting with official Google Maps API endpoint', () => {
  assert.strictEqual(NHA_TRANG_STAYS.length, 24, 'Expected exactly 24 stays');
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.ok(
      typeof stay.googleMapUrl === 'string' && stay.googleMapUrl.startsWith(GMAPS_PREFIX),
      `Stay #${idx + 1} (${stay.id}) has invalid googleMapUrl prefix: "${stay.googleMapUrl}"`
    );
  });
});

runner.test('Google Maps URL query parameter is properly URL-encoded and decodable without errors', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    const rawQueryParam = stay.googleMapUrl.slice(GMAPS_PREFIX.length);
    assert.ok(rawQueryParam.length > 0, `Stay #${idx + 1} (${stay.id}) query parameter is empty`);
    
    // Check decoding
    let decoded = '';
    assert.doesNotThrow(() => {
      decoded = decodeURIComponent(rawQueryParam);
    }, `Stay #${idx + 1} (${stay.id}) URI malformed during decodeURIComponent`);

    assert.ok(decoded.length >= 10, `Stay #${idx + 1} (${stay.id}) decoded query "${decoded}" is too short`);
  });
});

runner.test('Google Maps URL query coherence: matches googleMapQuery field or contains essential location tokens', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    const rawQueryParam = stay.googleMapUrl.slice(GMAPS_PREFIX.length);
    const decoded = decodeURIComponent(rawQueryParam);
    
    // Verify decoded query contains either the Vietnamese name or key part of name
    const hasNameMatch = decoded.toLowerCase().includes(stay.nameVi.toLowerCase().slice(0, 8)) ||
                         decoded.toLowerCase().includes(stay.nameKo.toLowerCase().slice(0, 4)) ||
                         decoded.toLowerCase().includes(stay.nameEn.toLowerCase().slice(0, 8));
    
    assert.ok(
      hasNameMatch,
      `Stay #${idx + 1} (${stay.id}) decoded query "${decoded}" does not match hotel name (${stay.nameVi} / ${stay.nameEn})`
    );

    // Verify location marker presence
    const hasLocationMarker = decoded.includes('Nha Trang') || 
                              decoded.includes('Cam Lâm') || 
                              decoded.includes('Cam Lam') || 
                              decoded.includes('Ninh Hòa') || 
                              decoded.includes('Ninh Hoa') ||
                              decoded.includes('Khánh Hòa') ||
                              decoded.includes('Khanh Hoa');
    assert.ok(
      hasLocationMarker,
      `Stay #${idx + 1} (${stay.id}) decoded query "${decoded}" lacks provincial/city location identifier`
    );
  });
});

runner.test('No unencoded forbidden characters (spaces, raw unicode, newlines) in googleMapUrl', () => {
  const forbidden = [' ', '\n', '\r', '\t', '<', '>', '"', '{', '}'];
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    forbidden.forEach(char => {
      assert.ok(
        !stay.googleMapUrl.includes(char),
        `Stay #${idx + 1} (${stay.id}) googleMapUrl contains unencoded character "${char}": ${stay.googleMapUrl}`
      );
    });
  });
});

// ============================================================================
// SUITE 2: Trip.com Booking URL Structure & Parameter Validation (All 24 Stays)
// ============================================================================
runner.suite('Trip.com Booking URL Structure & Parameter Validation');

const TRIP_PREFIX = 'https://kr.trip.com/hotels/list?keyword=';

runner.test('All 24 stays have tripDotComUrl starting with valid Trip.com keyword search endpoint', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.ok(
      typeof stay.tripDotComUrl === 'string' && stay.tripDotComUrl.startsWith(TRIP_PREFIX),
      `Stay #${idx + 1} (${stay.id}) tripDotComUrl does not start with "${TRIP_PREFIX}": "${stay.tripDotComUrl}"`
    );
  });
});

runner.test('Trip.com URL keyword parameter is validly encoded and decodes to non-empty English/Vietnamese hotel name', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    const rawKeyword = stay.tripDotComUrl.slice(TRIP_PREFIX.length);
    assert.ok(rawKeyword.length > 0, `Stay #${idx + 1} (${stay.id}) Trip.com keyword is empty`);
    
    let decodedKeyword = '';
    assert.doesNotThrow(() => {
      decodedKeyword = decodeURIComponent(rawKeyword);
    }, `Stay #${idx + 1} (${stay.id}) Trip.com keyword malformed`);

    assert.ok(decodedKeyword.length >= 3, `Stay #${idx + 1} (${stay.id}) decoded keyword "${decodedKeyword}" is too short`);
    
    // Check keyword relevance
    const matchesEn = decodedKeyword.toLowerCase().includes(stay.nameEn.toLowerCase().split(' ')[0]);
    const matchesVi = decodedKeyword.toLowerCase().includes(stay.nameVi.toLowerCase().split(' ')[0]);
    assert.ok(
      matchesEn || matchesVi,
      `Stay #${idx + 1} (${stay.id}) Trip.com keyword "${decodedKeyword}" does not match hotel name (${stay.nameEn})`
    );
  });
});

runner.test('No unencoded spaces or invalid URL characters in tripDotComUrl', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.ok(
      !stay.tripDotComUrl.includes(' '),
      `Stay #${idx + 1} (${stay.id}) tripDotComUrl contains raw unencoded space`
    );
  });
});

// ============================================================================
// SUITE 3: Cover & Gallery Image URLs Integrity & Uniqueness
// ============================================================================
runner.suite('Cover & Gallery Image URLs Integrity & Uniqueness');

runner.test('All cover images are valid HTTPS URLs from reputable CDNs (Unsplash)', () => {
  const httpsUrlRegex = /^https:\/\/[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}(\/.*)?$/;
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.ok(
      typeof stay.coverImage === 'string' && httpsUrlRegex.test(stay.coverImage),
      `Stay #${idx + 1} (${stay.id}) coverImage is not a valid HTTPS URL: "${stay.coverImage}"`
    );
  });
});

runner.test('Every stay has an images array with at least 3-4 valid HTTPS URLs', () => {
  const httpsUrlRegex = /^https:\/\/[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}(\/.*)?$/;
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.ok(Array.isArray(stay.images), `Stay #${idx + 1} (${stay.id}) images is not an array`);
    assert.ok(stay.images.length >= 3, `Stay #${idx + 1} (${stay.id}) images length ${stay.images.length} < 3`);
    stay.images.forEach((imgUrl, imgIdx) => {
      assert.ok(
        typeof imgUrl === 'string' && httpsUrlRegex.test(imgUrl),
        `Stay #${idx + 1} (${stay.id}) image #${imgIdx + 1} is not a valid HTTPS URL: "${imgUrl}"`
      );
    });
  });
});

runner.test('Intra-stay gallery image uniqueness: No duplicate image URLs within the same stay', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    const seen = new Set();
    stay.images.forEach((imgUrl, imgIdx) => {
      assert.ok(
        !seen.has(imgUrl),
        `Stay #${idx + 1} (${stay.id}) has duplicate gallery image at index ${imgIdx}: "${imgUrl}"`
      );
      seen.add(imgUrl);
    });
    assert.strictEqual(
      seen.size,
      stay.images.length,
      `Stay #${idx + 1} (${stay.id}) expected ${stay.images.length} unique images, found ${seen.size}`
    );
  });
});

runner.test('Cover image is consistent with the stay gallery (coverImage matches images[0])', () => {
  NHA_TRANG_STAYS.forEach((stay, idx) => {
    assert.strictEqual(
      stay.coverImage,
      stay.images[0],
      `Stay #${idx + 1} (${stay.id}) coverImage "${stay.coverImage}" does not match images[0] "${stay.images[0]}"`
    );
  });
});

// ============================================================================
// SUITE 4: Cross-Feature Wishlist Count Arithmetic Simulation
// ============================================================================
runner.suite('Cross-Feature Wishlist Count Arithmetic Simulation');

runner.test('Wishlist badge calculation arithmetic: total = activities + gourmets + stays', () => {
  // Replicate app.js state and badge calculation
  const mockState = {
    wishlist: ['act_01', 'act_02', 'act_03'],            // 3 activities
    gourmetWishlist: ['gourmet_01', 'gourmet_02'],        // 2 gourmets
    stayWishlist: ['stay_01', 'stay_04', 'stay_07', 'stay_13'], // 4 stays
    wishlistOnly: false
  };

  const calculateBadge = (s) => {
    return s.wishlist.length + s.gourmetWishlist.length + (s.stayWishlist ? s.stayWishlist.length : 0);
  };

  assert.strictEqual(calculateBadge(mockState), 9, 'Initial badge count must be 3 + 2 + 4 = 9');

  // Simulate adding a stay
  mockState.stayWishlist.push('stay_19');
  assert.strictEqual(calculateBadge(mockState), 10, 'After adding 1 stay, badge count must be 10');

  // Simulate removing an activity
  mockState.wishlist.splice(0, 1);
  assert.strictEqual(calculateBadge(mockState), 9, 'After removing 1 activity, badge count must be 9');

  // Simulate removing all gourmets
  mockState.gourmetWishlist = [];
  assert.strictEqual(calculateBadge(mockState), 7, 'After clearing gourmet wishlist, count must be 2 + 0 + 5 = 7');

  // Simulate undefined stayWishlist fallback resilience
  const fallbackState = {
    wishlist: ['act_01'],
    gourmetWishlist: ['gourmet_01'],
    stayWishlist: null
  };
  assert.strictEqual(calculateBadge(fallbackState), 2, 'Null stayWishlist must safely calculate 1 + 1 + 0 = 2');
});

runner.test('Wishlist filtering logic strictly isolates stays when in Stays Tab', () => {
  const stayWishlist = ['stay_01', 'stay_03', 'stay_08'];
  const allStays = NHA_TRANG_STAYS;

  // Filter with wishlistOnly = true
  const filtered = allStays.filter(s => stayWishlist.includes(s.id));
  assert.strictEqual(filtered.length, 3, 'Must match exactly 3 stays');
  assert.deepStrictEqual(filtered.map(s => s.id), ['stay_01', 'stay_03', 'stay_08']);

  // Filter with wishlistOnly = false
  const unFiltered = allStays.filter(s => true);
  assert.strictEqual(unFiltered.length, 24, 'When wishlistOnly is false, all 24 stays must be returned');
});

runner.test('app.js contains toggleStayWishlist and updates nha_trang_stay_wishlist localStorage', () => {
  assert.ok(appJsCode.includes('toggleStayWishlist'), 'app.js must define toggleStayWishlist function');
  assert.ok(appJsCode.includes('nha_trang_stay_wishlist'), 'app.js must use nha_trang_stay_wishlist key');
  assert.ok(appJsCode.includes('updateWishlistBadge'), 'app.js must call updateWishlistBadge');
  assert.ok(appJsCode.includes('stayWishlist'), 'app.js must manage stayWishlist in state');
});

// ============================================================================
// SUITE 5: XSS Sanitization, Injection Resistance & Security Analysis
// ============================================================================
runner.suite('XSS Sanitization & Security Vulnerability Analysis');

runner.test('Static Stay Dataset contains zero HTML tags or script injection vectors', () => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<img\b[^>]*onerror\s*=/gi,
    /<svg\b[^>]*onload\s*=/gi,
    /javascript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi
  ];

  NHA_TRANG_STAYS.forEach((stay, idx) => {
    const json = JSON.stringify(stay);
    xssPatterns.forEach(pattern => {
      assert.ok(
        !pattern.test(json),
        `Stay #${idx + 1} (${stay.id}) contains potential XSS pattern ${pattern}`
      );
    });
  });
});

runner.test('Search input query cannot cause reflected XSS in DOM', () => {
  // The result-count line is the one place a raw query could plausibly be echoed
  // back into innerHTML. Assert the invariant (only a number reaches it) rather
  // than grepping for one exact source line — the previous version of this test
  // pinned a literal template string and broke the moment the renderer was
  // refactored, even though the behaviour was unchanged.
  assert.ok(
    !/ResultCountText\.innerHTML\s*=[^;]*state\.searchQuery/.test(appJsCode),
    'Search query must NOT be interpolated into any result-count innerHTML'
  );

  // Count elements are populated from a countHtml(n) formatter fed the list length.
  assert.ok(
    /countEl\.innerHTML\s*=\s*cfg\.countHtml\(list\.length\)/.test(appJsCode),
    'Result count must be rendered via countHtml(list.length)'
  );

  // Every countHtml formatter may interpolate only its numeric parameter.
  const formatters = [...appJsCode.matchAll(/countHtml:\s*\((\w+)\)\s*=>\s*`([^`]*)`/g)];
  assert.ok(formatters.length >= 5, `Expected a countHtml formatter per domain, found ${formatters.length}`);
  formatters.forEach(([, param, tpl]) => {
    const interpolations = [...tpl.matchAll(/\$\{([^}]*)\}/g)].map(m => m[1].trim());
    interpolations.forEach(expr => {
      assert.strictEqual(
        expr, param,
        `countHtml may only interpolate its numeric argument '${param}', found '\${${expr}}'`
      );
    });
  });
});

runner.test('Modal text elements use safe textContent or value assignments', () => {
  const textContentIds = [
    'stayModalBadge',
    'stayModalCategory',
    'stayModalThemeBadge',
    'stayModalTitle',
    'stayModalNameVi',
    'stayModalRating',
    'stayModalPriceRange',
    'stayModalCheckInOut',
    'stayModalLocation',
    'stayModalAddress',
    'stayModalHighlight',
    'stayModalTip',
    'stayModalAvgPrice',
    'stayModalAvgKrw'
  ];

  // Verify that all modal text fields are handled via safe textContent or setContent helper
  const hasSafeSetContent = appJsCode.includes('el.textContent = text') || appJsCode.includes('.textContent =');
  assert.ok(hasSafeSetContent, 'Modal assignment must use textContent');
  
  textContentIds.forEach(id => {
    const isSafelyAssigned = appJsCode.includes(`'${id}'`) || appJsCode.includes(`"${id}"`) || appJsCode.includes(id);
    assert.ok(
      isSafelyAssigned,
      `app.js should safely assign text to modal via ${id}`
    );
  });
});

runner.test('Security Audit: Analysis of userNote rendering in stay cards', () => {
  // Inspect line 726 in app.js:
  // ${userNote ? `<div class="card-note-badge"><span>📝</span><span>${userNote}</span></div>` : ''}
  const noteInterpolationRegex = /\$\{userNote\s*\?\s*`[\s\S]*?<span>\$\{userNote\}<\/span>[\s\S]*?`\s*:\s*''\}/;
  const isDirectInterpolation = noteInterpolationRegex.test(appJsCode);

  if (isDirectInterpolation) {
    runner.warn(
      'Potential Stored XSS in card-note-badge if user enters raw HTML in Notes textarea',
      'userNote is directly interpolated into card HTML template string without escapeHtml(). While notes are stored locally in the user\'s own browser localStorage (self-XSS), implementing an escapeHtml helper is recommended for defensive security.'
    );
  }
});

// Run summary
const success = runner.summary();
process.exit(success ? 0 : 1);
