/**
 * ============================================================================
 * Nha Trang Trip 2026 - Hotel Dining Dataset Validation Suite
 * File: test-hoteldining.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner } = require('./test-harness.js');

const runner = new TestRunner({
  summaryTitle: 'Hotel Dining Test Execution Summary',
  failureHeader: 'Failures Detected:',
  failureFooter: 'Hotel Dining Test Suite Failed.',
  successMessage: '✨ All Hotel Dining Test Suites Passed Successfully! 100% Schema & Data Integrity Verified.',
  exitOnFailure: true,
  exitOnSuccess: true
});

const DATA_FILE_PATH = path.resolve(__dirname, 'hotel-dining-data.js');

runner.suite('Suite 1: File Loading & Dual Export Verification');

runner.test('hotel-dining-data.js exists on disk', () => {
  assert.ok(fs.existsSync(DATA_FILE_PATH), `hotel-dining-data.js not found at ${DATA_FILE_PATH}`);
});

let dinings = [];

runner.test('hotel-dining-data.js loads via CommonJS module.exports and exports NHA_TRANG_HOTEL_DININGS', () => {
  const mod = require(DATA_FILE_PATH);
  assert.ok(mod.NHA_TRANG_HOTEL_DININGS, 'module.exports.NHA_TRANG_HOTEL_DININGS must be exported');
  assert.ok(Array.isArray(mod.NHA_TRANG_HOTEL_DININGS), 'NHA_TRANG_HOTEL_DININGS must be an array');
  assert.ok(mod.NHA_TRANG_HOTEL_DININGS.length > 0, 'NHA_TRANG_HOTEL_DININGS must not be empty');
  dinings = mod.NHA_TRANG_HOTEL_DININGS;
});

runner.suite('Suite 2: Dataset Schema & Numeric Bounds');

const ALLOWED_CATEGORIES = ['buffet', 'fine_dining', 'seafood_bbq', 'lounge_bar', 'traditional'];

runner.test('All entries contain canonical categories and valid schema properties', () => {
  const seenIds = new Set();
  dinings.forEach((item, idx) => {
    assert.ok(item.id, `Item #${idx} must have an id`);
    assert.ok(!seenIds.has(item.id), `Duplicate ID detected: ${item.id}`);
    seenIds.add(item.id);

    assert.ok(item.name, `Item ${item.id} must have a name`);
    assert.ok(item.nameVi, `Item ${item.id} must have nameVi`);
    assert.ok(item.hotelName, `Item ${item.id} must have hotelName`);
    assert.ok(item.hotelKey, `Item ${item.id} must have hotelKey`);
    assert.ok(ALLOWED_CATEGORIES.includes(item.category), `Invalid category "${item.category}" on ${item.id}`);
    assert.ok(item.categoryLabel, `Item ${item.id} must have categoryLabel`);
    assert.ok(item.badge, `Item ${item.id} must have badge`);
    assert.ok(item.iconEmoji, `Item ${item.id} must have iconEmoji`);
    
    // Ratings and review counts
    assert.ok(typeof item.rating === 'number' && item.rating >= 3.5 && item.rating <= 5.0, `Invalid rating on ${item.id}: ${item.rating}`);
    assert.ok(typeof item.reviewCount === 'number' && item.reviewCount > 0, `Invalid reviewCount on ${item.id}: ${item.reviewCount}`);
    
    // Address & Links
    assert.ok(item.addressVi, `Item ${item.id} must have addressVi`);
    assert.ok(item.googleMapUrl && item.googleMapUrl.startsWith('https://www.google.com/maps/search/'), `Invalid googleMapUrl on ${item.id}`);
    assert.ok(item.priceRangeVnd, `Item ${item.id} must have priceRangeVnd`);
    assert.ok(typeof item.avgPriceVnd === 'number' && item.avgPriceVnd > 0, `Invalid avgPriceVnd on ${item.id}`);
    assert.ok(Array.isArray(item.signatureMenu) && item.signatureMenu.length > 0, `Item ${item.id} must have signatureMenu array`);
    assert.ok(Array.isArray(item.tags) && item.tags.length > 0, `Item ${item.id} must have tags array`);
    assert.ok(item.highlight, `Item ${item.id} must have highlight`);
    assert.ok(item.description, `Item ${item.id} must have description`);
    assert.ok(item.localTip, `Item ${item.id} must have localTip`);
  });
});

runner.suite('Suite 3: Filter & Search Business Logic (app.js integration)');

runner.test('app.js exports getFilteredHotelDinings and performs filtering', () => {
  global.NHA_TRANG_HOTEL_DININGS = dinings;
  const app = require('./js/app.js');
  assert.ok(typeof app.getFilteredHotelDinings === 'function', 'app.js must export getFilteredHotelDinings');

  app.resetStateFilters();
  const all = app.getFilteredHotelDinings();
  assert.strictEqual(all.length, dinings.length, 'Default filter returns all hotel dinings');

  // Test Hotel Category Filter (JW Marriott, InterContinental, Sheraton, etc.)
  app.state.hoteldiningCategory = 'jw_marriott';
  const jwDinings = app.getFilteredHotelDinings();
  assert.strictEqual(jwDinings.length, 6, 'JW Marriott filter returns all 6 JW venues');
  assert.ok(jwDinings.every(d => d.hotelKey === 'jw_marriott'), 'All items belong to JW Marriott');

  app.state.hoteldiningCategory = 'intercontinental';
  const interconDinings = app.getFilteredHotelDinings();
  assert.strictEqual(interconDinings.length, 5, 'InterContinental filter returns 5 venues');

  app.state.hoteldiningCategory = 'sheraton';
  const sheratonDinings = app.getFilteredHotelDinings();
  assert.strictEqual(sheratonDinings.length, 5, 'Sheraton filter returns 5 venues');
  assert.ok(sheratonDinings.every(d => d.hotelKey === 'sheraton'), 'All items belong to Sheraton');

  // Test Tag Filter
  app.resetStateFilters();
  app.state.hoteldiningTag = 'ocean_view';
  const oceanViews = app.getFilteredHotelDinings();
  assert.ok(oceanViews.length > 0, 'Tag filter returns ocean view spots');

  // Test Search
  app.resetStateFilters();
  app.state.searchQuery = '클레이';
  const searchResults = app.getFilteredHotelDinings();
  assert.ok(searchResults.length > 0 && searchResults.some(r => r.id === 'dining-jw-claycraft'), 'Search resolves Clay Craft');

  // Test Sorting
  app.resetStateFilters();
  app.state.sortBy = 'price-asc';
  const sortedAsc = app.getFilteredHotelDinings();
  for (let i = 0; i < sortedAsc.length - 1; i++) {
    assert.ok(sortedAsc[i].avgPriceVnd <= sortedAsc[i + 1].avgPriceVnd, 'Sorted by price ascending');
  }

  app.resetStateFilters();
});

runner.suite('Suite 4: DOM Elements in index.html & SSOT Sync');

runner.test('index.html contains all canonical hotel dining IDs and navigation elements', () => {
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('data-tab="hoteldining"'), 'Header must contain hoteldining tab button');
  assert.ok(indexHtml.includes('id="hoteldiningCategoryNav"'), 'index.html must contain hoteldiningCategoryNav');
  assert.ok(indexHtml.includes('id="hoteldiningTagChips"'), 'index.html must contain hoteldiningTagChips');
  assert.ok(indexHtml.includes('id="hoteldiningGridSection"'), 'index.html must contain hoteldiningGridSection');
  assert.ok(indexHtml.includes('id="hoteldiningCardsGridContainer"'), 'index.html must contain hoteldiningCardsGridContainer');
  assert.ok(indexHtml.includes('id="hoteldiningResultCountText"'), 'index.html must contain hoteldiningResultCountText');
  assert.ok(indexHtml.includes('data-modal="hoteldiningModal"'), 'index.html must contain hoteldiningModal template');
});

runner.suite('Suite 5: Anti-XSS and Security Verification');

runner.test('No hotel dining data property contains raw script tags or javascript protocols', () => {
  dinings.forEach(item => {
    const json = JSON.stringify(item);
    assert.ok(!json.includes('<script'), `Dangerous script tag found in item: ${item.id}`);
    assert.ok(!json.includes('javascript:'), `javascript: URI found in item: ${item.id}`);
  });
});

runner.summary();
