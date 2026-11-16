// Renders one view of a web study with Playwright and writes a PNG.
// Usage: node render.cjs <baseUrl> <specJson> <out.png>
// Playwright resolves through NODE_PATH (see README.md).
const { chromium } = require("playwright");

const [baseUrl, specJson, out] = process.argv.slice(2);
if (!baseUrl || !specJson || !out) {
  console.error("usage: node render.cjs <baseUrl> <specJson> <out.png>");
  process.exit(2);
}
const spec = JSON.parse(specJson);

async function runStep(page, step) {
  if (step.click) await page.locator(step.click).first().click();
  if (step.hover) await page.locator(step.hover).first().hover();
  if (step.fill) await page.locator(step.fill[0]).first().fill(step.fill[1]);
  if (step.press) await page.keyboard.press(step.press);
  if (step.scrollTo) await page.locator(step.scrollTo).first().scrollIntoViewIfNeeded();
  if (step.scrollY !== undefined) await page.evaluate(y => window.scrollTo(0, y), step.scrollY);
  if (step.eval) await page.evaluate(step.eval);
  await page.waitForTimeout(step.wait ?? 250);
}

(async () => {
  const [width, height] = spec.viewport ?? [1600, 991];
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: spec.scale ?? 2,
    isMobile: Boolean(spec.mobile),
    hasTouch: Boolean(spec.mobile),
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(new URL(spec.path, baseUrl).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  for (const step of spec.steps ?? []) await runStep(page, step);
  if (spec.scrollY !== undefined) {
    await page.evaluate(y => window.scrollTo(0, y), spec.scrollY);
    await page.waitForTimeout(300);
  }
  const options = { path: out, fullPage: Boolean(spec.fullPage), animations: "disabled" };
  if (spec.clip) options.clip = { x: spec.clip[0], y: spec.clip[1], width: spec.clip[2], height: spec.clip[3] };
  if (spec.element) await page.locator(spec.element).first().screenshot({ path: out, animations: "disabled" });
  else await page.screenshot(options);
  await browser.close();
})().catch(error => {
  console.error(error.message);
  process.exit(1);
});
