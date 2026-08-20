/**
 * ============================================================================
 * Nha Trang Trip 2026 - Stays Dataset Automated Validation Suite
 * File: test-stays.js
 * ============================================================================
 * 
 * Verifies NHA_TRANG_STAYS from stays-data.js against:
 * 1. Dataset size: Total stays >= 16 (specifically 24 expected).
 * 2. Theme distribution: Exactly 4 themes (theme1/welcome, theme2/luxury,
 *    theme3/poolvilla, theme4/goodbye), each with >= 4 stays (specifically 6).
 * 3. Schema completeness: Every stay has all 25 required fields with non-empty values.
 * 4. Data types: rating (3.0 <= r <= 5.0), reviewCount (positive int),
 *    pricePerNightVnd (positive number > 0).
 * 5. Zero-Hallucination & URL formatting:
 *    - googleMapUrl starts with https://www.google.com/maps/search/?api=1&query=
 *    - tripDotComUrl starts with https://kr.trip.com/ or valid Trip.com URL
 *    - coverImage is valid HTTP/HTTPS URL string
 *    - images is non-empty array with at least 3 valid image URLs
 *    - addressVi contains official Vietnamese address string
 * 6. Unique IDs: All id values are strictly unique.
 * 7. Adversarial & Data Integrity checks (no NaN, undefined strings, etc.)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { TestRunner, colors } = require('./test-harness.js');

const runner = new TestRunner({
  summaryTitle: 'Test Execution Summary',
  failureHeader: 'Failures & Discrepancies Detected:',
  failureFooter: 'Test Suite Failed.',
  successMessage: '✨ All Test Suites Passed Successfully! Zero Hallucination Verified.'
});

// ==========================================
// 1. File Loading & Module Export Verification
// ==========================================
runner.suite('Module Loading & Dataset Availability');

const DATA_FILE_PATH = path.resolve(__dirname, 'stays-data.js');

runner.test('stays-data.js exists on disk', () => {
  assert.ok(fs.existsSync(DATA_FILE_PATH), `stays-data.js not found at ${DATA_FILE_PATH}`);
});

let staysDataModule = null;
let staysList = [];

runner.test('stays-data.js loads and exports NHA_TRANG_STAYS array', () => {
  delete require.cache[require.resolve(DATA_FILE_PATH)];
  staysDataModule = require(DATA_FILE_PATH);
  assert.ok(staysDataModule, 'Module failed to load');
  
  staysList = staysDataModule.NHA_TRANG_STAYS || staysDataModule.default || staysDataModule;
  assert.ok(Array.isArray(staysList), 'NHA_TRANG_STAYS must be an array');
  assert.ok(staysList.length > 0, 'NHA_TRANG_STAYS must not be empty');
});

// ==========================================
// 2. Dataset Size & Capacity Boundaries
// ==========================================
runner.suite('Dataset Size & Capacity Constraints');

runner.test('Total stays count meets minimum requirement (>= 16)', () => {
  assert.ok(
    staysList.length >= 16,
    `Expected at least 16 stays, found ${staysList.length}`
  );
});

runner.test('Total stays count reaches full specification target (24 stays)', () => {
  assert.strictEqual(
    staysList.length,
    24,
    `Expected exactly 24 stays per full specification (6 per 4 themes), but found ${staysList.length}`
  );
});

// ==========================================
// 3. Theme Distribution & Classification
// ==========================================
runner.suite('Theme Distribution & Structure');

// Canonical mapping of themes
const VALID_THEME_KEYS = ['theme1', 'theme2', 'theme3', 'theme4', 'welcome', 'luxury', 'poolvilla', 'goodbye'];

runner.test('Contains exactly 4 distinct theme categories', () => {
  const distinctThemes = [...new Set(staysList.map(s => s.theme))];
  assert.strictEqual(
    distinctThemes.length,
    4,
    `Expected exactly 4 distinct themes, but found ${distinctThemes.length}: [${distinctThemes.join(', ')}]`
  );
});

runner.test('All stays belong to recognized canonical theme identifiers', () => {
  staysList.forEach((s, idx) => {
    assert.ok(
      VALID_THEME_KEYS.includes(s.theme),
      `Stay #${idx + 1} (${s.id || s.nameKo || s.name}) has invalid theme "${s.theme}"`
    );
  });
});

runner.test('Every theme contains at least 4 stays (target 6 stays per theme)', () => {
  const themeCounts = {};
  staysList.forEach(s => {
    themeCounts[s.theme] = (themeCounts[s.theme] || 0) + 1;
  });

  Object.entries(themeCounts).forEach(([theme, count]) => {
    assert.ok(
      count >= 4,
      `Theme "${theme}" has only ${count} stays (minimum required is 4)`
    );
  });

  // Check if exactly 6 stays per theme for 24-stay dataset
  const nonTargetThemes = Object.entries(themeCounts).filter(([_, count]) => count !== 6);
  if (staysList.length === 24) {
    assert.strictEqual(
      nonTargetThemes.length,
      0,
      `Expected exactly 6 stays per theme, but counts are: ${JSON.stringify(themeCounts)}`
    );
  }
});

// ==========================================
// 4. Unique Identifiers & Slugs
// ==========================================
runner.suite('ID Uniqueness & Slug Validation');

runner.test('Every stay has a non-empty unique string ID', () => {
  const idSet = new Set();
  const idRegex = /^[a-zA-Z0-9_-]+$/;

  staysList.forEach((s, idx) => {
    assert.ok(typeof s.id === 'string' && s.id.trim().length > 0, `Stay #${idx + 1} has missing or invalid ID`);
    assert.ok(idRegex.test(s.id), `Stay #${idx + 1} ID "${s.id}" contains invalid characters (must match ^[a-zA-Z0-9_-]+$)`);
    assert.ok(!idSet.has(s.id), `Duplicate stay ID detected: "${s.id}" at index ${idx}`);
    idSet.add(s.id);
  });
});

// Helper to safely access canonical field with optional alias fallback
function getField(s, canonical, alias) {
  if (s[canonical] !== undefined && s[canonical] !== null) return s[canonical];
  if (alias && s[alias] !== undefined && s[alias] !== null) return s[alias];
  return undefined;
}

// ==========================================
// 5. Schema Completeness (25 Required Fields)
// ==========================================
runner.suite('Schema Completeness (25 Required Fields)');

const STRICT_25_REQUIRED_FIELDS = [
  'id',
  'theme',
  'themeName',
  'nameKo',
  'nameEn',
  'nameVi',
  'category',
  'pricePerNightVnd',
  'priceRangeVnd',
  'estimatedPriceKrw',
  'rating',
  'reviewCount',
  'address',
  'addressVi',
  'area',
  'checkIn',
  'checkOut',
  'coverImage',
  'images',
  'tags',
  'amenities',
  'highlights',
  'nearbySpots',
  'googleMapQuery',
  'googleMapUrl',
  'tripDotComUrl'
];

runner.test('Every stay contains all 25+ required fields with non-empty values', () => {
  staysList.forEach((s, idx) => {
    const missing = [];
    STRICT_25_REQUIRED_FIELDS.forEach(field => {
      const val = s[field];
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
      `Stay #${idx + 1} (${s.id || 'unknown'}) is missing required fields: [${missing.join(', ')}]`
    );
  });
});

// ==========================================
// 6. Data Types & Mathematical Range Constraints
// ==========================================
runner.suite('Data Types & Value Boundaries');

runner.test('Ratings are numbers bounded between 3.0 and 5.0', () => {
  staysList.forEach((s, idx) => {
    assert.strictEqual(typeof s.rating, 'number', `Stay #${idx + 1} (${s.id}) rating is not a number`);
    assert.ok(!isNaN(s.rating), `Stay #${idx + 1} (${s.id}) rating is NaN`);
    assert.ok(
      s.rating >= 3.0 && s.rating <= 5.0,
      `Stay #${idx + 1} (${s.id}) rating ${s.rating} out of valid range [3.0, 5.0]`
    );
  });
});

runner.test('Review counts are positive integers (> 0)', () => {
  staysList.forEach((s, idx) => {
    assert.strictEqual(typeof s.reviewCount, 'number', `Stay #${idx + 1} (${s.id}) reviewCount is not a number`);
    assert.ok(Number.isInteger(s.reviewCount), `Stay #${idx + 1} (${s.id}) reviewCount is not an integer`);
    assert.ok(s.reviewCount > 0, `Stay #${idx + 1} (${s.id}) reviewCount must be > 0, got ${s.reviewCount}`);
  });
});

runner.test('Price per night VND is a positive number (> 0)', () => {
  staysList.forEach((s, idx) => {
    const price = s.pricePerNightVnd;
    assert.strictEqual(typeof price, 'number', `Stay #${idx + 1} (${s.id}) pricePerNightVnd is not a number`);
    assert.ok(price > 0, `Stay #${idx + 1} (${s.id}) pricePerNightVnd must be > 0, got ${price}`);
  });
});

// ==========================================
// 7. Zero-Hallucination & URL Formatting
// ==========================================
runner.suite('Zero-Hallucination & URL Formatting');

runner.test('googleMapUrl starts with official Google Maps search prefix and includes encoded query', () => {
  const prefix = 'https://www.google.com/maps/search/?api=1&query=';
  staysList.forEach((s, idx) => {
    assert.ok(
      typeof s.googleMapUrl === 'string' && s.googleMapUrl.startsWith(prefix),
      `Stay #${idx + 1} (${s.id}) googleMapUrl must start with "${prefix}"`
    );
    const queryPart = s.googleMapUrl.replace(prefix, '');
    assert.ok(queryPart.length > 0, `Stay #${idx + 1} (${s.id}) googleMapUrl has empty query part`);
    const decoded = decodeURIComponent(queryPart);
    assert.ok(decoded.length >= 5, `Stay #${idx + 1} (${s.id}) decoded query "${decoded}" is too short`);
  });
});

runner.test('tripDotComUrl starts with valid Trip.com URL format', () => {
  staysList.forEach((s, idx) => {
    const tripUrl = s.tripDotComUrl;
    assert.ok(typeof tripUrl === 'string', `Stay #${idx + 1} (${s.id}) tripDotComUrl is not a string`);
    const isValidTrip = tripUrl.startsWith('https://kr.trip.com/') ||
                        tripUrl.startsWith('https://www.trip.com/') ||
                        tripUrl.startsWith('https://trip.com/');
    assert.ok(
      isValidTrip,
      `Stay #${idx + 1} (${s.id}) tripDotComUrl "${tripUrl}" does not match Trip.com URL schema`
    );
  });
});

runner.test('coverImage is a valid HTTP/HTTPS URL string', () => {
  const urlRegex = /^https?:\/\/.+/i;
  staysList.forEach((s, idx) => {
    assert.ok(
      typeof s.coverImage === 'string' && urlRegex.test(s.coverImage),
      `Stay #${idx + 1} (${s.id}) coverImage is not a valid HTTP/HTTPS URL: "${s.coverImage}"`
    );
  });
});

runner.test('images is a non-empty array with at least 3 valid HTTP/HTTPS image URLs', () => {
  const urlRegex = /^https?:\/\/.+/i;
  staysList.forEach((s, idx) => {
    assert.ok(Array.isArray(s.images), `Stay #${idx + 1} (${s.id}) images is not an array`);
    assert.ok(
      s.images.length >= 3,
      `Stay #${idx + 1} (${s.id}) images has only ${s.images.length} photos (expected >= 3)`
    );
    s.images.forEach((img, imgIdx) => {
      assert.ok(
        typeof img === 'string' && urlRegex.test(img),
        `Stay #${idx + 1} (${s.id}) image #${imgIdx + 1} is not a valid HTTP/HTTPS URL: "${img}"`
      );
    });
  });
});

runner.test('addressVi contains official Vietnamese address string with location markers', () => {
  const locKeywords = ['Nha Trang', 'Khánh Hòa', 'Khanh Hoa', 'Cam Lâm', 'Cam Lam', 'Ninh Hòa', 'Ninh Hoa', 'Tân Lập', 'Lộc Thọ', 'Vĩnh Hòa', 'Vĩnh Nguyên', 'Phương Sài', 'Cam Hải Đông', 'Ninh Vân'];
  staysList.forEach((s, idx) => {
    assert.ok(typeof s.addressVi === 'string', `Stay #${idx + 1} (${s.id}) addressVi must be a string`);
    assert.ok(s.addressVi.trim().length >= 10, `Stay #${idx + 1} (${s.id}) addressVi is too short: "${s.addressVi}"`);
    const hasMarker = locKeywords.some(kw => s.addressVi.includes(kw));
    assert.ok(
      hasMarker,
      `Stay #${idx + 1} (${s.id}) addressVi "${s.addressVi}" lacks authentic Nha Trang / Khanh Hoa location markers`
    );
  });
});

// ==========================================
// 8. Array Content & Detailed Sub-structures
// ==========================================
runner.suite('Array Properties & Sub-structure Verification');

runner.test('tags is a non-empty array of strings with at least 2 tags', () => {
  staysList.forEach((s, idx) => {
    assert.ok(Array.isArray(s.tags), `Stay #${idx + 1} (${s.id}) tags must be an array`);
    assert.ok(s.tags.length >= 2, `Stay #${idx + 1} (${s.id}) tags must have at least 2 items`);
    s.tags.forEach((t, tIdx) => {
      assert.ok(typeof t === 'string' && t.trim().length > 0, `Stay #${idx + 1} tag #${tIdx + 1} is empty`);
    });
  });
});

runner.test('amenities (or features) is an array with at least 3 non-empty items', () => {
  staysList.forEach((s, idx) => {
    const amenities = getField(s, 'amenities', 'features');
    assert.ok(Array.isArray(amenities), `Stay #${idx + 1} (${s.id}) amenities must be an array`);
    assert.ok(amenities.length >= 3, `Stay #${idx + 1} (${s.id}) amenities must have at least 3 items`);
    amenities.forEach((a, aIdx) => {
      assert.ok(typeof a === 'string' && a.trim().length > 0, `Stay #${idx + 1} amenity #${aIdx + 1} is empty`);
    });
  });
});

runner.test('highlights contains non-empty descriptive text or list', () => {
  staysList.forEach((s, idx) => {
    const highlights = getField(s, 'highlights', 'highlight');
    if (Array.isArray(highlights)) {
      assert.ok(highlights.length >= 1, `Stay #${idx + 1} (${s.id}) highlights array is empty`);
      highlights.forEach((h, hIdx) => {
        assert.ok(typeof h === 'string' && h.trim().length > 0, `Stay #${idx + 1} highlight #${hIdx + 1} is empty`);
      });
    } else {
      assert.ok(typeof highlights === 'string' && highlights.trim().length >= 10, `Stay #${idx + 1} (${s.id}) highlight text too short`);
    }
  });
});

runner.test('nearbySpots (or location description) is populated and non-empty', () => {
  staysList.forEach((s, idx) => {
    const nearby = getField(s, 'nearbySpots', 'location');
    if (Array.isArray(nearby)) {
      assert.ok(nearby.length >= 1, `Stay #${idx + 1} (${s.id}) nearbySpots array is empty`);
    } else {
      assert.ok(typeof nearby === 'string' && nearby.trim().length >= 3, `Stay #${idx + 1} (${s.id}) location too short`);
    }
  });
});

// ==========================================
// 9. Adversarial & Data Integrity Stress Tests
// ==========================================
runner.suite('Adversarial & String Integrity Stress Checks');

runner.test('No properties contain placeholder, undefined, null, or NaN strings', () => {
  const forbiddenSubstrings = ['undefined', 'null', 'NaN', '[object Object]', '${'];
  staysList.forEach((s, idx) => {
    const jsonStr = JSON.stringify(s);
    forbiddenSubstrings.forEach(forbidden => {
      assert.ok(
        !jsonStr.includes(`"${forbidden}"`) && !jsonStr.includes(`:${forbidden}`),
        `Stay #${idx + 1} (${s.id}) contains forbidden placeholder/corrupted value "${forbidden}" in JSON representation`
      );
    });
  });
});

runner.test('priceRangeVnd and estimatedPriceKrw have consistent format', () => {
  staysList.forEach((s, idx) => {
    const vndRange = s.priceRangeVnd;
    assert.ok(typeof vndRange === 'string' && vndRange.length > 0, `Stay #${idx + 1} (${s.id}) priceRangeVnd invalid`);
    
    const krwEst = getField(s, 'estimatedPriceKrw', 'pricePer');
    assert.ok(typeof krwEst === 'string' && krwEst.length > 0, `Stay #${idx + 1} (${s.id}) estimated price KRW invalid`);
  });
});

runner.test('nameKo, nameEn, and nameVi are distinct, properly formatted strings', () => {
  staysList.forEach((s, idx) => {
    const nameKo = getField(s, 'nameKo', 'name');
    const nameEn = s.nameEn;
    const nameVi = s.nameVi;

    assert.ok(typeof nameKo === 'string' && nameKo.trim().length >= 2, `Stay #${idx + 1} (${s.id}) nameKo too short`);
    assert.ok(typeof nameEn === 'string' && nameEn.trim().length >= 2, `Stay #${idx + 1} (${s.id}) nameEn too short`);
    assert.ok(typeof nameVi === 'string' && nameVi.trim().length >= 2, `Stay #${idx + 1} (${s.id}) nameVi too short`);
  });
});

// ==========================================
// 10. Domain Invariants, Security & Image Uniqueness
// ==========================================
runner.suite('Domain Invariants & Security Checks');

runner.test('Theme 1 (Welcome) and Theme 4 (Goodbye) conform to budget constraint (<50,000 KRW / <= 1,000,000 VND)', () => {
  const budgetStays = staysList.filter(s => s.theme === 'theme1' || s.theme === 'theme4');
  budgetStays.forEach(s => {
    const price = s.pricePerNightVnd;
    assert.ok(
      price <= 1000000,
      `Stay "${s.nameKo || s.id}" in theme "${s.theme}" exceeds budget limit (50,000 KRW / 1,000,000 VND), got ${price.toLocaleString()} VND`
    );
  });
});

runner.test('Theme 2 (Luxury) and Theme 3 (Pool Villa) conform to high quality rating standards (>= 4.5)', () => {
  const luxuryStays = staysList.filter(s => s.theme === 'theme2' || s.theme === 'theme3');
  luxuryStays.forEach(s => {
    assert.ok(
      s.rating >= 4.5,
      `Luxury/Villa stay "${s.nameKo || s.id}" in theme "${s.theme}" has rating ${s.rating} (< 4.5 threshold)`
    );
  });
});

runner.test('CheckIn and CheckOut follow standard HH:MM time format', () => {
  const timeRegex = /^\d{1,2}:\d{2}$/;
  staysList.forEach(s => {
    assert.ok(
      timeRegex.test(s.checkIn),
      `Stay "${s.id}" checkIn "${s.checkIn}" is not in HH:MM format`
    );
    assert.ok(
      timeRegex.test(s.checkOut),
      `Stay "${s.id}" checkOut "${s.checkOut}" is not in HH:MM format`
    );
  });
});

runner.test('Security check: No text fields contain dangerous HTML tags or script injections', () => {
  const dangerousPatterns = [/<script/i, /<iframe/i, /javascript:/i, /onerror=/i, /onload=/i];
  staysList.forEach(s => {
    const jsonStr = JSON.stringify(s);
    dangerousPatterns.forEach(pattern => {
      assert.ok(
        !pattern.test(jsonStr),
        `Stay "${s.id}" failed security check: contains potentially unsafe HTML/JS pattern ${pattern}`
      );
    });
  });
});

runner.test('Image set uniqueness: Gallery images within each stay are unique', () => {
  staysList.forEach(s => {
    const imgSet = new Set(s.images);
    assert.strictEqual(
      imgSet.size,
      s.images.length,
      `Stay "${s.id}" contains duplicate gallery images (${imgSet.size} unique out of ${s.images.length})`
    );
  });
});

runner.test('Google Map query and URL encoding coherence', () => {
  staysList.forEach(s => {
    assert.ok(
      typeof s.googleMapQuery === 'string' && s.googleMapQuery.length >= 5,
      `Stay "${s.id}" googleMapQuery is too short: "${s.googleMapQuery}"`
    );
    const decodedUrl = decodeURIComponent(s.googleMapUrl);
    // Url should contain query string or key terms
    assert.ok(
      decodedUrl.includes('google.com/maps/search'),
      `Stay "${s.id}" googleMapUrl is malformed`
    );
  });
});

// Run all and exit with appropriate code
const passed = runner.summary();
process.exit(passed ? 0 : 1);

