(() => {
  const networkFetch = window.fetch.bind(window);
  const storageKey = 'cortex-public-demo-brand-v2';
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const later = new Date(today);
  later.setDate(later.getDate() + 2);
  const dueDate = `${later.getFullYear()}-${String(later.getMonth() + 1).padStart(2, '0')}-${String(later.getDate()).padStart(2, '0')}`;
  const seed = {
    'cortex-habits': [
      { id: 'read', name: 'Read 30 minutes', emoji: '📖' },
      { id: 'walk', name: 'Take a walk', emoji: '🌿' },
      { id: 'plan', name: 'Plan tomorrow', emoji: '✍️' },
    ],
    'cortex-habits-history': { [date]: { read: true, walk: true } },
    [`cortex-daily-sessions-${date}`]: [
      { id: 'sample-focus', task: 'Review software architecture', duration: 45, completedAt: `${date}T14:45:00Z` },
    ],
    'cortex-student-courses': [
      { id: 'architecture', name: 'Software architecture', difficulty: 'Medium', iconKey: 'Network', semester: 'Sample semester', status: 'Normal', credits: 3 },
    ],
    'cortex-student-assignments': [
      { id: 'sample-diagram', courseId: 'architecture', name: 'Draw a context diagram', deadline: dueDate, done: false, type: 'Project', weight: 10, priority: 'Medium' },
    ],
  };
  let records = seed;
  try { records = { ...seed, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; } catch { /* start from samples */ }
  const revisions = {};
  const respond = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
    status, headers: { 'Content-Type': 'application/json', ...headers },
  });
  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin !== location.origin) return respond({ error: 'Unavailable in the sample app.' }, 404);
    if (url.pathname.startsWith('/demos/cortex/') && !url.pathname.includes('/api/')) return networkFetch(input, init);
    if (url.pathname === '/api/data/keys') return respond({ keys: Object.keys(records) });
    if (url.pathname === '/api/data/batch') {
      const keys = (url.searchParams.get('keys') || '').split(',');
      return respond({ values: Object.fromEntries(keys.map(key => [key, records[key] ?? null])), revs: revisions });
    }
    if (url.pathname === '/api/data') {
      if ((init.method || 'GET') === 'POST') {
        const { key, data } = JSON.parse(init.body || '{}');
        records[key] = data;
        revisions[key] = String(Date.now());
        try { localStorage.setItem(storageKey, JSON.stringify(records)); } catch { /* memory still works */ }
        return respond({ ok: true, rev: revisions[key] });
      }
      const key = url.searchParams.get('key');
      return respond(records[key] ?? null, 200, { 'X-Cortex-Rev': revisions[key] || 'sample' });
    }
    if (url.pathname === '/api/calendar/events') return respond([
      { id: 'sample-walk', title: 'Afternoon walk', startDate: `${date}T17:00:00Z`, endDate: `${date}T17:30:00Z`, calendar: 'Sample calendar', isAllDay: false },
    ]);
    return respond({ error: 'Unavailable in the sample app.' }, 404);
  };
})();
