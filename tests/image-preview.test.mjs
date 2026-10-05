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
    const media = StudyMedia({ asset: { ...asset, kind } });
    assert.equal(media.tag, StudyImagePreview, `${kind} images do not enable automatic enlargement`);
    const image = media.props.imageProps;
    assert.ok(image, "Image configuration must cross the client boundary as plain data");
    assert.equal(media.props.children, undefined, "The client must not inspect a server-rendered image element");
    assert.equal(image.src, asset.src);
    assert.equal(image.alt, asset.alt);
    assert.equal(image.width, 4000);
    assert.equal(image.height, 3000);
    assert.equal(JSON.parse(JSON.stringify(image)).sizes, image.sizes);
    assert.equal(media.props.caption?.tag, "figcaption", "The caption must be separate from the zoomable image");
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

function mount({ linked = false, fine = true, paused = false, mediaAsset = asset, inlineWidth = 320 } = {}) {
  const origin = new Element(), focusTarget = linked ? new Element() : origin;
  const frame = new Element();
  const frameStyles = new Map();
  frame.style = { setProperty: (name, value) => frameStyles.set(name, value), getPropertyValue: name => frameStyles.get(name) ?? "" };
  let inlineHeight = inlineWidth * mediaAsset.height / mediaAsset.width, visualScale = 1;
  Object.defineProperties(frame, {
    clientWidth: { get: () => Math.round(inlineWidth) },
    clientHeight: { get: () => Math.round(inlineHeight) },
  });
  frame.getBoundingClientRect = () => ({ left: 100, top: 200, width: inlineWidth * visualScale, height: inlineHeight * visualScale });
  const image = new Element();
  image.getBoundingClientRect = frame.getBoundingClientRect;
  origin.querySelector = selector => selector === "img" ? image : null;
  frame.querySelector = origin.querySelector;
  origin.parentElement = { closest: () => linked ? focusTarget : null };
  origin.closest = () => ({ getAttribute: () => paused ? "paused" : "active" });
  const window = new Element(), media = new Element(); media.matches = fine;
  window.innerWidth = 1280; window.innerHeight = 720;
  window.matchMedia = () => media;
  const body = {}, effects = [];
  const observers = [];
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(target) { this.targets.add(target); }
    disconnect() { this.targets.clear(); }
    notify() { if (this.targets.has(frame)) this.callback([{ target: frame, contentRect: { width: inlineWidth, height: inlineHeight } }]); }
  }
  let state = null, effectIndex = 0, refIndex = 0, output;
  const { StudyImagePreview } = load("image-preview.tsx", {
    "next/image": { default: "img" },
    "react-dom": { createPortal: (child, container) => ({ portal: true, child, container }) },
    "react": {
      useRef: () => ({ current: refIndex++ === 0 ? origin : frame }), useState: () => [state, next => { state = next; }],
      useEffect: (callback, dependencies) => {
        const index = effectIndex++, previous = effects[index];
        if (previous && dependencies.every((value, i) => value === previous.dependencies[i])) return;
        previous?.cleanup?.(); effects[index] = { callback, dependencies };
      },
    },
    "@/app/site/theme": { workbenchTheme: { paper: "#fafaf7", ink: "#292b2d" } },
    "@/app/site/interaction.module.css": { default: { action: "action" } },
    "./image-preview.module.css": { default: { frame: "frame" } },
  }, { window, ResizeObserver, document: { body }, getComputedStyle: () => ({ borderRadius: "24px" }) });
  function render() {
    effectIndex = 0; refIndex = 0;
    output = StudyImagePreview({ asset: mediaAsset, imageProps: JSON.parse(JSON.stringify({ src: mediaAsset.src, alt: mediaAsset.alt, width: mediaAsset.width, height: mediaAsset.height, sizes: "(max-width: 700px) 88vw, 24vw", preload: false, style: { width: "100%", height: "auto" } })), caption: jsx("figcaption", { children: mediaAsset.label }), className: "media", style: { aspectRatio: "4 / 3" } });
    for (const effect of effects) if (effect.callback) { effect.cleanup = effect.callback(); effect.callback = null; }
    return output;
  }
  render();
  return { origin, frame, focusTarget, window, media, body, render, observers, notifyFrameResize: () => observers.forEach(observer => observer.notify()), setImageWidth: value => { inlineWidth = value; inlineHeight = value * mediaAsset.height / mediaAsset.width; },
    setImageHeight: value => { inlineHeight = value; }, setVisualScale: value => { visualScale = value; },
    get preview() { return [render().props.children].flat().find(child => child?.tag === "div" && child.props["data-zoomed"]); },
    get image() { return imageProps(render()); },
    cleanup() { for (const effect of effects) effect.cleanup?.(); },
  };
}

test("Pointer hover magnifies the existing image in place and leaving resets it without changing its link or caption", () => {
  const runtime = mount({ linked: true });
  assert.equal(runtime.preview, undefined);
  assert.equal(runtime.origin.getAttribute("tabindex"), null, "A linked image must not add another tab stop");
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse", clientX: 180, clientY: 260 });
  const preview = runtime.preview;
  assert.ok(preview, "Hover did not automatically zoom the inline image");
  assert.equal(preview.props.children.props.src, asset.src);
  assert.equal(preview.props.children.props.alt, asset.alt);
  assert.equal(runtime.render().props.children.filter(child => child?.portal).length, 0, "Zoom must not add a viewport overlay");
  assert.equal(runtime.render().props.children[1].tag, "figcaption", "The caption stays outside the clipped frame");
  assert.equal(runtime.frame.style.getPropertyValue("--zoom-x"), "25%");
  assert.equal(runtime.frame.style.getPropertyValue("--zoom-y"), "25%");
  runtime.frame.dispatch("pointermove", { pointerType: "mouse", clientX: 340, clientY: 380 });
  assert.equal(runtime.frame.style.getPropertyValue("--zoom-x"), "75%");
  assert.equal(runtime.frame.style.getPropertyValue("--zoom-y"), "75%");
  assert.equal(runtime.frame.style.borderRadius, "24px", "The clip must keep the original rounded image corners");
  assert.equal(runtime.render().props.onClick, undefined, "Image links keep their click behavior");
  runtime.frame.dispatch("pointerleave");
  assert.equal(runtime.preview, undefined);
  runtime.origin.dispatch("pointerenter", { pointerType: "mouse" });
  assert.equal(runtime.preview, undefined, "Hovering the figure or caption must not activate zoom");
  runtime.cleanup();
  assert.equal(runtime.origin.listeners.size, 0);
  assert.equal(runtime.frame.listeners.size, 0);
  assert.equal(runtime.focusTarget.listeners.size, 0);
});

test("The same image requests more detail only while magnified and preserves caller sizes when ordinary or disabled", () => {
  const runtime = mount();
  const sizes = runtime.image.sizes;
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse", clientX: 260, clientY: 320 });
  const scale = runtime.preview.props.style["--zoom-scale"];
  assert.ok(scale > 1, "The inline zoom must magnify the image");
  assert.equal(Number.parseFloat(runtime.image.sizes), 320 * scale);
  assert.equal(runtime.image.src, asset.src);
  assert.equal(runtime.image.style.width, "100%");
  runtime.frame.dispatch("pointerleave");
  assert.equal(runtime.image.sizes, sizes);
  runtime.cleanup();
  for (const props of [{ fine: false }, { inlineWidth: 1000 }]) {
    const disabled = mount(props);
    disabled.frame.dispatch("pointerenter", { pointerType: "mouse" });
    assert.equal(disabled.image.sizes, sizes);
    disabled.cleanup();
  }
});

test("Only small images enlarge on hover or focus; full-width images keep their links without another tab stop", () => {
  for (const linked of [false, true]) {
    for (const inlineWidth of [320, 1000]) {
      const runtime = mount({ linked, inlineWidth });
      const eligible = inlineWidth === 320;
      assert.equal(runtime.origin.getAttribute("data-zoomable"), String(eligible), "Consumers must share the same eligibility state");
      assert.equal(runtime.origin.getAttribute("tabindex"), linked ? null : eligible ? "0" : "-1");
      runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
      assert.equal(Boolean(runtime.preview), eligible, "Full-width images must remain ordinary");
      runtime.frame.dispatch("pointerleave");
      runtime.focusTarget.dispatch("focusin");
      assert.equal(Boolean(runtime.preview), eligible, "Keyboard previews must follow the same enlargement rule");
      runtime.cleanup();
      assert.equal(runtime.origin.getAttribute("data-zoomable"), null);
    }
  }
});

test("Resize refreshes the enlargement threshold using image aspect ratio and rendered width", () => {
  const runtime = mount();
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
  assert.ok(runtime.preview);
  runtime.window.innerHeight = 300;
  runtime.window.dispatch("resize");
  assert.equal(runtime.preview, undefined);
  assert.equal(runtime.origin.getAttribute("tabindex"), "-1");
  assert.equal(runtime.origin.getAttribute("data-zoomable"), "false");
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
  assert.equal(runtime.preview, undefined, "Less than 20% enlargement is not useful");
  runtime.window.innerHeight = 900;
  runtime.window.dispatch("resize");
  assert.equal(runtime.origin.getAttribute("tabindex"), "0");
  assert.equal(runtime.origin.getAttribute("data-zoomable"), "true");
  runtime.focusTarget.dispatch("focusin");
  assert.ok(runtime.preview);
  runtime.setImageWidth(1000);
  runtime.window.dispatch("resize");
  assert.equal(runtime.origin.getAttribute("tabindex"), "-1");
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
  assert.equal(runtime.preview, undefined, "Eligibility must use the current rendered image width");
  runtime.cleanup();
});

test("A layout change updates eligibility without a viewport resize and disconnects its frame observer", () => {
  const runtime = mount({ inlineWidth: 1000 });
  assert.equal(runtime.origin.getAttribute("data-zoomable"), "false");
  runtime.setImageWidth(303);
  runtime.notifyFrameResize();
  assert.equal(runtime.window.innerWidth, 1280);
  assert.equal(runtime.window.innerHeight, 720);
  assert.equal(runtime.origin.getAttribute("data-zoomable"), "true", "Moving into a smaller project column must enable zoom");
  assert.equal(runtime.origin.getAttribute("tabindex"), "0");
  runtime.focusTarget.dispatch("focusin");
  assert.ok(runtime.preview);
  runtime.setImageWidth(280);
  runtime.notifyFrameResize();
  assert.equal(runtime.preview, undefined, "Changing the image frame resets magnification");
  assert.equal(runtime.observers.length, 1);
  assert.ok(runtime.observers[0].targets.has(runtime.frame));
  runtime.cleanup();
  assert.equal(runtime.observers[0].targets.size, 0);
  assert.equal(runtime.origin.getAttribute("data-zoomable"), null);
  runtime.notifyFrameResize();
  assert.equal(runtime.origin.getAttribute("data-zoomable"), null, "Disconnected observers must not write after unmount");
});

test("Initial and repeated unchanged observer deliveries preserve pointer and focus zoom", () => {
  for (const source of ["pointer", "focus"]) {
    const runtime = mount();
    if (source === "pointer") runtime.frame.dispatch("pointerenter", { pointerType: "mouse", clientX: 260, clientY: 320 });
    else runtime.focusTarget.dispatch("focusin");
    assert.ok(runtime.preview);
    const sizes = runtime.image.sizes;
    for (let delivery = 0; delivery < 3; delivery++) {
      runtime.notifyFrameResize();
      assert.ok(runtime.preview, `${source} zoom must survive an unchanged observer delivery`);
      assert.equal(runtime.image.sizes, sizes, "The sharper source must not switch back during hover");
    }
    runtime.cleanup();
  }
});

test("Subpixel source rounding keeps zoom open while a real frame resize dismisses it", () => {
  const runtime = mount({ inlineWidth: 509, mediaAsset: { ...asset, width: 4500, height: 3000 } });
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse", clientX: 354, clientY: 369 });
  assert.ok(runtime.preview);
  const sizes = runtime.image.sizes;
  for (const height of [339.5833, 339.3333, 339.5833]) {
    runtime.setImageHeight(height);
    runtime.notifyFrameResize();
    assert.ok(runtime.preview, "A quarter-pixel source-ratio change must not cancel hover");
    assert.equal(runtime.image.sizes, sizes);
  }
  runtime.setImageWidth(485);
  runtime.notifyFrameResize();
  assert.equal(runtime.preview, undefined, "A real layout resize must still dismiss zoom");
  runtime.cleanup();
});

test("Ancestor transforms do not change layout-based eligibility or image resolution", () => {
  const runtime = mount({ inlineWidth: 630 });
  assert.equal(runtime.origin.getAttribute("data-zoomable"), "true");
  runtime.setVisualScale(1.025);
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse", clientX: 415, clientY: 436 });
  assert.ok(runtime.preview, "A small ancestor hover transform must not disable an eligible image");
  assert.equal(Number.parseFloat(runtime.image.sizes), 630 * 1.7);
  runtime.notifyFrameResize();
  assert.ok(runtime.preview, "Visual motion without a layout resize must preserve hover");
  runtime.cleanup();
});

test("Responsive image candidates keep the declared aspect ratio and caller sizing", () => {
  const runtime = mount({ mediaAsset: { ...asset, width: 4500, height: 3000 } });
  assert.equal(runtime.image.style.aspectRatio, "4500 / 3000", "Candidate rounding must not alter the hover frame");
  assert.equal(runtime.image.style.width, "100%");
  assert.equal(runtime.image.style.height, "auto");
  runtime.cleanup();
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

test("Focus survives the browser scroll-to-focus, then deliberate scrolling dismisses the preview", () => {
  for (const linked of [false, true]) {
    const runtime = mount({ linked });
    for (const [event, details] of [["wheel", {}], ["touchmove", {}], ["pointerdown", {}], ["keydown", { key: "PageDown" }], ["keydown", { key: " " }]]) {
      runtime.focusTarget.dispatch("focusin");
      assert.ok(runtime.preview);
      runtime.window.dispatch("scroll");
      assert.ok(runtime.preview, "The browser scroll after Tab must preserve its focus preview");
      runtime.window.dispatch(event, details);
      runtime.window.dispatch("scroll");
      assert.equal(runtime.preview, undefined, `${event} scrolling must dismiss the preview`);
      runtime.focusTarget.dispatch("focusout");
    }
    runtime.cleanup();
    assert.equal(runtime.window.listeners.size, 0);
  }
});

test("Unlinked images support keyboard preview while coarse pointers and touch avoid overlays", () => {
  const runtime = mount();
  assert.equal(runtime.origin.getAttribute("tabindex"), "0");
  runtime.frame.dispatch("pointerenter", { pointerType: "touch" });
  assert.equal(runtime.preview, undefined);
  runtime.origin.dispatch("focusin"); assert.ok(runtime.preview);
  runtime.media.matches = false; runtime.media.dispatch("change");
  assert.equal(runtime.preview, undefined);
  assert.equal(runtime.origin.getAttribute("tabindex"), "-1");
  runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
  runtime.origin.dispatch("focusin");
  assert.equal(runtime.preview, undefined);
  runtime.cleanup();
  assert.equal(runtime.origin.getAttribute("tabindex"), null);
});

test("A moving viewport dismisses the preview and preserves the page motion preference", () => {
  const runtime = mount({ paused: true });
  for (const event of ["scroll", "resize"]) {
    runtime.frame.dispatch("pointerenter", { pointerType: "mouse" });
    assert.equal(runtime.preview.props["data-motion"], "paused");
    runtime.window.dispatch(event);
    assert.equal(runtime.preview, undefined);
  }
  runtime.cleanup();
  assert.equal(runtime.window.listeners.size, 0);
});
