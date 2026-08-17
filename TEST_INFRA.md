# E2E Test Infra: Nha Trang 2026 Currency & ATM Domain

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation internals.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Matrix Testing + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---------|---------------------|:-----------------:|:-----------------:|:----------------------:|:-----------------:|
| 1 | Ground-Truth Dataset (`currency-data.js`) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Zero-Fee ATM & Card Matrix | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 3 | Operational Tips (DCC, PIN, Retention) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 4 | Header Nav & Dynamic Badge | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 5 | Category Nav & Tag Chips | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 6 | Interactive VND ↔ KRW Calculator | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 7 | Detail Modal & Google Maps Redirect | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 8 | Wishlist & Notes Storage (`nha_trang_*`) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: `test-currency.js` (Standalone Node.js TestRunner with ANSI color output).
- **Frontend Regression**: `test-frontend.js` (DOM, script ordering, CSS selectors).
- **Invocation**: `node test-currency.js && node test-frontend.js`
- **Pass/Fail Semantics**: Exit code 0 on 100% pass; non-zero on assertion failure.

## 12-Suite Test Matrix for `test-currency.js`:
1. Suite 1: File Loading & Dual Export Verification (`window.NHA_TRANG_CURRENCY` & `module.exports`).
2. Suite 2: Dataset Count (17 Places) & Category Distribution.
3. Suite 3: Unique Kebab-Case IDs (`/^[a-z0-9-]+$/`).
4. Suite 4: Schema Completeness (28 required fields non-empty).
5. Suite 5: Rating (3.0–5.0) & Review Counts (>0) Boundary Bounds.
6. Suite 6: Google Maps URL Encoding (`https://www.google.com/maps/search/?api=1&query=...`).
7. Suite 7: 5 Major Travel Cards Matrix (`supportedCards`, `feeFree`, withdrawal limits).
8. Suite 8: Operational Guidance Rules (DCC, PIN, card ejection, 100 USD bill).
9. Suite 9: DOM Element IDs & SSOT Count Badge Sync in `index.html`.
10. Suite 10: Multi-Keyword Search & Category/Tag Filtering Simulation.
11. Suite 11: Sorting Algorithms Simulation (`recommended`, `rating`, `name`).
12. Suite 12: Anti-XSS Payload Security & Injection Prevention.
