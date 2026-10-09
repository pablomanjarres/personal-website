import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function loadDataModule(path, cache = new Map()) {
  const file = resolve(root, path);
  assert.ok(
    file.startsWith(`${root}${sep}`),
    "Data import leaves the repository",
  );
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  if (file.endsWith(".json")) {
    exports.default = JSON.parse(readFileSync(file, "utf8"));
    return exports;
  }
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(
    code,
    {
      exports,
      require: (name) => {
        if (resolve(dirname(file), name) === resolve(root, "app/ProjectLogo"))
          return { projectIdentities: {} };
        const base = name.startsWith("@/")
          ? resolve(root, name.slice(2))
          : resolve(dirname(file), name);
        const dependency = [base, `${base}.ts`, resolve(base, "index.ts")].find(
          (candidate) => existsSync(candidate),
        );
        assert.ok(dependency, `Unresolved data dependency: ${name}`);
        return loadDataModule(dependency, cache);
      },
    },
    { filename: file, timeout: 1000 },
  );
  return exports;
}

export function loadProjects() {
  return Array.from(loadDataModule("app/projects.ts").projects);
}
