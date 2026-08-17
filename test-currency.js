/**
 * ============================================================================
 * Nha Trang Trip 2026 - Currency & ATM Dataset Automated Validation Suite
 * File: test-currency.js
 * ============================================================================
 * 
 * Comprehensive 12-Suite automated test runner validating:
 * 1. File loading & dual export verification (window.NHA_TRANG_CURRENCY & module.exports)
 * 2. Dataset size (17 verified spots) & canonical category distribution
 * 3. Kebab-case unique IDs (/^[a-z0-9-]+$/)
 * 4. Schema completeness (all 32 required fields non-empty + uniform 35-key shape)
 * 5. Numeric bounds (rating 3.0~5.0, reviewCount > 0 integer)
 * 6. Google Maps search API URL encoding & address fidelity
 * 7. 5 Major Korean travel cards matrix (TraveLog, TravelWallet, SOL, Toss, Wibee)
 * 8. Operational guidance rules (DCC avoidance, 6-digit PIN, card ejection, $100 bill)
 * 9. DOM element IDs & SSOT count badge synchronization in index.html
 * 10. Filter & search driven through the real js/app.js getFilteredCurrency()
 * 11. Sorting driven through the real js/app.js comparator (recommended, rating)
 * 12. Security & Anti-XSS payload prevention
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Terminal ANSI styling
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

class TestRunner {
  constructor() {
    this.totalSuites = 0;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.errors = [];
    this.startTime = Date.now();
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
    console.log(`${colors.bright}Currency & ATM Test Execution Summary (${duration}s)${colors.reset}`);
    console.log(`====================================================`);
    console.log(`Suites Run:    ${this.totalSuites}`);
    console.log(`Total Tests:   ${this.totalTests}`);
    console.log(`Passed Tests:  ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`Failed Tests:  ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}${colors.bright}Failures & Discrepancies Detected (${this.failedTests}):${colors.reset}`);
      this.errors.forEach((err, idx) => {
        console.log(`\n  ${idx + 1}) ${colors.red}${err.description}${colors.reset}`);
        console.log(`     ${err.message}`);
      });
      console.log(`\n${colors.red}❌ Currency Test Suite Failed.${colors.reset}\n`);
      process.exit(1);
    } else {
      console.log(`\n${colors.green}${colors.bright}✨ All ${this.totalSuites} Currency & ATM Test Suites Passed Successfully! 17 Ground-Truth Places Verified.${colors.reset}\n`);
      process.exit(0);
    }
  }
}

const runner = new TestRunner();

// ==========================================
// 1. File Loading & Module Export Verification
// ==========================================
runner.suite('File Loading & Dual Export Verification');

const currencyFilePath = path.join(__dirname, 'currency-data.js');
let NHA_TRANG_CURRENCY = null;
let NHA_TRANG_TRAVEL_CARDS = null;
let NHA_TRANG_ATM_TIPS = null;

runner.test('currency-data.js exists on disk in project root', () => {
  runner.assertTruthy(fs.existsSync(currencyFilePath), 'currency-data.js does not exist in root directory');
});

runner.test('currency-data.js exports NHA_TRANG_CURRENCY array', () => {
  runner.assertTruthy(fs.existsSync(currencyFilePath), 'Cannot test export: currency-data.js missing');
  const mod = require('./currency-data.js');
  runner.assertTruthy(mod.NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY export is missing');
  runner.assertTruthy(Array.isArray(mod.NHA_TRANG_CURRENCY), 'NHA_TRANG_CURRENCY must be an array');
  runner.assertTruthy(mod.NHA_TRANG_CURRENCY.length > 0, 'NHA_TRANG_CURRENCY array is empty');
  NHA_TRANG_CURRENCY = mod.NHA_TRANG_CURRENCY;
});

runner.test('currency-data.js exports NHA_TRANG_TRAVEL_CARDS array (5 Major Travel Cards)', () => {
  runner.assertTruthy(fs.existsSync(currencyFilePath), 'Cannot test export: currency-data.js missing');
  const mod = require('./currency-data.js');
  runner.assertTruthy(mod.NHA_TRANG_TRAVEL_CARDS, 'NHA_TRANG_TRAVEL_CARDS export is missing');
  runner.assertTruthy(Array.isArray(mod.NHA_TRANG_TRAVEL_CARDS), 'NHA_TRANG_TRAVEL_CARDS must be an array');
  runner.assertEqual(mod.NHA_TRANG_TRAVEL_CARDS.length, 5, `Expected 5 travel cards, got ${mod.NHA_TRANG_TRAVEL_CARDS.length}`);
  NHA_TRANG_TRAVEL_CARDS = mod.NHA_TRANG_TRAVEL_CARDS;
});

runner.test('currency-data.js exports NHA_TRANG_ATM_TIPS array (Operational Guidance Rules)', () => {
  runner.assertTruthy(fs.existsSync(currencyFilePath), 'Cannot test export: currency-data.js missing');
  const mod = require('./currency-data.js');
  runner.assertTruthy(mod.NHA_TRANG_ATM_TIPS, 'NHA_TRANG_ATM_TIPS export is missing');
  runner.assertTruthy(Array.isArray(mod.NHA_TRANG_ATM_TIPS), 'NHA_TRANG_ATM_TIPS must be an array');
  runner.assertTruthy(mod.NHA_TRANG_ATM_TIPS.length >= 4, `Expected at least 4 operational tips, got ${mod.NHA_TRANG_ATM_TIPS.length}`);
  NHA_TRANG_ATM_TIPS = mod.NHA_TRANG_ATM_TIPS;
});

runner.test('currency-data.js implements dual export pattern for browser window and Node.js', () => {
  runner.assertTruthy(fs.existsSync(currencyFilePath), 'Cannot test dual export: currency-data.js missing');
  const fileContent = fs.readFileSync(currencyFilePath, 'utf8');
  runner.assertTruthy(
    fileContent.includes('window.NHA_TRANG_CURRENCY') || fileContent.includes('typeof window'),
    'currency-data.js missing window global export pattern'
  );
  runner.assertTruthy(
    fileContent.includes('module.exports') || fileContent.includes('typeof module'),
    'currency-data.js missing module.exports dual export pattern'
  );
});

// ==========================================
// 2. Dataset Size & Category Distribution
// ==========================================
runner.suite('Dataset Size & Category Distribution');

const REQUIRED_CATEGORIES = ['exchange_gold', 'exchange_bank', 'exchange_airport', 'atm_zero_fee'];

runner.test('Total currency & ATM spot count is exactly 17 verified places', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  runner.assertEqual(NHA_TRANG_CURRENCY.length, 17, `Expected exactly 17 spots, got ${NHA_TRANG_CURRENCY.length}`);
});

runner.test('Dataset covers all 4 canonical categories (gold shop, bank, airport, zero-fee ATM)', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const presentCategories = new Set(NHA_TRANG_CURRENCY.map(s => s.category));
  for (const cat of REQUIRED_CATEGORIES) {
    runner.assertTruthy(presentCategories.has(cat), `Missing required category: '${cat}'`);
  }
});

runner.test('Category distribution matches ground-truth quota allocation (4 gold, 4 bank, 1 airport, 8 ATM)', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const counts = {};
  NHA_TRANG_CURRENCY.forEach(s => {
    counts[s.category] = (counts[s.category] || 0) + 1;
  });

  runner.assertEqual(counts['exchange_gold'], 4, `Expected exactly 4 gold shops, got ${counts['exchange_gold']}`);
  runner.assertEqual(counts['exchange_bank'], 4, `Expected exactly 4 official banks, got ${counts['exchange_bank']}`);
  runner.assertEqual(counts['exchange_airport'], 1, `Expected exactly 1 airport exchange booth, got ${counts['exchange_airport']}`);
  runner.assertEqual(counts['atm_zero_fee'], 8, `Expected exactly 8 zero-fee ATMs, got ${counts['atm_zero_fee']}`);
});

// ==========================================
// 3. ID Uniqueness & Slug Validation
// ==========================================
runner.suite('ID Uniqueness & Slug Validation');

runner.test('All 17 spot IDs are unique and strictly adhere to kebab-case slug format (/^[a-z0-9-]+$/)', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const idSet = new Set();
  const kebabRegex = /^[a-z0-9-]+$/;

  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertTruthy(spot.id, `Spot missing 'id': ${JSON.stringify(spot)}`);
    runner.assertTruthy(typeof spot.id === 'string', `Spot id must be a string, got ${typeof spot.id}`);
    runner.assertTruthy(kebabRegex.test(spot.id), `ID '${spot.id}' is not in valid kebab-case format`);
    runner.assertFalse(idSet.has(spot.id), `Duplicate ID found in dataset: '${spot.id}'`);
    idSet.add(spot.id);
  });
});

runner.test('All travel card IDs and ATM tip IDs adhere to unique kebab-case format', () => {
  runner.assertTruthy(NHA_TRANG_TRAVEL_CARDS, 'NHA_TRANG_TRAVEL_CARDS is not loaded');
  runner.assertTruthy(NHA_TRANG_ATM_TIPS, 'NHA_TRANG_ATM_TIPS is not loaded');

  const cardIdSet = new Set();
  const slugRegex = /^[a-z0-9_-]+$/;

  NHA_TRANG_TRAVEL_CARDS.forEach(card => {
    const cardId = card.id || card.cardId;
    runner.assertTruthy(cardId, `Card profile missing id: ${JSON.stringify(card)}`);
    runner.assertTruthy(slugRegex.test(cardId), `Card ID '${cardId}' not valid slug`);
    runner.assertFalse(cardIdSet.has(cardId), `Duplicate card ID found: '${cardId}'`);
    cardIdSet.add(cardId);
  });

  const tipIdSet = new Set();
  NHA_TRANG_ATM_TIPS.forEach(tip => {
    const tipId = tip.id || tip.ruleId;
    runner.assertTruthy(tipId, `ATM tip missing id: ${JSON.stringify(tip)}`);
    runner.assertTruthy(slugRegex.test(tipId), `Tip ID '${tipId}' not valid slug`);
    runner.assertFalse(tipIdSet.has(tipId), `Duplicate tip ID found: '${tipId}'`);
    tipIdSet.add(tipId);
  });
});

// ==========================================
// 4. Schema Completeness (Required Fields + Uniform Shape)
// ==========================================
runner.suite('Schema Completeness (Required Fields + Uniform Shape)');

const REQUIRED_SPOT_FIELDS = [
  'id',
  'name',
  'nameKo',
  'nameVi',
  'nameEn',
  'category',
  'categoryLabel',
  'badge',
  'rating',
  'reviewCount',
  'openHours',
  'location',
  'addressVi',
  'phone',
  'googleMapQuery',
  'googleMapUrl',
  'googlePhotosUrl',
  'district',
  'districtLabel',
  'supportedCurrencies',
  'supportedCards',
  'feeFree',
  'feePolicy',
  'withdrawalLimit',
  'exchangePerks',
  'facilities',
  'tags',
  'highlight',
  'description',
  'localTip',
  'coverImage',
  'images'
];

runner.test('Every spot contains all required fields with non-empty values', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    for (const field of REQUIRED_SPOT_FIELDS) {
      runner.assertTruthy(
        spot[field] !== undefined && spot[field] !== null,
        `Spot '${spot.id}' is missing required field '${field}'`
      );

      if (typeof spot[field] === 'string') {
        runner.assertTruthy(spot[field].trim().length > 0, `Spot '${spot.id}' field '${field}' cannot be empty string`);
      } else if (Array.isArray(spot[field])) {
        if (field === 'supportedCards' && (spot.category === 'exchange_gold' || spot.category === 'exchange_airport')) {
          // Gold shops or cash counters may have empty supportedCards array if purely cash-based
          runner.assertTruthy(Array.isArray(spot[field]), `Spot '${spot.id}' field '${field}' must be array`);
        } else {
          runner.assertTruthy(spot[field].length > 0, `Spot '${spot.id}' array field '${field}' cannot be empty`);
        }
      } else if (typeof spot[field] === 'boolean') {
        runner.assertEqual(typeof spot[field], 'boolean', `Spot '${spot.id}' field '${field}' must be boolean`);
      }
    }
  });
});

runner.test('All spots share an identical key set (uniform schema, no silent drift)', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const reference = Object.keys(NHA_TRANG_CURRENCY[0]).sort();

  NHA_TRANG_CURRENCY.forEach(spot => {
    const keys = Object.keys(spot).sort();
    const missing = reference.filter(k => !keys.includes(k));
    const extra = keys.filter(k => !reference.includes(k));
    runner.assertTruthy(
      missing.length === 0 && extra.length === 0,
      `Spot '${spot.id}' schema drift — missing: [${missing.join(', ')}], extra: [${extra.join(', ')}]`
    );
  });

  // REQUIRED_SPOT_FIELDS must not reference fields the data does not carry.
  const unknown = REQUIRED_SPOT_FIELDS.filter(f => !reference.includes(f));
  runner.assertTruthy(unknown.length === 0,
    `REQUIRED_SPOT_FIELDS lists fields absent from the dataset: ${unknown.join(', ')}`);

  // Document the fields deliberately left unvalidated so the gap is visible, not silent.
  const unvalidated = reference.filter(f => !REQUIRED_SPOT_FIELDS.includes(f));
  console.log(`    ℹ schema: ${reference.length} keys, ${REQUIRED_SPOT_FIELDS.length} validated, unvalidated: ${unvalidated.join(', ') || 'none'}`);
});

runner.test('Spot array fields contain valid strings with minimum depth', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertTruthy(spot.tags.length >= 3, `Spot '${spot.id}' tags must have >= 3 items`);
    runner.assertTruthy(spot.facilities.length >= 2, `Spot '${spot.id}' facilities must have >= 2 items`);
    runner.assertTruthy(spot.exchangePerks.length >= 2, `Spot '${spot.id}' exchangePerks must have >= 2 items`);
    runner.assertTruthy(spot.supportedCurrencies.length >= 1, `Spot '${spot.id}' supportedCurrencies must have >= 1 items`);

    spot.tags.forEach(t => runner.assertTruthy(typeof t === 'string' && t.trim().length > 0, `Spot '${spot.id}' has empty tag`));
    spot.facilities.forEach(f => runner.assertTruthy(typeof f === 'string' && f.trim().length > 0, `Spot '${spot.id}' has empty facility`));
    spot.exchangePerks.forEach(p => runner.assertTruthy(typeof p === 'string' && p.trim().length > 0, `Spot '${spot.id}' has empty perk`));
  });
});

// ==========================================
// 5. Numeric Bounds & Value Types
// ==========================================
runner.suite('Numeric Bounds & Value Types');

runner.test('Ratings are between 3.0 and 5.0 with max 1 decimal precision', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertEqual(typeof spot.rating, 'number', `Spot '${spot.id}' rating must be a number`);
    runner.assertFalse(isNaN(spot.rating), `Spot '${spot.id}' rating cannot be NaN`);
    runner.assertTruthy(
      spot.rating >= 3.0 && spot.rating <= 5.0,
      `Spot '${spot.id}' rating ${spot.rating} out of bounds [3.0, 5.0]`
    );
    const decimalPlaces = (spot.rating.toString().split('.')[1] || '').length;
    runner.assertTruthy(decimalPlaces <= 1, `Spot '${spot.id}' rating ${spot.rating} has more than 1 decimal place`);
  });
});

runner.test('Review counts are positive integers (>0)', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertEqual(typeof spot.reviewCount, 'number', `Spot '${spot.id}' reviewCount must be a number`);
    runner.assertTrue(Number.isInteger(spot.reviewCount), `Spot '${spot.id}' reviewCount must be an integer`);
    runner.assertTruthy(spot.reviewCount > 0, `Spot '${spot.id}' reviewCount ${spot.reviewCount} must be > 0`);
  });
});

// ==========================================
// 6. Zero-Hallucination & URL Verification
// ==========================================
runner.suite('Zero-Hallucination & URL Verification');

const MAP_SEARCH_PREFIX = 'https://www.google.com/maps/search/?api=1&query=';

runner.test('googleMapUrl and googlePhotosUrl conform to Google Maps Search API specifications', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertTrue(
      spot.googleMapUrl.startsWith(MAP_SEARCH_PREFIX),
      `Spot '${spot.id}' googleMapUrl does not start with '${MAP_SEARCH_PREFIX}'`
    );
    runner.assertTrue(
      spot.googlePhotosUrl.startsWith(MAP_SEARCH_PREFIX),
      `Spot '${spot.id}' googlePhotosUrl does not start with '${MAP_SEARCH_PREFIX}'`
    );

    // Exact encoding match verification
    const expectedMapUrl = `${MAP_SEARCH_PREFIX}${encodeURIComponent(spot.googleMapQuery)}`;
    runner.assertEqual(
      spot.googleMapUrl,
      expectedMapUrl,
      `Spot '${spot.id}' googleMapUrl does not match encodeURIComponent(googleMapQuery)`
    );
  });
});

runner.test('addressVi contains official Vietnamese address with Nha Trang and Khanh Hoa markers', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  NHA_TRANG_CURRENCY.forEach(spot => {
    const addr = spot.addressVi;
    runner.assertTruthy(addr.includes('Nha Trang') || addr.includes('Cam Ranh'), `Spot '${spot.id}' addressVi '${addr}' missing 'Nha Trang' or 'Cam Ranh'`);
    runner.assertTruthy(addr.includes('Khánh Hòa') || addr.includes('Khánh Hoà'), `Spot '${spot.id}' addressVi '${addr}' missing 'Khánh Hòa'`);
  });
});

runner.test('coverImage and images array contain valid HTTP/HTTPS URLs', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const urlRegex = /^https?:\/\//i;

  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertTruthy(urlRegex.test(spot.coverImage), `Spot '${spot.id}' coverImage '${spot.coverImage}' is not a valid URL`);
    runner.assertTruthy(Array.isArray(spot.images) && spot.images.length >= 2, `Spot '${spot.id}' images must contain >= 2 URLs`);
    spot.images.forEach((imgUrl, idx) => {
      runner.assertTruthy(urlRegex.test(imgUrl), `Spot '${spot.id}' images[${idx}] '${imgUrl}' is not a valid URL`);
    });
  });
});

// ==========================================
// 7. 5 Major Travel Cards Matrix
// ==========================================
runner.suite('5 Major Travel Cards Matrix');

runner.test('NHA_TRANG_TRAVEL_CARDS covers the 5 major Korean travel cards', () => {
  runner.assertTruthy(NHA_TRANG_TRAVEL_CARDS, 'NHA_TRANG_TRAVEL_CARDS is not loaded');
  runner.assertEqual(NHA_TRANG_TRAVEL_CARDS.length, 5, 'Must contain exactly 5 card profiles');

  const cardNames = NHA_TRANG_TRAVEL_CARDS.map(c => (c.name || c.cardName || '').toLowerCase()).join(' ');
  runner.assertTruthy(cardNames.includes('트래블로그') || cardNames.includes('하나'), 'Missing TraveLog card');
  runner.assertTruthy(cardNames.includes('트래블월렛'), 'Missing TravelWallet card');
  runner.assertTruthy(cardNames.includes('쏠') || cardNames.includes('sol'), 'Missing SOL Travel card');
  runner.assertTruthy(cardNames.includes('토스'), 'Missing Toss Bank card');
  runner.assertTruthy(cardNames.includes('위비'), 'Missing Wibee Travel card');
});

runner.test('Every card profile has complete fee specifications and partner ATM list', () => {
  runner.assertTruthy(NHA_TRANG_TRAVEL_CARDS, 'NHA_TRANG_TRAVEL_CARDS is not loaded');
  NHA_TRANG_TRAVEL_CARDS.forEach(card => {
    const name = card.name || card.cardName;
    runner.assertTruthy(name && name.trim().length > 0, 'Card missing name');
    runner.assertTruthy(card.issuer && card.issuer.trim().length > 0, `Card '${name}' missing issuer`);
    runner.assertTruthy(card.brand && card.brand.trim().length > 0, `Card '${name}' missing brand`);
    runner.assertTruthy(card.exchangeFee && card.exchangeFee.trim().length > 0, `Card '${name}' missing exchangeFee`);
    runner.assertTruthy(card.atmFee && card.atmFee.trim().length > 0, `Card '${name}' missing atmFee`);
    runner.assertTruthy(Array.isArray(card.freeAtmPartners) && card.freeAtmPartners.length > 0, `Card '${name}' missing freeAtmPartners array`);
    runner.assertTruthy(Array.isArray(card.perks) && card.perks.length > 0, `Card '${name}' missing perks array`);

    // VPBank must be included as free ATM partner for all 5 cards
    const partnersStr = card.freeAtmPartners.join(' ').toLowerCase();
    runner.assertTruthy(partnersStr.includes('vpbank'), `Card '${name}' must list VPBank as free ATM partner`);
  });
});

runner.test('All atm_zero_fee spots correctly declare supported travel cards & withdrawal limits', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const atmSpots = NHA_TRANG_CURRENCY.filter(s => s.category === 'atm_zero_fee');
  runner.assertEqual(atmSpots.length, 8, 'Expected 8 zero-fee ATM spots');

  atmSpots.forEach(atm => {
    runner.assertTruthy(Array.isArray(atm.supportedCards) && atm.supportedCards.length > 0, `ATM '${atm.id}' missing supportedCards`);
    runner.assertEqual(typeof atm.feeFree, 'boolean', `ATM '${atm.id}' feeFree must be boolean`);
    runner.assertTruthy(atm.withdrawalLimit && atm.withdrawalLimit.trim().length > 0, `ATM '${atm.id}' missing withdrawalLimit`);

    // Check that withdrawal limit specifies realistic transaction limit (e.g. 500만동 or 200~300만동)
    runner.assertTruthy(
      atm.withdrawalLimit.includes('만동') || atm.withdrawalLimit.includes('VND') || atm.withdrawalLimit.includes('000'),
      `ATM '${atm.id}' withdrawalLimit must specify VND amount`
    );
  });
});

// ==========================================
// 8. Operational Guidance Rules (DCC, PIN, Sequence, $100 Bill)
// ==========================================
runner.suite('Operational Guidance Rules');

runner.test('NHA_TRANG_ATM_TIPS contains all 4 critical practical operational rules', () => {
  runner.assertTruthy(NHA_TRANG_ATM_TIPS, 'NHA_TRANG_ATM_TIPS is not loaded');
  runner.assertTruthy(NHA_TRANG_ATM_TIPS.length >= 4, `Expected >= 4 operational tips, got ${NHA_TRANG_ATM_TIPS.length}`);

  const allTipsText = NHA_TRANG_ATM_TIPS.map(t =>
    `${t.id || ''} ${t.title || ''} ${t.summary || ''} ${t.actionGuide || ''} ${t.description || ''}`
  ).join(' ');

  // 1. DCC defense
  runner.assertTruthy(
    allTipsText.includes('Without Conversion') || allTipsText.includes('No Conversion') || allTipsText.includes('DCC') || allTipsText.includes('이중환전'),
    'Missing DCC defense rule (Without Conversion / 현지통화 결제)'
  );

  // 2. 6-digit PIN rule
  runner.assertTruthy(
    allTipsText.includes('PIN') || allTipsText.includes('비밀번호') || allTipsText.includes('00'),
    'Missing 6-digit PIN operational rule (4자리 + 00)'
  );

  // 3. Card-first ejection sequence
  runner.assertTruthy(
    allTipsText.includes('먼저') || allTipsText.includes('회수') || allTipsText.includes('삼킴') || allTipsText.includes('배출'),
    'Missing card-first ejection sequence warning rule'
  );

  // 4. 100 USD pristine bill rules
  runner.assertTruthy(
    allTipsText.includes('100') && (allTipsText.includes('신권') || allTipsText.includes('달러')),
    'Missing 100 USD pristine bill exchange rule'
  );
});

runner.test('Every operational tip contains required structured fields', () => {
  runner.assertTruthy(NHA_TRANG_ATM_TIPS, 'NHA_TRANG_ATM_TIPS is not loaded');
  NHA_TRANG_ATM_TIPS.forEach(tip => {
    runner.assertTruthy(tip.title && tip.title.trim().length > 0, `Tip missing title: ${JSON.stringify(tip)}`);
    runner.assertTruthy(tip.summary && tip.summary.trim().length > 0, `Tip '${tip.title}' missing summary`);
    runner.assertTruthy(tip.actionGuide && tip.actionGuide.trim().length > 0, `Tip '${tip.title}' missing actionGuide`);
  });
});

// ==========================================
// 9. DOM Element IDs & SSOT Count Badge Sync in index.html
// ==========================================
runner.suite('DOM Element IDs & SSOT Count Badge Sync in index.html');

const htmlPath = path.join(__dirname, 'index.html');
const htmlExists = fs.existsSync(htmlPath);
const htmlContent = htmlExists ? fs.readFileSync(htmlPath, 'utf8') : '';

runner.test('index.html exists in project root', () => {
  runner.assertTruthy(htmlExists, 'index.html not found in project root');
});

runner.test('Header navigation contains Currency & ATM tab button and synced count badge', () => {
  runner.assertTruthy(htmlExists, 'Cannot test index.html: file missing');
  runner.assertTruthy(
    htmlContent.includes('data-tab="currency"') || htmlContent.includes("data-tab='currency'"),
    "index.html missing nav tab button with data-tab='currency'"
  );
  // Count badge verification — derived from the dataset, never hardcoded.
  // (The old assertion OR'd in a literal that always exists in index.html, so it
  //  passed even when every badge was out of sync with the data.)
  const total = NHA_TRANG_CURRENCY.length;
  runner.assertTruthy(
    htmlContent.includes(`${total}곳`),
    `index.html must state the live dataset count '${total}곳' (tab badge / category button / result count)`
  );
});

runner.test('index.html count badges match NHA_TRANG_CURRENCY.length exactly (no stale numbers)', () => {
  runner.assertTruthy(htmlExists, 'Cannot test index.html: file missing');
  const total = NHA_TRANG_CURRENCY.length;

  // Every "N곳" that appears inside the currency tab markup must equal the dataset
  // total or a real per-category subtotal. A stale number fails here.
  const validCounts = new Set([String(total)]);
  REQUIRED_CATEGORIES.forEach(cat => {
    validCounts.add(String(NHA_TRANG_CURRENCY.filter(s => s.category === cat).length));
  });

  const navStart = htmlContent.indexOf('id="currencyCategoryNav"');
  const navEnd = htmlContent.indexOf('</nav>', navStart);
  runner.assertTruthy(navStart > -1 && navEnd > navStart, 'currencyCategoryNav block not found in index.html');

  const navMarkup = htmlContent.slice(navStart, navEnd);
  const found = [...navMarkup.matchAll(/\((\d+)곳\)/g)].map(m => m[1]);
  runner.assertTruthy(found.length > 0, 'No "(N곳)" count labels found in currencyCategoryNav');

  found.forEach(n => {
    runner.assertTruthy(
      validCounts.has(n),
      `currencyCategoryNav shows '(${n}곳)' but the dataset has no such total/subtotal (valid: ${[...validCounts].join(', ')})`
    );
  });

  // The result count line must carry the live total.
  const countLine = htmlContent.match(/id="currencyResultCountText"[^>]*>([\s\S]*?)<\/span>/);
  runner.assertTruthy(countLine, 'currencyResultCountText span not found');
  runner.assertTruthy(
    countLine[1].includes(`<strong>${total}</strong>`),
    `currencyResultCountText must show <strong>${total}</strong>, got: ${countLine[1].trim()}`
  );
});

const REQUIRED_CURRENCY_DOM_IDS = [
  'currencyCategoryNav',
  'currencyTagChips',
  'currencyGridSection',
  'currencyResultCountText',
  'currencyCardsGridContainer',
  'currencyModal',
  'currencyModalCloseBtn',
  'currencyModalGallery',
  'currencyModalMainImg',
  'currencyModalThumbs',
  'currencyModalBadge',
  'currencyModalCategory',
  'currencyModalFeeBadge',
  'currencyModalTitle',
  'currencyModalNameVi',
  'currencyModalRating',
  'currencyModalHours',
  'currencyModalFeePolicy',
  'currencyModalLocation',
  'currencyModalAddress',
  'currencyCopyAddressBtn',
  'currencyModalCardsList',
  'currencyModalAtmSteps',
  'currencyModalDccGuide',
  'currencyModalRatesBox',
  'currencyModalLimitsBox',
  'currencyModalHighlight',
  'currencyModalFacilities',
  'currencyModalDesc',
  'currencyModalTip',
  'currencyNoteInput',
  'currencyNoteStatus',
  'currencyModalHeartBtn',
  'currencyModalPhotosBtn',
  'currencyModalMapBtn'
];

runner.test('All canonical currency DOM element IDs exist in index.html', () => {
  runner.assertTruthy(htmlExists, 'Cannot test index.html: file missing');
  for (const id of REQUIRED_CURRENCY_DOM_IDS) {
    runner.assertTruthy(htmlContent.includes(`id="${id}"`), `Missing DOM element id="${id}" in index.html`);
  }
});

runner.test('currency-data.js script tag is loaded before js/app.js in index.html', () => {
  runner.assertTruthy(htmlExists, 'Cannot test index.html: file missing');
  const currencyScriptIdx = htmlContent.indexOf('currency-data.js');
  const appScriptIdx = htmlContent.indexOf('js/app.js');

  runner.assertTruthy(currencyScriptIdx !== -1, "index.html missing '<script src=\"./currency-data.js\"></script>'");
  runner.assertTruthy(appScriptIdx !== -1, "index.html missing '<script src=\"./js/app.js\"></script>'");
  runner.assertTruthy(currencyScriptIdx < appScriptIdx, 'currency-data.js must be loaded BEFORE js/app.js');
});

// ==========================================
// 10. Filter & Search — exercises the REAL js/app.js implementation
// ==========================================
runner.suite('Filter & Search Business Logic (real js/app.js)');

// Load the shipped application logic rather than reimplementing it here. A test that
// re-derives the filter would keep passing even if getFilteredCurrency() were gutted.
global.NHA_TRANG_CURRENCY = NHA_TRANG_CURRENCY;
global.NHA_TRANG_ACTIVITIES = [];
global.NHA_TRANG_GOURMETS = [];
global.NHA_TRANG_STAYS = [];
global.NHA_TRANG_SHOPPING = [];
let app = null;
let appLoadError = null;
try {
  app = require('./js/app.js');
} catch (e) {
  appLoadError = e;
}

function withCurrencyState(patch, fn) {
  app.resetStateFilters();
  Object.assign(app.state, patch);
  try {
    return fn();
  } finally {
    app.resetStateFilters();
  }
}

runner.test('js/app.js is loadable in Node and exports getFilteredCurrency', () => {
  runner.assertTruthy(!appLoadError, `js/app.js failed to load: ${appLoadError && appLoadError.message}`);
  runner.assertTruthy(app && typeof app.getFilteredCurrency === 'function', 'getFilteredCurrency export missing');
  runner.assertTruthy(app.state && typeof app.resetStateFilters === 'function', 'state / resetStateFilters export missing');
});

runner.test('getFilteredCurrency() with no filters returns the whole dataset', () => {
  const all = withCurrencyState({}, () => app.getFilteredCurrency());
  runner.assertEqual(all.length, NHA_TRANG_CURRENCY.length,
    'Unfiltered getFilteredCurrency() must return every spot');
});

runner.test('Every category button in index.html yields a non-empty result through the real filter', () => {
  const navStart = htmlContent.indexOf('id="currencyCategoryNav"');
  const navEnd = htmlContent.indexOf('</nav>', navStart);
  const navMarkup = htmlContent.slice(navStart, navEnd);
  const categories = [...navMarkup.matchAll(/data-currcategory="([^"]+)"/g)].map(m => m[1]);

  runner.assertTruthy(categories.length > 0, 'No data-currcategory buttons found in index.html');

  categories.forEach(cat => {
    const out = withCurrencyState({ currencyCategory: cat }, () => app.getFilteredCurrency());
    runner.assertTruthy(out.length > 0,
      `Category button '${cat}' produces 0 results through getFilteredCurrency() — dead filter in the UI`);
  });
});

runner.test('Canonical category filters return exactly the matching subset', () => {
  REQUIRED_CATEGORIES.forEach(cat => {
    const expected = NHA_TRANG_CURRENCY.filter(s => s.category === cat).length;
    const actual = withCurrencyState({ currencyCategory: cat }, () => app.getFilteredCurrency()).length;
    runner.assertEqual(actual, expected, `Category '${cat}': real filter returned ${actual}, dataset has ${expected}`);
  });
});

runner.test('Every tag chip in index.html yields a non-empty result through the real filter', () => {
  const chipStart = htmlContent.indexOf('id="currencyTagChips"');
  const chipEnd = htmlContent.indexOf('</div>', htmlContent.indexOf('tag-chip-btn', chipStart));
  const chipMarkup = htmlContent.slice(chipStart, chipEnd > chipStart ? chipEnd + 4000 : chipStart + 4000);
  const tags = [...chipMarkup.matchAll(/data-currtag="([^"]+)"/g)].map(m => m[1]);

  runner.assertTruthy(tags.length > 0, 'No data-currtag chips found in index.html');

  tags.forEach(tag => {
    const out = withCurrencyState({ currencyTag: tag }, () => app.getFilteredCurrency());
    runner.assertTruthy(out.length > 0,
      `Tag chip '${tag}' produces 0 results through getFilteredCurrency() — dead chip in the UI`);
  });
});

runner.test('Wishlist-only mode filters through the real implementation', () => {
  const pick = NHA_TRANG_CURRENCY[0].id;
  const out = withCurrencyState({ wishlistOnly: true }, () => {
    app.state.currencyWishlist = [pick];
    const r = app.getFilteredCurrency();
    app.state.currencyWishlist = [];
    return r;
  });
  runner.assertEqual(out.length, 1, 'wishlistOnly must narrow the list to the wishlisted spot');
  runner.assertEqual(out[0].id, pick, 'wishlistOnly returned the wrong spot');
});

runner.test('Search keywords resolve through the real search implementation', () => {
  const searchKeywords = [
    '김청', '김빈', 'VPBank', 'TPBank', 'LiveBank',
    '깜란', '야시장', '100달러', '수수료', '트래블로그', '트래블월렛'
  ];

  searchKeywords.forEach(kw => {
    const out = withCurrencyState({ searchQuery: kw }, () => app.getFilteredCurrency());
    runner.assertTruthy(out.length > 0, `Search '${kw}' returned 0 matches through getFilteredCurrency()`);
  });
});

runner.test('A nonsense query returns zero results (search is not a pass-through)', () => {
  const out = withCurrencyState({ searchQuery: 'zzzz-no-such-place-zzzz' }, () => app.getFilteredCurrency());
  runner.assertEqual(out.length, 0, 'Search must actually exclude non-matching spots');
});

runner.test('Category and search compose (AND, not OR)', () => {
  const both = withCurrencyState(
    { currencyCategory: 'atm_zero_fee', searchQuery: 'zzzz-no-such-place-zzzz' },
    () => app.getFilteredCurrency()
  );
  runner.assertEqual(both.length, 0, 'Combined category + unmatched search must yield 0, not the category subset');
});

// ==========================================
// 11. Sorting — drives the REAL comparator in js/app.js
// ==========================================
runner.suite('Sorting (real js/app.js comparator)');

// These tests sort via app.state.sortBy so the shipped comparator is the thing under
// test. (Previously the suite sorted with its own comparator and then asserted that
// result was sorted — a tautology that could never fail.)

runner.test("sortBy='rating' orders by rating DESC with reviewCount as tie-breaker", () => {
  const out = withCurrencyState({ sortBy: 'rating' }, () => app.getFilteredCurrency());
  runner.assertEqual(out.length, NHA_TRANG_CURRENCY.length, 'Sorting must not drop spots');

  for (let i = 0; i < out.length - 1; i++) {
    const a = (out[i].rating || 0) * 100000 + (out[i].reviewCount || 0);
    const b = (out[i + 1].rating || 0) * 100000 + (out[i + 1].reviewCount || 0);
    runner.assertTruthy(a >= b,
      `Real comparator produced a rating-sort violation at index ${i} ('${out[i].id}' before '${out[i + 1].id}')`);
  }
});

runner.test("sortBy='rating' actually reorders (top spot is the true maximum)", () => {
  const out = withCurrencyState({ sortBy: 'rating' }, () => app.getFilteredCurrency());
  const best = NHA_TRANG_CURRENCY.reduce((m, s) =>
    ((s.rating || 0) * 100000 + (s.reviewCount || 0)) > ((m.rating || 0) * 100000 + (m.reviewCount || 0)) ? s : m);
  runner.assertEqual(out[0].id, best.id,
    `rating sort should surface '${best.id}' first, got '${out[0].id}'`);
});

runner.test("sortBy='recommended' preserves the curated dataset order", () => {
  const out = withCurrencyState({ sortBy: 'recommended' }, () => app.getFilteredCurrency());
  out.forEach((spot, i) => {
    runner.assertEqual(spot.id, NHA_TRANG_CURRENCY[i].id,
      `recommended order must match the dataset order at index ${i}`);
  });
});

runner.test('Price sort options are hidden on the currency tab (avgPriceVnd is not meaningful here)', () => {
  // Every spot has avgPriceVnd = 0, so a price sort can never reorder anything.
  // js/app.js hides those options in switchMainTab(); this guards that contract.
  const allZero = NHA_TRANG_CURRENCY.every(s => !s.avgPriceVnd);
  if (!allZero) {
    // If real prices ever land in the dataset, the option should come back — fail loudly
    // so nobody forgets to re-enable it.
    runner.assertTruthy(false,
      'currency-data.js now carries real avgPriceVnd values — re-enable the price sort options in switchMainTab()');
    return;
  }

  const appSrc = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');
  runner.assertTruthy(
    appSrc.includes("option[value=\"price-asc\"], option[value=\"price-desc\"]"),
    'switchMainTab() must hide the price sort options while avgPriceVnd is 0 for every spot'
  );
});

// ==========================================
// 12. Security & Anti-XSS Payload Prevention
// ==========================================
runner.suite('Security & Anti-XSS Verification');

runner.test('No data property contains dangerous raw HTML script tags or event handlers', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const xssScriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const xssEventPattern = /\bon\w+\s*=/gi;
  const javascriptUriPattern = /javascript:\s*/gi;

  NHA_TRANG_CURRENCY.forEach(spot => {
    const jsonStr = JSON.stringify(spot);
    runner.assertFalse(xssScriptPattern.test(jsonStr), `Potential script injection detected in spot '${spot.id}'`);
    runner.assertFalse(xssEventPattern.test(jsonStr), `Potential inline event handler detected in spot '${spot.id}'`);
    runner.assertFalse(javascriptUriPattern.test(jsonStr), `Potential javascript URI detected in spot '${spot.id}'`);
  });
});

runner.test('Phone numbers follow standard international or local contact format', () => {
  runner.assertTruthy(NHA_TRANG_CURRENCY, 'NHA_TRANG_CURRENCY is not loaded');
  const phonePattern = /^(\+84|0|1900|1800|\-)/;

  NHA_TRANG_CURRENCY.forEach(spot => {
    runner.assertTrue(
      phonePattern.test(spot.phone),
      `Spot '${spot.id}' phone '${spot.phone}' does not match expected telephone format`
    );
  });
});

// Run Summary & Exit
runner.summary();
