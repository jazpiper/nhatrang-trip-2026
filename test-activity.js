/**
 * ============================================================================
 * Nha Trang Trip 2026 - Activities Dataset Automated Validation Suite
 * File: test-activity.js
 * ============================================================================
 * 
 * Verifies NHA_TRANG_ACTIVITIES from data.js against:
 * 1. Dataset size: Total activities >= 40 (specifically 43).
 * 2. Unique IDs: Strictly unique alphanumeric identifiers (act-01 to act-43).
 * 3. Schema completeness: All 23 schema fields present and non-empty.
 * 4. Data types & bounds: rating (1.0 <= r <= 5.0), reviewCount (> 0 integer), priceVnd (>= 0).
 * 5. Category taxonomy: Exactly matches the 10 allowed categories.
 * 6. Image URLs: Non-empty array with >= 3 valid HTTP/HTTPS URLs per entry.
 * 7. Google Map queries & Booking URLs: Non-empty query strings and valid URLs.
 * 8. Sub-array fields: tags, included, notIncluded, whatToBring are populated arrays.
 * 9. Text integrity & Security: No corrupted placeholders, no XSS vectors.
 * 10. Schedule integrity: Referenced activity IDs in NHA_TRANG_SCHEDULE exist in activities dataset.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Terminal ANSI styling
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
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
    console.log(`${colors.bright}Activity Test Execution Summary (${duration}s)${colors.reset}`);
    console.log(`====================================================`);
    console.log(`Suites Run:    ${this.totalSuites}`);
    console.log(`Total Tests:   ${this.totalTests}`);
    console.log(`Passed Tests:  ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`Failed Tests:  ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}${colors.bright}Failures Detected:${colors.reset}`);
      this.errors.forEach((err, idx) => {
        console.log(`\n  ${idx + 1}) ${colors.red}${err.description}${colors.reset}`);
        console.log(`     ${err.message}`);
      });
      console.log(`\n${colors.red}❌ Activity Test Suite Failed.${colors.reset}\n`);
      return false;
    } else {
      console.log(`\n${colors.green}${colors.bright}✨ All Activity Test Suites Passed Successfully! 100% Schema & Data Integrity Verified.${colors.reset}\n`);
      return true;
    }
  }
}

const runner = new TestRunner();

// ==========================================
// 1. Module Loading & Dataset Availability
// ==========================================
runner.suite('Module Loading & Dataset Availability');

const DATA_FILE_PATH = path.resolve(__dirname, 'data.js');

runner.test('data.js exists on disk', () => {
  assert.ok(fs.existsSync(DATA_FILE_PATH), `data.js not found at ${DATA_FILE_PATH}`);
});

let activities = [];
let schedule = [];

runner.test('data.js loads and exports NHA_TRANG_ACTIVITIES and NHA_TRANG_SCHEDULE', () => {
  const dataCode = fs.readFileSync(DATA_FILE_PATH, 'utf8').replace(/const /g, 'global.');
  eval(dataCode);
  
  activities = global.NHA_TRANG_ACTIVITIES;
  schedule = global.NHA_TRANG_SCHEDULE;

  assert.ok(Array.isArray(activities), 'NHA_TRANG_ACTIVITIES must be an array');
  assert.ok(activities.length > 0, 'NHA_TRANG_ACTIVITIES must not be empty');
  assert.ok(Array.isArray(schedule), 'NHA_TRANG_SCHEDULE must be an array');
});

// ==========================================
// 2. Dataset Size & Capacity Boundaries
// ==========================================
runner.suite('Dataset Size & Capacity Constraints');

runner.test('Total activities count meets minimum requirement (>= 40)', () => {
  assert.ok(
    activities.length >= 40,
    `Expected at least 40 activities, but found ${activities.length}`
  );
});

runner.test('Total activities count reaches target specification (43 activities)', () => {
  assert.strictEqual(
    activities.length,
    43,
    `Expected exactly 43 activities, but found ${activities.length}`
  );
});

// ==========================================
// 3. Unique Identifiers Validation
// ==========================================
runner.suite('ID Uniqueness & Identifier Format');

runner.test('Every activity has a unique, well-formatted string ID (e.g., act-01..act-43)', () => {
  const idSet = new Set();
  const idRegex = /^act-\d{2,}$/;

  activities.forEach((act, idx) => {
    assert.ok(typeof act.id === 'string' && act.id.trim().length > 0, `Activity #${idx + 1} has missing or empty ID`);
    assert.ok(idRegex.test(act.id), `Activity #${idx + 1} ID "${act.id}" must match format /^act-\\d{2,}$/`);
    assert.ok(!idSet.has(act.id), `Duplicate activity ID detected: "${act.id}" at index ${idx}`);
    idSet.add(act.id);
  });
});

// ==========================================
// 4. Schema Completeness (23 Required Fields)
// ==========================================
runner.suite('Schema Completeness (All 23 Required Fields)');

const ALL_23_SCHEMA_FIELDS = [
  'id',
  'title',
  'titleEn',
  'category',
  'categoryLabel',
  'badge',
  'rating',
  'reviewCount',
  'duration',
  'bestTime',
  'location',
  'googleMapQuery',
  'priceVnd',
  'pricePer',
  'tags',
  'images',
  'highlight',
  'included',
  'notIncluded',
  'whatToBring',
  'coupleTip',
  'suggestedDay',
  'bookingUrl'
];

runner.test('Every activity contains all 23 schema fields with non-empty values', () => {
  activities.forEach((act, idx) => {
    const missing = [];
    ALL_23_SCHEMA_FIELDS.forEach(field => {
      const val = act[field];
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
      `Activity #${idx + 1} (${act.id || 'unknown'}) is missing required fields: [${missing.join(', ')}]`
    );
  });
});

// ==========================================
// 5. Data Types & Mathematical Range Constraints
// ==========================================
runner.suite('Data Types & Value Boundaries');

runner.test('Ratings are numbers bounded between 1.0 and 5.0', () => {
  activities.forEach((act, idx) => {
    assert.strictEqual(typeof act.rating, 'number', `Activity #${idx + 1} (${act.id}) rating is not a number`);
    assert.ok(!isNaN(act.rating), `Activity #${idx + 1} (${act.id}) rating is NaN`);
    assert.ok(
      act.rating >= 1.0 && act.rating <= 5.0,
      `Activity #${idx + 1} (${act.id}) rating ${act.rating} out of valid range [1.0, 5.0]`
    );
  });
});

runner.test('Review counts are positive numbers (> 0)', () => {
  activities.forEach((act, idx) => {
    assert.strictEqual(typeof act.reviewCount, 'number', `Activity #${idx + 1} (${act.id}) reviewCount is not a number`);
    assert.ok(!isNaN(act.reviewCount), `Activity #${idx + 1} (${act.id}) reviewCount is NaN`);
    assert.ok(act.reviewCount > 0, `Activity #${idx + 1} (${act.id}) reviewCount must be > 0, got ${act.reviewCount}`);
  });
});

runner.test('Price in VND is a non-negative number (>= 0)', () => {
  activities.forEach((act, idx) => {
    assert.strictEqual(typeof act.priceVnd, 'number', `Activity #${idx + 1} (${act.id}) priceVnd is not a number`);
    assert.ok(!isNaN(act.priceVnd), `Activity #${idx + 1} (${act.id}) priceVnd is NaN`);
    assert.ok(act.priceVnd >= 0, `Activity #${idx + 1} (${act.id}) priceVnd must be >= 0, got ${act.priceVnd}`);
  });
});

// ==========================================
// 6. Category Taxonomy & Labels
// ==========================================
runner.suite('Category Taxonomy & Classification');

const ALLOWED_CATEGORIES = [
  'hopping',
  'mudbath',
  'vinwonders',
  'spa',
  'cruise',
  'culture',
  'nightlife',
  'shopping',
  'cafe',
  'cooking'
];

runner.test('All activities belong to the 10 allowed categories', () => {
  activities.forEach((act, idx) => {
    assert.ok(
      ALLOWED_CATEGORIES.includes(act.category),
      `Activity #${idx + 1} (${act.id}) has invalid category: "${act.category}". Allowed: [${ALLOWED_CATEGORIES.join(', ')}]`
    );
  });
});

runner.test('Category labels are descriptive non-empty strings', () => {
  activities.forEach((act, idx) => {
    assert.ok(
      typeof act.categoryLabel === 'string' && act.categoryLabel.trim().length > 0,
      `Activity #${idx + 1} (${act.id}) categoryLabel is empty`
    );
  });
});

// ==========================================
// 7. Image Gallery Validation
// ==========================================
runner.suite('Image Gallery Validation');

runner.test('Every activity has at least 3 valid HTTP/HTTPS image URLs', () => {
  const urlRegex = /^https?:\/\/.+/i;

  activities.forEach((act, idx) => {
    assert.ok(Array.isArray(act.images), `Activity #${idx + 1} (${act.id}) images is not an array`);
    assert.ok(
      act.images.length >= 3,
      `Activity #${idx + 1} (${act.id}) has only ${act.images.length} images (minimum 3 required)`
    );

    act.images.forEach((img, imgIdx) => {
      assert.ok(
        typeof img === 'string' && urlRegex.test(img),
        `Activity #${idx + 1} (${act.id}) image #${imgIdx + 1} is not a valid HTTP/HTTPS URL: "${img}"`
      );
    });
  });
});

runner.test('Gallery images within each activity are distinct', () => {
  activities.forEach((act, idx) => {
    const imgSet = new Set(act.images);
    assert.strictEqual(
      imgSet.size,
      act.images.length,
      `Activity #${idx + 1} (${act.id}) contains duplicate gallery images`
    );
  });
});

// ==========================================
// 8. Google Maps Query & Booking URLs
// ==========================================
runner.suite('Google Maps & Booking URLs');

runner.test('googleMapQuery is a non-empty string with location terms', () => {
  activities.forEach((act, idx) => {
    assert.ok(
      typeof act.googleMapQuery === 'string' && act.googleMapQuery.trim().length >= 5,
      `Activity #${idx + 1} (${act.id}) googleMapQuery is too short: "${act.googleMapQuery}"`
    );
  });
});

runner.test('bookingUrl is a valid HTTP/HTTPS URL', () => {
  const urlRegex = /^https?:\/\/.+/i;
  activities.forEach((act, idx) => {
    assert.ok(
      typeof act.bookingUrl === 'string' && urlRegex.test(act.bookingUrl),
      `Activity #${idx + 1} (${act.id}) bookingUrl is not a valid URL: "${act.bookingUrl}"`
    );
  });
});

// ==========================================
// 9. Array Content & Sub-structure Verification
// ==========================================
runner.suite('Array Properties & Sub-structures');

runner.test('tags is an array with at least 2 non-empty strings', () => {
  activities.forEach((act, idx) => {
    assert.ok(Array.isArray(act.tags), `Activity #${idx + 1} (${act.id}) tags must be an array`);
    assert.ok(act.tags.length >= 2, `Activity #${idx + 1} (${act.id}) tags must have at least 2 items`);
    act.tags.forEach((tag, tIdx) => {
      assert.ok(typeof tag === 'string' && tag.trim().length > 0, `Activity #${idx + 1} tag #${tIdx + 1} is empty`);
    });
  });
});

runner.test('included, notIncluded, and whatToBring are arrays of strings', () => {
  ['included', 'notIncluded', 'whatToBring'].forEach(field => {
    activities.forEach((act, idx) => {
      assert.ok(Array.isArray(act[field]), `Activity #${idx + 1} (${act.id}) ${field} must be an array`);
      assert.ok(act[field].length >= 1, `Activity #${idx + 1} (${act.id}) ${field} must have at least 1 item`);
      act[field].forEach((item, iIdx) => {
        assert.ok(typeof item === 'string' && item.trim().length > 0, `Activity #${idx + 1} ${field} item #${iIdx + 1} is empty`);
      });
    });
  });
});

// ==========================================
// 10. String Integrity, Security & Schedule Invariants
// ==========================================
runner.suite('String Integrity, Security & Schedule Invariants');

runner.test('No properties contain placeholder, undefined, null, or NaN strings', () => {
  const forbiddenSubstrings = ['undefined', 'null', 'NaN', '[object Object]', '${'];
  activities.forEach((act, idx) => {
    const jsonStr = JSON.stringify(act);
    forbiddenSubstrings.forEach(forbidden => {
      assert.ok(
        !jsonStr.includes(`"${forbidden}"`) && !jsonStr.includes(`:${forbidden}`),
        `Activity #${idx + 1} (${act.id}) contains forbidden placeholder/corrupted value "${forbidden}"`
      );
    });
  });
});

runner.test('Security check: No text fields contain dangerous HTML or script injection vectors', () => {
  const dangerousPatterns = [/<script/i, /<iframe/i, /javascript:/i, /onerror=/i, /onload=/i];
  activities.forEach((act, idx) => {
    const jsonStr = JSON.stringify(act);
    dangerousPatterns.forEach(pattern => {
      assert.ok(
        !pattern.test(jsonStr),
        `Activity #${idx + 1} (${act.id}) failed security check: contains unsafe pattern ${pattern}`
      );
    });
  });
});

runner.test('Schedule integrity: All activity IDs in NHA_TRANG_SCHEDULE exist in activities dataset', () => {
  const activityIdSet = new Set(activities.map(a => a.id));
  schedule.forEach((day, dIdx) => {
    const actIds = day.activities || day.activityIds || [];
    assert.ok(Array.isArray(actIds), `Schedule Day ${dIdx + 1} activities must be an array`);
    actIds.forEach(id => {
      assert.ok(
        activityIdSet.has(id),
        `Schedule Day ${dIdx + 1} references non-existent activity ID "${id}"`
      );
    });
  });
});

runner.test('test-frontend.js exists and is available', () => {
  assert.ok(fs.existsSync(path.resolve(__dirname, 'test-frontend.js')), 'test-frontend.js must exist');
});

// Run all and exit with appropriate code
const passed = runner.summary();
process.exit(passed ? 0 : 1);
