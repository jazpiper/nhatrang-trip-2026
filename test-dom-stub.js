/**
 * ============================================================================
 * Minimal DOM stub — zero dependencies, just enough to run js/app.js renderers
 * in Node so their HTML output can be snapshotted.
 * File: test-dom-stub.js
 * ============================================================================
 *
 * WHY THIS EXISTS
 * The project has no package.json and no jsdom. The renderers only touch a small
 * DOM surface (measured: getElementById, querySelectorAll, innerHTML, textContent,
 * classList, dataset, style, addEventListener, and a handful of attributes), so a
 * hand-rolled stub covers them exactly.
 *
 * USAGE ORDER MATTERS
 *   1. seed the data globals
 *   2. require('./js/app.js')      <- no `document` yet, so init() does NOT run
 *   3. installDom()                <- functions resolve `document` at call time
 *   4. call app.renderCurrency() etc. and read element.innerHTML
 *
 * Installing the stub before the require would trigger the bootstrap and bind
 * every event listener, which is not what a render snapshot wants to measure.
 * ============================================================================
 */

function makeClassList(el) {
  const set = new Set();
  return {
    add: (...names) => names.forEach(n => set.add(n)),
    remove: (...names) => names.forEach(n => set.delete(n)),
    toggle: (name, force) => {
      const on = force === undefined ? !set.has(name) : !!force;
      if (on) set.add(name); else set.delete(name);
      return on;
    },
    contains: name => set.has(name),
    get _names() { return [...set]; }
  };
}

function makeElement(tag = 'div', id = '') {
  const el = {
    tagName: String(tag).toUpperCase(),
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    src: '',
    alt: '',
    href: '',
    title: '',
    placeholder: '',
    className: '',
    hidden: false,
    disabled: false,
    checked: false,
    dataset: {},
    style: {},
    children: [],
    // Renderers call these right after assigning innerHTML in order to bind
    // click handlers. Returning an empty list is intentional: the snapshot is
    // about markup, and binding is covered by the browser check instead.
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: child => { el.children.push(child); return child; },
    removeChild: child => { el.children = el.children.filter(c => c !== child); return child; },
    remove: () => {},
    closest: () => null,
    matches: () => false,
    focus: () => {},
    select: () => {},
    scrollIntoView: () => {},
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }),
    setAttribute: (k, v) => { el[k] = v; },
    getAttribute: k => (k in el ? el[k] : null)
  };
  el.classList = makeClassList(el);
  return el;
}

/**
 * Installs a fake `document` (and `window`) on globalThis.
 * Returns a handle for reading back what the renderers produced.
 */
function installDom() {
  const byId = new Map();

  const doc = {
    readyState: 'complete',
    body: makeElement('body'),
    documentElement: makeElement('html'),
    getElementById(id) {
      if (!byId.has(id)) byId.set(id, makeElement('div', id));
      return byId.get(id);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: tag => makeElement(tag),
    addEventListener: () => {},
    removeEventListener: () => {},
    execCommand: () => true,
    dispatchEvent: () => true
  };

  const win = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    scrollTo: () => {},
    scrollBy: () => {}
  };

  globalThis.document = doc;
  globalThis.window = win;
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) { this.type = type; Object.assign(this, init || {}); }
  };
  globalThis.Event = globalThis.CustomEvent;
  globalThis.navigator = { clipboard: null };

  return {
    doc,
    /** HTML currently held by an element id (''-safe). */
    html(id) { return doc.getElementById(id).innerHTML; },
    /** textContent currently held by an element id. */
    text(id) { return doc.getElementById(id).textContent; },
    /** Every id the code has touched so far. */
    touchedIds() { return [...byId.keys()].sort(); },
    reset() { byId.clear(); }
  };
}

function uninstallDom() {
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.CustomEvent;
  delete globalThis.Event;
  delete globalThis.navigator;
}

module.exports = { installDom, uninstallDom, makeElement };
