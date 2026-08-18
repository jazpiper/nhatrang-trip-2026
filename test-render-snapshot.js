/**
 * ============================================================================
 * Nha Trang Trip 2026 - Render Output Snapshot Suite (Characterization Tests)
 * File: test-render-snapshot.js
 * ============================================================================
 *
 * WHAT THIS GUARDS
 * The other suites verify data and filter logic. Nothing verified the HTML the
 * renderers actually emit — so a refactor could silently change every card on
 * the page and stay green. This suite pins the exact markup for all 5 domains
 * across representative filter states.
 *
 * It is a CHARACTERIZATION test: the goldens record what the code does today,
 * not what it ideally should do. During a behaviour-preserving refactor the
 * correct outcome is "no diff". If a diff appears, either the refactor changed
 * behaviour (fix the code) or the change was intended (review the diff line by
 * line, then re-record).
 *
 *   node test-render-snapshot.js            # verify against goldens
 *   node test-render-snapshot.js --update   # re-record goldens (review the diff!)
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(__dirname, 'test-snapshots');
const UPDATE = process.argv.includes('--update');

const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m'
};

// --- 1. Seed data globals BEFORE requiring the app -------------------------
// data.js has no module.exports, so it is evaluated the same way test-activity.js
// does it: read the source and run it, then lift the consts onto globalThis.
const dataSrc = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
(0, eval)(
  dataSrc +
  '\n;globalThis.NHA_TRANG_ACTIVITIES = NHA_TRANG_ACTIVITIES;' +
  '\n;globalThis.DEFAULT_EXCHANGE_RATE = DEFAULT_EXCHANGE_RATE;'
);

globalThis.NHA_TRANG_GOURMETS = require('./gourmet-data.js').NHA_TRANG_GOURMETS;
globalThis.NHA_TRANG_STAYS = require('./stays-data.js').NHA_TRANG_STAYS;
globalThis.NHA_TRANG_SHOPPING = require('./shopping-data.js').NHA_TRANG_SHOPPING;
globalThis.NHA_TRANG_CURRENCY = require('./currency-data.js').NHA_TRANG_CURRENCY;

// --- 2. Require the app while `document` is still absent -------------------
// (that is what keeps init() from firing — see test-dom-stub.js header)
const app = require('./js/app.js');

// --- 3. Install the DOM stub ------------------------------------------------
const { installDom } = require('./test-dom-stub.js');
const dom = installDom();

// --- 4. Case matrix ---------------------------------------------------------
// Values below are the real data-* attribute values used in index.html, so the
// cases stay meaningful rather than synthetic.
const DOMAINS = [
  {
    key: 'activity',
    render: () => app.renderCards(),
    container: 'cardsGridContainer',
    count: 'resultCountText',
    catField: 'actCategory', tagField: 'actTag',
    wishField: 'wishlist', data: () => NHA_TRANG_ACTIVITIES,
    sampleCat: 'hopping', sampleTag: 'wife', sampleQuery: '스노클링'
  },
  {
    key: 'gourmet',
    render: () => app.renderGourmets(),
    container: 'gourmetCardsGridContainer',
    count: 'gourmetResultCountText',
    catField: 'gourmetCategory', tagField: 'gourmetTag',
    wishField: 'gourmetWishlist', data: () => NHA_TRANG_GOURMETS,
    sampleCat: 'banhxeo', sampleTag: 'line', sampleQuery: '반쎄오'
  },
  {
    key: 'stay',
    render: () => app.renderStays(),
    container: 'staysCardsGridContainer',
    count: 'stayResultCountText',
    catField: 'stayCategory', tagField: 'stayTag',
    wishField: 'stayWishlist', data: () => NHA_TRANG_STAYS,
    sampleCat: 'welcome', sampleTag: 'pool', sampleQuery: '인터컨티넨탈'
  },
  {
    key: 'shopping',
    render: () => app.renderShopping(),
    container: 'shoppingCardsGridContainer',
    count: 'shoppingResultCountText',
    catField: 'shoppingCategory', tagField: 'shoppingTag',
    wishField: 'shoppingWishlist', data: () => NHA_TRANG_SHOPPING,
    sampleCat: 'boutique_mirror', sampleTag: 'ac', sampleQuery: '크록스'
  },
  {
    key: 'currency',
    render: () => app.renderCurrency(),
    container: 'currencyCardsGridContainer',
    count: 'currencyResultCountText',
    catField: 'currencyCategory', tagField: 'currencyTag',
    wishField: 'currencyWishlist', data: () => NHA_TRANG_CURRENCY,
    sampleCat: 'atm_zero_fee', sampleTag: 'fee_free', sampleQuery: '김청'
  }
];

const NO_MATCH = 'zzzz-no-such-place-zzzz';

function statesFor(d) {
  return [
    { name: 'default', patch: {} },
    { name: 'category', patch: { [d.catField]: d.sampleCat } },
    { name: 'tag', patch: { [d.tagField]: d.sampleTag } },
    { name: 'search', patch: { searchQuery: d.sampleQuery } },
    { name: 'sort-rating', patch: { sortBy: 'rating' } },
    // Price sorts read a different field per domain (priceVnd / avgPriceVnd /
    // pricePerNightVnd) and the rating tie-breaker multiplier differs too, so
    // both directions are pinned — a unified comparator must not flatten them.
    { name: 'sort-price-asc', patch: { sortBy: 'price-asc' } },
    { name: 'sort-price-desc', patch: { sortBy: 'price-desc' } },
    // Seeded with two real ids so this exercises the wishlist branch rather than
    // collapsing into the same empty state as the case below.
    { name: 'wishlist-only', patch: { wishlistOnly: true, [d.wishField]: d.data().slice(0, 2).map(x => x.id) } },
    { name: 'empty', patch: { searchQuery: NO_MATCH } }
  ];
}

function capture(d, state) {
  app.resetStateFilters();
  // resetStateFilters() deliberately leaves wishlist arrays alone (they are user
  // data, not filters), so clear it here to keep cases independent.
  app.state[d.wishField] = [];
  Object.assign(app.state, state.patch);
  d.render();
  const out = [
    `<!-- domain: ${d.key} | state: ${state.name} -->`,
    `<!-- count: ${dom.html(d.count) || dom.text(d.count)} -->`,
    `<!-- container class: ${dom.cls(d.container)} -->`,
    dom.html(d.container)
  ].join('\n');
  app.resetStateFilters();
  return out;
}

// --- 5. Run -----------------------------------------------------------------
if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

let checked = 0, passed = 0, failed = 0, written = 0;
const failures = [];

console.log(`\n${colors.bright}${colors.cyan}=== Render Output Snapshots (${UPDATE ? 'RECORDING' : 'verifying'}) ===${colors.reset}`);

const cases = [];
for (const d of DOMAINS) {
  for (const state of statesFor(d)) {
    cases.push({ file: `${d.key}.${state.name}.html`, produce: () => capture(d, state) });
  }
}
// 리스트가 기본 뷰라 위 케이스는 전부 행 마크업을 잡는다. 그리드는 같은 데이터를
// 카드 템플릿으로 그리는 두 번째 뷰이므로 도메인별로 한 케이스씩 따로 고정한다.
for (const d of DOMAINS) {
  cases.push({
    file: `${d.key}.grid-view.html`,
    produce: () => {
      const prev = app.state.currentView;
      app.state.currentView = 'grid';
      const out = capture(d, { name: 'grid-view', patch: {} });
      app.state.currentView = prev;
      return out;
    }
  });
}

// 밀도는 컨테이너 클래스만 바꾸므로 한 도메인에서만 확인한다.
cases.push({
  file: 'gourmet.comfy.html',
  produce: () => {
    const prev = app.state.density;
    app.state.density = 'comfy';
    const out = capture(DOMAINS.find(d => d.key === 'gourmet'), { name: 'comfy', patch: {} });
    app.state.density = prev;
    return out;
  }
});

// "지금 영업중" 필터는 시각에 따라 결과가 달라지므로 스냅샷으로 고정하지 않는다.

// --- Modal snapshots --------------------------------------------------------
// openXModal writes into ~30 individual elements each. Dumping every element the
// call touched pins the whole modal population, which is what Phase 4 (declarative
// field maps) has to preserve. Without this the modals would be unguarded.
const MODAL_OPENERS = [
  { key: 'activity', open: item => app.openActivityModal(item), data: () => NHA_TRANG_ACTIVITIES },
  { key: 'gourmet', open: item => app.openGourmetModal(item), data: () => NHA_TRANG_GOURMETS },
  { key: 'stay', open: item => app.openStayModal(item), data: () => NHA_TRANG_STAYS },
  { key: 'shopping', open: item => app.openShoppingModal(item), data: () => NHA_TRANG_SHOPPING },
  { key: 'currency', open: item => app.openCurrencyModal(item), data: () => NHA_TRANG_CURRENCY }
];

function captureModal(m, index) {
  dom.reset();
  const item = m.data()[index];
  m.open(item);
  const lines = [`<!-- modal: ${m.key} | item: ${item.id} -->`];
  dom.touchedIds().forEach(id => {
    const el = dom.doc.getElementById(id);
    const parts = [];
    if (el.textContent) parts.push(`text=${JSON.stringify(el.textContent)}`);
    if (el.innerHTML) parts.push(`html=${JSON.stringify(el.innerHTML)}`);
    if (el.src) parts.push(`src=${JSON.stringify(el.src)}`);
    if (el.href) parts.push(`href=${JSON.stringify(el.href)}`);
    if (el.value) parts.push(`value=${JSON.stringify(el.value)}`);
    const style = Object.keys(el.style).filter(k => el.style[k] !== '');
    if (style.length) parts.push(`style={${style.map(k => `${k}:${el.style[k]}`).join(';')}}`);
    if (parts.length) lines.push(`${id}\n    ${parts.join('\n    ')}`);
  });
  dom.reset();
  return lines.join('\n');
}

MODAL_OPENERS.forEach(m => {
  // First and last entry: catches domain items with different optional-field shapes.
  [0, m.data().length - 1].forEach((idx, n) => {
    cases.push({ file: `${m.key}.modal-${n === 0 ? 'first' : 'last'}.txt`, produce: () => captureModal(m, idx) });
  });
});

for (const c of cases) {
  const target = path.join(SNAPSHOT_DIR, c.file);
  let actual;
  try {
    actual = c.produce();
  } catch (err) {
    failed++;
    failures.push({ file: c.file, message: `renderer threw: ${err.message}` });
    console.log(`  ${colors.red}✖ THREW:${colors.reset} ${c.file} — ${err.message}`);
    continue;
  }

  if (actual.trim() === '' || actual.split('\n').slice(2).join('').trim() === '') {
    // A completely empty container almost always means the harness is miswired
    // (wrong container id), which would make every later comparison vacuous.
    failed++;
    failures.push({ file: c.file, message: 'renderer produced no markup — harness likely misconfigured' });
    console.log(`  ${colors.red}✖ EMPTY:${colors.reset} ${c.file}`);
    continue;
  }

  if (UPDATE || !fs.existsSync(target)) {
    fs.writeFileSync(target, actual);
    written++;
    console.log(`  ${colors.yellow}✎ recorded:${colors.reset} ${c.file} (${actual.length.toLocaleString()} chars)`);
    continue;
  }

  checked++;
  const expected = fs.readFileSync(target, 'utf8');
  if (expected === actual) {
    passed++;
    console.log(`  ${colors.green}✔ match:${colors.reset} ${c.file}`);
  } else {
    failed++;
    const expLines = expected.split('\n');
    const actLines = actual.split('\n');
    let firstDiff = 0;
    while (firstDiff < Math.max(expLines.length, actLines.length) &&
           expLines[firstDiff] === actLines[firstDiff]) firstDiff++;
    failures.push({
      file: c.file,
      message: `first difference at line ${firstDiff + 1}`,
      expected: (expLines[firstDiff] || '(missing)').trim().slice(0, 200),
      actual: (actLines[firstDiff] || '(missing)').trim().slice(0, 200)
    });
    console.log(`  ${colors.red}✖ DIFF:${colors.reset} ${c.file} (line ${firstDiff + 1})`);
  }
}

// --- 6. Summary -------------------------------------------------------------
console.log(`\n${colors.bright}====================================================${colors.reset}`);
if (UPDATE || written > 0) {
  console.log(`${colors.yellow}Recorded ${written} snapshot(s) into test-snapshots/.${colors.reset}`);
  console.log(`${colors.dim}Review the git diff before committing — these are the refactor baseline.${colors.reset}`);
}
if (checked > 0) {
  console.log(`Compared: ${checked}   ${colors.green}Match: ${passed}${colors.reset}   ${failed > 0 ? colors.red : colors.green}Diff: ${failed}${colors.reset}`);
}

if (failed > 0) {
  console.log(`\n${colors.red}${colors.bright}Render output changed in ${failed} case(s):${colors.reset}`);
  failures.forEach((f, i) => {
    console.log(`\n  ${i + 1}) ${colors.red}${f.file}${colors.reset} — ${f.message}`);
    if (f.expected !== undefined) {
      console.log(`     ${colors.dim}expected:${colors.reset} ${f.expected}`);
      console.log(`     ${colors.dim}actual  :${colors.reset} ${f.actual}`);
    }
  });
  console.log(`\n${colors.red}❌ Snapshot suite failed. If the change was intended, re-run with --update and review the diff.${colors.reset}\n`);
  process.exit(1);
}

console.log(`\n${colors.green}${colors.bright}✨ Render output is unchanged across all ${checked || written} snapshot cases.${colors.reset}\n`);
process.exit(0);
