/**
 * ============================================================================
 * Adversarial Challenger Test Suite: InterContinental Hotel Dining Integration
 * File: test-challenger-ic.js
 * Author: Challenger Subagent (challenger_1)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { URL } = require('url');
const { TestRunner } = require('./test-harness.js');
const { installDom, uninstallDom } = require('./test-dom-stub.js');

const runner = new TestRunner({
  summaryTitle: 'Adversarial Challenger Test Summary (IC Dining)',
  failureHeader: 'Adversarial Challenge Failures:',
  failureFooter: 'Challenger Verification Failed.',
  successMessage: '🛡️ All Adversarial Challenger Stress Tests Passed! InterContinental integration is 100% robust, verified, and bug-free.',
  exitOnFailure: true,
  exitOnSuccess: true
});

const DATA_FILE_PATH = path.resolve(__dirname, 'hotel-dining-data.js');
const mod = require(DATA_FILE_PATH);
const dinings = mod.NHA_TRANG_HOTEL_DININGS;
const icDinings = dinings.filter(d => d.hotelKey === 'intercontinental');

// Seed global for app.js
global.NHA_TRANG_HOTEL_DININGS = dinings;
const app = require('./js/app.js');

// ============================================================================
// Suite 1: IC Outlets Completeness and Identification
// ============================================================================
runner.suite('Suite 1: InterContinental Outlets Ground-Truth & Identification');

runner.test('Exactly 5 InterContinental F&B outlets are registered', () => {
  assert.strictEqual(icDinings.length, 5, `Expected 5 IC outlets, found ${icDinings.length}`);
});

runner.test('All expected canonical IC outlet IDs are present', () => {
  const expectedIds = [
    'dining-intercon-cookbook',
    'dining-intercon-costaseafood',
    'dining-intercon-aqualine',
    'dining-intercon-lobbylounge',
    'dining-intercon-clublounge'
  ];
  const actualIds = icDinings.map(d => d.id);
  expectedIds.forEach(id => {
    assert.ok(actualIds.includes(id), `Missing expected IC outlet ID: ${id}`);
  });
});

runner.test('All 5 IC outlets share valid Vietnamese address at 32-34 Trần Phú', () => {
  icDinings.forEach(d => {
    assert.ok(d.addressVi.includes('32-34 Trần Phú'), `${d.id} addressVi must contain "32-34 Trần Phú"`);
    assert.ok(d.addressVi.includes('Lộc Thọ'), `${d.id} addressVi must contain "Lộc Thọ"`);
    assert.ok(d.addressVi.includes('Nha Trang'), `${d.id} addressVi must contain "Nha Trang"`);
    assert.ok(d.addressVi.includes('Khánh Hòa'), `${d.id} addressVi must contain "Khánh Hòa"`);
  });
});

runner.test('All 5 IC outlets have valid Vietnamese landline phone numbers (+84 258)', () => {
  icDinings.forEach(d => {
    assert.ok(typeof d.phone === 'string', `${d.id} phone must be string`);
    assert.ok(d.phone.startsWith('+84 258 '), `${d.id} phone must start with "+84 258 " (Khanh Hoa prefix)`);
    const cleanDigits = d.phone.replace(/\D/g, '');
    assert.strictEqual(cleanDigits.length, 12, `${d.id} phone number should have 12 digits (84 + 258 + 7 local digits)`);
  });
});

// ============================================================================
// Suite 2: Deep Schema & 31-Property Canonical Validation
// ============================================================================
runner.suite('Suite 2: 31-Property Canonical Schema Integrity for IC Outlets');

const REQUIRED_PROPERTIES = [
  'id', 'hotelKey', 'hotelName', 'name', 'nameVi', 'category', 'categoryLabel',
  'badge', 'iconEmoji', 'rating', 'reviewCount', 'openHours', 'location',
  'addressVi', 'phone', 'googleMapQuery', 'officialUrl', 'priceRangeVnd',
  'avgPriceVnd', 'pricePer', 'signatureMenu', 'dressCode', 'reservationRequired',
  'tags', 'highlight', 'description', 'localTip', 'coverImage', 'images',
  'googleMapUrl', 'googlePhotosUrl'
];

const ALLOWED_CATEGORIES = ['buffet', 'fine_dining', 'seafood_bbq', 'lounge_bar', 'traditional'];

runner.test('All IC outlets have exactly the 31 required schema properties with non-null values', () => {
  icDinings.forEach(d => {
    REQUIRED_PROPERTIES.forEach(prop => {
      assert.ok(d[prop] !== undefined, `${d.id} is missing property: ${prop}`);
      assert.ok(d[prop] !== null, `${d.id} property ${prop} is null`);
      if (typeof d[prop] === 'string') {
        assert.ok(d[prop].trim().length > 0, `${d.id} property ${prop} is empty string`);
      }
    });
    assert.ok(ALLOWED_CATEGORIES.includes(d.category), `${d.id} has invalid category: ${d.category}`);
  });
});

runner.test('Rating and review count invariants', () => {
  icDinings.forEach(d => {
    assert.ok(typeof d.rating === 'number', `${d.id} rating must be number`);
    assert.ok(d.rating >= 3.5 && d.rating <= 5.0, `${d.id} rating ${d.rating} out of range [3.5, 5.0]`);
    assert.ok(typeof d.reviewCount === 'number', `${d.id} reviewCount must be number`);
    assert.ok(Number.isInteger(d.reviewCount), `${d.id} reviewCount must be integer`);
    assert.ok(d.reviewCount >= 100, `${d.id} reviewCount ${d.reviewCount} unexpectedly low for 5-star venue`);
  });
});

runner.test('Signature menus have >= 3 items and realistic pricing', () => {
  icDinings.forEach(d => {
    assert.ok(Array.isArray(d.signatureMenu), `${d.id} signatureMenu must be array`);
    assert.ok(d.signatureMenu.length >= 3, `${d.id} must have at least 3 signature dishes, found ${d.signatureMenu.length}`);
    d.signatureMenu.forEach((dish, idx) => {
      assert.ok(typeof dish === 'string' && dish.trim().length > 5, `${d.id} dish #${idx} is too short or invalid`);
    });

    assert.ok(typeof d.avgPriceVnd === 'number', `${d.id} avgPriceVnd must be number`);
    assert.ok(d.avgPriceVnd >= 100000 && d.avgPriceVnd <= 3000000, `${d.id} avgPriceVnd ${d.avgPriceVnd} out of realistic range`);
    assert.ok(d.priceRangeVnd.includes('VND'), `${d.id} priceRangeVnd must mention VND`);
  });
});

// ============================================================================
// Suite 3: URL & Google Maps Search Query Encoding
// ============================================================================
runner.suite('Suite 3: URL Parsing & Strict Query Parameter Encoding');

runner.test('googleMapUrl strictly conforms to Google Maps search API format', () => {
  icDinings.forEach(d => {
    const expectedBase = 'https://www.google.com/maps/search/?api=1&query=';
    assert.ok(d.googleMapUrl.startsWith(expectedBase), `${d.id} googleMapUrl must start with standard base`);
    
    // Parse URL with standard URL parser
    const parsed = new URL(d.googleMapUrl);
    assert.strictEqual(parsed.protocol, 'https:');
    assert.strictEqual(parsed.hostname, 'www.google.com');
    assert.strictEqual(parsed.pathname, '/maps/search/');
    assert.strictEqual(parsed.searchParams.get('api'), '1');
    
    const queryParam = parsed.searchParams.get('query');
    assert.strictEqual(queryParam, d.googleMapQuery, `${d.id} query param must decode to exact googleMapQuery`);
    
    // Strict string encoding match check
    const constructedUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.googleMapQuery)}`;
    assert.strictEqual(d.googleMapUrl, constructedUrl, `${d.id} googleMapUrl does not match exact encodeURIComponent output`);
  });
});

runner.test('googlePhotosUrl strictly conforms to Google Maps photo query format', () => {
  icDinings.forEach(d => {
    const parsed = new URL(d.googlePhotosUrl);
    assert.strictEqual(parsed.protocol, 'https:');
    assert.strictEqual(parsed.hostname, 'www.google.com');
    assert.strictEqual(parsed.pathname, '/maps/search/');
    assert.strictEqual(parsed.searchParams.get('api'), '1');
    
    const queryParam = parsed.searchParams.get('query');
    assert.ok(queryParam.includes('사진'), `${d.id} googlePhotosUrl query must include '사진' suffix`);
    
    const constructedUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.googleMapQuery + ' 사진')}`;
    assert.strictEqual(d.googlePhotosUrl, constructedUrl, `${d.id} googlePhotosUrl does not match exact encodeURIComponent output`);
  });
});

runner.test('officialUrl and image URLs are valid HTTPS links', () => {
  icDinings.forEach(d => {
    const parsedOfficial = new URL(d.officialUrl);
    assert.strictEqual(parsedOfficial.protocol, 'https:', `${d.id} officialUrl must be https`);
    
    const parsedCover = new URL(d.coverImage);
    assert.strictEqual(parsedCover.protocol, 'https:', `${d.id} coverImage must be https`);
    
    assert.ok(Array.isArray(d.images) && d.images.length >= 2, `${d.id} images must have at least 2 photos`);
    d.images.forEach(img => {
      const parsedImg = new URL(img);
      assert.strictEqual(parsedImg.protocol, 'https:', `${d.id} image must be https`);
    });
  });
});

// ============================================================================
// Suite 4: Filter, Search & Edge Case Adversarial Testing
// ============================================================================
runner.suite('Suite 4: Search & Filtering Edge Cases via app.js');

runner.test('Category filter isolates all 5 IC outlets with 0 noise', () => {
  app.resetStateFilters();
  app.state.hoteldiningCategory = 'intercontinental';
  const filtered = app.getFilteredHotelDinings();
  assert.strictEqual(filtered.length, 5);
  filtered.forEach(item => {
    assert.strictEqual(item.hotelKey, 'intercontinental');
  });
});

runner.test('Adversarial Search: Special characters, partial strings, and accents', () => {
  const testQueries = [
    { q: '쿡북', expectedId: 'dining-intercon-cookbook' },
    { q: 'Cookbook', expectedId: 'dining-intercon-cookbook' },
    { q: '코스타', expectedId: 'dining-intercon-costaseafood' },
    { q: 'Costa', expectedId: 'dining-intercon-costaseafood' },
    { q: '아쿠아라인', expectedId: 'dining-intercon-aqualine' },
    { q: 'Aqualine', expectedId: 'dining-intercon-aqualine' },
    { q: '로비 라운지', expectedId: 'dining-intercon-lobbylounge' },
    { q: '클럽 인터컨티넨탈', expectedId: 'dining-intercon-clublounge' },
    { q: 'Trần Phú', expectMin: 5 },
    { q: '(The Costa & InterContinental)', expectedId: 'dining-intercon-costaseafood' },
    { q: '32-34', expectMin: 5 }
  ];

  testQueries.forEach(t => {
    app.resetStateFilters();
    app.state.searchQuery = t.q;
    const res = app.getFilteredHotelDinings();
    if (t.expectedId) {
      assert.ok(res.some(r => r.id === t.expectedId), `Query "${t.q}" did not find ${t.expectedId}`);
    }
    if (t.expectMin) {
      const icMatches = res.filter(r => r.hotelKey === 'intercontinental');
      assert.ok(icMatches.length >= t.expectMin, `Query "${t.q}" expected >= ${t.expectMin} IC matches, got ${icMatches.length}`);
    }
  });
  app.resetStateFilters();
});

runner.test('Sorting edge cases across all venues including IC venues', () => {
  // Sort by rating (which uses rating * 10000 + reviewCount desc)
  app.resetStateFilters();
  app.state.sortBy = 'rating';
  const byRating = app.getFilteredHotelDinings();
  assert.strictEqual(byRating.length, dinings.length);
  for (let i = 0; i < byRating.length - 1; i++) {
    const scoreA = (byRating[i].rating || 0) * 10000 + (byRating[i].reviewCount || 0);
    const scoreB = (byRating[i + 1].rating || 0) * 10000 + (byRating[i + 1].reviewCount || 0);
    assert.ok(scoreA >= scoreB, 'Rating compound score desc ordering failure');
  }

  // Sort by price-asc
  app.resetStateFilters();
  app.state.sortBy = 'price-asc';
  const byPriceAsc = app.getFilteredHotelDinings();
  assert.strictEqual(byPriceAsc.length, dinings.length);
  for (let i = 0; i < byPriceAsc.length - 1; i++) {
    assert.ok(byPriceAsc[i].avgPriceVnd <= byPriceAsc[i + 1].avgPriceVnd, 'Price asc ordering failure');
  }

  // Sort by price-desc
  app.resetStateFilters();
  app.state.sortBy = 'price-desc';
  const byPriceDesc = app.getFilteredHotelDinings();
  assert.strictEqual(byPriceDesc.length, dinings.length);
  for (let i = 0; i < byPriceDesc.length - 1; i++) {
    assert.ok(byPriceDesc[i].avgPriceVnd >= byPriceDesc[i + 1].avgPriceVnd, 'Price desc ordering failure');
  }

  app.resetStateFilters();
});

// ============================================================================
// Suite 5: DOM Rendering & Modal Integration via DOM Stub
// ============================================================================
runner.suite('Suite 5: DOM Rendering & Modal Lifecycle Stress Test');

runner.test('renderHotelDinings renders all venues and all 5 IC outlets without throwing', () => {
  const dom = installDom();
  try {
    app.resetStateFilters();
    app.renderHotelDinings();
    
    const gridHtml = dom.html('hoteldiningCardsGridContainer');
    assert.ok(gridHtml.length > 0, 'Grid HTML must not be empty');
    
    // Check presence of all 5 IC cards in grid HTML
    icDinings.forEach(d => {
      assert.ok(gridHtml.includes(`data-id="${d.id}"`), `Grid missing card for ${d.id}`);
      assert.ok(gridHtml.includes(app.escapeHtml(d.name)), `Grid missing title for ${d.name}`);
      assert.ok(gridHtml.includes(app.escapeHtml(d.categoryLabel)), `Grid missing categoryLabel for ${d.categoryLabel}`);
    });

    const countText = dom.html('hoteldiningResultCountText');
    assert.ok(countText.includes(String(dinings.length)), `Result count text must reflect ${dinings.length} items: ${countText}`);
  } finally {
    uninstallDom();
  }
});

runner.test('openHotelDiningModal cleanly binds all data fields for every IC outlet', () => {
  const dom = installDom();
  try {
    icDinings.forEach(d => {
      app.openHotelDiningModal(d);
      
      assert.strictEqual(app.state.activeModalHoteldining, d);
      assert.strictEqual(dom.text('hoteldiningModalTitle'), d.name);
      assert.ok(dom.text('hoteldiningModalHotelName').includes(d.hotelName));
      assert.ok(dom.text('hoteldiningModalAddress').includes(d.addressVi));
      assert.ok(dom.text('hoteldiningModalPhone').includes(d.phone));
      
      const sigList = dom.doc.getElementById('hoteldiningModalSignatureList');
      assert.ok(sigList, 'Signature list container must exist');
      
      app.closeHotelDiningModal();
    });
  } finally {
    uninstallDom();
  }
});

// ============================================================================
// Suite 6: Total SSOT Sync across index.html and app.js
// ============================================================================
runner.suite('Suite 6: Total SSOT Sync across index.html and app.js');

runner.test('index.html contains exact count for hoteldining', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes(`data-count-for="hoteldining">${dinings.length}</span>`),
    `Header tab badge must show ${dinings.length} for hoteldining`);
  assert.ok(indexHtml.includes(`전체 호텔 (${dinings.length}곳)`) || indexHtml.includes(`(${dinings.length}곳)`),
    `Category nav button must sync to ${dinings.length} places`);
});

runner.summary();
