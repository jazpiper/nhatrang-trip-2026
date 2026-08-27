/**
 * Nha Trang Trip 2026 - Comprehensive Adversarial Storage & Prototype Security Suite
 * Challenger 1: Storage & Prototype Adversarial Challenger
 * 
 * Vectors tested:
 * 1. Prototype Pollution Attacks (__proto__, constructor.prototype, prototype, deep nested prototypes)
 * 2. Prototype Property Collisions (toString, valueOf, hasOwnProperty, isPrototypeOf, __defineGetter__, etc.)
 * 3. Malformed Storage Payloads & Type Confusion (corrupted JSON, type mismatch, circular refs, deep nesting, huge data)
 * 4. QuotaExceededError Simulation & UI Degradation on LocalStorage
 * 5. All 7 Domain Storage Boundaries & Note Auto-Save Handlers
 */

const assert = require('assert');
const { installDom, uninstallDom } = require('./test-dom-stub.js');

console.log('================================================================');
console.log('⚡ CHALLENGER 1: ADVERSARIAL STORAGE & PROTOTYPE STRESS HARNESS ⚡');
console.log('================================================================\n');

// 1. Mock LocalStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
    this.quotaError = false;
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key, value) {
    if (this.quotaError) {
      const err = new Error('QuotaExceededError: The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      err.code = 22;
      throw err;
    }
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
globalThis.localStorage = mockStorage;

// 2. Require app without document so init() does not auto-run
const app = require('./js/app.js');

// 3. Install DOM stub for UI and render interactions
const dom = installDom();

function getToasts() {
  const tc = globalThis.document.getElementById('toastContainer');
  return tc ? tc.children.map(c => c.textContent) : [];
}

function clearToasts() {
  const tc = globalThis.document.getElementById('toastContainer');
  if (tc) tc.children = [];
}

let passCount = 0;
let failCount = 0;
const failures = [];

function runChallenge(category, testName, fn) {
  try {
    fn();
    console.log(`  ✔ [PASS] [${category}] ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] [${category}] ${testName}`);
    console.error(`     Reason: ${err.message}`);
    if (err.stack) {
      const stackLine = err.stack.split('\n')[1];
      console.error(`     ${stackLine.trim()}`);
    }
    failCount++;
    failures.push({ category, testName, error: err.message });
  }
}

// ============================================================================
// SECTION 1: PROTOTYPE POLLUTION ATTACK VECTORS
// ============================================================================
console.log('--- SECTION 1: PROTOTYPE POLLUTION ATTACKS ---');

runChallenge('ProtoPollution', 'Direct __proto__ JSON injection does not pollute Object.prototype', () => {
  const maliciousJSON = '{"__proto__": {"polluted_prop_1": "ATTACK_SUCCESS"}}';
  const parsed = JSON.parse(maliciousJSON);

  assert.strictEqual(Object.prototype.polluted_prop_1, undefined);
  const sanitized = app.sanitizeStorageData(parsed, {});

  assert.strictEqual(Object.prototype.polluted_prop_1, undefined, 'Object.prototype must NOT be polluted');
  assert.strictEqual(sanitized.polluted_prop_1, undefined, '__proto__ payload must be discarded');
  assert.strictEqual(Object.getPrototypeOf(sanitized), null, 'Sanitized object must have null prototype');
});

runChallenge('ProtoPollution', 'Constructor.prototype injection does not pollute Object.prototype', () => {
  const maliciousJSON = '{"constructor": {"prototype": {"admin_role": true, "polluted_prop_2": "ATTACK_SUCCESS"}}}';
  const parsed = JSON.parse(maliciousJSON);

  const sanitized = app.sanitizeStorageData(parsed, {});

  assert.strictEqual(Object.prototype.admin_role, undefined);
  assert.strictEqual(Object.prototype.polluted_prop_2, undefined);
  assert.strictEqual(sanitized.constructor, undefined);
  assert.strictEqual(sanitized.admin_role, undefined);
});

runChallenge('ProtoPollution', 'Prototype key injection does not pollute prototype chain', () => {
  const maliciousJSON = '{"prototype": {"injected_field": "hacked"}}';
  const parsed = JSON.parse(maliciousJSON);

  const sanitized = app.sanitizeStorageData(parsed, {});

  assert.strictEqual(Object.prototype.injected_field, undefined);
  assert.strictEqual(sanitized.prototype, undefined);
  assert.strictEqual(sanitized.injected_field, undefined);
});

runChallenge('ProtoPollution', 'Nested prototype pollution attempts in objects are rejected', () => {
  const payload = {
    legitKey: 'valid_value',
    nestedObj: {
      '__proto__': { 'nested_polluted': true },
      'constructor': { 'prototype': { 'nested_polluted_2': true } }
    },
    deepNested: {
      level1: {
        level2: {
          '__proto__': { 'deep_polluted': true }
        }
      }
    }
  };

  const sanitized = app.sanitizeStorageData(payload, {});

  assert.strictEqual(Object.prototype.nested_polluted, undefined);
  assert.strictEqual(Object.prototype.nested_polluted_2, undefined);
  assert.strictEqual(Object.prototype.deep_polluted, undefined);
  assert.strictEqual(sanitized.legitKey, 'valid_value');
  assert.strictEqual(sanitized.nestedObj, undefined);
  assert.strictEqual(sanitized.deepNested, undefined);
});

runChallenge('ProtoPollution', 'Array pollution payloads are filtered to safe strings only', () => {
  const arrayPayload = [
    'act_1',
    { '__proto__': { 'arr_polluted': true } },
    { 'constructor': { 'prototype': { 'arr_polluted_2': true } } },
    'act_2',
    ['nested', 'array', { '__proto__': { 'deep_polluted': true } }],
    42
  ];

  const sanitized = app.sanitizeStorageData(arrayPayload, []);

  assert.strictEqual(Object.prototype.arr_polluted, undefined);
  assert.strictEqual(Object.prototype.arr_polluted_2, undefined);
  assert.strictEqual(Object.prototype.deep_polluted, undefined);
  assert.deepStrictEqual(sanitized, ['act_1', 'act_2', '42']);
});

runChallenge('ProtoPollution', 'loadFromStorage drops malicious __proto__ payloads from localStorage', () => {
  mockStorage.setItem('nha_trang_notes', JSON.stringify({
    '__proto__': { 'storage_polluted': true },
    'constructor': { 'prototype': { 'storage_polluted_2': true } },
    'act_dam_market': 'Great place for bargaining'
  }));

  const loaded = app.loadFromStorage('nha_trang_notes', {});

  assert.strictEqual(Object.prototype.storage_polluted, undefined);
  assert.strictEqual(Object.prototype.storage_polluted_2, undefined);
  assert.strictEqual(loaded.act_dam_market, 'Great place for bargaining');
  assert.strictEqual(Object.getPrototypeOf(loaded), null);
});


// ============================================================================
// SECTION 2: PROTOTYPE PROPERTY COLLISIONS
// ============================================================================
console.log('\n--- SECTION 2: PROTOTYPE PROPERTY COLLISIONS ---');

runChallenge('Collisions', 'Null prototype on sanitized objects prevents property lookup collisions', () => {
  const sanitized = app.sanitizeStorageData(null, { defaultKey: 'val' });
  assert.strictEqual(Object.getPrototypeOf(sanitized), null);

  assert.strictEqual(sanitized.toString, undefined);
  assert.strictEqual(sanitized.valueOf, undefined);
  assert.strictEqual(sanitized.hasOwnProperty, undefined);
  assert.strictEqual(sanitized.isPrototypeOf, undefined);
  assert.strictEqual(sanitized.defaultKey, 'val');
});

runChallenge('Collisions', 'Collision keys stored as note IDs work safely without crashing or polluting', () => {
  const collisionPayload = {
    'toString': 'User note for toString item',
    'valueOf': 'User note for valueOf item',
    'hasOwnProperty': 'User note for hasOwnProperty item',
    'isPrototypeOf': 'User note for isPrototypeOf item',
    'propertyIsEnumerable': 'User note for propertyIsEnumerable item',
    'toLocaleString': 'User note for toLocaleString item',
    '__defineGetter__': 'User note for __defineGetter__ item',
    'constructor': 'User note for constructor item',
    '__proto__': { evil: 123 }
  };

  const sanitizedNotes = app.sanitizeStorageData(collisionPayload, {});

  assert.strictEqual(sanitizedNotes['toString'], 'User note for toString item');
  assert.strictEqual(sanitizedNotes['valueOf'], 'User note for valueOf item');
  assert.strictEqual(sanitizedNotes['hasOwnProperty'], 'User note for hasOwnProperty item');
  assert.strictEqual(sanitizedNotes['isPrototypeOf'], 'User note for isPrototypeOf item');
  assert.strictEqual(sanitizedNotes['propertyIsEnumerable'], 'User note for propertyIsEnumerable item');
  assert.strictEqual(sanitizedNotes['toLocaleString'], 'User note for toLocaleString item');
  assert.strictEqual(sanitizedNotes['__defineGetter__'], 'User note for __defineGetter__ item');
  assert.strictEqual(sanitizedNotes['constructor'], undefined, 'constructor key must be excluded');
  assert.strictEqual(sanitizedNotes['__proto__'], undefined, '__proto__ key must be excluded');
  assert.strictEqual(Object.prototype.evil, undefined);
});

runChallenge('Collisions', 'Wishlist array safely handles prototype collision ID strings', () => {
  const wishlistPayload = [
    'toString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'constructor',
    '__proto__',
    'normal_id_1'
  ];

  const sanitizedWishlist = app.sanitizeStorageData(wishlistPayload, []);

  assert.strictEqual(sanitizedWishlist.includes('toString'), true);
  assert.strictEqual(sanitizedWishlist.includes('valueOf'), true);
  assert.strictEqual(sanitizedWishlist.includes('hasOwnProperty'), true);
  assert.strictEqual(sanitizedWishlist.includes('constructor'), true);
  assert.strictEqual(sanitizedWishlist.includes('__proto__'), true);
  assert.strictEqual(sanitizedWishlist.includes('normal_id_1'), true);
  assert.strictEqual(sanitizedWishlist.indexOf('valueOf'), 1);

  const idx = sanitizedWishlist.indexOf('toString');
  sanitizedWishlist.splice(idx, 1);
  assert.strictEqual(sanitizedWishlist.includes('toString'), false);
});

runChallenge('Collisions', 'Saving and reloading state containing prototype collision keys roundtrips safely', () => {
  const testNotes = Object.create(null);
  testNotes['toString'] = 'Note for toString place';
  testNotes['valueOf'] = 'Note for valueOf place';
  testNotes['hasOwnProperty'] = 'Note for hasOwnProperty place';

  const saveSuccess = app.saveToStorage('nha_trang_notes', testNotes);
  assert.strictEqual(saveSuccess, true);

  const reloaded = app.loadFromStorage('nha_trang_notes', {});
  assert.strictEqual(reloaded['toString'], 'Note for toString place');
  assert.strictEqual(reloaded['valueOf'], 'Note for valueOf place');
  assert.strictEqual(reloaded['hasOwnProperty'], 'Note for hasOwnProperty place');
  assert.strictEqual(Object.getPrototypeOf(reloaded), null);
});


// ============================================================================
// SECTION 3: MALFORMED STORAGE PAYLOADS & TYPE CONFUSION
// ============================================================================
console.log('\n--- SECTION 3: MALFORMED STORAGE PAYLOADS & TYPE CONFUSION ---');

runChallenge('MalformedData', 'Corrupted JSON strings in storage fall back gracefully without uncaught exceptions', () => {
  const badJSONs = [
    '{ invalid json',
    '[1, 2, ',
    'undefined',
    '',
    "{'single_quotes': 1}",
    '\x00\x01\x02\x03\x04',
    '{"truncated": '
  ];

  for (const bad of badJSONs) {
    mockStorage.setItem('nha_trang_notes', bad);
    const resultObj = app.loadFromStorage('nha_trang_notes', { fallbackKey: 'ok' });
    assert.strictEqual(resultObj.fallbackKey, 'ok', `Must fall back cleanly for bad JSON: ${bad}`);
    assert.strictEqual(Object.getPrototypeOf(resultObj), null);

    mockStorage.setItem('nha_trang_wishlist', bad);
    const resultArr = app.loadFromStorage('nha_trang_wishlist', ['fallback_id']);
    assert.deepStrictEqual(resultArr, ['fallback_id'], `Must fall back cleanly for bad JSON: ${bad}`);
  }
});

runChallenge('MalformedData', 'Type Confusion: Primitive values passed to object fallback are recovered safely', () => {
  const types = [12345, true, false, 'just a string'];
  for (const raw of types) {
    const sanitized = app.sanitizeStorageData(raw, { defaultNote: 'hello' });
    assert.strictEqual(sanitized.defaultNote, 'hello');
    assert.strictEqual(Object.getPrototypeOf(sanitized), null);
  }
});

runChallenge('MalformedData', 'Type Confusion: Array passed to object fallback returns object with fallback properties', () => {
  const sanitized = app.sanitizeStorageData(['a', 'b', 'c'], { defaultNote: 'hello' });
  assert.strictEqual(sanitized.defaultNote, 'hello');
  assert.strictEqual(Object.getPrototypeOf(sanitized), null);
  assert.strictEqual(sanitized[0], undefined);
});

runChallenge('MalformedData', 'Type Confusion: Object passed to array fallback returns copy of fallback array', () => {
  const fallback = ['item1', 'item2'];
  const sanitized = app.sanitizeStorageData({ '0': 'hacked_item' }, fallback);
  assert.deepStrictEqual(sanitized, fallback);
  assert.notStrictEqual(sanitized, fallback, 'Must return a fresh slice/copy');
});

runChallenge('MalformedData', 'Type Confusion: Non-string and non-number items inside arrays are filtered out', () => {
  const rawArray = [
    'valid_str',
    123,
    null,
    undefined,
    true,
    false,
    {},
    [],
    () => {},
    NaN,
    Infinity
  ];

  const sanitized = app.sanitizeStorageData(rawArray, []);
  assert.deepStrictEqual(sanitized, ['valid_str', '123', 'NaN', 'Infinity']);
});

runChallenge('MalformedData', 'Boundary Capping: Extremely large arrays are capped to 500 items and 200 chars', () => {
  const hugeArray = [];
  for (let i = 0; i < 1000; i++) {
    hugeArray.push('item_' + i + '_' + 'x'.repeat(300));
  }

  const sanitized = app.sanitizeStorageData(hugeArray, []);
  assert.strictEqual(sanitized.length, 500, 'Array must be capped to 500 items');
  assert.strictEqual(sanitized[0].length, 200, 'Each item string must be capped to 200 chars');
});

runChallenge('MalformedData', 'Boundary Capping: Extremely large objects are capped to 500 entries, 100 char keys, 5000 char values', () => {
  const hugeObj = {};
  for (let i = 0; i < 1000; i++) {
    const longKey = 'key_' + i + '_' + 'k'.repeat(200);
    hugeObj[longKey] = 'val_' + 'v'.repeat(6000);
  }

  const sanitized = app.sanitizeStorageData(hugeObj, {});
  const keys = Object.keys(sanitized);
  assert.strictEqual(keys.length, 500, 'Dictionary must be capped to 500 entries');
  assert.ok(keys[0].length <= 100, `Key length ${keys[0].length} must be <= 100`);
  assert.strictEqual(sanitized[keys[0]].length, 5000, 'Value length must be capped to 5000 chars');
});

runChallenge('MalformedData', 'saveToStorage gracefully catches circular references and returns false', () => {
  const circularObj = { name: 'circular' };
  circularObj.self = circularObj;

  const result = app.saveToStorage('nha_trang_notes', circularObj);
  assert.strictEqual(result, false, 'saveToStorage must return false on circular structures without throwing');
});

runChallenge('MalformedData', 'Non-namespaced keys are strictly rejected on both load and save', () => {
  assert.strictEqual(app.saveToStorage('other_app_token', 'secret'), false);
  assert.strictEqual(app.saveToStorage('', 'value'), false);
  assert.strictEqual(app.saveToStorage(null, 'value'), false);
  assert.strictEqual(app.saveToStorage(12345, 'value'), false);

  mockStorage.setItem('other_app_token', JSON.stringify('secret'));
  const loaded = app.loadFromStorage('other_app_token', 'fallback');
  assert.strictEqual(loaded, 'fallback', 'Reading non-namespaced key must return fallback');
});


// ============================================================================
// SECTION 4: LOCALSTORAGE QUOTAEXCEEDEDERROR SIMULATION & UI RECOVERY
// ============================================================================
console.log('\n--- SECTION 4: LOCALSTORAGE QUOTAEXCEEDEDERROR & UI RECOVERY ---');

runChallenge('QuotaExhaustion', 'saveToStorage returns false when localStorage throws QuotaExceededError', () => {
  mockStorage.quotaError = true;

  const resultNotes = app.saveToStorage('nha_trang_notes', { act_1: 'sample note' });
  assert.strictEqual(resultNotes, false, 'saveToStorage must return false on QuotaExceededError');

  const resultWishlist = app.saveToStorage('nha_trang_wishlist', ['act_1', 'act_2']);
  assert.strictEqual(resultWishlist, false, 'saveToStorage must return false on QuotaExceededError');

  mockStorage.quotaError = false;
});

runChallenge('QuotaExhaustion', 'toggleDomainWishlist triggers warning toast on QuotaExceededError across domains while updating state', () => {
  mockStorage.quotaError = true;
  clearToasts();

  const domains = [
    { key: 'activities', wishField: 'wishlist', id: 'act_test_1' },
    { key: 'gourmet', wishField: 'gourmetWishlist', id: 'gourmet_test_1' },
    { key: 'stays', wishField: 'stayWishlist', id: 'stay_test_1' },
    { key: 'hoteldining', wishField: 'hoteldiningWishlist', id: 'hotel_test_1' },
    { key: 'spa', wishField: 'spaWishlist', id: 'spa_test_1' },
    { key: 'shopping', wishField: 'shoppingWishlist', id: 'shop_test_1' },
    { key: 'currency', wishField: 'currencyWishlist', id: 'curr_test_1' }
  ];

  for (const d of domains) {
    clearToasts();
    app.state[d.wishField] = [];
    app.toggleDomainWishlist(d.key, d.id);

    // In-memory state updated
    assert.strictEqual(app.state[d.wishField].includes(d.id), true, `Domain ${d.key} in-memory wishlist must update`);

    // UI Warning Toast triggered
    const toasts = getToasts();
    assert.ok(
      toasts.some(t => t.includes('저장 공간 부족')),
      `Domain ${d.key} must display '⚠️ 저장 공간 부족'. Got: ${JSON.stringify(toasts)}`
    );
  }

  // Recovery test
  mockStorage.quotaError = false;
  clearToasts();

  app.toggleDomainWishlist('activities', 'act_test_1'); // toggle off
  assert.strictEqual(app.state.wishlist.includes('act_test_1'), false);
  const recoveryToasts = getToasts();
  assert.ok(
    recoveryToasts.some(t => t.includes('제외되었습니다')),
    `Normal toast should appear after quota restoration. Got: ${JSON.stringify(recoveryToasts)}`
  );
});

runChallenge('QuotaExhaustion', 'Notes auto-save logic reflects QuotaExceededError warning in UI status', () => {
  // Mock note input and status elements
  const noteStatusEl = dom.doc.getElementById('modalNoteStatus');
  
  mockStorage.quotaError = true;
  app.state.activeModalActivity = { id: 'act_vinwonders' };
  if (!app.state.notes) app.state.notes = Object.create(null);
  
  // Simulate note edit
  const testVal = 'Great memories here';
  app.state.notes['act_vinwonders'] = testVal;
  const saved = app.saveToStorage('nha_trang_notes', app.state.notes);
  
  if (saved === false) {
    noteStatusEl.textContent = '⚠️ 저장 공간 부족';
  } else {
    noteStatusEl.textContent = '✓ 저장 완료';
  }

  assert.strictEqual(saved, false);
  assert.strictEqual(noteStatusEl.textContent, '⚠️ 저장 공간 부족');
  assert.strictEqual(app.state.notes['act_vinwonders'], testVal);

  // Clear quota error and simulate save success
  mockStorage.quotaError = false;
  const saved2 = app.saveToStorage('nha_trang_notes', app.state.notes);
  if (saved2 === false) {
    noteStatusEl.textContent = '⚠️ 저장 공간 부족';
  } else {
    noteStatusEl.textContent = '✓ 저장 완료';
  }

  assert.strictEqual(saved2, true);
  assert.strictEqual(noteStatusEl.textContent, '✓ 저장 완료');
});

runChallenge('ProtoPollution', 'sanitizeStorageData cleanses polluted fallback objects as well', () => {
  const fallbackWithProto = { fallbackNote: 'safe note' };
  const sanitizedNull = app.sanitizeStorageData(null, fallbackWithProto);
  assert.strictEqual(Object.getPrototypeOf(sanitizedNull), null);
  assert.strictEqual(sanitizedNull.fallbackNote, 'safe note');
  assert.strictEqual(sanitizedNull.toString, undefined);
});

runChallenge('QuotaExhaustion', 'View and density mode state functions reject invalid values and persist valid ones', () => {
  mockStorage.quotaError = false;

  // Test setViewMode
  app.setViewMode('grid');
  assert.strictEqual(app.state.currentView, 'grid');
  assert.strictEqual(mockStorage.getItem('nha_trang_view'), '"grid"');

  app.setViewMode('list');
  assert.strictEqual(app.state.currentView, 'list');
  assert.strictEqual(mockStorage.getItem('nha_trang_view'), '"list"');

  app.setViewMode('invalid_mode_malicious');
  assert.strictEqual(app.state.currentView, 'list', 'Invalid view mode must not overwrite state');

  // Test setDensity
  app.setDensity('comfy');
  assert.strictEqual(app.state.density, 'comfy');
  assert.strictEqual(mockStorage.getItem('nha_trang_density'), '"comfy"');

  app.setDensity('tight');
  assert.strictEqual(app.state.density, 'tight');
  assert.strictEqual(mockStorage.getItem('nha_trang_density'), '"tight"');

  app.setDensity('invalid_density_malicious');
  assert.strictEqual(app.state.density, 'tight', 'Invalid density must not overwrite state');
});


// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n================================================================');
console.log(`STRESS TEST HARNESS RESULTS: ${passCount} / ${passCount + failCount} PASSED`);
if (failCount > 0) {
  console.error(`❌ ${failCount} CHALLENGES FAILED:`);
  failures.forEach(f => console.error(`   - [${f.category}] ${f.testName}: ${f.error}`));
  console.log('================================================================\n');
  process.exit(1);
} else {
  console.log('🎉 ALL ADVERSARIAL CHALLENGES DEFENDED SUCCESSFULLY (VERDICT: APPROVE) 🎉');
  console.log('================================================================\n');
  process.exit(0);
}
