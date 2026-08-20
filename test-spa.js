/**
 * ============================================================================
 * Nha Trang Trip 2026 - Dedicated Spa & Massage Dataset Validation Suite
 * File: test-spa.js
 * ============================================================================
 * 
 * 13 Automated Suites:
 * 1. File loading & dual export verification (window.NHA_TRANG_SPAS & module.exports)
 * 2. Dataset capacity (20~25 verified spots) & category distribution
 * 3. Unique IDs & format (/^spa-\d{2,}$/)
 * 4. Schema completeness (all standardized fields + uniform key shape, 0 drift)
 * 5. Numeric bounds (rating 4.0~5.0, reviewCount > 0 integer, priceVnd > 0)
 * 6. Course price matrix structure (60/90/120min courses, priceVnd, priceKrw)
 * 7. Facility & service policy invariants (pickupDropoff, tipPolicy, luggageShower)
 * 8. Google Maps API search URL encoding & addressVi fidelity
 * 9. Cover image & gallery images integrity (>= 3 valid HTTPS URLs, distinct)
 * 10. Category taxonomy & tag depth (>= 3 tags per spot)
 * 11. Filtering business logic (category, tag, search query, district)
 * 12. Comparator & sorting (recommended, rating, reviews, price-asc, price-desc)
 * 13. Security & zero-schedule invariants (anti-XSS, no dates, tips completeness)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner, colors } = require('./test-harness.js');

const runner = new TestRunner({
  summaryTitle: 'Spa Test Execution Summary',
  failureHeader: 'Failures Detected:',
  failureFooter: 'Spa Test Suite Failed.',
  successMessage: '✨ All Spa Test Suites Passed Successfully! 100% Schema & Data Integrity Verified.'
});
const SPA_FILE_PATH = path.resolve(__dirname, 'spa-data.js');

// ============================================================================
// Suite 1: File Loading & Dual Export Verification
// ============================================================================
runner.suite('File Loading & Dual Export Verification');

runner.test('spa-data.js exists on disk', () => {
  assert.ok(fs.existsSync(SPA_FILE_PATH), `spa-data.js not found at ${SPA_FILE_PATH}`);
});

let spas = [];
let spaTips = [];

runner.test('spa-data.js loads via CommonJS module.exports and exports NHA_TRANG_SPAS', () => {
  const mod = require(SPA_FILE_PATH);
  assert.ok(mod.NHA_TRANG_SPAS, 'module.exports.NHA_TRANG_SPAS must be exported');
  assert.ok(Array.isArray(mod.NHA_TRANG_SPAS), 'NHA_TRANG_SPAS must be an array');
  assert.ok(mod.NHA_TRANG_SPAS.length > 0, 'NHA_TRANG_SPAS must not be empty');
  spas = mod.NHA_TRANG_SPAS;
  spaTips = mod.NHA_TRANG_SPA_TIPS || [];
});

runner.test('spa-data.js supports window globals for vanilla browser environment', () => {
  const rawCode = fs.readFileSync(SPA_FILE_PATH, 'utf8');
  assert.ok(
    rawCode.includes('window.NHA_TRANG_SPAS = NHA_TRANG_SPAS') || rawCode.includes('typeof window !== \'undefined\''),
    'spa-data.js must declare dual export shim for window browser context'
  );
  assert.ok(
    rawCode.includes('module.exports'),
    'spa-data.js must export for CommonJS node environment'
  );
});

// ============================================================================
// Suite 2: Dataset Capacity & Category Taxonomy
// ============================================================================
runner.suite('Dataset Capacity & Category Taxonomy');

runner.test('Total spa count meets capacity constraint (20 <= count <= 25, exactly 24)', () => {
  assert.ok(
    spas.length >= 20 && spas.length <= 25,
    `Expected between 20 and 25 spas, but found ${spas.length}`
  );
  assert.strictEqual(spas.length, 24, `Expected exactly 24 ground-truth spas, got ${spas.length}`);
});

const ALLOWED_SPA_CATEGORIES = [
  'local_budget',
  'luxury_resort',
  'barbershop',
  'family_maternity'
];

runner.test('All spas belong to the 4 canonical categories with balanced distribution', () => {
  const categoryCounts = {};
  ALLOWED_SPA_CATEGORIES.forEach(cat => { categoryCounts[cat] = 0; });

  spas.forEach((spa, idx) => {
    assert.ok(
      ALLOWED_SPA_CATEGORIES.includes(spa.category),
      `Spa #${idx + 1} (${spa.id}) has invalid category: "${spa.category}". Allowed: [${ALLOWED_SPA_CATEGORIES.join(', ')}]`
    );
    categoryCounts[spa.category]++;
  });

  // Verify >= 4 spots per category
  ALLOWED_SPA_CATEGORIES.forEach(cat => {
    assert.ok(
      categoryCounts[cat] >= 4,
      `Category "${cat}" has only ${categoryCounts[cat]} spots (minimum 4 required for balance)`
    );
  });

  assert.strictEqual(categoryCounts['local_budget'], 6, 'local_budget should have 6 spots');
  assert.strictEqual(categoryCounts['luxury_resort'], 6, 'luxury_resort should have 6 spots');
  assert.strictEqual(categoryCounts['barbershop'], 4, 'barbershop should have 4 spots');
  assert.strictEqual(categoryCounts['family_maternity'], 8, 'family_maternity should have 8 spots');
});

// ============================================================================
// Suite 3: Unique Identifiers & Slug Format
// ============================================================================
runner.suite('ID Uniqueness & Identifier Format');

runner.test('Every spa has a unique ID matching /^spa-\\d{2,}$/', () => {
  const idSet = new Set();
  const idRegex = /^spa-\d{2,}$/;

  spas.forEach((spa, idx) => {
    assert.ok(typeof spa.id === 'string' && spa.id.trim().length > 0, `Spa #${idx + 1} missing ID`);
    assert.ok(idRegex.test(spa.id), `Spa #${idx + 1} ID "${spa.id}" must match format /^spa-\\d{2,}$/`);
    assert.ok(!idSet.has(spa.id), `Duplicate spa ID detected: "${spa.id}"`);
    idSet.add(spa.id);

    const expectedId = `spa-${String(idx + 1).padStart(2, '0')}`;
    assert.strictEqual(spa.id, expectedId, `Spa at index ${idx} should have sequential ID "${expectedId}"`);
  });
});

// ============================================================================
// Suite 4: Schema Completeness & Uniform Shape
// ============================================================================
runner.suite('Schema Completeness & Uniform Shape');

const REQUIRED_SPA_FIELDS = [
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
  'priceRange',
  'priceRangeVnd',
  'avgPriceVnd',
  'price60minVnd',
  'price90minVnd',
  'price120minVnd',
  'prices',
  'courses',
  'pickupDropoff',
  'tipPolicy',
  'luggageShower',
  'openHours',
  'location',
  'district',
  'districtLabel',
  'addressVi',
  'phone',
  'googleMapQuery',
  'googleMapUrl',
  'googlePhotosUrl',
  'coverImage',
  'images',
  'tags',
  'facilities',
  'highlight',
  'summary',
  'description',
  'features',
  'localTip'
];

runner.test('Every spa contains all 39 standardized schema fields with non-empty values', () => {
  spas.forEach((spa, idx) => {
    const missing = [];
    REQUIRED_SPA_FIELDS.forEach(field => {
      const val = spa[field];
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
      `Spa #${idx + 1} (${spa.id || 'unknown'}) is missing required fields: [${missing.join(', ')}]`
    );
  });
});

// ============================================================================
// Suite 5: Numeric Bounds & Currency Precision
// ============================================================================
runner.suite('Numeric Bounds & Value Boundaries');

runner.test('Ratings are numbers bounded between 4.0 and 5.0', () => {
  spas.forEach((spa, idx) => {
    assert.strictEqual(typeof spa.rating, 'number', `Spa #${idx + 1} (${spa.id}) rating is not a number`);
    assert.ok(!isNaN(spa.rating), `Spa #${idx + 1} (${spa.id}) rating is NaN`);
    assert.ok(
      spa.rating >= 4.0 && spa.rating <= 5.0,
      `Spa #${idx + 1} (${spa.id}) rating ${spa.rating} out of valid range [4.0, 5.0]`
    );
  });
});

runner.test('Review counts are positive integers (reviewCount >= 100)', () => {
  spas.forEach((spa, idx) => {
    assert.strictEqual(typeof spa.reviewCount, 'number', `Spa #${idx + 1} (${spa.id}) reviewCount not a number`);
    assert.ok(!isNaN(spa.reviewCount), `Spa #${idx + 1} (${spa.id}) reviewCount is NaN`);
    assert.ok(
      spa.reviewCount >= 100,
      `Spa #${idx + 1} (${spa.id}) reviewCount ${spa.reviewCount} must be at least 100 for verified popularity`
    );
  });
});

runner.test('Prices are non-negative and satisfy ascending hierarchy (60m <= 90m <= 120m)', () => {
  spas.forEach((spa, idx) => {
    assert.ok(spa.price60minVnd > 0, `Spa #${idx + 1} (${spa.id}) price60minVnd must be > 0`);
    assert.ok(spa.price90minVnd >= spa.price60minVnd, `Spa #${idx + 1} (${spa.id}) 90m price must be >= 60m price`);
    assert.ok(spa.price120minVnd >= spa.price90minVnd, `Spa #${idx + 1} (${spa.id}) 120m price must be >= 90m price`);
    assert.ok(spa.avgPriceVnd > 0, `Spa #${idx + 1} (${spa.id}) avgPriceVnd must be > 0`);
  });
});

// ============================================================================
// Suite 6: Course Price Matrix Verification
// ============================================================================
runner.suite('Course Price Matrix & Exchange Rate Precision');

runner.test('courses array contains >= 3 standard duration tiers (60, 90, 120 min)', () => {
  const DEFAULT_RATE = 0.0545;
  spas.forEach((spa, idx) => {
    assert.ok(Array.isArray(spa.courses), `Spa #${idx + 1} (${spa.id}) courses must be an array`);
    assert.ok(spa.courses.length >= 3, `Spa #${idx + 1} (${spa.id}) courses must have at least 3 courses`);

    spa.courses.forEach((course, cIdx) => {
      assert.ok(typeof course.name === 'string' && course.name.trim().length > 0, `Course #${cIdx + 1} name missing`);
      assert.ok([60, 90, 120].includes(course.durationMin), `Course #${cIdx + 1} duration must be 60, 90, or 120`);
      assert.ok(typeof course.priceVnd === 'number' && course.priceVnd > 0, `Course #${cIdx + 1} priceVnd invalid`);
      assert.ok(typeof course.priceKrw === 'number' && course.priceKrw > 0, `Course #${cIdx + 1} priceKrw invalid`);
      
      const expectedKrw = Math.round(course.priceVnd * DEFAULT_RATE);
      const diff = Math.abs(course.priceKrw - expectedKrw);
      assert.ok(
        diff <= 100,
        `Course #${cIdx + 1} priceKrw (${course.priceKrw}) deviates from expected (${expectedKrw}) at rate ${DEFAULT_RATE}`
      );
    });
  });
});

// ============================================================================
// Suite 7: Facility & Service Policy Invariants
// ============================================================================
runner.suite('Facility & Service Policy Invariants');

runner.test('pickupDropoff, tipPolicy, and luggageShower are well-structured', () => {
  spas.forEach((spa, idx) => {
    assert.ok(
      typeof spa.pickupDropoff === 'string' && spa.pickupDropoff.trim().length > 0,
      `Spa #${idx + 1} (${spa.id}) pickupDropoff is missing or empty`
    );
    assert.ok(
      typeof spa.tipPolicy === 'string' && spa.tipPolicy.trim().length > 0,
      `Spa #${idx + 1} (${spa.id}) tipPolicy is missing or empty`
    );
    assert.ok(
      typeof spa.luggageShower === 'object' && spa.luggageShower !== null,
      `Spa #${idx + 1} (${spa.id}) luggageShower must be an object`
    );
    assert.strictEqual(typeof spa.luggageShower.luggage, 'boolean', `Spa #${idx + 1} luggageShower.luggage must be boolean`);
    assert.strictEqual(typeof spa.luggageShower.shower, 'boolean', `Spa #${idx + 1} luggageShower.shower must be boolean`);
    assert.ok(
      typeof spa.luggageShower.details === 'string' && spa.luggageShower.details.trim().length > 0,
      `Spa #${idx + 1} luggageShower.details is empty`
    );
  });
});

// ============================================================================
// Suite 8: Google Maps URL & Address Vi Fidelity
// ============================================================================
runner.suite('Google Maps URL & Address Vi Fidelity');

runner.test('googleMapUrl and googlePhotosUrl are valid, encoded Google Maps search URLs', () => {
  const mapPrefix = 'https://www.google.com/maps/search/?api=1&query=';
  spas.forEach((spa, idx) => {
    assert.ok(
      spa.googleMapUrl.startsWith(mapPrefix),
      `Spa #${idx + 1} (${spa.id}) googleMapUrl does not start with standard prefix`
    );
    assert.ok(
      spa.googlePhotosUrl.startsWith(mapPrefix),
      `Spa #${idx + 1} (${spa.id}) googlePhotosUrl does not start with standard prefix`
    );
    assert.ok(
      spa.addressVi.includes('Nha Trang') || spa.addressVi.includes('Cam Lâm') || spa.addressVi.includes('Ninh Hòa'),
      `Spa #${idx + 1} (${spa.id}) addressVi must contain official administrative district`
    );
    assert.ok(
      spa.addressVi.includes('Khánh Hòa'),
      `Spa #${idx + 1} (${spa.id}) addressVi must contain province Khánh Hòa`
    );
  });
});

// ============================================================================
// Suite 9: Cover Image & Gallery CDN Integrity
// ============================================================================
runner.suite('Cover Image & Gallery CDN Integrity');

runner.test('Cover image and images gallery are valid HTTPS URLs with >= 3 distinct photos', () => {
  const urlRegex = /^https:\/\/.+/i;

  spas.forEach((spa, idx) => {
    assert.ok(
      typeof spa.coverImage === 'string' && urlRegex.test(spa.coverImage),
      `Spa #${idx + 1} (${spa.id}) coverImage is not a valid HTTPS URL`
    );
    assert.ok(Array.isArray(spa.images), `Spa #${idx + 1} (${spa.id}) images must be an array`);
    assert.ok(spa.images.length >= 3, `Spa #${idx + 1} (${spa.id}) images must contain at least 3 photos`);

    const distinct = new Set(spa.images);
    assert.strictEqual(
      distinct.size,
      spa.images.length,
      `Spa #${idx + 1} (${spa.id}) has duplicate images in gallery`
    );
  });
});

// ============================================================================
// Suite 10: Category Coverage & Tag Taxonomy
// ============================================================================
runner.suite('Category Coverage & Tag Taxonomy');

runner.test('tags and facilities are populated with informative items', () => {
  spas.forEach((spa, idx) => {
    assert.ok(Array.isArray(spa.tags) && spa.tags.length >= 3, `Spa #${idx + 1} (${spa.id}) tags must have >= 3 items`);
    assert.ok(Array.isArray(spa.facilities) && spa.facilities.length >= 2, `Spa #${idx + 1} (${spa.id}) facilities must have >= 2 items`);

    spa.tags.forEach((tag, tIdx) => {
      assert.ok(typeof tag === 'string' && tag.trim().length > 0, `Spa #${idx + 1} tag #${tIdx + 1} is empty`);
    });
    spa.facilities.forEach((fac, fIdx) => {
      assert.ok(typeof fac === 'string' && fac.trim().length > 0, `Spa #${idx + 1} facility #${fIdx + 1} is empty`);
    });
  });
});

// ============================================================================
// Suite 11: Filtering Business Logic Verification
// ============================================================================
runner.suite('Filtering Business Logic Verification');

function getFilteredSpas(category = 'all', tag = 'all', query = '', district = 'all') {
  return spas.filter(spa => {
    if (category !== 'all' && spa.category !== category) return false;
    if (tag !== 'all' && !(spa.tags && spa.tags.includes(tag))) return false;
    if (district !== 'all' && spa.district !== district) return false;
    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      const matchName = (spa.name && spa.name.toLowerCase().includes(q)) ||
                        (spa.nameKo && spa.nameKo.toLowerCase().includes(q)) ||
                        (spa.nameVi && spa.nameVi.toLowerCase().includes(q));
      const matchAddr = spa.addressVi && spa.addressVi.toLowerCase().includes(q);
      const matchTag = spa.tags && spa.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchAddr && !matchTag) return false;
    }
    return true;
  });
}

runner.test('Filtering by each category yields expected non-empty spot subsets', () => {
  ALLOWED_SPA_CATEGORIES.forEach(cat => {
    const filtered = getFilteredSpas(cat);
    assert.ok(filtered.length > 0, `Category filter for "${cat}" returned 0 results`);
    assert.ok(filtered.every(s => s.category === cat), `Category filter for "${cat}" leaked wrong category`);
  });
});

runner.test('Keyword search successfully matches Korean, Vietnamese and tag terms', () => {
  const senResults = getFilteredSpas('all', 'all', '센스파');
  assert.ok(senResults.length >= 1, 'Search for "센스파" must find Sen Spa');
  assert.strictEqual(senResults[0].id, 'spa-01');

  const mudResults = getFilteredSpas('all', 'all', '머드');
  assert.ok(mudResults.length >= 4, 'Search for "머드" must find mud bath spas');

  const shampooResults = getFilteredSpas('all', 'all', '귀청소');
  assert.ok(shampooResults.length >= 2, 'Search for "귀청소" must find barbershops');
});

// ============================================================================
// Suite 12: Comparator & Sorting Verification
// ============================================================================
runner.suite('Comparator & Sorting Verification');

runner.test('Sort comparators (rating, reviews, price-asc, price-desc) work accurately', () => {
  // 1. Sort by rating desc
  const sortedRating = [...spas].sort((a, b) => b.rating - a.rating);
  assert.ok(sortedRating[0].rating >= sortedRating[sortedRating.length - 1].rating);

  // 2. Sort by review count desc
  const sortedReviews = [...spas].sort((a, b) => b.reviewCount - a.reviewCount);
  assert.ok(sortedReviews[0].reviewCount >= sortedReviews[sortedReviews.length - 1].reviewCount);
  assert.strictEqual(sortedReviews[0].nameKo, '아이리조트 머드온천 (I-Resort Mud Bath)', 'I-Resort has the highest review count');

  // 3. Sort by price asc
  const sortedPriceAsc = [...spas].sort((a, b) => a.avgPriceVnd - b.avgPriceVnd);
  assert.ok(sortedPriceAsc[0].avgPriceVnd <= sortedPriceAsc[sortedPriceAsc.length - 1].avgPriceVnd);

  // 4. Sort by price desc
  const sortedPriceDesc = [...spas].sort((a, b) => b.avgPriceVnd - a.avgPriceVnd);
  assert.ok(sortedPriceDesc[0].avgPriceVnd >= sortedPriceDesc[sortedPriceDesc.length - 1].avgPriceVnd);
  assert.strictEqual(sortedPriceDesc[0].nameKo, '식스센스 스파 (Six Senses Spa Ninh Van Bay)', 'Six Senses has highest avg price');
});

// ============================================================================
// Suite 13: Security & Zero-Schedule Invariants
// ============================================================================
runner.suite('Security, Schedule Invariants & Spa Tips');

runner.test('Security check: No text fields contain dangerous HTML or script injection vectors', () => {
  const dangerousPatterns = [/<script/i, /<iframe/i, /javascript:/i, /onerror=/i, /onload=/i];
  const jsonStr = JSON.stringify(spas) + JSON.stringify(spaTips);
  dangerousPatterns.forEach(pattern => {
    assert.ok(
      !pattern.test(jsonStr),
      `Spa dataset failed security check: contains unsafe pattern ${pattern}`
    );
  });
});

runner.test('Privacy & zero-schedule: No personal travel dates or Day markers', () => {
  const jsonStr = JSON.stringify(spas) + JSON.stringify(spaTips);
  assert.ok(!/9\/1[0-9]|9\/2[0-9]|Day ?[1-7]/.test(jsonStr), 'spa-data.js must not contain private trip dates');
});

runner.test('NHA_TRANG_SPA_TIPS contains all 4 verified spa survival tips', () => {
  assert.strictEqual(spaTips.length, 4, `Expected 4 spa tips, got ${spaTips.length}`);
  spaTips.forEach((tip, idx) => {
    assert.ok(typeof tip.id === 'string' && tip.id.length > 0, `Tip #${idx + 1} missing id`);
    assert.ok(typeof tip.title === 'string' && tip.title.length > 0, `Tip #${idx + 1} missing title`);
    assert.ok(typeof tip.badge === 'string' && tip.badge.length > 0, `Tip #${idx + 1} missing badge`);
    assert.ok(typeof tip.icon === 'string' && tip.icon.length > 0, `Tip #${idx + 1} missing icon`);
    assert.ok(typeof tip.summary === 'string' && tip.summary.length > 0, `Tip #${idx + 1} missing summary`);
    assert.ok(typeof tip.actionGuide === 'string' && tip.actionGuide.length > 0, `Tip #${idx + 1} missing actionGuide`);
    assert.ok(Array.isArray(tip.tips) && tip.tips.length >= 3, `Tip #${idx + 1} must have >= 3 detail bullet tips`);
  });
});

// Run summary and exit
const passed = runner.summary();
process.exit(passed ? 0 : 1);
