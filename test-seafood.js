/**
 * ============================================================================
 * Nha Trang Trip 2026 - Seafood & Local Clams Domain Verification Test Suite
 * File: test-seafood.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { NHA_TRANG_GOURMETS } = require('./gourmet-data.js');

console.log('\n🦞 Running Nha Trang Seafood Domain Test Suite...');

// 1. Total count check
const seafoods = NHA_TRANG_GOURMETS.filter(g => g.category === 'seafood');
console.log(`\n1. Checking Seafood & BBQ count: ${seafoods.length} spots found`);
assert.strictEqual(seafoods.length, 17, `Expected exactly 17 seafood/BBQ entries, got ${seafoods.length}`);
console.log('  ✔ PASS: Exactly 17 seafood places present');

// 2. 26 fields completeness for all 17 places
console.log('\n2. Verifying 26-field completeness for all 17 seafood entries');
const REQUIRED_26_FIELDS = [
  'id', 'name', 'nameVi', 'category', 'categoryLabel', 'badge', 'iconEmoji',
  'rating', 'reviewCount', 'openHours', 'location', 'addressVi', 'phone',
  'googleMapQuery', 'officialUrl', 'priceRangeVnd', 'avgPriceVnd', 'pricePer',
  'signatureMenu', 'tags', 'highlight', 'description', 'localTip',
  'suggestedMeal', 'googleMapUrl', 'googlePhotosUrl'
];

seafoods.forEach((place, idx) => {
  REQUIRED_26_FIELDS.forEach(f => {
    assert.ok(f in place && place[f] !== undefined, `${place.id} missing field '${f}'`);
  });
  assert.ok(place.rating >= 3.5 && place.rating <= 5.0, `${place.id} rating ${place.rating} out of bounds`);
  assert.ok(place.reviewCount >= 100, `${place.id} reviewCount ${place.reviewCount} < 100`);
  assert.ok(place.signatureMenu.length >= 2, `${place.id} signatureMenu length < 2`);
  assert.ok(place.tags.length >= 3, `${place.id} tags length < 3`);
  assert.ok(place.addressVi.includes('Nha Trang'), `${place.id} addressVi missing 'Nha Trang'`);
  assert.ok(place.googleMapUrl.startsWith('https://www.google.com/maps/search/?api=1&query='), `${place.id} invalid map url`);
  assert.ok(place.googlePhotosUrl.includes('%EC%82%AC%EC%A7%84'), `${place.id} invalid photos url`);
});
console.log('  ✔ PASS: All 17 seafood places satisfy strict 26-field schema');

// 3. Check new 9 seafood entries exist and are correct
const newPlaceIds = [
  'vinh-xanh-seafood',
  'moc-quan-seafood',
  'hanh-xuan-seafood',
  'costa-seafood',
  'ben-cang-seafood',
  'nina-seafood',
  'oc-chao-so-1',
  'hem-oc-van-don',
  'oc-co-van'
];

console.log('\n3. Verifying new 9 seafood additions');
newPlaceIds.forEach(id => {
  const found = seafoods.find(s => s.id === id);
  assert.ok(found, `New seafood spot '${id}' not found`);
  console.log(`  ✔ Found: ${found.name} (Rating: ${found.rating}★, Reviews: ${found.reviewCount})`);
});

// 4. Keyword search simulation
console.log('\n4. Verifying search simulation for seafood keywords');
const keywords = ['랍스터', '가리비', '맛조개', '조개', '보케', '빈산', '목콴', '오션뷰', '사테'];
keywords.forEach(kw => {
  const matches = NHA_TRANG_GOURMETS.filter(g => {
    const jsonStr = JSON.stringify(g).toLowerCase();
    return jsonStr.includes(kw.toLowerCase());
  });
  assert.ok(matches.length > 0, `Keyword '${kw}' should match at least 1 place`);
  console.log(`  ✔ Keyword '${kw}': matched ${matches.length} places`);
});

console.log('\n✨ All Seafood Domain Tests Passed Successfully!\n');
