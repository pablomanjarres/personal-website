import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/site/motion.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
} }).outputText;

class Element {
  constructor(tag = "div", top = 1000, reveal) {
    this.tag = tag; this.top = top; this.children = []; this.attributes = new Map(); this.listeners = new Map();
    this.style = { setProperty() {} };
    if (reveal) this.setAttribute("data-reveal", reveal);
  }
  append(child) { this.children.push(child); child.parentElement = this; }
  remove(child) { this.children = this.children.filter(item => item !== child); child.parentElement = null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  hasAttribute(name) { return this.attributes.has(name); }
  matches(selector) { return selector === "[data-reveal]" && this.hasAttribute("data-reveal"); }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) ?? null; }
  contains(target) { return this === target || this.children.some(child => child.contains(target)); }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) {
    if (selector === "main section") return this.children.find(child => child.tag === "main")?.children.find(child => child.tag === "section") ?? null;
    return this.querySelectorAll(selector)[0] ?? null;
  }
  getBoundingClientRect() { return { top: this.top, height: 600 }; }
  addEventListener(name, handler) { this.listeners.set(name, handler); }
  removeEventListener(name) { this.listeners.delete(name); }
}

function mount(root, { paused = false, reduced = false, intersection = true } = {}) {
  let effect;
  const observers = { intersection: [], mutation: [] };
  const frames = new Map(), windowListeners = new Map();
  let frame = 0;
  const exports = {};
  const context = {
    exports, Element,
    require: name => {
      if (name === "react") return {
        useRef: () => ({ current: root }), useState: () => [paused, () => {}], useEffect: callback => { effect = callback; },
      };
      if (name === "react/jsx-runtime") return { jsx: (tag, props) => ({ tag, props }), jsxs: (tag, props) => ({ tag, props }) };
      if (name === "./useReducedMotion") return { useReducedMotion: () => reduced };
      if (name === "./motion.module.css") return { default: {} };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window: {
      innerHeight: 800, innerWidth: 1400, matchMedia: () => ({ matches: true }),
      addEventListener: (name, handler) => windowListeners.set(name, handler),
      removeEventListener: name => windowListeners.delete(name),
    },
    requestAnimationFrame: callback => { frames.set(++frame, callback); return frame; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: intersection ? class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); this.calls = 0; observers.intersection.push(this); }
      observe(target) { this.targets.add(target); this.calls++; }
      unobserve(target) { this.targets.delete(target); }
      disconnect() { this.targets.clear(); this.disconnected = true; }
    } : undefined,
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.mutation.push(this); }
      observe(target, options) { this.target = target; this.options = options; }
      disconnect() { this.disconnected = true; }
    },
  };
  vm.runInNewContext(code, context, { filename: "motion.tsx", timeout: 1000 });
  exports.MotionRoot({ children: null, className: "", style: {}, concept: "studio" });
  const cleanup = effect();
  return { cleanup, get intersection() { return observers.intersection.at(-1); }, get mutation() { return observers.mutation.at(-1); }, frames, windowListeners };
}

function pageWith(...reveals) {
  const root = new Element(), main = new Element("main"), hero = new Element("section", 0);
  root.append(main); main.append(hero);
  for (const reveal of reveals) main.append(reveal);
  return { root, main };
}

test("New client route content registers its reveals and releases the old page", () => {
  const old = new Element("article", 1000, "media");
  const { root, main } = pageWith(old);
  const runtime = mount(root);
  assert.equal(old.hasAttribute("data-pending"), true);
  const next = new Element("article", 1200, "media"), visible = new Element("section", 100, "panel");
  const newMain = new Element("main"); newMain.append(next); newMain.append(visible);
  root.remove(main); root.append(newMain);
  runtime.mutation?.callback([{ addedNodes: [newMain, next], removedNodes: [main] }]);
  assert.equal(next.hasAttribute("data-pending"), true);
  assert.equal(visible.hasAttribute("data-revealed"), true);
  assert.equal(old.hasAttribute("data-pending"), false);
  assert.deepEqual([...runtime.intersection.targets], [next]);
  assert.equal(runtime.intersection.calls, 2, "The same added subtree must not register twice");
  runtime.cleanup();
});

test("Keyboard focus exposes every pending ancestor without waiting for intersection", () => {
  const panel = new Element("section", 1000, "panel"), media = new Element("div", 1100, "media"), link = new Element("a");
  panel.append(media); media.append(link);
  const { root } = pageWith(panel), runtime = mount(root);
  root.listeners.get("focusin")({ target: link });
  for (const element of [panel, media]) {
    assert.equal(element.hasAttribute("data-pending"), false);
    assert.equal(element.hasAttribute("data-revealed"), true);
  }
  assert.equal(runtime.intersection.targets.size, 0);
  runtime.cleanup();
});

test("Client content can remove the hero while a scroll frame is queued", () => {
  const { root, main } = pageWith(), runtime = mount(root);
  assert.ok(runtime.frames.size > 0);
  const nextMain = new Element("main");
  root.remove(main); root.append(nextMain);
  runtime.mutation?.callback([{ addedNodes: [nextMain], removedNodes: [main] }]);
  for (const [id, callback] of runtime.frames) {
    runtime.frames.delete(id);
    assert.doesNotThrow(callback);
  }
  runtime.cleanup();
});

test("Cleanup exposes pending content and removes observers, handlers, and scheduled work", () => {
  const media = new Element("article", 1000, "media");
  const { root } = pageWith(media), runtime = mount(root);
  root.listeners.get("pointermove")({ pointerType: "mouse", clientX: 100, clientY: 200 });
  assert.ok(runtime.frames.size > 0);
  runtime.cleanup();
  assert.equal(media.hasAttribute("data-pending"), false);
  assert.equal(runtime.intersection.disconnected, true);
  assert.equal(runtime.mutation.disconnected, true);
  assert.equal(root.listeners.size, 0);
  assert.equal(runtime.windowListeners.size, 0);
  assert.equal(runtime.frames.size, 0);
});

test("Paused, reduced-motion, and unsupported intersection states never hide content", () => {
  for (const options of [{ paused: true }, { reduced: true }, { intersection: false }]) {
    const media = new Element("article", 1000, "media");
    const { root } = pageWith(media), runtime = mount(root, options);
    assert.equal(media.hasAttribute("data-pending"), false);
    if (runtime.cleanup) runtime.cleanup();
    assert.equal(root.listeners.size, 0);
  }
});

test("Intersection reveals a target once and releases its observation", () => {
  const media = new Element("article", 1000, "media");
  const { root } = pageWith(media), runtime = mount(root);
  runtime.intersection.callback([{ target: media, isIntersecting: true }]);
  assert.equal(media.hasAttribute("data-revealed"), true);
  assert.equal(media.hasAttribute("data-pending"), false);
  assert.equal(runtime.intersection.targets.size, 0);
  runtime.cleanup();
});
