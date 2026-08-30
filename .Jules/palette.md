# Palette's Journal - UX & Accessibility Learnings

## 2025-05-10 - Dynamic ARIA States on Shared Toolbar Controls
**Learning:** In single-page app interfaces with multi-domain tabs, shared controls like search input and toggle buttons need explicit dynamic `aria-label` and `aria-pressed` state updates during tab switches, not just static markup.
**Action:** Always update ARIA attributes programmatically whenever toggle state or active domain scope changes.
