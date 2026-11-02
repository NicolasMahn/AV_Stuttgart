const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const root = path.resolve(__dirname, '..');
const indexHtml = '<!doctype html><html><body><div id="root">Fixture app</div></body></html>';
let fixture;
let server;
let baseURL;

before(async () => {
  // Run the real server in isolation so tests never change saved analytics or a local build.
  fixture = await fs.mkdtemp(path.join(os.tmpdir(), 'av-stuttgart-server-'));
  await fs.copyFile(path.join(root, 'server.js'), path.join(fixture, 'server.js'));
  await fs.symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir');
  await fs.mkdir(path.join(fixture, 'build', 'assets'), { recursive: true });
  await fs.writeFile(path.join(fixture, 'build', 'index.html'), indexHtml);
  await fs.writeFile(path.join(fixture, 'build', 'assets', 'fixture.txt'), 'static fixture');
  await fs.writeFile(path.join(fixture, 'build', 'content_de.yaml'), 'Ethik: []\n');

  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  baseURL = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['server.js'], {
    cwd: fixture,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port), ANALYTICS_PASSWORD: 'test-password' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => finish(new Error(`Server did not start: ${output}`)), 10000);
    const finish = error => {
      clearTimeout(timer);
      server.stdout.off('data', onData);
      server.off('error', onError);
      server.off('exit', onExit);
      error ? reject(error) : resolve();
    };
    const onData = data => {
      output += data;
      if (output.includes(`Server running on port ${port}`)) finish();
    };
    const onError = error => finish(error);
    const onExit = code => finish(new Error(`Server exited (${code}): ${output}`));
    server.stdout.on('data', onData);
    server.stderr.on('data', data => { output += data; });
    server.once('error', onError);
    server.once('exit', onExit);
  });
});

after(async () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, 'exit');
    server.kill();
    await exited;
  }
  if (fixture) await fs.rm(fixture, { recursive: true, force: true });
});

function postJSON(route, body) {
  return fetch(`${baseURL}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('serves the built app, public content and static files with HTTP caching and ranges', async () => {
  const home = await fetch(baseURL);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.equal(await home.text(), indexHtml);

  const content = await fetch(`${baseURL}/content_de.yaml`);
  assert.equal(content.status, 200);
  assert.equal(await content.text(), 'Ethik: []\n');

  const assetURL = `${baseURL}/assets/fixture.txt`;
  const asset = await fetch(assetURL);
  assert.equal(asset.status, 200);
  assert.equal(await asset.text(), 'static fixture');
  const cached = await fetch(assetURL, {
    cache: 'no-cache',
    headers: { 'if-none-match': asset.headers.get('etag') },
  });
  assert.equal(cached.status, 304);
  const range = await fetch(assetURL, { headers: { range: 'bytes=0-5' } });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get('content-range'), 'bytes 0-5/14');
  assert.equal(await range.text(), 'static');
});

test('serves SPA deep links but returns JSON 404 for unknown API routes', async () => {
  const deepLink = await fetch(`${baseURL}/datenschutz?language=en`);
  assert.equal(deepLink.status, 200);
  assert.equal(await deepLink.text(), indexHtml);

  const missingAPI = await fetch(`${baseURL}/api/does-not-exist`);
  assert.equal(missingAPI.status, 404);
  assert.match(missingAPI.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await missingAPI.json(), { error: 'API endpoint not found' });
});

test('rejects malformed and oversized JSON without persisting analytics', async () => {
  const malformed = await fetch(`${baseURL}/api/track`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"eventType":',
  });
  assert.equal(malformed.status, 400);
  assert.doesNotMatch(await malformed.text(), /SyntaxError|server\.js|node_modules/);

  const oversized = await postJSON('/api/track', { eventType: 'page_view', payload: 'x'.repeat(110000) });
  assert.equal(oversized.status, 413);
  assert.doesNotMatch(await oversized.text(), /PayloadTooLargeError|server\.js|node_modules/);

  const summary = await fetch(`${baseURL}/api/analytics/summary`);
  assert.equal(summary.status, 200);
  assert.equal((await summary.json()).totalEvents, 0);
  await assert.rejects(fs.access(path.join(fixture, 'analytics')), { code: 'ENOENT' });
});

test('persists valid tracking data and includes it in summary and exports', async () => {
  const events = [
    { eventType: 'page_view', visitorId: 'visitor-1', sessionId: 'session-1', path: '/', hash: '#Ethik' },
    { eventType: 'link_click', visitorId: 'visitor-1', sessionId: 'session-1', linkTitle: 'Example', linkUrl: 'https://example.com/' },
    { eventType: 'language_change', visitorId: 'visitor-2', sessionId: 'session-2', fromLanguage: 'de', toLanguage: 'en' },
  ];
  for (const event of events) {
    const response = await postJSON('/api/track', event);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }

  const files = await fs.readdir(path.join(fixture, 'analytics'));
  const persisted = [];
  for (const file of files) {
    assert.match(file, /^analytics-\d{4}-\d{2}-\d{2}\.jsonl$/);
    const lines = await fs.readFile(path.join(fixture, 'analytics', file), 'utf8');
    persisted.push(...lines.trim().split('\n').map(line => JSON.parse(line)));
  }
  assert.equal(persisted.length, events.length);
  persisted.forEach((event, index) => {
    const { serverTimestamp, ip, ...original } = event;
    assert.deepEqual(original, events[index]);
    assert.equal(new Date(serverTimestamp).toISOString(), serverTimestamp);
    assert.ok(ip.includes('127.0.0.1'));
  });

  const summaryResponse = await fetch(`${baseURL}/api/analytics/summary`);
  assert.equal(summaryResponse.status, 200);
  const summary = await summaryResponse.json();
  assert.equal(summary.totalEvents, 3);
  assert.equal(summary.totalVisitors, 2);
  assert.equal(summary.totalSessions, 2);
  assert.equal(summary.pageViews, 1);
  assert.equal(summary.languageChanges, 1);
  assert.deepEqual(summary.eventTypes, { page_view: 1, link_click: 1, language_change: 1 });
  assert.deepEqual(summary.topLinks, [{ title: 'Example', url: 'https://example.com/', clicks: 1 }]);

  for (const file of files) {
    const date = file.slice('analytics-'.length, -'.jsonl'.length);
    const daily = await fetch(`${baseURL}/api/analytics/export?date=${date}`);
    assert.equal(daily.status, 200);
    const data = await daily.json();
    assert.equal(data.date, date);
    assert.deepEqual(data.events, persisted.filter(event => event.serverTimestamp.startsWith(date)));
    assert.equal(data.count, data.events.length);
  }
  const exported = await fetch(`${baseURL}/api/analytics/export-all`);
  assert.equal(exported.status, 200);
  const data = await exported.json();
  assert.equal(data.count, events.length);
  assert.deepEqual(data.events, persisted);
});

test('checks analytics passwords and validates missing export dates', async () => {
  const accepted = await postJSON('/api/analytics/auth', { password: 'test-password' });
  assert.equal(accepted.status, 200);
  assert.deepEqual(await accepted.json(), { success: true });
  const rejected = await postJSON('/api/analytics/auth', { password: 'wrong-password' });
  assert.equal(rejected.status, 200);
  assert.deepEqual(await rejected.json(), { success: false, message: 'Invalid password' });
  const missingDate = await fetch(`${baseURL}/api/analytics/export`);
  assert.equal(missingDate.status, 400);
  assert.deepEqual(await missingDate.json(), { error: 'Date parameter required (YYYY-MM-DD)' });
});
