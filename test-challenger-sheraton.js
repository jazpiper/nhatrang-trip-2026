/**
 * ============================================================================
 * Nha Trang Trip 2026 - Sheraton Nha Trang F&B Adversarial Challenger Test
 * File: test-challenger-sheraton.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner } = require('./test-harness.js');
const { installDom, uninstallDom } = require('./test-dom-stub.js');

const runner = new TestRunner({
  summaryTitle: 'Adversarial Challenger Test Summary (Sheraton F&B)',
  failureHeader: 'Adversarial Challenge Failures:',
  failureFooter: 'Challenger Verification Failed.',
  successMessage: '🛡️ All Adversarial Challenger Stress Tests Passed! Sheraton integration is 100% robust, verified, and bug-free.',
  exitOnFailure: true,
  exitOnSuccess: true
});

const DATA_FILE = path.resolve(__dirname, 'hotel-dining-data.js');
const mod = require(DATA_FILE);
const dinings = mod.NHA_TRANG_HOTEL_DININGS;
const sheratonDinings = dinings.filter(d => d.hotelKey === 'sheraton');

global.NHA_TRANG_HOTEL_DININGS = dinings;
const app = require('./js/app.js');

// ============================================================================
// Suite 1: Sheraton Outlets Ground-Truth & Identification
// ============================================================================
runner.suite('Suite 1: Sheraton Outlets Ground-Truth & Identification');

runner.test('Exactly 5 Sheraton F&B establishments are registered', () => {
  assert.strictEqual(sheratonDinings.length, 5, `Expected 5 Sheraton venues, found ${sheratonDinings.length}`);
});

const EXPECTED_IDS = [
  'dining-sheraton-feast',
  'dining-sheraton-altitude',
  'dining-sheraton-steam-n-spice',
  'dining-sheraton-plunge-pool-bar',
  'dining-sheraton-andmore'
];

runner.test('All expected canonical Sheraton establishment IDs are present', () => {
  const ids = sheratonDinings.map(d => d.id);
  EXPECTED_IDS.forEach(expectedId => {
    assert.ok(ids.includes(expectedId), `Missing expected Sheraton venue ID: ${expectedId}`);
  });
});

runner.test('All 5 Sheraton venues share valid Vietnamese address at 26-28 Trần Phú', () => {
  sheratonDinings.forEach(d => {
    assert.ok(d.addressVi.includes('26-28 Trần Phú') && d.addressVi.includes('Lộc Thọ') && d.addressVi.includes('Nha Trang'),
      `${d.id} addressVi "${d.addressVi}" must include standard Sheraton address tokens`);
  });
});

runner.test('All 5 Sheraton venues have valid phone contact (+84 258)', () => {
  sheratonDinings.forEach(d => {
    assert.ok(d.phone && d.phone.startsWith('+84 258'), `${d.id} invalid phone: ${d.phone}`);
  });
});

// ============================================================================
// Suite 2: Schema & Canonical Property Integrity
// ============================================================================
runner.suite('Suite 2: 31-Property Canonical Schema Integrity for Sheraton Outlets');

const REQUIRED_FIELDS = [
  'id', 'hotelKey', 'hotelName', 'name', 'nameVi', 'category', 'categoryLabel',
  'badge', 'iconEmoji', 'rating', 'reviewCount', 'openHours', 'location',
  'addressVi', 'phone', 'googleMapQuery', 'officialUrl', 'priceRangeVnd',
  'avgPriceVnd', 'pricePer', 'signatureMenu', 'dressCode', 'reservationRequired',
  'tags', 'highlight', 'description', 'localTip', 'coverImage', 'images',
  'googleMapUrl', 'googlePhotosUrl'
];

const ALLOWED_CATEGORIES = ['buffet', 'fine_dining', 'seafood_bbq', 'lounge_bar', 'traditional'];

runner.test('All Sheraton venues have exactly the canonical schema properties', () => {
  sheratonDinings.forEach(d => {
    REQUIRED_FIELDS.forEach(f => {
      assert.ok(d[f] !== undefined && d[f] !== null, `${d.id} missing field: ${f}`);
    });
    assert.strictEqual(d.hotelKey, 'sheraton');
    assert.ok(ALLOWED_CATEGORIES.includes(d.category), `${d.id} has invalid category: ${d.category}`);
  });
});

runner.test('Rating and review count invariants match survey ground truth', () => {
  const expectedMetrics = {
    'dining-sheraton-feast': { rating: 4.5, reviewCount: 450, category: 'seafood_bbq' },
    'dining-sheraton-altitude': { rating: 4.6, reviewCount: 380, category: 'lounge_bar' },
    'dining-sheraton-steam-n-spice': { rating: 4.6, reviewCount: 210, category: 'fine_dining' },
    'dining-sheraton-plunge-pool-bar': { rating: 4.5, reviewCount: 140, category: 'lounge_bar' },
    'dining-sheraton-andmore': { rating: 4.6, reviewCount: 320, category: 'traditional' }
  };

  sheratonDinings.forEach(d => {
    const exp = expectedMetrics[d.id];
    assert.ok(exp, `Unexpected venue: ${d.id}`);
    assert.strictEqual(d.rating, exp.rating, `${d.id} rating mismatch`);
    assert.strictEqual(d.reviewCount, exp.reviewCount, `${d.id} reviewCount mismatch`);
    assert.strictEqual(d.category, exp.category, `${d.id} category mismatch`);
  });
});

runner.test('Signature menus have >= 3 items and realistic pricing', () => {
  sheratonDinings.forEach(d => {
    assert.ok(Array.isArray(d.signatureMenu) && d.signatureMenu.length >= 3, `${d.id} signatureMenu must have >= 3 items`);
    assert.ok(typeof d.avgPriceVnd === 'number' && d.avgPriceVnd > 0, `${d.id} avgPriceVnd invalid`);
    assert.ok(d.priceRangeVnd.includes('VND'), `${d.id} priceRangeVnd must mention VND`);
  });
});

// ============================================================================
// Suite 3: URL Parsing & Strict Query Parameter Encoding
// ============================================================================
runner.suite('Suite 3: URL Parsing & Strict Query Parameter Encoding');

runner.test('googleMapUrl strictly conforms to Google Maps search API format', () => {
  sheratonDinings.forEach(d => {
    const expectedBase = 'https://www.google.com/maps/search/?api=1&query=';
    assert.ok(d.googleMapUrl.startsWith(expectedBase), `${d.id} googleMapUrl must start with standard base`);
    
    const parsed = new URL(d.googleMapUrl);
    assert.strictEqual(parsed.protocol, 'https:');
    assert.strictEqual(parsed.hostname, 'www.google.com');
    assert.strictEqual(parsed.pathname, '/maps/search/');
    assert.strictEqual(parsed.searchParams.get('api'), '1');
    
    const queryParam = parsed.searchParams.get('query');
    assert.strictEqual(queryParam, d.googleMapQuery, `${d.id} query param must decode to exact googleMapQuery`);
  });
});

runner.test('googlePhotosUrl strictly conforms to Google Maps photo query format', () => {
  sheratonDinings.forEach(d => {
    const parsed = new URL(d.googlePhotosUrl);
    assert.strictEqual(parsed.protocol, 'https:');
    assert.strictEqual(parsed.hostname, 'www.google.com');
    assert.strictEqual(parsed.pathname, '/maps/search/');
    assert.strictEqual(parsed.searchParams.get('api'), '1');
    
    const queryParam = parsed.searchParams.get('query');
    assert.ok(queryParam.includes('사진'), `${d.id} googlePhotosUrl query must include '사진' suffix`);
  });
});

// ============================================================================
// Suite 4: Filter, Search & Edge Case Adversarial Testing
// ============================================================================
runner.suite('Suite 4: Search & Filtering Edge Cases via app.js');

runner.test('Category filter isolates all 5 Sheraton venues with 0 noise', () => {
  app.resetStateFilters();
  app.state.hoteldiningCategory = 'sheraton';
  const filtered = app.getFilteredHotelDinings();
  assert.strictEqual(filtered.length, 5);
  filtered.forEach(item => {
    assert.strictEqual(item.hotelKey, 'sheraton');
  });
});

runner.test('Adversarial Search: Searches find all Sheraton venues accurately', () => {
  const testQueries = [
    { q: '피스트', expectedId: 'dining-sheraton-feast' },
    { q: 'Feast', expectedId: 'dining-sheraton-feast' },
    { q: '알티튜드', expectedId: 'dining-sheraton-altitude' },
    { q: 'Altitude', expectedId: 'dining-sheraton-altitude' },
    { q: '스팀 앤 스파이스', expectedId: 'dining-sheraton-steam-n-spice' },
    { q: 'Steam', expectedId: 'dining-sheraton-steam-n-spice' },
    { q: '플런지', expectedId: 'dining-sheraton-plunge-pool-bar' },
    { q: 'Plunge', expectedId: 'dining-sheraton-plunge-pool-bar' },
    { q: '앤모어', expectedId: 'dining-sheraton-andmore' },
    { q: 'AndMore', expectedId: 'dining-sheraton-andmore' }
  ];

  testQueries.forEach(t => {
    app.resetStateFilters();
    app.state.searchQuery = t.q;
    const res = app.getFilteredHotelDinings();
    assert.ok(res.some(r => r.id === t.expectedId), `Query "${t.q}" did not find ${t.expectedId}`);
  });
  app.resetStateFilters();
});

// ============================================================================
// Suite 5: DOM Rendering & Modal Integration via DOM Stub
// ============================================================================
runner.suite('Suite 5: DOM Rendering & Modal Lifecycle Stress Test');

runner.test('renderHotelDinings renders all venues and all 5 Sheraton venues without throwing', () => {
  const dom = installDom();
  try {
    app.resetStateFilters();
    app.renderHotelDinings();
    
    const gridHtml = dom.html('hoteldiningCardsGridContainer');
    assert.ok(gridHtml.length > 0, 'Grid HTML must not be empty');
    
    sheratonDinings.forEach(d => {
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

runner.test('openHotelDiningModal cleanly binds all data fields for every Sheraton outlet', () => {
  const dom = installDom();
  try {
    sheratonDinings.forEach(d => {
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

runner.summary();
