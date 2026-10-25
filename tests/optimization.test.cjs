// Run with: node --test tests/optimization.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function dataContext(fetch) {
  const context = vm.createContext({ fetch, window: {}, appState: {}, parseHash: () => ({ name: 'home' }), render() {} });
  const start = html.indexOf('  const subjectFiles =');
  const end = html.indexOf('  // ============ ROUTING', start);
  vm.runInContext(html.slice(start, end), context);
  return context;
}
test('home renders without downloading subject JSON', () => {
  let calls = 0;
  const context = dataContext(() => { calls++; });
  context.loadData();
  assert.equal(calls, 0);
  assert.equal(context.appState.loading, false);
  assert.equal(context.appState.route.name, 'home');
});
test('concurrent subject selections share a download; loaded subjects are reused', async () => {
  let calls = 0, finish;
  const context = dataContext(() => { calls++; return new Promise(resolve => { finish = resolve; }); });
  context.loadData();
  const first = context.loadOtherSubject('science');
  const second = context.loadOtherSubject('science');
  assert.equal(calls, 1);
  finish({ ok: true, json: async () => ({ grades: { 8: { lessons: [] } } }) });
  await Promise.all([first, second]);
  await context.loadOtherSubject('science');
  assert.equal(calls, 1);
  assert.ok(context.appState.content.subjects.science.grades[8]);
});
test('failed subject downloads can be retried', async () => {
  let calls = 0;
  const context = dataContext(async () => ({ ok: ++calls > 1, json: async () => ({ grades: {} }) }));
  context.loadData();
  await assert.rejects(context.loadOtherSubject('science'), /Failed to load/);
  await context.loadOtherSubject('science');
  assert.equal(calls, 2);
});
function workerContext(fetch) {
  const stores = new Map();
  const listeners = {};
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return { match: async request => store.get(request.url || request), put: async (request, response) => store.set(request.url || request, response), addAll: async urls => { for (const url of urls) store.set(url, url); } };
    },
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name)
  };
  const context = vm.createContext({ fetch, caches, URL, Response, console: { log() {}, warn() {}, error() {} }, self: { location: { hostname: 'quizhub.lk' }, addEventListener: (name, listener) => { listeners[name] = listener; }, skipWaiting: async () => {}, clients: { claim: async () => {} } } });
  vm.runInContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), context);
  return { context, caches, listeners, stores };
}
test('offline uses latest runtime copy rather than older precache copy', async () => {
  const { context, caches } = workerContext(async () => { throw new Error('offline'); });
  const request = { url: 'https://quizhub.lk/', headers: new Headers() };
  await (await caches.open('quizhub-v3')).put(request, 'old');
  await (await caches.open('quizhub-runtime-v3')).put(request, 'latest');
  assert.equal(await context.networkFirstStrategy(request), 'latest');
});
test('activation preserves caches belonging to other apps', async () => {
  const { caches, listeners, stores } = workerContext();
  for (const name of ['another-app', 'quizhub-v2', 'quizhub-v3', 'quizhub-runtime-v3']) await caches.open(name);
  let work;
  listeners.activate({ waitUntil(promise) { work = promise; } });
  await work;
  assert.ok(stores.has('another-app'));
  assert.ok(stores.has('quizhub-v3'));
  assert.equal(stores.has('quizhub-v2'), false);
});
test('service worker install does not eagerly fetch question banks or third parties', async () => {
  const { listeners, stores } = workerContext();
  let work;
  listeners.install({ waitUntil(promise) { work = promise; } });
  await work;
  const urls = [...stores.get('quizhub-v3').keys()];
  assert.ok(urls.includes('/index.html'));
  assert.equal(urls.some(url => url.startsWith('/data/') || url.startsWith('https:')), false);
});
test('cache quota failures do not discard a successful network response', async () => {
  const response = new Response('fresh');
  const { context } = workerContext(async () => response);
  context.caches.open = async () => ({ put: async () => { throw new Error('quota'); } });
  assert.equal(await context.networkFirstStrategy({ url: 'https://quizhub.lk/' }), response);
});
test('background cache refresh stays attached to the fetch event', async () => {
  const { context, caches } = workerContext(async () => new Response('fresh'));
  const request = { url: 'https://quizhub.lk/icon-192.png' };
  await (await caches.open('quizhub-runtime-v3')).put(request, 'cached');
  let work;
  assert.equal(await context.cacheFirstStrategy(request, { waitUntil(promise) { work = promise; } }), 'cached');
  assert.ok(work);
  await work;
  assert.equal(await (await (await caches.open('quizhub-runtime-v3')).match(request)).text(), 'fresh');
});
test('a delayed subject route cannot overwrite a newer home navigation', async () => {
  let finish;
  const app = { innerHTML: '' };
  const context = vm.createContext({
    appState: { content: { subjects: {} }, route: { name: 'grades', subject: 'science' } },
    document: { getElementById: () => app },
    window: { scrollTo() {} },
    renderShell: body => body,
    renderHome: () => 'home',
    renderGrades: () => new Promise(resolve => { finish = resolve; }),
    updateFullscreenBtn() {}, updateInstallButton() {},
    panelHidden: false, liteMode: false, timerInterval: null
  });
  const start = html.indexOf('  let renderGeneration =');
  const end = html.indexOf('  function renderShell(', start);
  vm.runInContext(html.slice(start, end), context);
  const older = context.render();
  context.appState.route = { name: 'home' };
  await context.render();
  finish('grades');
  await older;
  assert.equal(app.innerHTML, 'home');
});
