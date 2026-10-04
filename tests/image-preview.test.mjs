import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const jsx = (tag, props) => ({ tag, props });
const imageProps = node => !node || !node.props ? undefined : node.tag === "img" ? node.props : [node.props.children].flat().map(imageProps).find(Boolean);
const asset = { id: "workspace", kind: "presentation", src: "/workspace.webp", alt: "Desktop workspace", label: "Workspace", width: 4000, height: 3000 };
function load(file, dependencies, globals = {}) {
  const path = new URL(`../app/portfolio/studies/${file}`, import.meta.url);
  assert.ok(existsSync(path), "The shared image hover preview is missing");
  const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, ...globals, require: name => {
    if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  } }, { filename: file, timeout: 1000 });
  return exports;
}

test("StudyMedia enables previews for full images without changing videos, unavailable media, or decorative lenses", () => {
  const StudyImagePreview = () => null;
  const { StudyMedia } = load("primitives.tsx", {
    "next/image": { default: "img" }, "next/link": { default: "a" },
    "@/app/portfolio/LiveEmbed": {}, "./data": {}, "./video": {},
    "./image-preview": { StudyImagePreview }, "./primitives.module.css": { default: {} },
    "@/app/site/interaction.module.css": { default: {} },
  });
  for (const kind of ["presentation", "screen"]) {
    const media = StudyMedia({ asset: { ...asset, kind }, caption: false });
    assert.equal(media.tag, StudyImagePreview, `${kind} images do not enable automatic enlargement`);
    const image = imageProps(media);
    assert.equal(image.src, asset.src);
    assert.equal(image.alt, asset.alt);
    assert.equal(image.width, 4000);
    assert.equal(image.height, 3000);
  }
  for (const props of [{ asset, detail: true }, { asset: { ...asset, kind: "video" } }, { asset: { ...asset, kind: "unavailable", src: undefined } }]) {
    assert.equal(StudyMedia(props).tag, "figure");
  }
});

class Element {
  constructor() { this.listeners = new Map(); this.attributes = new Map(); this.focusVisible = true; }
  addEventListener(name, listener) { this.listeners.set(name, listener); }
  removeEventListener(name) { this.listeners.delete(name); }
  dispatch(name, event = {}) { this.listeners.get(name)?.(event); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  set tabIndex(value) { this.setAttribute("tabindex", String(value)); }
  matches(selector) { return selector === ":focus-visible" && this.focusVisible; }
  closest() { return null; }
}

function mount({ linked = false, fine = true, paused = false } = {}) {
  const origin = new Element(), focusTarget = linked ? new Element() : origin;
  origin.parentElement = { closest: () => linked ? focusTarget : null };
  origin.closest = () => ({ getAttribute: () => paused ? "paused" : "active" });
  const window = new Element(), media = new Element(); media.matches = fine;
  window.matchMedia = () => media;
  const body = {}, effects = [];
  let state = null, effectIndex = 0, output;
  const { StudyImagePreview } = load("image-preview.tsx", {
    "next/image": { default: "img" },
    "react-dom": { createPortal: (child, container) => ({ portal: true, child, container }) },
    "react": {
      useRef: () => ({ current: origin }), useState: () => [state, next => { state = next; }],
      useEffect: (callback, dependencies) => {
        const index = effectIndex++, previous = effects[index];
        if (previous && dependencies.every((value, i) => value === previous.dependencies[i])) return;
        previous?.cleanup?.(); effects[index] = { callback, dependencies };
      },
    },
    "@/app/site/theme": { workbenchTheme: { paper: "#fafaf7", ink: "#292b2d" } },
    "@/app/site/interaction.module.css": { default: { action: "action" } },
    "./image-preview.module.css": { default: { preview: "preview" } },
  }, { window, document: { body }, getComputedStyle: () => ({ getPropertyValue: name => ({ "--paper": "#f5f7f3", "--ink": "#183d39", "--motion-ease": "ease" })[name] ?? "" }) });
  function render() {
    effectIndex = 0;
    output = StudyImagePreview({ asset, children: jsx("img", { src: asset.src }), className: "media", style: { aspectRatio: "4 / 3" } });
    for (const effect of effects) if (effect.callback) { effect.cleanup = effect.callback(); effect.callback = null; }
    return output;
  }
  render();
  return { origin, focusTarget, window, media, body, render,
    get preview() { return render().props.children.find(child => child?.portal); },
    cleanup() { for (const effect of effects) effect.cleanup?.(); },
  };
}

test("Pointer hover opens a larger portal immediately and leaving closes it while the linked origin stays unchanged", () => {
  const runtime = mount({ linked: true });
  assert.equal(runtime.preview, undefined);
  assert.equal(runtime.origin.getAttribute("tabindex"), null, "A linked image must not add another tab stop");
  runtime.origin.dispatch("pointerenter", { pointerType: "mouse" });
  const preview = runtime.preview;
  assert.ok(preview, "Hover did not automatically open the preview");
  assert.equal(preview.container, runtime.body, "The preview must escape transformed and clipped parents");
  assert.equal(preview.child.props["aria-hidden"], true);
  assert.equal(preview.child.props.style["--paper"], "#f5f7f3");
  assert.equal(preview.child.props.children.props.src, asset.src);
  assert.equal(runtime.render().props.onClick, undefined, "Image links keep their click behavior");
  runtime.origin.dispatch("pointerleave");
  assert.equal(runtime.preview, undefined);
  runtime.cleanup();
  assert.equal(runtime.origin.listeners.size, 0);
  assert.equal(runtime.focusTarget.listeners.size, 0);
});

test("Keyboard focus uses the existing link and Escape dismisses without moving focus", () => {
  const runtime = mount({ linked: true });
  runtime.focusTarget.dispatch("focusin");
  assert.ok(runtime.preview);
  runtime.window.dispatch("keydown", { key: "Escape" });
  assert.equal(runtime.preview, undefined);
  runtime.focusTarget.dispatch("focusout"); runtime.focusTarget.dispatch("focusin");
  assert.ok(runtime.preview);
  runtime.focusTarget.dispatch("focusout");
  assert.equal(runtime.preview, undefined);
  runtime.focusTarget.focusVisible = false;
  runtime.focusTarget.dispatch("focusin");
  assert.equal(runtime.preview, undefined, "Pointer focus must not act as a click-to-open control");
  runtime.cleanup();
});

test("Unlinked images support keyboard preview while coarse pointers and touch avoid overlays", () => {
  const runtime = mount();
  assert.equal(runtime.origin.getAttribute("tabindex"), "0");
  runtime.origin.dispatch("pointerenter", { pointerType: "touch" });
  assert.equal(runtime.preview, undefined);
  runtime.origin.dispatch("focusin"); assert.ok(runtime.preview);
  runtime.media.matches = false; runtime.media.dispatch("change");
  assert.equal(runtime.preview, undefined);
  assert.equal(runtime.origin.getAttribute("tabindex"), "-1");
  runtime.origin.dispatch("pointerenter", { pointerType: "mouse" });
  runtime.origin.dispatch("focusin");
  assert.equal(runtime.preview, undefined);
  runtime.cleanup();
  assert.equal(runtime.origin.getAttribute("tabindex"), null);
});

test("A moving viewport dismisses the preview and preserves the page motion preference", () => {
  const runtime = mount({ paused: true });
  for (const event of ["scroll", "resize"]) {
    runtime.origin.dispatch("pointerenter", { pointerType: "mouse" });
    assert.equal(runtime.preview.child.props["data-motion"], "paused");
    runtime.window.dispatch(event);
    assert.equal(runtime.preview, undefined);
  }
  runtime.cleanup();
  assert.equal(runtime.window.listeners.size, 0);
});
