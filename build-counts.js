#!/usr/bin/env node
// build-counts.js — index.html에 하드코딩된 데이터셋 카운트를 실제 데이터에서
// 파생시켜 다시 찍는다(in-place, 멱등). 데이터 추가/삭제 후 실행:
//
//   node build-counts.js
//
// 대상: 헤더 탭 뱃지 6곳, 카테고리 첫 버튼 "전체 … (N곳)" 6곳, 환전 탭
// 카테고리별 소계, 결과 카운트 초기값 6곳. js/app.js의 heroPills 문구 숫자는
// 산문에 박혀 있어 자동 치환하지 않는다 — test-frontend.js Suite 10c가 잡는다.
// 검증도 같은 파일 Suite 10이 담당하므로, 이 스크립트와 Suite 10의 기대값은
// 둘 다 데이터셋 .length에서 나와 서로 어긋날 수 없다.
'use strict';
const fs = require('fs');

const { NHA_TRANG_ACTIVITIES } = require('./data.js');
const { NHA_TRANG_GOURMETS } = require('./gourmet-data.js');
const { NHA_TRANG_STAYS } = require('./stays-data.js');
const { NHA_TRANG_HOTEL_DININGS } = require('./hotel-dining-data.js');
const { NHA_TRANG_SPAS } = require('./spa-data.js');
const { NHA_TRANG_SHOPPING } = require('./shopping-data.js');
const { NHA_TRANG_CURRENCY } = require('./currency-data.js');

// 환전 탭 카테고리별 소계는 재구현이 아니라 실제 getFilteredCurrency()로 센다.
global.NHA_TRANG_CURRENCY = NHA_TRANG_CURRENCY;
const app = require('./js/app.js');

const counts = {
  activities: NHA_TRANG_ACTIVITIES.length,
  gourmet: NHA_TRANG_GOURMETS.length,
  stays: NHA_TRANG_STAYS.length,
  hoteldining: NHA_TRANG_HOTEL_DININGS.length,
  spa: NHA_TRANG_SPAS.length,
  shopping: NHA_TRANG_SHOPPING.length,
  currency: NHA_TRANG_CURRENCY.length
};

let html = fs.readFileSync('index.html', 'utf8');
const original = html;
const problems = [];

// 치환 헬퍼: 패턴이 정확히 1회 매치되지 않으면 실패로 기록한다.
// (매치 0회를 조용히 넘기면 마크업이 바뀌었을 때 드리프트가 되살아난다.)
function stampOnce(label, re, replacer) {
  const m = html.match(re);
  if (!m) { problems.push(`${label}: 패턴 매치 실패 — 마크업이 바뀌었으면 이 스크립트의 정규식을 갱신할 것`); return; }
  html = html.replace(re, replacer);
}

// --- 1) 헤더 탭 뱃지 (guide 탭은 "4대 가이드" 고정이라 제외) ---
for (const [domain, n] of Object.entries(counts)) {
  stampOnce(`tab-badge[${domain}]`,
    new RegExp(`(data-tab="${domain}"[\\s\\S]*?<span class="tab-badge"[^>]*>)[^<]+(</span>)`),
    (_, a, b) => a + n + b);
}

// --- 2) 카테고리 첫 버튼 "전체 … (N곳)" ---
const navIds = {
  activities: 'activityCategoryNav',
  gourmet: 'gourmetCategoryNav',
  stays: 'stayCategoryNav',
  hoteldining: 'hoteldiningCategoryNav',
  spa: 'spaCategoryNav',
  shopping: 'shoppingCategoryNav',
  currency: 'currencyCategoryNav'
};
for (const [domain, navId] of Object.entries(navIds)) {
  const start = html.indexOf(`id="${navId}"`);
  const end = start === -1 ? -1 : html.indexOf('</nav>', start);
  if (start === -1 || end === -1) { problems.push(`nav[${navId}]: 블록을 찾지 못함`); continue; }
  const block = html.slice(start, end);
  const re = /(<span>전체 [^<(]*\()\d+(곳\))/;
  if (!re.test(block)) { problems.push(`nav[${navId}]: "전체 … (N곳)" 버튼 매치 실패`); continue; }
  html = html.slice(0, start) + block.replace(re, `$1${counts[domain]}$2`) + html.slice(end);
}

// --- 3) 환전 탭 카테고리별 소계 — 실제 필터 함수로 센다 ---
{
  const start = html.indexOf('id="currencyCategoryNav"');
  const end = html.indexOf('</nav>', start);
  let block = html.slice(start, end);
  block = block.replace(
    /(data-currcategory="(?!all")([^"]+)"[\s\S]*?<span>[^<(]*\()\d+(곳\))/g,
    (whole, prefix, cat, suffix) => {
      app.resetStateFilters();
      app.state.currencyCategory = cat;
      return prefix + app.getFilteredCurrency().length + suffix;
    });
  app.resetStateFilters();
  html = html.slice(0, start) + block + html.slice(end);
}

// --- 4) 결과 카운트 초기값 "총 <strong>N</strong>" ---
const resultCountIds = {
  activities: 'resultCountText',
  gourmet: 'gourmetResultCountText',
  stays: 'stayResultCountText',
  hoteldining: 'hoteldiningResultCountText',
  spa: 'spaResultCountText',
  shopping: 'shoppingResultCountText',
  currency: 'currencyResultCountText'
};
for (const [domain, id] of Object.entries(resultCountIds)) {
  stampOnce(`resultCount[${id}]`,
    new RegExp(`(<span id="${id}">총 <strong[^>]*>)[\\d,]+(</strong>)`),
    (_, a, b) => a + counts[domain] + b);
}

if (problems.length) {
  console.error('❌ build-counts 실패:');
  problems.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

if (html !== original) {
  fs.writeFileSync('index.html', html);
  console.log('✔ index.html 카운트 갱신 완료:', JSON.stringify(counts));
} else {
  console.log('✔ 변경 없음 — index.html 카운트가 이미 데이터셋과 일치:', JSON.stringify(counts));
}
