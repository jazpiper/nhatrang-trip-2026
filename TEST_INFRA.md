# E2E Test Infra: Nha Trang Trip 2026 - Accommodations (숙소) Tab

## Test Philosophy
- Opaque-box, requirement-driven, zero-hallucination verification.
- Validates data integrity, link correctness, UI interactions, and responsive design.

## Feature Inventory & Test Coverage
| # | Feature | Requirement | Tier 1 (Unit/Data) | Tier 2 (Boundary/Edge) | Tier 3 (Integration) | Tier 4 (Scenario/E2E) |
|---|---------|-------------|:------------------:|:----------------------:|:--------------------:|:---------------------:|
| 1 | Stays Tab Navigation | ORIGINAL_REQUEST §R3 | Tab switch event | Quick multi-click | Tab state persist | Full user journey |
| 2 | 4-Theme Stays Dataset | ORIGINAL_REQUEST §R1 | Count >= 16 | Missing fields test | Theme distribution | Theme filter rendering |
| 3 | Real-Data Verification | ORIGINAL_REQUEST §R2 | Rating/Review type | Min/Max range checks | URL encoded check | Live link checks |
| 4 | Theme Filter Toolbar | ORIGINAL_REQUEST §R3 | Filter match test | Empty result handling | Filter + Search combo | Filter switch animation |
| 5 | Search & Sort Controls | ORIGINAL_REQUEST §R3 | Name/tag search | Special chars / empty | Search + Sort + Filter | Realtime debounce search |
| 6 | Stay Card Component | ORIGINAL_REQUEST §R3 | Card DOM elements | Long text overflow | Exchange rate sync | Currency change live update |
| 7 | Stay Detail Modal | ORIGINAL_REQUEST §R3 | Modal open/close | ESC / Backdrop click | Copy address to clipboard | Full gallery browsing |
| 8 | LocalStorage Sync | ORIGINAL_REQUEST §R3 | Wishlist/Notes save | Corrupted storage handling | Tab switch note sync | Reload state preservation |

## Test Architecture
- **Validation Script**: `test-stays.js` executed via Node.js:
  - Validates `stays-data.js` structure, types, non-null values, Google Maps URL formatting, Trip.com URL formatting, image URLs.
- **Frontend Verifiers**:
  - Reviewer & Challenger subagents test DOM elements, event listeners, localStorage operations, and CSS responsive breakpoints.
