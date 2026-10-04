export function installCortexDemo(fixtures, applyWorkHoursCommand) {
  const networkFetch = window.fetch.bind(window);
  const storageKey = "cortex-public-demo-v3";
  const validKey = key => typeof key === "string" && /^cortex-[a-z0-9-]+$/.test(key) && !/credential|keychain|secret|token/.test(key);
  const localValue = (key, data) => key === "cortex-opportunities" && ["requested", "running"].includes(data?.runStatus)
    ? { ...data, runStatus: "error", runError: "Opportunity scanning is unavailable in the browser demo." } : data;
  let records = structuredClone(fixtures.records);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (saved.schema === 3 && saved.records && Object.keys(saved.records).length <= 160) {
      for (const [key, value] of Object.entries(saved.records)) if (validKey(key)) records[key] = localValue(key, value);
    }
  } catch { /* The fixture remains usable when storage is blocked. */ }
  const revisions = Object.fromEntries(Object.keys(records).map(key => [key, "1"]));
  const respond = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
  const unavailable = () => respond({ ok: false, error: "This service is unavailable in the browser demo." }, 503);
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ schema: 3, records })); } catch { /* Changes still work in memory. */ }
  };
  const save = (key, data) => {
    if (!validKey(key)) throw new Error("This record is unavailable in the browser demo.");
    if (!(key in records) && Object.keys(records).length >= 160) throw new Error("The demo has reached its record limit.");
    if (JSON.stringify(data).length > 200000) throw new Error("This record is too large for the browser demo.");
    records[key] = localValue(key, data);
    revisions[key] = String(Number(revisions[key] || 0) + 1);
    persist();
    return records[key];
  };
  window.fetch = async (input, init = {}) => {
    const request = input instanceof Request ? input : null;
    const url = new URL(request ? request.url : String(input), location.href);
    const method = (init.method || request?.method || "GET").toUpperCase();
    if (url.origin !== location.origin) return unavailable();
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith("/demos/cortex/") && !/(^|\/)api(\/|$)/.test(pathname) && ["GET", "HEAD"].includes(method)) return networkFetch(input, init);
    const read = key => validKey(key) ? records[key] ?? null : null;
    if (method === "GET" && pathname === "/api/data/keys") return respond(Object.keys(records));
    if (method === "GET" && pathname === "/api/data/batch") {
      const keys = (url.searchParams.get("keys") || "").split(",").slice(0, 64);
      return respond({ values: Object.fromEntries(keys.map(key => [key, read(key)])), revs: Object.fromEntries(keys.map(key => [key, revisions[key] ?? null])) });
    }
    if (method === "GET" && pathname === "/api/data") {
      const key = url.searchParams.get("key");
      return respond(read(key), 200, key && revisions[key] ? { "X-Cortex-Rev": revisions[key] } : {});
    }
    if (method === "GET" && pathname === "/api/calendar/events") {
      const start = url.searchParams.get("start") || "", end = url.searchParams.get("end") || "9999";
      return respond(fixtures.calendar.filter(event => event.startDate.slice(0, 10) >= start && event.startDate.slice(0, 10) < end));
    }
    if (method === "GET" && pathname === "/api/projects/scan") return respond(fixtures.projects);
    if (method === "GET" && pathname === "/api/automation/scheduled-tasks") return respond([]);
    if (method !== "POST" || !["/api/data", "/api/work-hours/command"].includes(pathname)) return unavailable();
    try {
      const raw = init.body ?? (request ? await request.clone().text() : "{}");
      if (typeof raw !== "string" || raw.length > 200000) return respond({ ok: false, error: "This request is too large for the browser demo." }, 413);
      const body = JSON.parse(raw);
      if (pathname === "/api/work-hours/command") {
        const state = applyWorkHoursCommand(records["cortex-project-time"], body, new Date().toISOString());
        save("cortex-project-time", state);
        return respond({ ok: true, state });
      }
      if (!validKey(body.key)) return unavailable();
      if (body.baseRev != null && body.baseRev !== (revisions[body.key] ?? null)) return respond({ error: "conflict", data: read(body.key), rev: revisions[body.key] ?? null }, 409);
      const data = save(body.key, body.data);
      return respond({ ok: true, rev: revisions[body.key], ...(data !== body.data ? { data } : {}) });
    } catch (error) { return respond({ ok: false, error: error instanceof Error ? error.message : "The local change could not be saved." }, 400); }
  };
  // Retire only this demo's registrations and caches on returning browsers.
  if (typeof navigator !== "undefined" && navigator.serviceWorker?.getRegistrations) {
    void navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.filter(registration => {
      const scope = new URL(registration.scope);
      return scope.origin === location.origin && scope.pathname === "/demos/cortex/";
    }).map(registration => registration.unregister()))).catch(() => {});
  }
  if (typeof caches !== "undefined") {
    void caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("cortex-demo-")).map(key => caches.delete(key)))).catch(() => {});
  }
}
