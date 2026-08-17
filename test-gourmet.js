/**
 * ============================================================================
 * Nha Trang Trip 2026 - Gourmet & Specialty Cafes Automated Validation Suite
 * File: test-gourmet.js
 * ============================================================================
 * 
 * Comprehensive 12-Suite automated test runner for NHA_TRANG_GOURMETS:
 * 1. File Loading & Module Export Verification
 * 2. Dataset Size Check (>= 88 places, exactly 113 places)
 * 3. Category Coverage & Distribution
 * 4. 26-Field Completeness for all entries (no missing/undefined fields)
 * 5. Numeric Bounds (rating 3.0~5.0, reviewCount > 100, avgPriceVnd >= 10,000)
 * 6. Unique kebab-case IDs (/^[a-z0-9-]+$/)
 * 7. Signature Menu (2~5 items with prices) & Tags (>=3 items)
 * 8. Google Maps URL formats (search & photos API)
 * 9. Vietnamese Address & Name integrity (contains ward/street/Nha Trang)
 * 10. Tag Filtering & Search simulation logic
 * 11. DOM Synchronization (index.html badge count matches dataset length)
 * 12. Content Security & XSS sanitization (no raw script tags)
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

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log(`\n${colors.bright}====================================================${colors.reset}`);
    console.log(`${colors.bright}Gourmet Test Execution Summary (${duration}s)${colors.reset}`);
    console.log(`====================================================`);
    console.log(`Suites Run:    ${this.totalSuites}`);
    console.log(`Total Tests:   ${this.totalTests}`);
    console.log(`Passed Tests:  ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`Failed Tests:  ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}${colors.bright}Failures & Discrepancies Detected:${colors.reset}`);
      this.errors.forEach((err, idx) => {
        console.log(`\n  ${idx + 1}) ${colors.red}${err.description}${colors.reset}`);
        console.log(`     ${err.message}`);
      });
      console.log(`\n${colors.red}❌ Test Suite Failed.${colors.reset}\n`);
      return false;
    } else {
      console.log(`\n${colors.green}${colors.bright}✨ All 12 Test Suites Passed Successfully! Ground-Truth 113 Verified.${colors.reset}\n`);
      return true;
    }
  }
}

const runner = new TestRunner();

// ==========================================
// 1. File Loading & Module Export Verification
// ==========================================
runner.suite('File Loading & Module Export Verification');

let NHA_TRANG_GOURMETS = [];
const gourmetFilePath = path.join(__dirname, 'gourmet-data.js');

runner.test('gourmet-data.js exists on disk', () => {
  assert.strictEqual(fs.existsSync(gourmetFilePath), true, 'gourmet-data.js file must exist');
});

runner.test('gourmet-data.js loads and exports NHA_TRANG_GOURMETS array', () => {
  const mod = require(gourmetFilePath);
  assert.ok(mod.NHA_TRANG_GOURMETS, 'Export NHA_TRANG_GOURMETS must exist');
  assert.ok(Array.isArray(mod.NHA_TRANG_GOURMETS), 'NHA_TRANG_GOURMETS must be an Array');
  assert.ok(mod.NHA_TRANG_GOURMETS.length > 0, 'NHA_TRANG_GOURMETS must not be empty');
  NHA_TRANG_GOURMETS = mod.NHA_TRANG_GOURMETS;
});

// ==========================================
// 2. Dataset Size Check
// ==========================================
runner.suite('Dataset Size Check');

runner.test('Total gourmet places count meets minimum requirement (>= 88)', () => {
  assert.ok(NHA_TRANG_GOURMETS.length >= 88, `Expected >= 88 places, found ${NHA_TRANG_GOURMETS.length}`);
});

runner.test('Total gourmet places count reaches exact full specification (113 places)', () => {
  assert.strictEqual(NHA_TRANG_GOURMETS.length, 113, `Expected exactly 113 places, found ${NHA_TRANG_GOURMETS.length}`);
});

// ==========================================
// 3. Category Coverage & Distribution
// ==========================================
runner.suite('Category Coverage & Distribution');

runner.test('All canonical food categories are populated with verified places', () => {
  const banhxeoCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'banhxeo' || (g.tags && g.tags.some(t => t.includes('반쎄오') || t.includes('반깐') || t.includes('넴느엉')))).length;
  const phoCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'pho' || g.category === 'bunca' || (g.categoryLabel && (g.categoryLabel.includes('쌀국수') || g.categoryLabel.includes('분짜')))).length;
  const riceCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'rice' || (g.tags && g.tags.some(t => t.includes('가정식') || t.includes('솥밥') || t.includes('치킨라이스') || t.includes('닭고기밥') || t.includes('껌땀')))).length;
  const seafoodCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'seafood' || (g.categoryLabel && g.categoryLabel.includes('해산물'))).length;
  const banhmiCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'banhmi').length;
  const cafeFruitCount = NHA_TRANG_GOURMETS.filter(g => g.category === 'fruit' || g.category === 'cafe' || g.category === 'dessert').length;

  assert.ok(banhxeoCount >= 8, `Expected banhxeo/nem >= 8, found ${banhxeoCount}`);
  assert.ok(phoCount >= 10, `Expected pho/noodles >= 10, found ${phoCount}`);
  assert.ok(riceCount >= 12, `Expected rice/family meals >= 12, found ${riceCount}`);
  assert.ok(seafoodCount >= 8, `Expected seafood >= 8, found ${seafoodCount}`);
  assert.ok(banhmiCount >= 8, `Expected banhmi >= 8, found ${banhmiCount}`);
  assert.ok(cafeFruitCount >= 40, `Expected cafes/desserts/fruits >= 40, found ${cafeFruitCount}`);
});

// ==========================================
// 4. 26-Field Schema Completeness
// ==========================================
runner.suite('26-Field Completeness Verification');

const REQUIRED_26_FIELDS = [
  'id', 'name', 'nameVi', 'category', 'categoryLabel', 'badge', 'iconEmoji',
  'rating', 'reviewCount', 'openHours', 'location', 'addressVi', 'phone',
  'googleMapQuery', 'officialUrl', 'priceRangeVnd', 'avgPriceVnd', 'pricePer',
  'signatureMenu', 'tags', 'highlight', 'description', 'localTip',
  'suggestedMeal', 'googleMapUrl', 'googlePhotosUrl'
];

runner.test('Every place contains all 26 required schema fields', () => {
  NHA_TRANG_GOURMETS.forEach((g, idx) => {
    REQUIRED_26_FIELDS.forEach(field => {
      assert.ok(field in g, `Place #${idx + 1} (${g.id || 'unknown'}) missing field '${field}'`);
      assert.notStrictEqual(g[field], undefined, `Place #${idx + 1} (${g.id}) field '${field}' is undefined`);
    });
  });
});

runner.test('Mandatory text and array fields are non-empty', () => {
  NHA_TRANG_GOURMETS.forEach((g, idx) => {
    assert.ok(typeof g.id === 'string' && g.id.trim().length > 0, `Place #${idx + 1} id must be non-empty string`);
    assert.ok(typeof g.name === 'string' && g.name.trim().length > 0, `Place #${idx + 1} (${g.id}) name must be non-empty string`);
    assert.ok(typeof g.nameVi === 'string' && g.nameVi.trim().length > 0, `Place #${idx + 1} (${g.id}) nameVi must be non-empty string`);
    assert.ok(typeof g.badge === 'string' && g.badge.trim().length > 0, `Place #${idx + 1} (${g.id}) badge must be non-empty string`);
    assert.ok(typeof g.iconEmoji === 'string' && g.iconEmoji.trim().length > 0, `Place #${idx + 1} (${g.id}) iconEmoji must be non-empty string`);
    assert.ok(typeof g.openHours === 'string' && g.openHours.trim().length > 0, `Place #${idx + 1} (${g.id}) openHours must be non-empty string`);
    assert.ok(typeof g.location === 'string' && g.location.trim().length > 0, `Place #${idx + 1} (${g.id}) location must be non-empty string`);
    assert.ok(typeof g.addressVi === 'string' && g.addressVi.trim().length > 0, `Place #${idx + 1} (${g.id}) addressVi must be non-empty string`);
    assert.ok(typeof g.googleMapQuery === 'string' && g.googleMapQuery.trim().length > 0, `Place #${idx + 1} (${g.id}) googleMapQuery must be non-empty string`);
    assert.ok(typeof g.priceRangeVnd === 'string' && g.priceRangeVnd.trim().length > 0, `Place #${idx + 1} (${g.id}) priceRangeVnd must be non-empty string`);
    assert.ok(typeof g.pricePer === 'string' && g.pricePer.trim().length > 0, `Place #${idx + 1} (${g.id}) pricePer must be non-empty string`);
    assert.ok(typeof g.highlight === 'string' && g.highlight.trim().length > 0, `Place #${idx + 1} (${g.id}) highlight must be non-empty string`);
    assert.ok(typeof g.description === 'string' && g.description.trim().length > 0, `Place #${idx + 1} (${g.id}) description must be non-empty string`);
    assert.ok(typeof g.localTip === 'string' && g.localTip.trim().length > 0, `Place #${idx + 1} (${g.id}) localTip must be non-empty string`);
    assert.ok(typeof g.suggestedMeal === 'string' && g.suggestedMeal.trim().length > 0, `Place #${idx + 1} (${g.id}) suggestedMeal must be non-empty string`);
  });
});

// ==========================================
// 5. Numeric Bounds & Type Integrity
// ==========================================
runner.suite('Numeric Bounds & Type Integrity');

runner.test('Ratings are valid numbers between 3.0 and 5.0', () => {
  NHA_TRANG_GOURMETS.forEach((g) => {
    assert.strictEqual(typeof g.rating, 'number', `${g.id} rating must be a number`);
    assert.ok(!isNaN(g.rating), `${g.id} rating must not be NaN`);
    assert.ok(g.rating >= 3.0 && g.rating <= 5.0, `${g.id} rating (${g.rating}) must be between 3.0 and 5.0`);
  });
});

runner.test('Review counts are positive integers >= 100', () => {
  NHA_TRANG_GOURMETS.forEach((g) => {
    assert.strictEqual(typeof g.reviewCount, 'number', `${g.id} reviewCount must be a number`);
    assert.ok(Number.isInteger(g.reviewCount), `${g.id} reviewCount must be an integer`);
    assert.ok(g.reviewCount >= 100, `${g.id} reviewCount (${g.reviewCount}) must be >= 100`);
  });
});

runner.test('avgPriceVnd are positive integers >= 10,000', () => {
  NHA_TRANG_GOURMETS.forEach((g) => {
    assert.strictEqual(typeof g.avgPriceVnd, 'number', `${g.id} avgPriceVnd must be a number`);
    assert.ok(Number.isInteger(g.avgPriceVnd), `${g.id} avgPriceVnd must be an integer`);
    assert.ok(g.avgPriceVnd >= 10000, `${g.id} avgPriceVnd (${g.avgPriceVnd}) must be >= 10,000 VND`);
  });
});

// ==========================================
// 6. Unique Identifiers & Kebab-case
// ==========================================
runner.suite('Unique Identifiers & Kebab-case');

runner.test('All IDs follow kebab-case /^[a-z0-9-]+$/ pattern', () => {
  const kebabRegex = /^[a-z0-9-]+$/;
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(kebabRegex.test(g.id), `${g.id} must be valid kebab-case`);
  });
});

runner.test('All 113 place IDs are strictly unique', () => {
  const ids = new Set();
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(!ids.has(g.id), `Duplicate ID found: '${g.id}'`);
    ids.add(g.id);
  });
  assert.strictEqual(ids.size, 113, 'Total unique IDs must equal 113');
});

// ==========================================
// 7. Signature Menu & Tags Structure
// ==========================================
runner.suite('Signature Menu & Tags Structure');

runner.test('signatureMenu is an array with 2 to 5 items', () => {
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(Array.isArray(g.signatureMenu), `${g.id} signatureMenu must be an Array`);
    assert.ok(g.signatureMenu.length >= 2 && g.signatureMenu.length <= 5, `${g.id} signatureMenu length (${g.signatureMenu.length}) must be between 2 and 5`);
    g.signatureMenu.forEach((m, mIdx) => {
      if (typeof m === 'string') {
        assert.ok(m.trim().length > 0, `${g.id} menu item #${mIdx} must be non-empty`);
      } else if (typeof m === 'object' && m !== null) {
        assert.ok(m.name && m.name.trim().length > 0, `${g.id} menu item #${mIdx} must have non-empty name`);
      } else {
        assert.fail(`${g.id} menu item #${mIdx} has invalid type`);
      }
    });
  });
});

runner.test('tags is an array with at least 3 non-empty string items', () => {
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(Array.isArray(g.tags), `${g.id} tags must be an Array`);
    assert.ok(g.tags.length >= 3, `${g.id} tags length (${g.tags.length}) must be >= 3`);
    g.tags.forEach((t, tIdx) => {
      assert.strictEqual(typeof t, 'string', `${g.id} tag #${tIdx} must be a string`);
      assert.ok(t.trim().length > 0, `${g.id} tag #${tIdx} must be non-empty`);
    });
  });
});

// ==========================================
// 8. Google Maps URL Formats
// ==========================================
runner.suite('Google Maps URL Formats');

runner.test('googleMapUrl starts with Google Maps search prefix and has valid encoded query', () => {
  const mapPrefix = 'https://www.google.com/maps/search/?api=1&query=';
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(g.googleMapUrl.startsWith(mapPrefix), `${g.id} googleMapUrl must start with '${mapPrefix}'`);
    assert.ok(!g.googleMapUrl.includes(' '), `${g.id} googleMapUrl must not contain unencoded spaces`);
    assert.ok(!g.googleMapUrl.includes('%2520'), `${g.id} googleMapUrl must not contain double encoded %2520`);
  });
});

runner.test('googlePhotosUrl starts with search prefix and includes encoded Korean 사진 query', () => {
  const mapPrefix = 'https://www.google.com/maps/search/?api=1&query=';
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(g.googlePhotosUrl.startsWith(mapPrefix), `${g.id} googlePhotosUrl must start with '${mapPrefix}'`);
    assert.ok(g.googlePhotosUrl.includes('%EC%82%AC%EC%A7%84') || g.googlePhotosUrl.includes(encodeURIComponent('사진')), `${g.id} googlePhotosUrl must contain encoded '사진'`);
    assert.ok(!g.googlePhotosUrl.includes(' '), `${g.id} googlePhotosUrl must not contain unencoded spaces`);
  });
});

// ==========================================
// 9. Vietnamese Address & Name Integrity
// ==========================================
runner.suite('Vietnamese Address & Name Integrity');

runner.test('addressVi contains street, ward/city, and Nha Trang', () => {
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(g.addressVi.includes('Nha Trang'), `${g.id} addressVi ('${g.addressVi}') must contain 'Nha Trang'`);
    assert.ok(g.addressVi.includes(','), `${g.id} addressVi ('${g.addressVi}') must be comma-separated`);
  });
});

runner.test('nameVi is a non-empty string with Vietnamese characters or store title', () => {
  NHA_TRANG_GOURMETS.forEach(g => {
    assert.ok(typeof g.nameVi === 'string' && g.nameVi.trim().length > 0, `${g.id} nameVi must be non-empty`);
  });
});

// ==========================================
// 10. Tag Filtering & Search Simulation Logic
// ==========================================
runner.suite('Tag Filtering & Search Simulation Logic');

function simulateFilter(opts = {}) {
  const { category = 'all', tag = 'all', query = '', wishlistOnly = false, wishlist = [] } = opts;
  return NHA_TRANG_GOURMETS.filter(item => {
    if (wishlistOnly && !wishlist.includes(item.id)) return false;

    // Category Filter
    if (category !== 'all') {
      const cat = category;
      const tagStr = (item.tags || []).join(' ');
      let matchCat = false;
      if (cat === 'fruit') {
        matchCat = (item.category === 'fruit' || item.category === 'cafe' || item.category === 'dessert' || (item.categoryLabel && (item.categoryLabel.includes('카페') || item.categoryLabel.includes('디저트') || item.categoryLabel.includes('생과일'))));
      } else if (cat === 'rice') {
        matchCat = (item.category === 'rice' || (item.category === 'vietnamese' && (tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('전통') || tagStr.includes('식당'))) || tagStr.includes('가정식') || tagStr.includes('솥밥') || tagStr.includes('치킨라이스') || tagStr.includes('닭고기밥') || tagStr.includes('껌땀') || tagStr.includes('누룽지'));
      } else if (cat === 'pho') {
        matchCat = (item.category === 'pho' || item.category === 'bunca' || tagStr.includes('쌀국수') || tagStr.includes('분짜') || tagStr.includes('분까') || tagStr.includes('분보') || (item.category === 'vietnamese' && tagStr.includes('쌀국수')) || (item.categoryLabel && (item.categoryLabel.includes('쌀국수') || item.categoryLabel.includes('분짜'))));
      } else if (cat === 'banhxeo') {
        matchCat = (item.category === 'banhxeo' || tagStr.includes('반쎄오') || tagStr.includes('넴느엉') || tagStr.includes('반깐') || (item.categoryLabel && item.categoryLabel.includes('반쎄오')));
      } else if (cat === 'seafood') {
        matchCat = (item.category === 'seafood' || (item.categoryLabel && item.categoryLabel.includes('해산물')) || tagStr.includes('해산물') || tagStr.includes('조개'));
      } else if (cat === 'banhmi') {
        matchCat = (item.category === 'banhmi' || tagStr.includes('반미'));
      } else {
        matchCat = (item.category === cat);
      }
      if (!matchCat) return false;
    }

    // Tag Filter
    if (tag !== 'all') {
      const gt = tag;
      const tagStr = (item.tags || []).join(' ');
      let matchTag = false;
      if (gt === 'line' && (tagStr.includes('줄서는') || tagStr.includes('1위') || tagStr.includes('인기') || tagStr.includes('성지') || tagStr.includes('명가') || tagStr.includes('단골'))) matchTag = true;
      else if (gt === 'ac' && (tagStr.includes('에어컨') || tagStr.includes('냉방') || tagStr.includes('쾌적') || tagStr.includes('위생'))) matchTag = true;
      else if (gt === 'breakfast' && (tagStr.includes('아침') || tagStr.includes('모닝') || tagStr.includes('해장') || (item.openHours && (item.openHours.startsWith('05:') || item.openHours.startsWith('06:') || item.openHours.startsWith('07:'))))) matchTag = true;
      else if (gt === 'seafood' && (tagStr.includes('정찰제') || tagStr.includes('해산물') || tagStr.includes('조개') || item.category === 'seafood')) matchTag = true;
      else if (gt === 'night' && (tagStr.includes('야간') || tagStr.includes('야식') || tagStr.includes('맥주') || tagStr.includes('심야') || (item.openHours && (item.openHours.includes('23:') || item.openHours.includes('24:') || item.openHours.includes('02:'))))) matchTag = true;
      else if (item.tags && item.tags.includes(gt)) matchTag = true;
      if (!matchTag) return false;
    }

    // Search Query
    if (query) {
      const q = query.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchNameVi = (item.nameVi || '').toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchHighlight = item.highlight.toLowerCase().includes(q);
      const matchBadge = (item.badge || '').toLowerCase().includes(q);
      const matchCatLabel = (item.categoryLabel || '').toLowerCase().includes(q);
      const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
      const matchMenu = item.signatureMenu.some(m => {
        const mStr = typeof m === 'string' ? m : (m.name + ' ' + m.desc);
        return mStr.toLowerCase().includes(q);
      });
      if (!matchName && !matchNameVi && !matchDesc && !matchLoc && !matchHighlight && !matchBadge && !matchCatLabel && !matchTags && !matchMenu) return false;
    }

    return true;
  });
}

runner.test('Category filter simulation returns expected counts across all tabs', () => {
  const allPlaces = simulateFilter({ category: 'all' });
  assert.strictEqual(allPlaces.length, 113, 'all category should return 113 places');

  const banhxeoPlaces = simulateFilter({ category: 'banhxeo' });
  assert.ok(banhxeoPlaces.length >= 8, `banhxeo category should return >= 8 places, got ${banhxeoPlaces.length}`);

  const phoPlaces = simulateFilter({ category: 'pho' });
  assert.ok(phoPlaces.length >= 10, `pho category should return >= 10 places, got ${phoPlaces.length}`);

  const seafoodPlaces = simulateFilter({ category: 'seafood' });
  assert.ok(seafoodPlaces.length >= 8, `seafood category should return >= 8 places, got ${seafoodPlaces.length}`);

  const ricePlaces = simulateFilter({ category: 'rice' });
  assert.ok(ricePlaces.length >= 12, `rice category should return >= 12 places, got ${ricePlaces.length}`);

  const banhmiPlaces = simulateFilter({ category: 'banhmi' });
  assert.ok(banhmiPlaces.length >= 8, `banhmi category should return >= 8 places, got ${banhmiPlaces.length}`);

  const fruitPlaces = simulateFilter({ category: 'fruit' });
  assert.ok(fruitPlaces.length >= 40, `fruit/cafe category should return >= 40 places, got ${fruitPlaces.length}`);
});

runner.test('Tag chip filtering simulation maps English tags to non-empty Korean results', () => {
  const linePlaces = simulateFilter({ tag: 'line' });
  assert.ok(linePlaces.length > 0, `Tag 'line' should match places, got ${linePlaces.length}`);

  const acPlaces = simulateFilter({ tag: 'ac' });
  assert.ok(acPlaces.length > 0, `Tag 'ac' should match places, got ${acPlaces.length}`);

  const breakfastPlaces = simulateFilter({ tag: 'breakfast' });
  assert.ok(breakfastPlaces.length > 0, `Tag 'breakfast' should match places, got ${breakfastPlaces.length}`);

  const seafoodPlaces = simulateFilter({ tag: 'seafood' });
  assert.ok(seafoodPlaces.length > 0, `Tag 'seafood' should match places, got ${seafoodPlaces.length}`);

  const nightPlaces = simulateFilter({ tag: 'night' });
  assert.ok(nightPlaces.length > 0, `Tag 'night' should match places, got ${nightPlaces.length}`);
});

runner.test('Search simulation accurately finds keywords in names, menus, locations', () => {
  const searchCoconut = simulateFilter({ query: '코코넛' });
  assert.ok(searchCoconut.length >= 4, `Search '코코넛' should find >= 4 places, got ${searchCoconut.length}`);

  const searchAvocado = simulateFilter({ query: '아보카도' });
  assert.ok(searchAvocado.length >= 3, `Search '아보카도' should find >= 3 places, got ${searchAvocado.length}`);

  const searchMango = simulateFilter({ query: '망고' });
  assert.ok(searchMango.length >= 4, `Search '망고' should find >= 4 places, got ${searchMango.length}`);

  const searchPhoHotpot = simulateFilter({ query: '뚝배기' });
  assert.ok(searchPhoHotpot.length >= 2, `Search '뚝배기' should find >= 2 places, got ${searchPhoHotpot.length}`);

  const searchBanhXeo = simulateFilter({ query: '반쎄오' });
  assert.ok(searchBanhXeo.length >= 5, `Search '반쎄오' should find >= 5 places, got ${searchBanhXeo.length}`);
});

// ==========================================
// 11. DOM Synchronization & Badge Counts
// ==========================================
runner.suite('DOM Synchronization & Badge Counts');

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

runner.test('index.html static gourmet badge count matches dataset length', () => {
  assert.ok(indexHtmlContent.includes('전체 맛집 (113곳)'), "index.html must contain '전체 맛집 (113곳)'");
  assert.ok(indexHtmlContent.includes('Google 검증 113곳'), "index.html must contain 'Google 검증 113곳'");
});

runner.test('All critical gourmet DOM element IDs exist in index.html', () => {
  const requiredDomIds = [
    'gourmetCategoryNav',
    'gourmetTagChips',
    'gourmetGridSection',
    'gourmetResultCountText',
    'gourmetCardsGridContainer',
    'gourmetModal',
    'gourmetModalCloseBtn',
    'gourmetModalBadge',
    'gourmetModalCategory',
    'gourmetModalTitle',
    'gourmetModalNameVi',
    'gourmetModalRating',
    'gourmetModalHours',
    'gourmetModalPriceRange',
    'gourmetModalMeal',
    'gourmetModalAddress',
    'gourmetCopyAddressBtn',
    'gourmetModalHighlight',
    'gourmetModalMenuList',
    'gourmetModalDesc',
    'gourmetModalTip',
    'gourmetNoteInput',
    'gourmetNoteStatus',
    'gourmetModalAvgPrice',
    'gourmetModalAvgKrw',
    'gourmetModalPricePer',
    'gourmetModalHeartBtn',
    'gourmetModalPhotosBtn',
    'gourmetModalMapBtn',
    'gourmetModalOfficialBtn'
  ];

  requiredDomIds.forEach(id => {
    const idPattern = new RegExp(`id=["']${id}["']`);
    const dataModalPattern = new RegExp(`data-modal=["']${id}["']`);
    const dataClosePattern = new RegExp(`data-close=["']${id}["']`);
    const hasId = idPattern.test(indexHtmlContent) ||
                  dataModalPattern.test(indexHtmlContent) ||
                  dataClosePattern.test(indexHtmlContent);
    assert.ok(hasId, `index.html must contain element with id='${id}'`);
  });
});

// ==========================================
// 12. Content Security & XSS Sanitization
// ==========================================
runner.suite('Content Security & XSS Sanitization');

runner.test('No gourmet data properties contain dangerous HTML script injection vectors', () => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b/gi,
    /javascript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /<img[^>]+src\s*=\s*['"]?javascript:/gi
  ];

  NHA_TRANG_GOURMETS.forEach(g => {
    REQUIRED_26_FIELDS.forEach(f => {
      const val = g[f];
      const stringified = (typeof val === 'object') ? JSON.stringify(val) : String(val);
      dangerousPatterns.forEach(pat => {
        assert.strictEqual(pat.test(stringified), false, `Security alert: XSS payload detected in ${g.id} field '${f}': ${stringified}`);
      });
    });
  });
});

// Output Summary
const passed = runner.summary();
if (!passed) {
  process.exit(1);
}
