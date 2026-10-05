import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, process.env.NEXT_OUTPUT_DIR ?? ".next", "server/app");
const publicRoot = resolve(root, "public");
const origin = "https://pablomanjarres.com";
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39|#x([\da-f]+)|#(\d+));/gi, (entity, hex, decimal) =>
  hex || decimal ? String.fromCodePoint(parseInt(hex ?? decimal, hex ? 16 : 10)) : ({ "&amp;": "&", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">" })[entity.toLowerCase()]);
const normalize = value => decode(value).replace(/\bserves as\b/g, "is").replace(/<!--[^]*?-->/g, "").replace(/<[^>]+>/g, " ").normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const htmlFor = path => readFileSync(resolve(output, `${path === "/" ? "index" : path.slice(1)}.html`), "utf8").replace(/<script\b[^>]*>[^]*?<\/script>/gi, "").replace(/<style\b[^>]*>[^]*?<\/style>/gi, "");
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)=("|')(.*?)\2/g)].map(([, key, , value]) => [key, decode(value)])));
const links = html => tags(html, "a").map(tag => tag.href).filter(Boolean);
const contains = (html, value, label = value) => assert.ok(normalize(html).includes(normalize(value)), `Missing ${label}`);
const h1 = html => normalize(html.match(/<h1\b[^>]*>([^]*?)<\/h1>/i)?.[1] ?? "");
function registry() {
  const source = readFileSync(resolve(root, "app/projects.ts"), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => {
    assert.equal(name, "./ProjectLogo");
    return { projectIdentities: {} };
  } }, { filename: "projects.ts", timeout: 1000 });
  return Array.from(exports.projects);
}
const projects = registry();
const featured = ["anki", "construcredit", "cortex"];
const projectPath = slug => `/portfolio/projects/${slug}`;
function canonical(html, path) {
  const href = tags(html, "link").find(tag => tag.rel === "canonical")?.href;
  const og = tags(html, "meta").find(tag => tag.property === "og:url")?.content;
  assert.ok(href, `${path}: missing canonical`); assert.ok(og, `${path}: missing Open Graph URL`);
  assert.equal(new URL(href, origin).href, new URL(path, origin).href);
  assert.equal(new URL(og, origin).href, new URL(path, origin).href);
  const title = decode(html.match(/<title>([^]*?)<\/title>/i)?.[1] ?? "");
  assert.ok(title.includes("Pablo Manjarres"), `${path}: missing site title`);
  assert.equal(tags(html, "meta").find(tag => tag.property === "og:title")?.content, title);
  assert.equal(tags(html, "meta").find(tag => tag.name === "twitter:title")?.content, title);
  assert.ok(!tags(html, "meta").some(tag => tag.name === "robots" && /noindex/.test(tag.content)));
}
function realNavigation(html) {
  assert.ok(!links(html).some(href => href.startsWith("/mockups")), "Production navigation points into mockups");
  assert.ok(!/next project/i.test(normalize(html)), "Removed Next project section returned");
}
function imagePath(src) {
  const url = new URL(src, origin);
  return decodeURIComponent(url.pathname === "/_next/image" ? new URL(url.searchParams.get("url"), origin).pathname : url.pathname);
}
function localImages(html, path) {
  const images = tags(html, "img");
  for (const image of images) {
    let url = new URL(image.src, origin);
    if (url.pathname === "/_next/image") url = new URL(url.searchParams.get("url"), origin);
    if (url.origin !== origin || url.pathname.startsWith("/_next/static/")) continue;
    const file = resolve(publicRoot, `.${decodeURIComponent(url.pathname)}`);
    assert.ok(file.startsWith(`${publicRoot}${sep}`) && existsSync(file), `${path}: missing image ${url.pathname}`);
  }
}

test("Production routes have no transitive dependency on design explorations", () => {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const queue = ["app/layout.tsx", "app/page.tsx", "app/portfolio/page.tsx", "app/portfolio/projects/[slug]/page.tsx", "app/portfolio/[slug]/demo/page.tsx"].map(file => resolve(root, file));
  const visited = new Set();
  while (queue.length) {
    const file = queue.pop();
    if (visited.has(file)) continue;
    visited.add(file);
    assert.ok(!relative(root, file).startsWith(`app${sep}mockups${sep}`), `Production imports ${relative(root, file)}`);
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = node => {
      const specifier = (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ? node.moduleSpecifier : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword ? node.arguments[0] : undefined;
      if (specifier && ts.isStringLiteral(specifier)) {
        const resolved = ts.resolveModuleName(specifier.text, file, options, ts.sys).resolvedModule;
        if (resolved && !resolved.isExternalLibraryImport && /\.[cm]?tsx?$/.test(resolved.resolvedFileName)) queue.push(resolved.resolvedFileName);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  assert.ok(visited.size > 10, "Dependency graph did not inspect the production components");
});

test("Open Studio is the real homepage with the approved selected work", () => {
  const html = htmlFor("/");
  assert.equal(h1(html), "Ideas taking shape");
  assert.deepEqual([...html.matchAll(/<article\b[^>]*data-product="([^"]+)"/g)].map(match => match[1]), featured);
  for (const slug of featured) {
    assert.ok(links(html).includes(projectPath(slug)), `Missing selected project ${slug}`);
    contains(html, projects.find(project => project.slug === slug).oneLiner);
  }
  for (const href of ["#work", "#about", "#contact", "/portfolio"]) assert.ok(links(html).includes(href));
  contains(html, "Software Engineer"); contains(html, "Product Designer"); contains(html, "Founder");
  assert.ok(tags(html, "img").some(image => image.src.includes("forest.webp")), "Approved jacket portrait is missing");
  canonical(html, "/"); realNavigation(html); localImages(html, "/");
});

test("ConstruCredit receives the same lead presentation as Anki in selected projects", () => {
  const html = htmlFor("/portfolio");
  const selected = [...html.matchAll(/<article\b([^>]*)>([^]*?)<\/article>/g)]
    .filter(([, , body]) => featured.some(slug => links(body).includes(projectPath(slug))));
  for (const slug of ["anki", "construcredit"]) {
    const article = selected.find(([, , body]) => links(body).includes(projectPath(slug)));
    assert.ok(article, `${slug}: missing selected project`);
    assert.match(article[1], /leadProject/, `${slug}: missing the full-width lead treatment`);
  }
});

test("Business case studies pair device presentations with readable interface views", () => {
  for (const [slug, screens] of [
    ["construcredit", ["client-portfolio", "collections"]],
    ["cortex", ["home-focus", "student-overview"]],
  ]) {
    const html = htmlFor(projectPath(slug));
    const section = html.match(/<section\b[^>]*aria-labelledby="workbench-interfaces"[^>]*>([^]*?)<\/section>/)?.[1];
    assert.ok(section, `${slug}: missing a readable interface section`);
    contains(section, "Inside the product.");
    for (const screen of screens) {
      const src = `/portfolio/interfaces/${slug}-${screen}.webp`;
      const image = tags(section, "img").find(image => imagePath(image.src) === src);
      assert.ok(image, `${slug}: missing ${screen} native interface capture`);
      assert.ok(Number(image.width) >= 1600 && Number(image.height) >= 1000);
      assert.ok(image.alt && image.alt !== `${slug}: project preview`);
      assert.ok(image.sizes, `${slug}: missing responsive delivery sizes`);
      assert.ok(links(section).includes(src), `${slug}: no full-size inspection link`);
      assert.ok(existsSync(resolve(publicRoot, `.${src}`)), `${slug}: missing screen file`);
    }
    assert.ok(html.indexOf('aria-label="Project context"') < html.indexOf('aria-labelledby="workbench-interfaces"'), `${slug}: interface views must follow project context`);
    assert.ok(!tags(section, "img").some(image => imagePath(image.src).includes("/presentations/")), `${slug}: device compositions must not stand in for readable screens`);
  }
  for (const slug of ["anki", "alfred"]) {
    assert.ok(!htmlFor(projectPath(slug)).includes('aria-labelledby="workbench-interfaces"'), `${slug}: unrelated media must not be labeled as verified interface views`);
  }
});

test("Selected product presentations reach public and saved routes while live demos remain available", () => {
  const presentations = [
    { slug: "anki", src: "/portfolio/presentations/anki-paired.webp", width: 4000, height: 3000, alt: "Anki home and calculus review screens in two iPhones on stone" },
    { slug: "cortex", src: "/portfolio/presentations/cortex-dashboard.webp", width: 4500, height: 3000, alt: "Cortex daily dashboard on a laptop resting on a green chair" },
    { slug: "construcredit", src: "/portfolio/presentations/construcredit-workspace.webp", width: 4000, height: 3000, alt: "ConstruCredit client portfolio on a laptop beside its mobile administration view" },
  ];
  const concepts = ["signal", "open-studio", "blueprint", "after-hours", "green-room", "soft-focus"];
  const directions = ["playground", "workbench", "atlas", "cinema", "gallery", "stack"];
  for (const presentation of presentations) {
    const paths = ["/", "/portfolio", projectPath(presentation.slug), ...concepts.map(concept => `/mockups/${concept}`), ...directions.flatMap(direction => [`/mockups/projects/${direction}`, `/mockups/projects/${direction}/${presentation.slug}`])];
    for (const path of paths) {
      const image = tags(htmlFor(path), "img").find(image => imagePath(image.src) === presentation.src && image.alt === presentation.alt);
      assert.ok(image, `${path}: missing accessible presentation for ${presentation.slug}`);
      assert.equal(Number(image.width), presentation.width, `${path}: incorrect intrinsic width`);
      assert.equal(Number(image.height), presentation.height, `${path}: incorrect intrinsic height`);
    }
    const archiveArticle = [...htmlFor("/portfolio").matchAll(/<article\b[^>]*>([^]*?)<\/article>/g)].map(match => match[1]).find(article => links(article).includes(projectPath(presentation.slug)));
    assert.ok(archiveArticle, `${presentation.slug}: missing archive presentation card`);
    assert.equal(imagePath(tags(archiveArticle, "img")[0].src), presentation.src, `${presentation.slug}: archive leads with the wrong visual`);
    const detail = htmlFor(projectPath(presentation.slug));
    assert.equal(imagePath(tags(detail, "img")[0].src), presentation.src, `${presentation.slug}: presentation is not the lead visual`);
    for (const [attribute, value] of [["property", "og:image"], ["name", "twitter:image"]]) {
      const image = tags(detail, "meta").find(tag => tag[attribute] === value)?.content;
      assert.ok(image, `${presentation.slug}: missing ${value}`);
      assert.equal(imagePath(image), presentation.src);
      const optimized = new URL(image, origin);
      assert.equal(optimized.pathname, "/_next/image");
      assert.equal(optimized.searchParams.get("url"), presentation.src);
      assert.equal(optimized.searchParams.get("w"), "1200");
      assert.equal(optimized.searchParams.get("q"), "75");
      assert.ok(existsSync(resolve(publicRoot, `.${imagePath(image)}`)), `${presentation.slug}: missing social image file`);
    }
    assert.equal(tags(detail, "meta").find(tag => tag.property === "og:image:alt")?.content, presentation.alt);
    assert.equal(Number(tags(detail, "meta").find(tag => tag.property === "og:image:width")?.content), 1200);
    assert.equal(Number(tags(detail, "meta").find(tag => tag.property === "og:image:height")?.content), Math.round(1200 * presentation.height / presentation.width));
  }
  const review = tags(htmlFor(projectPath("anki")), "img").find(image => imagePath(image.src) === "/portfolio/presentations/anki-review.webp");
  assert.ok(review, "Anki detail lost its supporting review presentation");
  assert.equal(review.alt, "Anki calculus review with a tangent graph on an angled iPhone");
  assert.equal(Number(review.width), 4000); assert.equal(Number(review.height), 3000);
  for (const supporting of [
    { slug: "cortex", src: "/portfolio/presentations/cortex-study.webp", width: 4000, height: 3000, alt: "Cortex student workspace on a laptop beside its mobile finance view" },
    { slug: "construcredit", src: "/portfolio/presentations/construcredit-dashboard.webp", width: 4500, height: 3000, alt: "ConstruCredit loan dashboard on a laptop resting on a green chair" },
  ]) {
    for (const path of [projectPath(supporting.slug), ...["gallery", "cinema", "stack", "workbench"].map(direction => `/mockups/projects/${direction}/${supporting.slug}`)]) {
      const images = tags(htmlFor(path), "img");
      const image = images.find(image => imagePath(image.src) === supporting.src);
      assert.ok(image, `${path}: missing supporting presentation`);
      assert.equal(image.alt, supporting.alt);
      assert.equal(Number(image.width), supporting.width); assert.equal(Number(image.height), supporting.height);
      assert.ok(!images.some(image => imagePath(image.src) === projects.find(project => project.slug === supporting.slug).cover), `${path}: obsolete screenshot is displayed`);
    }
  }
  const cortex = htmlFor(projectPath("cortex"));
  const launcher = cortex.match(/<button\b[^>]*aria-label="Run the live Cortex demo"[^>]*>([^]*?)<\/button>/)?.[1];
  assert.ok(launcher, "Cortex lost its real demo launcher");
  assert.equal(imagePath(tags(launcher, "img")[0].src), "/portfolio/presentations/cortex-dashboard.webp");
  assert.ok(links(cortex).includes("/portfolio/cortex/demo"), "Cortex lost its full-screen demo link");
  assert.equal(tags(htmlFor("/portfolio/cortex/demo"), "iframe")[0]?.src, projects.find(project => project.slug === "cortex").embedUrl);
});

test("The production archive reaches every registered project", () => {
  const html = htmlFor("/portfolio");
  assert.equal(projects.length, 20);
  for (const project of projects) assert.ok(links(html).includes(projectPath(project.slug)), `Unreachable ${project.slug}`);
  canonical(html, "/portfolio"); realNavigation(html); localImages(html, "/portfolio");
});

for (const project of projects) test(`Canonical project preserves facts: ${project.slug}`, () => {
  const path = projectPath(project.slug);
  const html = htmlFor(path);
  assert.equal(h1(html), normalize(project.title));
  canonical(html, path); realNavigation(html); localImages(html, path);
  for (const value of [project.year, ...project.stack, ...project.tags, ...project.summary.split(/\n{2,}/), project.problem, ...project.highlights]) contains(html, value, `${project.slug}: ${value.slice(0, 70)}`);
  const role = project.role.replace("Solo · design + engineering", "Product design and engineering").replace("Sole developer · client work", "Sole developer, client work");
  contains(html, role); contains(html, project.status === "wip" ? "in progress" : project.status);
  for (const metric of project.metrics ?? []) {
    const quantity = metric.match(/^([<>~+]?\d[\d,.]*(?:\+|%|-bit)?(?: months?)?)\s+(.+)$/);
    for (const value of quantity ? quantity.slice(1) : [metric]) contains(html, value);
  }
  for (const part of project.subProjects ?? []) for (const value of [part.name, part.kind, part.oneLiner]) contains(html, value);
  for (const link of project.links) assert.ok(links(html).includes(link.url), `Lost ${project.slug} link: ${link.url}`);
  assert.ok(links(html).includes("/portfolio"));
});

test("All six saved homepage and project directions stay accessible", () => {
  const concepts = ["signal", "open-studio", "blueprint", "after-hours", "green-room", "soft-focus"];
  const directions = ["playground", "workbench", "atlas", "cinema", "gallery", "stack"];
  for (let index = 0; index < concepts.length; index++) {
    const homePath = `/mockups/${concepts[index]}`;
    const home = htmlFor(homePath);
    assert.ok(h1(home), `${homePath}: no hero`);
    assert.ok(links(home).includes("/mockups"));
    for (const slug of featured) assert.ok(links(home).includes(`/mockups/projects/${directions[index]}/${slug}`));
    localImages(home, homePath);
    const indexPath = `/mockups/projects/${directions[index]}`;
    const archive = htmlFor(indexPath);
    localImages(archive, indexPath);
    for (const project of projects) {
      const path = `${indexPath}/${project.slug}`;
      assert.ok(links(archive).includes(path), `${indexPath}: missing ${project.slug}`);
      const detail = htmlFor(path);
      assert.equal(h1(detail), normalize(project.title));
      assert.ok(!/next project/i.test(normalize(detail)));
      localImages(detail, path);
    }
  }
});
