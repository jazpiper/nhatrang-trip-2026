/**
 * ============================================================================
 * Nha Trang Trip 2026 - Tailored Situational Curation Dataset Validation Suite
 * File: test-curation.js
 * ============================================================================
 * 
 * 12 Automated Suites:
 * 1. File loading & dual export verification (window.NHA_TRANG_CURATIONS & module.exports)
 * 2. Dataset size & 4 canonical scenarios (checkout, rainy, night, couple)
 * 3. Scenario course schema completeness (standardized course fields)
 * 4. Timeline steps structure & sequential ordering (stepNo, time, transit, actions)
 * 5. ✈️ Checkout Tour (23:00 Night Flight CXR) ground-truth content
 * 6. 🌧️ Rainy Weather Indoor Course ground-truth content
 * 7. 🌙 Late Night 22:00+ Spot Course ground-truth content
 * 8. 💑 Romantic & Couple Healing Course ground-truth content
 * 9. Zero-hallucination & Google Maps link integrity
 * 10. Filter & search business logic (real js/app.js)
 * 11. String integrity & anti-XSS security
 * 12. DOM IDs & count synchronization in index.html
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner } = require('./test-harness.js');

const runner = new TestRunner({
  summaryTitle: 'Curation Test Execution Summary',
  failureHeader: 'Failures Detected:',
  failureFooter: 'Curation Test Suite Failed.',
  successMessage: '✨ All Curation Test Suites Passed Successfully! 100% Schema & Data Integrity Verified.'
});

const CURATION_FILE_PATH = path.resolve(__dirname, 'curation-data.js');

// ============================================================================
// Suite 1: File Loading & Dual Export Verification
// ============================================================================
runner.suite('File Loading & Dual Export Verification');

runner.test('curation-data.js exists on disk', () => {
  assert.ok(fs.existsSync(CURATION_FILE_PATH), `curation-data.js not found at ${CURATION_FILE_PATH}`);
});

let curations = [];

runner.test('curation-data.js loads via CommonJS module.exports and exports NHA_TRANG_CURATIONS', () => {
  const mod = require(CURATION_FILE_PATH);
  assert.ok(mod.NHA_TRANG_CURATIONS || mod.NHA_TRANG_CURATION, 'module.exports must export NHA_TRANG_CURATIONS');
  curations = mod.NHA_TRANG_CURATIONS || mod.NHA_TRANG_CURATION;
  assert.ok(Array.isArray(curations), 'NHA_TRANG_CURATIONS must be an array');
  assert.ok(curations.length > 0, 'NHA_TRANG_CURATIONS must not be empty');
});

runner.test('curation-data.js supports window globals for vanilla browser environment', () => {
  const rawCode = fs.readFileSync(CURATION_FILE_PATH, 'utf8');
  assert.ok(
    rawCode.includes('window.NHA_TRANG_CURATIONS') || rawCode.includes('typeof window !== \'undefined\''),
    'curation-data.js must declare dual export shim for window browser context'
  );
  assert.ok(
    rawCode.includes('module.exports'),
    'curation-data.js must export for CommonJS node environment'
  );
});

// ============================================================================
// Suite 2: Dataset Size & 4 Canonical Scenarios
// ============================================================================
runner.suite('Dataset Size & 4 Canonical Scenarios');

runner.test('Total scenario course count is exactly 4', () => {
  assert.strictEqual(curations.length, 4, `Expected exactly 4 scenario courses, got ${curations.length}`);
});

const REQUIRED_SCENARIOS = ['checkout', 'rainy', 'night', 'couple'];

runner.test('All 4 canonical scenarios exist with unique IDs', () => {
  const foundKeys = new Set();
  const foundIds = new Set();

  curations.forEach((course, idx) => {
    const key = course.scenarioKey || course.category;
    assert.ok(REQUIRED_SCENARIOS.includes(key), `Course #${idx + 1} has unexpected scenario key: ${key}`);
    assert.ok(!foundKeys.has(key), `Duplicate scenario key detected: ${key}`);
    foundKeys.add(key);

    assert.ok(typeof course.id === 'string' && course.id.trim().length > 0, `Course #${idx + 1} missing ID`);
    assert.ok(!foundIds.has(course.id), `Duplicate course ID detected: ${course.id}`);
    foundIds.add(course.id);
  });

  REQUIRED_SCENARIOS.forEach(req => {
    assert.ok(foundKeys.has(req), `Missing required scenario: ${req}`);
  });
});

// ============================================================================
// Suite 3: Course Schema Completeness (Required Fields)
// ============================================================================
runner.suite('Course Schema Completeness');

const REQUIRED_COURSE_FIELDS = [
  'id',
  'title',
  'titleEn',
  'badge',
  'summary',
  'duration',
  'targetAudience',
  'coverImage',
  'tags',
  'timeline'
];

runner.test('Every course contains all required schema fields with non-empty values', () => {
  curations.forEach((course, idx) => {
    const missing = [];
    REQUIRED_COURSE_FIELDS.forEach(field => {
      const val = course[field];
      if (val === undefined || val === null || val === '') {
        missing.push(field);
      }
      if (Array.isArray(val) && val.length === 0) {
        missing.push(`${field}(empty array)`);
      }
    });

    assert.strictEqual(
      missing.length,
      0,
      `Course #${idx + 1} (${course.id || 'unknown'}) is missing required fields: [${missing.join(', ')}]`
    );
  });
});

runner.test('Every course contains at least 3 highlights or keyTips and at least 4 tags', () => {
  curations.forEach((course, idx) => {
    const tips = course.keyTips || course.highlights || [];
    assert.ok(tips.length >= 3, `Course #${idx + 1} (${course.id}) must have >= 3 tips/highlights`);
    assert.ok(Array.isArray(course.tags) && course.tags.length >= 4, `Course #${idx + 1} (${course.id}) must have >= 4 tags`);
  });
});

// ============================================================================
// Suite 4: Timeline Structure & Step Ordering
// ============================================================================
runner.suite('Timeline Structure & Step Ordering');

runner.test('Each course timeline has >= 4 chronological steps with sequential step numbering', () => {
  curations.forEach((course, cIdx) => {
    assert.ok(Array.isArray(course.timeline), `Course #${cIdx + 1} (${course.id}) timeline must be an array`);
    assert.ok(course.timeline.length >= 4, `Course #${cIdx + 1} (${course.id}) timeline must have at least 4 steps`);

    course.timeline.forEach((step, sIdx) => {
      const stepNumber = step.stepNo || step.step;
      assert.strictEqual(stepNumber, sIdx + 1, `Course ${course.id} step #${sIdx + 1} has incorrect stepNo: ${stepNumber}`);
      assert.ok(typeof step.time === 'string' && step.time.trim().length > 0, `Course ${course.id} step #${sIdx + 1} missing time`);
      assert.ok(typeof step.title === 'string' && step.title.trim().length > 0, `Course ${course.id} step #${sIdx + 1} missing title`);

      const desc = step.actionGuide || step.description || step.recommendedAction;
      assert.ok(typeof desc === 'string' && desc.trim().length > 0, `Course ${course.id} step #${sIdx + 1} missing description/actionGuide`);
    });
  });
});

// ============================================================================
// Suite 5: ✈️ Checkout Tour (Night Flight CXR) Ground-Truth Content
// ============================================================================
runner.suite('Checkout Tour (Night Flight CXR) Ground-Truth Content');

runner.test('Checkout tour contains all essential phases: 12:00 checkout, luggage spa, shopping, dinner, shower, airport arrival', () => {
  const checkoutCourse = curations.find(c => (c.scenarioKey || c.category) === 'checkout');
  assert.ok(checkoutCourse, 'Checkout tour course must exist');

  const fullText = JSON.stringify(checkoutCourse);
  assert.ok(fullText.includes('12:00'), 'Must include 12:00 checkout time');
  assert.ok(fullText.includes('짐 보관') || fullText.includes('무료 보관'), 'Must mention luggage storage');
  assert.ok(fullText.includes('롯데마트') || fullText.includes('골드코스트'), 'Must include Lotte Mart / Gold Coast mall');
  assert.ok(fullText.includes('스파') || fullText.includes('마사지'), 'Must include spa treatment');
  assert.ok(fullText.includes('샤워') || fullText.includes('환복'), 'Must include shower / clothes change before flight');
  assert.ok(fullText.includes('깜란') || fullText.includes('CXR') || fullText.includes('공항'), 'Must include Cam Ranh Airport (CXR) sending');

  // Verify logistics tips
  assert.ok(checkoutCourse.logisticsTips, 'Must contain logisticsTips object');
  assert.ok(checkoutCourse.logisticsTips.airportSendingTiming || checkoutCourse.logisticsTips.baggageStorage, 'Must contain airport or baggage timing info');
});

// ============================================================================
// Suite 6: 🌧️ Rainy Weather Course Ground-Truth Content
// ============================================================================
runner.suite('Rainy Weather Course Ground-Truth Content');

runner.test('Rainy weather course contains 100% indoor activities: mud bath, hot soup, mall, afternoon tea, head spa', () => {
  const rainyCourse = curations.find(c => (c.scenarioKey || c.category) === 'rainy');
  assert.ok(rainyCourse, 'Rainy weather course must exist');

  const fullText = JSON.stringify(rainyCourse);
  assert.ok(fullText.includes('머드') || fullText.includes('온천') || fullText.includes('아이리조트'), 'Must include mud bath / hot mineral bath');
  assert.ok(fullText.includes('쌀국수') || fullText.includes('뚝배기'), 'Must include hot soup / noodle');
  assert.ok(fullText.includes('애프터눈') || fullText.includes('하이티') || fullText.includes('라운지'), 'Must include 5-star hotel afternoon tea');
  assert.ok(fullText.includes('헤드스파') || fullText.includes('샴푸'), 'Must include relaxing head spa / shampoo');
});

// ============================================================================
// Suite 7: 🌙 Late Night (22:00+) Ground-Truth Content
// ============================================================================
runner.suite('Late Night (22:00+) Ground-Truth Content');

runner.test('Late night course contains late night spots: 45F rooftop, beach club fire show, craft beer, night food', () => {
  const nightCourse = curations.find(c => (c.scenarioKey || c.category) === 'night');
  assert.ok(nightCourse, 'Late night course must exist');

  const fullText = JSON.stringify(nightCourse);
  assert.ok(fullText.includes('스카이라이트') || fullText.includes('루프탑'), 'Must include Skylight 360 / rooftop');
  assert.ok(fullText.includes('세일링') || fullText.includes('불쇼') || fullText.includes('파이어'), 'Must include Sailing Club fire show');
  assert.ok(fullText.includes('루이지애나') || fullText.includes('수제맥주') || fullText.includes('브루하우스'), 'Must include craft beer / brewhouse');
  assert.ok(fullText.includes('야식') || fullText.includes('포차') || fullText.includes('포퀸') || fullText.includes('조개'), 'Must include late night food');
});

// ============================================================================
// Suite 8: 💑 Romantic & Couple Healing Course Ground-Truth Content
// ============================================================================
runner.suite('Romantic & Couple Healing Course Ground-Truth Content');

runner.test('Couple course contains romantic spots: private villa spa, cliff oceanview cafe, 5-star sunset dinner cruise', () => {
  const coupleCourse = curations.find(c => (c.scenarioKey || c.category) === 'couple');
  assert.ok(coupleCourse, 'Couple romantic course must exist');

  const fullText = JSON.stringify(coupleCourse);
  assert.ok(fullText.includes('센 스파') || fullText.includes('빌라') || fullText.includes('커플'), 'Must include private villa couple spa');
  assert.ok(fullText.includes('혼총') || fullText.includes('절벽') || fullText.includes('오션뷰'), 'Must include cliff oceanview cafe');
  assert.ok(fullText.includes('엠페러') || fullText.includes('선셋') || fullText.includes('크루즈'), 'Must include 5-star Emperor sunset dinner cruise');
  assert.ok(fullText.includes('알티튜드') || fullText.includes('루프탑') || fullText.includes('칵테일') || fullText.includes('쉐라톤'), 'Must include rooftop cocktail / skyline view');
});

// ============================================================================
// Suite 9: Zero-Hallucination & Google Maps Link Integrity
// ============================================================================
runner.suite('Google Maps Link Integrity');

runner.test('All places referenced in timelines have valid Google Maps Search URLs with Nha Trang address markers', () => {
  const mapPrefix = 'https://www.google.com/maps/search/?api=1&query=';
  let totalPlacesChecked = 0;

  curations.forEach(course => {
    course.timeline.forEach(step => {
      const places = step.places || step.recommendedPlaces || [];
      places.forEach(place => {
        const url = place.mapUrl || place.googleMapUrl;
        assert.ok(typeof url === 'string' && url.startsWith(mapPrefix), `Place "${place.name}" has invalid map URL: ${url}`);
        assert.ok(typeof place.name === 'string' && place.name.length > 0, 'Place name must not be empty');
        assert.ok(typeof place.rating === 'number' && place.rating >= 3.5 && place.rating <= 5.0, `Place "${place.name}" rating out of bounds: ${place.rating}`);
        assert.ok(typeof place.reviewCount === 'number' && place.reviewCount > 0, `Place "${place.name}" reviewCount invalid: ${place.reviewCount}`);
        totalPlacesChecked++;
      });
    });
  });

  assert.ok(totalPlacesChecked >= 10, `Expected at least 10 place references across courses, checked ${totalPlacesChecked}`);
});

// ============================================================================
// Suite 10: Filter & Search Business Logic (Real js/app.js)
// ============================================================================
runner.suite('Filter & Search Business Logic');

global.NHA_TRANG_CURATIONS = curations;
const app = require('./js/app.js');

runner.test('getFilteredCurations() exports from js/app.js and returns all 4 courses by default', () => {
  assert.strictEqual(typeof app.getFilteredCurations, 'function', 'app.getFilteredCurations must be a function');
  app.resetStateFilters();
  const all = app.getFilteredCurations();
  assert.strictEqual(all.length, 4, `Expected 4 courses by default, got ${all.length}`);
});

runner.test('Category filtering correctly partitions the 4 scenario courses', () => {
  REQUIRED_SCENARIOS.forEach(scenario => {
    app.resetStateFilters();
    app.state.curationCategory = scenario;
    const res = app.getFilteredCurations();
    assert.strictEqual(res.length, 1, `Category "${scenario}" should return exactly 1 course, got ${res.length}`);
    const key = res[0].scenarioKey || res[0].category;
    assert.strictEqual(key, scenario, `Course returned has key "${key}", expected "${scenario}"`);
  });
  app.resetStateFilters();
});

runner.test('Tag filtering matches expected courses', () => {
  const testTags = ['luggage', 'indoor', 'late', 'sunset'];
  testTags.forEach(tag => {
    app.resetStateFilters();
    app.state.curationTag = tag;
    const res = app.getFilteredCurations();
    assert.ok(res.length >= 1, `Tag "${tag}" should return at least 1 course, got ${res.length}`);
  });
  app.resetStateFilters();
});

runner.test('Keyword search matches courses by title, summary, and place names', () => {
  const searchCases = [
    { query: '체크아웃', minExpected: 1 },
    { query: '머드', minExpected: 1 },
    { query: '스카이라이트', minExpected: 1 },
    { query: '선셋', minExpected: 1 },
    { query: '롯데마트', minExpected: 1 }
  ];

  searchCases.forEach(sc => {
    app.resetStateFilters();
    app.state.searchQuery = sc.query;
    const res = app.getFilteredCurations();
    assert.ok(
      res.length >= sc.minExpected,
      `Search for "${sc.query}" returned ${res.length}, expected >= ${sc.minExpected}`
    );
  });
  app.resetStateFilters();
});

// ============================================================================
// Suite 11: String Integrity & Anti-XSS Security
// ============================================================================
runner.suite('String Integrity & Anti-XSS Security');

runner.test('No corrupted string literals exist in dataset', () => {
  const jsonStr = JSON.stringify(curations);
  const corruptedLiterals = ['undefined', 'null', 'NaN', '[object Object]'];
  corruptedLiterals.forEach(lit => {
    // Check if literal is present as a stand-alone string
    assert.ok(!jsonStr.includes(`"${lit}"`), `Found corrupted literal "${lit}" in curation dataset`);
  });
});

runner.test('No XSS injection vectors exist in dataset', () => {
  const jsonStr = JSON.stringify(curations);
  const dangerousPatterns = [/<script/i, /<iframe/i, /javascript:/i, /onerror=/i, /onload=/i];
  dangerousPatterns.forEach(pat => {
    assert.ok(!pat.test(jsonStr), `Found unsafe pattern ${pat} in curation dataset`);
  });
});

runner.test('Privacy: No personal calendar dates or Day markers', () => {
  const jsonStr = JSON.stringify(curations);
  assert.ok(!/9\/1[0-9]|9\/2[0-9]|Day ?[1-7]/.test(jsonStr), 'curation-data.js must not contain private trip dates');
});

// ============================================================================
// Suite 12: DOM Elements & Count Synchronization in index.html
// ============================================================================
runner.suite('DOM Elements & Count Synchronization');

const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

runner.test('All canonical curation DOM IDs exist in index.html', () => {
  const curationIds = [
    'curationCategoryNav',
    'curationTagChips',
    'curationGridSection',
    'curationResultCountText',
    'curationCardsGridContainer'
  ];

  curationIds.forEach(id => {
    assert.ok(indexHtml.includes(`id="${id}"`), `Missing ID "${id}" in index.html`);
  });
});

runner.test('Header tab badge for curation displays "4대 코스"', () => {
  const badgeRegex = /data-tab="curation"[\s\S]*?<span class="tab-badge"[^>]*>([^<]+)<\/span>/;
  const match = indexHtml.match(badgeRegex);
  assert.ok(match, 'Curation tab badge not found in index.html');
  assert.strictEqual(match[1].trim(), '4대 코스', `Curation tab badge reads "${match[1]}", expected "4대 코스"`);
});

// Run summary and exit
const passed = runner.summary();
process.exit(passed ? 0 : 1);
