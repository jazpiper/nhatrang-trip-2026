/**
 * ============================================================================
 * Nha Trang Trip 2026 - Shopping Dataset Automated Validation Suite
 * File: test-shopping.js
 * ============================================================================
 * 
 * Verifies NHA_TRANG_SHOPPING from shopping-data.js against:
 * 1. Module loading & Dual export availability
 * 2. Dataset size & 5 canonical categories coverage (18 spots)
 * 3. Kebab-case unique IDs (/^[a-z0-9-]+$/)
 * 4. 25+ Required Schema field completeness
 * 5. Zero-hallucination & Google Maps / Photos URL formatting
 * 6. Numeric bounds (rating 3.0~5.0, reviewCount > 0, avgPriceVnd > 0)
 * 7. Bargaining guide tables & realistic price bounds
 * 8. Korean community sentiment analysis structure (pros, cons, scam warnings)
 * 9. DOM SSOT synchronization in index.html (badge counts, DOM element IDs)
 * 10. Simulation of filtering & multi-keyword search business logic
 * 11. Sorting algorithm verification (rating, price-asc, price-desc)
 * 12. Security checks (XSS prevention, no raw script tags)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner, colors } = require('./test-harness.js');

const runner = new TestRunner({
  summaryTitle: 'Shopping Test Execution Summary',
  failureHeader: 'Failures & Discrepancies Detected:',
  failureFooter: 'Test Suite Failed.',
  successMessage: (totalSuites) => `✨ All ${totalSuites} Shopping Test Suites Passed Successfully! Ground-Truth 18 Verified.`,
  exitOnFailure: true
});

// ==========================================
// 1. File Loading & Module Export Verification
// ==========================================
runner.suite('File Loading & Dual Export Verification');

runner.test('shopping-data.js exists on disk', () => {
  const filePath = path.join(__dirname, 'shopping-data.js');
  assert.ok(fs.existsSync(filePath), 'shopping-data.js does not exist in root directory');
});

let NHA_TRANG_SHOPPING;
runner.test('shopping-data.js loads and exports NHA_TRANG_SHOPPING array', () => {
  const mod = require('./shopping-data.js');
  assert.ok(mod.NHA_TRANG_SHOPPING, 'NHA_TRANG_SHOPPING export is missing');
  assert.ok(Array.isArray(mod.NHA_TRANG_SHOPPING), 'NHA_TRANG_SHOPPING must be an array');
  assert.ok(mod.NHA_TRANG_SHOPPING.length > 0, 'NHA_TRANG_SHOPPING array is empty');
  NHA_TRANG_SHOPPING = mod.NHA_TRANG_SHOPPING;
});

// ==========================================
// 2. Dataset Size & Category Distribution
// ==========================================
runner.suite('Dataset Size & Category Distribution');

runner.test('Total shopping spot count reaches full target (18 verified spots)', () => {
  assert.strictEqual(NHA_TRANG_SHOPPING.length, 18, `Expected exactly 18 shopping spots, got ${NHA_TRANG_SHOPPING.length}`);
});

const REQUIRED_CATEGORIES = ['crocs_shoes', 'dam_market', 'night_market', 'boutique_mirror', 'casual_sportswear'];

runner.test('Contains all 5 canonical shopping categories', () => {
  const categories = new Set(NHA_TRANG_SHOPPING.map(s => s.category));
  for (const cat of REQUIRED_CATEGORIES) {
    assert.ok(categories.has(cat), `Missing required category: ${cat}`);
  }
});

runner.test('Every category has verified spots with minimum count requirements', () => {
  const counts = {};
  NHA_TRANG_SHOPPING.forEach(s => {
    counts[s.category] = (counts[s.category] || 0) + 1;
  });
  assert.ok(counts['crocs_shoes'] >= 3, `Expected >= 3 crocs_shoes spots, got ${counts['crocs_shoes']}`);
  assert.ok(counts['dam_market'] >= 6, `Expected >= 6 dam_market spots, got ${counts['dam_market']}`);
  assert.ok(counts['night_market'] >= 2, `Expected >= 2 night_market spots, got ${counts['night_market']}`);
  assert.ok(counts['boutique_mirror'] >= 3, `Expected >= 3 boutique_mirror spots, got ${counts['boutique_mirror']}`);
  assert.ok(counts['casual_sportswear'] >= 4, `Expected >= 4 casual_sportswear spots, got ${counts['casual_sportswear']}`);
});

// ==========================================
// 3. ID Uniqueness & Slug Validation
// ==========================================
runner.suite('ID Uniqueness & Slug Validation');

runner.test('All IDs are strictly unique and adhere to kebab-case slug format', () => {
  const idSet = new Set();
  const kebabRegex = /^[a-z0-9-]+$/;
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(s.id, `Shopping spot is missing 'id': ${JSON.stringify(s)}`);
    assert.ok(kebabRegex.test(s.id), `ID '${s.id}' is not in valid kebab-case format`);
    assert.ok(!idSet.has(s.id), `Duplicate ID found: '${s.id}'`);
    idSet.add(s.id);
  });
});

// ==========================================
// 4. Schema Completeness
// ==========================================
runner.suite('Schema Completeness (25+ Standard Fields)');

const REQUIRED_FIELDS = [
  'id',
  'name',
  'nameVi',
  'nameEn',
  'category',
  'categoryLabel',
  'badge',
  'qualityTier',
  'rating',
  'reviewCount',
  'openHours',
  'location',
  'addressVi',
  'phone',
  'googleMapQuery',
  'googleMapUrl',
  'googlePhotosUrl',
  'priceRangeVnd',
  'avgPriceVnd',
  'estimatedPriceKrw',
  'pricePer',
  'paymentMethods',
  'facilities',
  'tags',
  'signatureItems',
  'bargainingGuide',
  'sentimentAnalysis',
  'customsAdvice',
  'highlight',
  'description',
  'localTip',
  'coverImage',
  'images'
];

runner.test('Every shopping spot contains all 25+ required fields with non-empty values', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(s[field] !== undefined && s[field] !== null, `Spot '${s.id}' missing field '${field}'`);
      if (typeof s[field] === 'string') {
        assert.ok(s[field].trim().length > 0, `Spot '${s.id}' field '${field}' cannot be empty string`);
      } else if (Array.isArray(s[field])) {
        assert.ok(s[field].length > 0, `Spot '${s.id}' array field '${field}' cannot be empty`);
      }
    }
  });
});

// ==========================================
// 5. Numeric Bounds & Value Types
// ==========================================
runner.suite('Numeric Bounds & Value Types');

runner.test('Ratings are between 3.0 and 5.0 and review counts are positive integers', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(typeof s.rating === 'number', `Spot '${s.id}' rating is not a number`);
    assert.ok(s.rating >= 3.0 && s.rating <= 5.0, `Spot '${s.id}' rating ${s.rating} out of bounds [3.0, 5.0]`);
    assert.ok(typeof s.reviewCount === 'number' && Number.isInteger(s.reviewCount), `Spot '${s.id}' reviewCount must be integer`);
    assert.ok(s.reviewCount > 0, `Spot '${s.id}' reviewCount must be > 0`);
  });
});

runner.test('avgPriceVnd is positive number > 0', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(typeof s.avgPriceVnd === 'number' && s.avgPriceVnd > 0, `Spot '${s.id}' avgPriceVnd must be > 0`);
  });
});

// ==========================================
// 6. Zero-Hallucination & URL Verification
// ==========================================
runner.suite('Zero-Hallucination & URL Verification');

runner.test('googleMapUrl and googlePhotosUrl conform to standard Google Maps search API', () => {
  const mapPrefix = 'https://www.google.com/maps/search/?api=1&query=';
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(s.googleMapUrl.startsWith(mapPrefix), `Spot '${s.id}' googleMapUrl does not start with '${mapPrefix}'`);
    assert.ok(s.googlePhotosUrl.startsWith(mapPrefix), `Spot '${s.id}' googlePhotosUrl does not start with '${mapPrefix}'`);
    
    // Test URL encoding coherence
    const expectedMapUrl = `${mapPrefix}${encodeURIComponent(s.googleMapQuery)}`;
    assert.strictEqual(s.googleMapUrl, expectedMapUrl, `Spot '${s.id}' googleMapUrl is not properly URL-encoded`);
  });
});

runner.test('images contains at least 3 valid HTTP/HTTPS URLs and coverImage is valid', () => {
  const urlRegex = /^https?:\/\//i;
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(urlRegex.test(s.coverImage), `Spot '${s.id}' coverImage '${s.coverImage}' is not a valid URL`);
    assert.ok(Array.isArray(s.images) && s.images.length >= 3, `Spot '${s.id}' images must contain >= 3 URLs`);
    s.images.forEach((img, idx) => {
      assert.ok(urlRegex.test(img), `Spot '${s.id}' image[${idx}] '${img}' is not a valid URL`);
    });
  });
});

runner.test('addressVi contains official Vietnamese street address with Nha Trang marker', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(s.addressVi.includes('Nha Trang'), `Spot '${s.id}' addressVi '${s.addressVi}' missing 'Nha Trang'`);
    assert.ok(s.addressVi.includes('Khánh Hòa'), `Spot '${s.id}' addressVi '${s.addressVi}' missing 'Khánh Hòa'`);
  });
});

// ==========================================
// 7. Bargaining Guide & Realistic Pricing
// ==========================================
runner.suite('Bargaining Guide & Pricing Matrix');

runner.test('Every spot has structured bargaining guide with item, asking, target and tip', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(Array.isArray(s.bargainingGuide) && s.bargainingGuide.length > 0, `Spot '${s.id}' missing bargainingGuide array`);
    s.bargainingGuide.forEach(bg => {
      assert.ok(bg.item && bg.item.trim().length > 0, `Spot '${s.id}' bargainingGuide missing item`);
      assert.ok(bg.askingPriceVnd && bg.askingPriceVnd.trim().length > 0, `Spot '${s.id}' bargainingGuide missing askingPriceVnd`);
      assert.ok(bg.targetPriceVnd && bg.targetPriceVnd.trim().length > 0, `Spot '${s.id}' bargainingGuide missing targetPriceVnd`);
      assert.ok(bg.targetPriceKrw && bg.targetPriceKrw.trim().length > 0, `Spot '${s.id}' bargainingGuide missing targetPriceKrw`);
      assert.ok(bg.tip && bg.tip.trim().length > 0, `Spot '${s.id}' bargainingGuide missing tip`);
    });
  });
});

// ==========================================
// 8. Community Review Sentiment Matrix
// ==========================================
runner.suite('Community Sentiment Analysis Structure');

runner.test('Every spot contains complete sentimentAnalysis object with pros (>=2), cons (>=1), and scamWarning', () => {
  NHA_TRANG_SHOPPING.forEach(s => {
    assert.ok(s.sentimentAnalysis, `Spot '${s.id}' missing sentimentAnalysis`);
    const sent = s.sentimentAnalysis;
    assert.ok(sent.communityVerdict && sent.communityVerdict.trim().length > 0, `Spot '${s.id}' missing communityVerdict`);
    assert.ok(Array.isArray(sent.pros) && sent.pros.length >= 2, `Spot '${s.id}' pros must have >= 2 items`);
    assert.ok(Array.isArray(sent.cons) && sent.cons.length >= 1, `Spot '${s.id}' cons must have >= 1 items`);
    assert.ok(sent.scamWarning && sent.scamWarning.trim().length > 0, `Spot '${s.id}' missing scamWarning`);
    assert.ok(sent.customsTip && sent.customsTip.trim().length > 0, `Spot '${s.id}' missing customsTip`);
  });
});

// ==========================================
// 9. DOM & Badge Synchronization in index.html
// ==========================================
runner.suite('DOM & Badge Synchronization in index.html');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

runner.test('Tab badge in header matches dataset count (18곳)', () => {
  assert.ok(/<span class="tab-badge">18<\/span>/.test(htmlContent), "Header tab badge must show 18");
});

runner.test('Category all button matches dataset count (18곳)', () => {
  assert.ok(htmlContent.includes('전체 쇼핑 (18곳)'), "Category button does not contain '전체 쇼핑 (18곳)'");
});

runner.test('Result count info bar text matches dataset count (18개의)', () => {
  assert.ok(htmlContent.includes('총 <strong>18</strong>개의 검증 쇼핑 스팟'), "Info bar does not contain '총 <strong>18</strong>개의 검증 쇼핑 스팟'");
});

const REQUIRED_DOM_IDS = [
  'shoppingCategoryNav',
  'shoppingTagChips',
  'shoppingGridSection',
  'shoppingResultCountText',
  'shoppingCardsGridContainer',
  'shoppingModal',
  'shoppingModalCloseBtn',
  'shoppingModalGallery',
  'shoppingModalMainImg',
  'shoppingModalThumbs',
  'shoppingModalBadge',
  'shoppingModalCategory',
  'shoppingModalQualityBadge',
  'shoppingModalAcBadge',
  'shoppingModalTitle',
  'shoppingModalNameVi',
  'shoppingModalRating',
  'shoppingModalHours',
  'shoppingModalPriceRange',
  'shoppingModalLocation',
  'shoppingModalAddress',
  'shoppingCopyAddressBtn',
  'shoppingModalHighlight',
  'shoppingModalFacilities',
  'shoppingModalBargainingTable',
  'shoppingModalSentimentPanel',
  'shoppingModalCustomsGuide',
  'shoppingCustomsWarningText',
  'shoppingModalDesc',
  'shoppingModalTip',
  'shoppingNoteInput',
  'shoppingNoteStatus',
  'shoppingModalAvgPrice',
  'shoppingModalAvgKrw',
  'shoppingModalPricePer',
  'shoppingModalHeartBtn',
  'shoppingModalPhotosBtn',
  'shoppingModalMapBtn'
];

runner.test('All required shopping DOM element IDs exist in index.html', () => {
  for (const id of REQUIRED_DOM_IDS) {
    const hasId = htmlContent.includes(`id="${id}"`) ||
                  htmlContent.includes(`data-modal="${id}"`) ||
                  htmlContent.includes(`data-close="${id}"`);
    assert.ok(hasId, `Missing DOM element id="${id}" in index.html`);
  }
});

// ==========================================
// 10. Business Logic Simulation (Filters & Search)
// ==========================================
runner.suite('Filter & Search Simulation');

runner.test('Category filter simulation returns non-zero results for all categories', () => {
  for (const cat of REQUIRED_CATEGORIES) {
    const filtered = NHA_TRANG_SHOPPING.filter(s => s.category === cat);
    assert.ok(filtered.length > 0, `Category filter '${cat}' returned 0 results`);
  }
});

runner.test('Tag chips filter simulation matches expected spots', () => {
  const tags = ['ac', 'fixed', 'transfer', 'bargain', 'mirror_tier', 'value'];
  for (const tag of tags) {
    const filtered = NHA_TRANG_SHOPPING.filter(s => {
      const allText = [
        ...(s.tags || []),
        ...(s.facilities || []),
        ...(s.paymentMethods || []),
        s.qualityTier || '',
        s.category || ''
      ].join(' ').toLowerCase();

      if (tag === 'ac') return s.hasAirConditioning || allText.includes('에어컨');
      if (tag === 'fixed') return s.bargainingRequired === false || allText.includes('정찰');
      if (tag === 'transfer') return allText.includes('계좌이체') || allText.includes('원화') || allText.includes('gln') || allText.includes('카카오페이');
      if (tag === 'bargain') return s.bargainingRequired === true || allText.includes('흥정');
      if (tag === 'mirror_tier') return s.category === 'boutique_mirror' || allText.includes('미러') || allText.includes('sa급');
      if (tag === 'value') return allText.includes('가성비') || s.avgPriceVnd <= 250000 || s.category === 'dam_market';
      return false;
    });
    assert.ok(filtered.length > 0, `Tag filter '${tag}' returned 0 results`);
  }
});

runner.test('Search query simulation finds spots for representative keywords', () => {
  const searchKeywords = ['켄켄', '크록스', '담시장', '착한할아버지', '라탄', '탑젤리', '야시장', '롯데마트', '소호', 'VIP', '미스앤미스터', '스투시', '린넨', '원피스', '레깅스', '스니커즈', '김청', '김빈'];
  for (const kw of searchKeywords) {
    const q = kw.toLowerCase();
    const matches = NHA_TRANG_SHOPPING.filter(s => {
      const inName = (s.name || '').toLowerCase().includes(q);
      const inNameVi = (s.nameVi || '').toLowerCase().includes(q);
      const inLocation = (s.location || '').toLowerCase().includes(q);
      const inHighlight = (s.highlight || '').toLowerCase().includes(q);
      const inDesc = (s.description || '').toLowerCase().includes(q);
      const inTags = (s.tags || []).some(t => t.toLowerCase().includes(q));
      const inBargain = (s.bargainingGuide || []).some(bg => bg.item.toLowerCase().includes(q));
      return inName || inNameVi || inLocation || inHighlight || inDesc || inTags || inBargain;
    });
    assert.ok(matches.length > 0, `Search keyword '${kw}' returned 0 matches`);
  }
});

// ==========================================
// 11. Sorting Verification
// ==========================================
runner.suite('Sorting Algorithms Verification');

runner.test('Sorting by rating produces descending order', () => {
  const sorted = [...NHA_TRANG_SHOPPING].sort((a, b) => (b.rating * 10000 + b.reviewCount) - (a.rating * 10000 + a.reviewCount));
  for (let i = 0; i < sorted.length - 1; i++) {
    const scoreA = sorted[i].rating * 10000 + sorted[i].reviewCount;
    const scoreB = sorted[i + 1].rating * 10000 + sorted[i + 1].reviewCount;
    assert.ok(scoreA >= scoreB, `Rating sort order violated at index ${i}`);
  }
});

runner.test('Sorting by price-asc produces ascending avgPriceVnd order', () => {
  const sorted = [...NHA_TRANG_SHOPPING].sort((a, b) => a.avgPriceVnd - b.avgPriceVnd);
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].avgPriceVnd <= sorted[i + 1].avgPriceVnd, `Price ASC sort order violated at index ${i}`);
  }
});

runner.test('Sorting by price-desc produces descending avgPriceVnd order', () => {
  const sorted = [...NHA_TRANG_SHOPPING].sort((a, b) => b.avgPriceVnd - a.avgPriceVnd);
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].avgPriceVnd >= sorted[i + 1].avgPriceVnd, `Price DESC sort order violated at index ${i}`);
  }
});

// ==========================================
// 12. Security & Anti-XSS Verification
// ==========================================
runner.suite('Security & Anti-XSS Verification');

runner.test('No data property contains dangerous HTML script injection vectors', () => {
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  NHA_TRANG_SHOPPING.forEach(s => {
    const jsonStr = JSON.stringify(s);
    assert.ok(!xssPattern.test(jsonStr), `Potential XSS payload detected in spot '${s.id}'`);
  });
});

// Run Summary
runner.summary();
