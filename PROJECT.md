# Project: Nha Trang Trip 2026 - Currency, ATM & Travel Card Guide Domain

## Architecture
Vanilla Single Page Application (SPA) architecture with strict separation of concerns, zero external framework runtime dependencies, and dual Node.js CommonJS test compatibility.

- **Data Layer (`currency-data.js`)**: Global constant `NHA_TRANG_CURRENCY` loaded before `app.js`, supporting dual Node.js `module.exports` for test runners. Contains 17 ground-truth verified currency exchange spots and zero-fee ATMs with 28-field schema. Also exports `NHA_TRANG_TRAVEL_CARDS` and `NHA_TRANG_ATM_TIPS`.
- **State Layer (`js/store/state.js` & `js/app.js`)**: Reactive state managing `currentTab: 'currency'`, `currencyCategory`, `currencyTag`, `currencyWishlist`, `currencyNotes`, and `activeModalCurrency`.
- **Component Layer (`js/components/currency.js` & `js/app.js`)**: Pure modular functions exporting `renderCurrency()`, `openCurrencyModal()`, `closeCurrencyModal()`, `toggleCurrencyWishlist()`, `getFilteredCurrency()`, and `initCurrencyCalculator()`.
- **App Controller (`js/app.js`)**: Main SPA orchestrator handling tab switching (`switchMainTab('currency')`), event routing, search filtering, and hero banner updates.
- **Style Layer (`style.css`)**: Airbnb design tokens, scoped `.currency-card`, `.currency-badge-fee`, `.supported-cards-grid`, `.atm-step-guide`, `.dcc-warning-banner`, `.exchange-rate-table-wrap`, and interactive calculator styling.
- **Verification Layer (`test-currency.js`, `test-frontend.js`)**: Automated test runner executing 12 validation suites with 100% schema, DOM, URL encoding, card matrix, and business logic coverage.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Verified Currency & ATM Dataset (`currency-data.js`) | 17 ground-truth verified exchange spots & zero-fee ATMs (28-field schema) | M1 | Spec Miner 2 / Explorer 2 |
| 2 | 5 Major Korean Travel Cards Specs Matrix | TraveLog, TravelWallet, SOL Travel, Toss Bank, Wibee Travel matching | M1 | Spec Miner 2 / Explorer 2 |
| 3 | Cash & ATM Operational Guide Dataset | DCC avoidance, 6-digit PIN rules, card-dispense-first order, $100 crisp bill rules | M1 | Spec Miner 2 / Explorer 3 |
| 4 | Header Navigation Tab & Badge | '💱 환전 & ATM' tab button with dynamic venue count badge (17곳) | M2 | Explorer 1 / 3 |
| 5 | Category Filter Bar (`#currencyCategoryNav`) | 6 category filters (전체, 수수료 무료 ATM, 시내 금은방, 공항/은행, 트래블로그, 트래블월렛 등) | M2 | Explorer 1 / 3 |
| 6 | Tag Chips Bar (`#currencyTagChips`) | 8 quick filter chips (수수료 0원, 24시간 LiveBank, 100달러 우대, 야시장 인근 등) | M2 | Explorer 1 / 3 |
| 7 | Interactive VND ↔ KRW Currency Calculator | Dual bidirectional input, quick preset pills (+50k~+2M), mental math banner, custom rate | M2 | Explorer 3 |
| 8 | Practical Guide & DCC Defense Infographics | POS terminal simulation, 7-step ATM flowchart, emergency hotlines | M2 | Explorer 3 |
| 9 | Dynamic Currency Cards Grid Section | Responsive card grid container `#currencyCardsGridContainer` | M2 | Explorer 1 |
| 10 | Comprehensive Detail Modal (`#currencyModal`) | Modal with photos, Google Maps link, address copy, supported card badges, limits, tips | M2 | Explorer 1 / 3 |
| 11 | Airbnb CSS Styling & Class Invariants | Styles for currency cards, badges, calculator, tables, guide banners in `style.css` | M3 | Explorer 1 / 3 |
| 12 | State Store & LocalStorage Extension | `currencyCategory`, `currencyTag`, `currencyWishlist`, `currencyNotes` (`nha_trang_currency_*`) | M3 | Explorer 1 |
| 13 | Currency Component Module & Router | `js/components/currency.js` + `js/app.js` `switchMainTab('currency')`, search, hero | M3 | Explorer 1 / 3 |
| 14 | Automated Test Suite (`test-currency.js`) | 12 test suites verifying schema, URLs, DOM sync, card matrices, filter simulation | Final | Explorer 1 / 2 / 3 |
| 15 | Frontend Regression Suite Update | Extend `test-frontend.js` for currency tab DOM IDs and CSS classes | Final | Explorer 1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Verified Real-World Dataset | `currency-data.js` (17 verified spots, 28 fields, 5 travel card matrices, tips) | none | DONE |
| M2 | SPA Markup & Calculator UI | `index.html` (tab, nav, chips, calculator widget, guide cards, grid, modal) | M1 | DONE |
| M3 | State Store, Logic & Styling | `js/store/state.js`, `js/components/currency.js`, `js/app.js`, `style.css` | M1, M2 | DONE |
| Final | 100% Verification, Audit & Hardening | `test-currency.js` & `test-frontend.js` 100% pass + Forensic Audit | M1, M2, M3 | DONE |

## Interface Contracts
### `currency-data.js` ↔ `js/components/currency.js` & `js/app.js`
- `window.NHA_TRANG_CURRENCY`: Array of 17 `NhaTrangCurrencySpot` objects.
- `window.NHA_TRANG_TRAVEL_CARDS`: Array of 5 Korean travel card spec objects.
- `window.NHA_TRANG_ATM_TIPS`: Array of practical guidelines (DCC, PIN, card ejection, 100 USD bill).
- Each `NhaTrangCurrencySpot` object contains: `id`, `name`, `nameKo`, `nameVi`, `nameEn`, `category`, `categoryLabel`, `badge`, `rating`, `reviewCount`, `openHours`, `location`, `addressVi`, `phone`, `googleMapQuery`, `googleMapUrl`, `googlePhotosUrl`, `district`, `districtLabel`, `supportedCurrencies`, `supportedCards`, `feeFree`, `feePolicy`, `withdrawalLimit`, `exchangePerks`, `facilities`, `tags`, `highlight`, `description`, `localTip`, `coverImage`, `images`.

### `js/store/state.js` ↔ `js/components/currency.js` & `js/app.js`
- `state.currencyCategory`: string ('all' | category slug)
- `state.currencyTag`: string ('all' | tag key)
- `state.currencyWishlist`: string[] (array of IDs from `nha_trang_currency_wishlist`)
- `state.currencyNotes`: Record<string, string> (id -> note from `nha_trang_currency_notes`)
- `state.activeModalCurrency`: object | null

### `js/components/currency.js` Exports
- `renderCurrency()`: void (renders cards into `#currencyCardsGridContainer`)
- `openCurrencyModal(spot)`: void (populates `#currencyModal` and adds `.active`)
- `closeCurrencyModal()`: void (removes `.active` from `#currencyModal`)
- `toggleCurrencyWishlist(id)`: void (toggles item in wishlist, updates badge & storage)
- `getFilteredCurrency()`: Array<NhaTrangCurrencySpot> (returns filtered & sorted list)
- `initCurrencyCalculator()`: void (binds bidirectional calculation and preset pills)

## Code Layout
```
./
├── data.js                     # Activities & Schedule dataset (43 places)
├── gourmet-data.js             # Gourmet dataset (113 places)
├── stays-data.js               # Stays dataset (24 places)
├── shopping-data.js            # Shopping dataset (18 places)
├── currency-data.js            # [M1] Currency & ATM dataset (17 places)
├── index.html                  # [M2] Main SPA markup, calculator widget & currency modal
├── style.css                   # [M3] Airbnb design styles & currency components
├── js/
│   ├── app.js                  # [M3] Main router & tab switcher
│   ├── store/
│   │   └── state.js            # [M3] Reactive state store
│   ├── utils/
│   │   └── dom.js              # DOM and storage helpers
│   └── components/
│       ├── activity.js         # Activities component
│       ├── gourmet.js          # Gourmet component
│       ├── stay.js             # Stays component
│       ├── shopping.js         # Shopping component
│       └── currency.js         # [M3] Currency & ATM component + Calculator
├── test-activity.js            # Activity test suite
├── test-gourmet.js             # Gourmet test suite
├── test-stays.js               # Stays test suite
├── test-shopping.js            # Shopping test suite
├── test-frontend.js            # [Final] Frontend integration test
└── test-currency.js            # [Final] Dedicated 12-suite currency & ATM test runner
```
