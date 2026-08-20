/**
 * ============================================================================
 * Nha Trang Trip 2026 - Travel Guide Hub & Survival Kit Dataset Test Suite
 * File: test-guide.js
 * ============================================================================
 * 
 * 8 Comprehensive Automated Test Suites:
 * 1. Global structure and sub-module presence
 * 2. Transport & Grab guide schema & matrix sanity
 * 3. Lotte Mart 30 Souvenir Price Matrix (30 items, schema, prices, discounts)
 * 4. Emergency & 24h Pharmacy Guide (10 meds, 2 hospitals, insurance guide)
 * 5. One-touch Flashcards (21 cards across 4 categories, bilingual text)
 * 6. Customs & Quarantine data validity
 * 7. Scam prevention checklist validation
 * 8. CommonJS module.exports & browser window dual-export compatibility
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
      this.errors.push({ suite: this.totalSuites, description, error: err });
      console.log(`  ${colors.red}✖ FAIL:${colors.reset} ${description}`);
      console.log(`    ${colors.yellow}${err.message}${colors.reset}`);
    }
  }

  summary() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(3);
    console.log(`\n${colors.bright}====================================================${colors.reset}`);
    console.log(`${colors.bright}Test Summary: ${this.totalSuites} Suites, ${this.totalTests} Tests${colors.reset}`);
    console.log(`  Passed: ${colors.green}${this.passedTests}${colors.reset}`);
    console.log(`  Failed: ${this.failedTests > 0 ? colors.red : colors.green}${this.failedTests}${colors.reset}`);
    console.log(`  Time:   ${elapsed}s`);
    console.log(`${colors.bright}====================================================${colors.reset}`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}${colors.bright}Failed Test Details:${colors.reset}`);
      this.errors.forEach(({ suite, description, error }, idx) => {
        console.log(`\n${idx + 1}. [Suite ${suite}] ${description}`);
        console.log(`   ${colors.red}${error.stack || error.message}${colors.reset}`);
      });
      process.exit(1);
    } else {
      console.log(`\n${colors.green}${colors.bright}✨ All Guide Hub Test Suites Passed Perfectly! ✨${colors.reset}\n`);
      process.exit(0);
    }
  }
}

const runner = new TestRunner();

// Load dataset
const guideDataPath = path.resolve(__dirname, 'guide-data.js');
assert.ok(fs.existsSync(guideDataPath), 'guide-data.js must exist on disk');

const { NHA_TRANG_GUIDE_HUB } = require('./guide-data.js');

// ----------------------------------------------------------------------------
// Suite 1: Global Structure and Sub-module Presence
// ----------------------------------------------------------------------------
runner.suite('Global Structure and Sub-module Presence');

runner.test('NHA_TRANG_GUIDE_HUB root object is non-null and defined', () => {
  assert.ok(NHA_TRANG_GUIDE_HUB && typeof NHA_TRANG_GUIDE_HUB === 'object', 'Root object must exist');
});

runner.test('Contains all 4 required sub-modules with correct property keys', () => {
  const expectedKeys = ['transport', 'shoppingPriceMatrix', 'emergencyPharmacy', 'flashcards'];
  expectedKeys.forEach(k => {
    assert.ok(k in NHA_TRANG_GUIDE_HUB, `Missing required sub-module key: ${k}`);
    assert.ok(NHA_TRANG_GUIDE_HUB[k] !== undefined && NHA_TRANG_GUIDE_HUB[k] !== null, `${k} must not be null/undefined`);
  });
});

runner.test('Dual export shim pattern exists in guide-data.js source', () => {
  const src = fs.readFileSync(guideDataPath, 'utf8');
  assert.ok(src.includes('window.NHA_TRANG_GUIDE_HUB = NHA_TRANG_GUIDE_HUB'), 'Must set window.NHA_TRANG_GUIDE_HUB');
  assert.ok(src.includes('module.exports = { NHA_TRANG_GUIDE_HUB }') || src.includes('module.exports ='), 'Must export for CommonJS');
});

// ----------------------------------------------------------------------------
// Suite 2: Transport & Grab Guide Schema & Matrix Sanity
// ----------------------------------------------------------------------------
runner.suite('Transport & Grab Guide Schema & Matrix Sanity');

runner.test('Airport matrix contains >= 4 major routes with valid pricing & distance', () => {
  const { airportMatrix } = NHA_TRANG_GUIDE_HUB.transport;
  assert.ok(Array.isArray(airportMatrix), 'airportMatrix must be an array');
  assert.ok(airportMatrix.length >= 4, `airportMatrix must have >= 4 routes (found: ${airportMatrix.length})`);

  airportMatrix.forEach((r, idx) => {
    assert.ok(r.id && typeof r.id === 'string', `Route [${idx}] missing id`);
    assert.ok(r.routeKo && typeof r.routeKo === 'string', `Route [${idx}] missing routeKo`);
    assert.ok(r.routeVi && typeof r.routeVi === 'string', `Route [${idx}] missing routeVi`);
    assert.ok(typeof r.distanceKm === 'number' && r.distanceKm > 0, `Route [${idx}] distanceKm must be positive number`);
    assert.ok(typeof r.sedan4SeatVnd === 'number' && r.sedan4SeatVnd >= 50000, `Route [${idx}] sedan4SeatVnd must be valid number`);
    assert.ok(typeof r.suv7SeatVnd === 'number' && r.suv7SeatVnd >= r.sedan4SeatVnd, `Route [${idx}] suv7SeatVnd must be >= sedan4SeatVnd`);
    assert.ok(typeof r.van16SeatVnd === 'number' && r.van16SeatVnd >= r.suv7SeatVnd, `Route [${idx}] van16SeatVnd must be >= suv7SeatVnd`);
    assert.ok(r.durationMins && typeof r.durationMins === 'string', `Route [${idx}] missing durationMins`);
    assert.ok(r.tip && typeof r.tip === 'string', `Route [${idx}] missing tip`);
  });
});

runner.test('Taxi comparison covers Xanh SM EV, Grab, and Traditional taxis', () => {
  const { taxiComparison } = NHA_TRANG_GUIDE_HUB.transport;
  assert.ok(taxiComparison && typeof taxiComparison === 'object', 'taxiComparison must be an object');
  assert.ok(taxiComparison.xanhSM, 'Must include xanhSM');
  assert.ok(taxiComparison.grab, 'Must include grab');
  assert.ok(taxiComparison.traditionalTaxis, 'Must include traditionalTaxis');

  ['xanhSM', 'grab', 'traditionalTaxis'].forEach(k => {
    const t = taxiComparison[k];
    assert.ok(t.nameKo, `${k} missing nameKo`);
    assert.ok(t.nameVi, `${k} missing nameVi`);
    assert.ok(t.pros, `${k} missing pros`);
    assert.ok(t.cons, `${k} missing cons`);
    assert.ok(t.hotline, `${k} missing hotline`);
    assert.ok(t.bookingMethod, `${k} missing bookingMethod`);
  });
});

runner.test('Intercity buses guide covers Dalat and Mui Ne routes', () => {
  const { intercityBuses } = NHA_TRANG_GUIDE_HUB.transport;
  assert.ok(Array.isArray(intercityBuses), 'intercityBuses must be an array');
  assert.ok(intercityBuses.length >= 2, 'intercityBuses must have >= 2 routes');

  const destinations = intercityBuses.map(b => b.destination);
  assert.ok(destinations.some(d => d.includes('달랏') || d.includes('Đà Lạt')), 'Must cover Dalat');
  assert.ok(destinations.some(d => d.includes('무이네') || d.includes('Mũi Né')), 'Must cover Mui Ne');

  intercityBuses.forEach(b => {
    assert.ok(b.distanceKm > 0, 'distanceKm must be positive');
    assert.ok(Array.isArray(b.majorOperators) && b.majorOperators.length >= 2, 'majorOperators must have >= 2 entries');
    b.majorOperators.forEach(op => {
      assert.ok(op.name, 'Operator missing name');
      assert.ok(typeof op.fareVnd === 'number' && op.fareVnd > 50000, 'fareVnd must be valid number');
    });
  });
});

runner.test('Motorbike rental guide specifies pricing, models, deposit and helmet laws', () => {
  const { motorbikeRental } = NHA_TRANG_GUIDE_HUB.transport;
  assert.ok(motorbikeRental && typeof motorbikeRental === 'object', 'motorbikeRental must be an object');
  assert.ok(motorbikeRental.pricePerDayVnd, 'Missing pricePerDayVnd');
  assert.ok(motorbikeRental.depositRules, 'Missing depositRules');
  assert.ok(motorbikeRental.legalRequirements.includes('헬멧') || motorbikeRental.legalRequirements.includes('helmet'), 'Must mention helmet law');
  assert.ok(motorbikeRental.safetyTip, 'Missing safetyTip');
});

// ----------------------------------------------------------------------------
// Suite 3: Lotte Mart 30 Souvenir Price Matrix
// ----------------------------------------------------------------------------
runner.suite('Lotte Mart 30 Souvenir Price Matrix');

runner.test('Contains exactly 30 curated souvenir items', () => {
  const { items } = NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix;
  assert.ok(Array.isArray(items), 'shoppingPriceMatrix.items must be an array');
  assert.strictEqual(items.length, 30, `Expected exactly 30 items, got ${items.length}`);
});

runner.test('All 30 items contain uniform required schema fields', () => {
  const { items } = NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix;
  const requiredFields = [
    'id', 'nameKo', 'nameVi', 'category', 'unit',
    'officialPriceVnd', 'marketBargainPriceVnd',
    'targetDiscountPercent', 'originalVsFakeTip',
    'customsAllowed', 'description'
  ];

  items.forEach((item, idx) => {
    requiredFields.forEach(f => {
      assert.ok(f in item, `Item [${idx} - ${item.nameKo || item.id}] missing required field: ${f}`);
      assert.notStrictEqual(item[f], undefined, `Item [${idx}] field ${f} is undefined`);
      assert.notStrictEqual(item[f], null, `Item [${idx}] field ${f} is null`);
    });
    assert.ok(typeof item.customsAllowed === 'boolean', `Item [${idx}] customsAllowed must be boolean`);
  });
});

runner.test('Numeric pricing and discount bounds are mathematically sound', () => {
  const { items } = NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix;
  items.forEach(item => {
    assert.ok(typeof item.officialPriceVnd === 'number' && item.officialPriceVnd > 0, `${item.id} officialPriceVnd must be > 0`);
    assert.ok(typeof item.marketBargainPriceVnd === 'number' && item.marketBargainPriceVnd > 0, `${item.id} marketBargainPriceVnd must be > 0`);
    assert.ok(typeof item.targetDiscountPercent === 'number' && item.targetDiscountPercent >= 0 && item.targetDiscountPercent <= 90,
      `${item.id} targetDiscountPercent must be between 0 and 90`);
  });
});

runner.test('Item IDs are unique and sequentially formatted', () => {
  const { items } = NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix;
  const ids = new Set();
  items.forEach(item => {
    assert.ok(!ids.has(item.id), `Duplicate souvenir ID found: ${item.id}`);
    ids.add(item.id);
    assert.match(item.id, /^souv-\d{2}$/, `ID format must be souv-XX, got: ${item.id}`);
  });
});

// ----------------------------------------------------------------------------
// Suite 4: Emergency & 24h Pharmacy Guide
// ----------------------------------------------------------------------------
runner.suite('Emergency & 24h Pharmacy Guide');

runner.test('Contains exactly 10 OTC symptom-medication remedies', () => {
  const { pharmacyMeds } = NHA_TRANG_GUIDE_HUB.emergencyPharmacy;
  assert.ok(Array.isArray(pharmacyMeds), 'pharmacyMeds must be an array');
  assert.strictEqual(pharmacyMeds.length, 10, `Expected 10 pharmacyMeds, got ${pharmacyMeds.length}`);

  const requiredMedFields = ['id', 'brandName', 'activeIngredient', 'category', 'symptom', 'dosageKo', 'boxPhotoTip', 'urgency'];
  pharmacyMeds.forEach((m, idx) => {
    requiredMedFields.forEach(f => {
      assert.ok(m[f], `Med [${idx}] missing field: ${f}`);
    });
  });
});

runner.test('Key travel remedies are covered: Smecta, Berberin, Panadol, Nautamine, Phosphalugel, etc.', () => {
  const { pharmacyMeds } = NHA_TRANG_GUIDE_HUB.emergencyPharmacy;
  const brands = pharmacyMeds.map(m => m.brandName.toLowerCase());
  assert.ok(brands.some(b => b.includes('smecta')), 'Must include Smecta');
  assert.ok(brands.some(b => b.includes('berberin')), 'Must include Berberin');
  assert.ok(brands.some(b => b.includes('panadol')), 'Must include Panadol');
  assert.ok(brands.some(b => b.includes('nautamine')), 'Must include Nautamine');
  assert.ok(brands.some(b => b.includes('phosphalugel')), 'Must include Phosphalugel');
  assert.ok(brands.some(b => b.includes('telfast')), 'Must include Telfast');
  assert.ok(brands.some(b => b.includes('strepsils') || b.includes('eugica')), 'Must include Strepsils/Eugica');
  assert.ok(brands.some(b => b.includes('remos') || b.includes('tiger')), 'Must include Remos/Tiger Balm');
  assert.ok(brands.some(b => b.includes('biafine')), 'Must include Biafine');
  assert.ok(brands.some(b => b.includes('betadine') || b.includes('urgo')), 'Must include Betadine/Urgo');
});

runner.test('International hospitals coverage with verified hotlines and addresses', () => {
  const { hospitals } = NHA_TRANG_GUIDE_HUB.emergencyPharmacy;
  assert.ok(Array.isArray(hospitals), 'hospitals must be an array');
  assert.strictEqual(hospitals.length, 2, 'Must cover 2 major international hospitals');

  const vinmec = hospitals.find(h => h.id === 'hosp-vinmec');
  const vk = hospitals.find(h => h.id === 'hosp-vk');

  assert.ok(vinmec, 'Must contain Vinmec Hospital');
  assert.ok(vinmec.hotline.includes('+84 258 3900 168') || vinmec.hotline.includes('3900 168'), 'Vinmec hotline must match +84 258 3900 168');
  assert.ok(vinmec.addressVi.includes('Trần Phú'), 'Vinmec address must include Trần Phú');

  assert.ok(vk, 'Must contain VK Hospital');
  assert.ok(vk.hotline.includes('+84 258 352 8866') || vk.hotline.includes('352 8866'), 'VK hotline must match +84 258 352 8866');
  assert.ok(vk.addressVi.includes('Nguyễn Thiện Thuật'), 'VK address must include Nguyễn Thiện Thuật');
});

runner.test('Insurance claim documentation guide specifies 5 essential steps', () => {
  const { insuranceGuide } = NHA_TRANG_GUIDE_HUB.emergencyPharmacy;
  assert.ok(insuranceGuide && typeof insuranceGuide === 'object', 'insuranceGuide must exist');
  assert.ok(Array.isArray(insuranceGuide.steps), 'insuranceGuide.steps must be an array');
  assert.strictEqual(insuranceGuide.steps.length, 5, 'Must have exactly 5 claim steps');

  insuranceGuide.steps.forEach(s => {
    assert.ok(s.stepNo > 0, 'stepNo must be positive');
    assert.ok(s.nameKo && s.nameKo.length > 0, 'nameKo must not be empty');
    assert.ok(s.desc && s.desc.length > 0, 'desc must not be empty');
  });
});

// ----------------------------------------------------------------------------
// Suite 5: One-touch Flashcards
// ----------------------------------------------------------------------------
runner.suite('One-touch Flashcards');

runner.test('Contains exactly 21 communicative flashcards', () => {
  const { flashcards } = NHA_TRANG_GUIDE_HUB;
  assert.ok(Array.isArray(flashcards), 'flashcards must be an array');
  assert.strictEqual(flashcards.length, 21, `Expected exactly 21 flashcards, got ${flashcards.length}`);
});

runner.test('Category distribution matches: dining (7), transport (5), shopping (4), emergency (5)', () => {
  const { flashcards } = NHA_TRANG_GUIDE_HUB;
  const categoryCounts = { dining: 0, transport: 0, shopping: 0, emergency: 0 };

  flashcards.forEach(fc => {
    assert.ok(fc.category in categoryCounts, `Unknown flashcard category: ${fc.category}`);
    categoryCounts[fc.category]++;
  });

  assert.strictEqual(categoryCounts.dining, 7, `Expected 7 dining cards, got ${categoryCounts.dining}`);
  assert.strictEqual(categoryCounts.transport, 5, `Expected 5 transport cards, got ${categoryCounts.transport}`);
  assert.strictEqual(categoryCounts.shopping, 4, `Expected 4 shopping cards, got ${categoryCounts.shopping}`);
  assert.strictEqual(categoryCounts.emergency, 5, `Expected 5 emergency cards, got ${categoryCounts.emergency}`);
});

runner.test('All flashcards have complete bilingual fields, pronunciation, purpose, and icon', () => {
  const { flashcards } = NHA_TRANG_GUIDE_HUB;
  const requiredFields = ['id', 'category', 'categoryLabel', 'icon', 'ko', 'vi', 'pronunciation', 'purpose', 'fullscreenText'];

  flashcards.forEach((fc, idx) => {
    requiredFields.forEach(f => {
      assert.ok(fc[f] && typeof fc[f] === 'string', `Flashcard [${idx} - ${fc.id}] missing non-empty field: ${f}`);
    });
    assert.match(fc.id, /^fc-\d{2}$/, `ID format must be fc-XX, got: ${fc.id}`);
  });
});

// ----------------------------------------------------------------------------
// Suite 6: Customs & Quarantine Data Validity
// ----------------------------------------------------------------------------
runner.suite('Customs & Quarantine Data Validity');

runner.test('Customs and quarantine rules define duty free bounds and prohibited goods', () => {
  const { customsQuarantine } = NHA_TRANG_GUIDE_HUB.shoppingPriceMatrix;
  assert.ok(customsQuarantine && typeof customsQuarantine === 'object', 'customsQuarantine must exist');
  assert.strictEqual(customsQuarantine.dutyFreeAllowance.basicAllowanceUsd, 800, 'Basic duty free allowance must be $800');
  assert.ok(Array.isArray(customsQuarantine.prohibitedItems) && customsQuarantine.prohibitedItems.length >= 3,
    'prohibitedItems must have >= 3 entries');
  assert.ok(Array.isArray(customsQuarantine.permittedItems) && customsQuarantine.permittedItems.length >= 3,
    'permittedItems must have >= 3 entries');
});

// ----------------------------------------------------------------------------
// Suite 7: Scam Prevention Checklist Validation
// ----------------------------------------------------------------------------
runner.suite('Scam Prevention Checklist Validation');

runner.test('Scam prevention checklist contains >= 4 actionable prevention scenarios', () => {
  const { scamPrevention } = NHA_TRANG_GUIDE_HUB.transport;
  assert.ok(Array.isArray(scamPrevention), 'scamPrevention must be an array');
  assert.ok(scamPrevention.length >= 4, `Expected >= 4 scam prevention items, got ${scamPrevention.length}`);

  scamPrevention.forEach((item, idx) => {
    assert.ok(item.id, `Scam item [${idx}] missing id`);
    assert.ok(item.titleKo, `Scam item [${idx}] missing titleKo`);
    assert.ok(item.warningText, `Scam item [${idx}] missing warningText`);
    assert.ok(item.actionRule, `Scam item [${idx}] missing actionRule`);
  });
});

// ----------------------------------------------------------------------------
// Suite 8: CommonJS module.exports Compatibility
// ----------------------------------------------------------------------------
runner.suite('CommonJS module.exports Compatibility');

runner.test('Node require returns object with NHA_TRANG_GUIDE_HUB export', () => {
  const imported = require('./guide-data.js');
  assert.ok(imported.NHA_TRANG_GUIDE_HUB, 'require("./guide-data.js") must export NHA_TRANG_GUIDE_HUB');
  assert.strictEqual(typeof imported.NHA_TRANG_GUIDE_HUB, 'object', 'NHA_TRANG_GUIDE_HUB must be an object');
});

runner.summary();
