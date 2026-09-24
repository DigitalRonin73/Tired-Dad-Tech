import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

// Real Workers runtime and isolated D1 database. No production or preview data is used.
const workerDirectory = '.programlist-local/test-worker';
const workerFile = (await readdir(workerDirectory)).find(name => name.endsWith('.js'));
const mf = new Miniflare(convertV4MiniflareOptions({ name: 'programlist-test', modules: true, scriptPath: `${workerDirectory}/${workerFile}`, compatibilityDate: '2026-09-24', d1Databases: ['PROGRAMLIST_DB'] }));
const db = await mf.getD1Database('PROGRAMLIST_DB');
const origin = 'https://programlist.test';
const password = randomBytes(24).toString('hex');
const hash = () => { const salt = randomBytes(16).toString('hex'); return `pbkdf2:100000:${salt}:${pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex')}`; };
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; }
async function call(path, body, cookie = '', extra = {}) {
  const response = await mf.dispatchFetch(`${origin}/api/programlist/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json', 'CF-Connecting-IP': '127.0.0.1', ...extra },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, headers: response.headers, body: await response.json() };
}
try {
  const schema = await readFile('migrations/0001_programlist.sql', 'utf8');
  await db.batch(schema.split(';').map(s => s.trim()).filter(Boolean).map(s => db.prepare(s)));
  for (const [id, name, role] of [['admin', 'Scott', 'admin'], ['member', 'John', 'member'], ['second', 'Erin', 'member']]) {
    await db.prepare('INSERT INTO users (id, name, role, password_hash) VALUES (?, ?, ?, ?)').bind(id, name, role, hash()).run();
  }
  check((await call('state')).status === 401, 'Unauthenticated data must be protected');
  check((await call('requests', { building: '2442', kind: 'room', label: '112' })).status === 401, 'Unauthenticated writes must be protected');
  check((await call('login', { username: 'Scott', password: 'incorrect' })).status === 401, 'Wrong password must fail');
  const login = await call('login', { username: 'scott', password });
  check(login.status === 200, 'Case-insensitive login succeeds');
  const header = login.headers.get('set-cookie');
  check(header.includes('HttpOnly') && header.includes('Secure') && header.includes('SameSite=Strict'), 'Cookie protections are present');
  const admin = header.split(';')[0];
  const member = (await call('login', { username: 'John', password })).headers.get('set-cookie').split(';')[0];
  const second = (await call('login', { username: 'Erin', password })).headers.get('set-cookie').split(';')[0];
  check((await call('state', undefined, member)).body.buildings.length === 6, 'All six buildings seeded');
  check((await call('admin/buildings', { name: '9999' }, member)).status === 403, 'Ordinary users cannot manage buildings');
  check((await call('requests', { building: '2442', kind: 'room', label: '112' }, member, { Origin: 'https://untrusted.test' })).status === 403, 'Cross-origin writes blocked');
  for (const label of ['12', '1234', '12A', '１２３', ' 112', '112 ', '-12', '1.2']) {
    check((await call('requests', { building: '2442', kind: 'room', label }, member)).status === 400, `Invalid room rejected: ${label}`);
  }
  check((await call('requests', { building: 'unlisted', kind: 'room', label: '112' }, member)).status === 400, 'Unknown building rejected');
  const room = (await call('requests', { building: '2442', kind: 'room', label: '112' }, member)).body;
  check(!!room.id, 'Room created');
  const duplicate = await call('requests', { building: '2442', kind: 'room', label: '112' }, second);
  check(duplicate.status === 409 && duplicate.body.error.includes('already on the programming list'), 'Duplicate pending request warns');
  const pending = (await call('requests?building=2442', undefined, admin)).body;
  check(pending.length === 1 && pending[0].submitter === 'John', 'Duplicate preserves original attribution');
  const originalTime = pending[0].submitted_at;
  check((await call('complete', { building: '2443', ids: [room.id] }, second)).body.completed === 0, 'Completion cannot cross buildings');
  check((await call('complete', { building: '2442', ids: [room.id] }, second)).body.completed === 1, 'Ordinary user can complete a door');
  check((await call('complete', { building: '2442', ids: [room.id] }, admin)).body.completed === 0, 'Repeated completion does not replace completer');
  let history = (await call('history?building=2442&door=112', undefined, admin)).body;
  check(history.total === 1 && history.completedCount === 1 && history.rows[0].completer === 'Erin' && history.rows[0].submitted_at === originalTime, 'Log preserves submitter, completer and dates');
  check((await call('requests', { building: '2442', kind: 'room', label: '112' }, second)).status === 201, 'Completed room may be recreated');
  history = (await call('history?building=2442&door=112&status=all', undefined, admin)).body;
  check(history.total === 2 && history.completedCount === 1 && history.pendingCount === 1, 'Pending does not inflate times-programmed count');
  history = (await call('history?building=2442&door=112&submittedBy=second', undefined, admin)).body;
  check(history.total === 0 && history.completedCount === 1, 'All-time count ignores person filters');
  check((await call('history?building=2442&completedBy=second', undefined, admin)).body.total === 1, 'Completed-by filter works');
  check((await call(`history?building=2442&dateField=completed&from=${Date.now() + 86400000}`, undefined, admin)).body.total === 0, 'Date filter works');
  check((await call('requests', { building: '2442', kind: 'other', label: '3rd Deck Lounge' }, member)).status === 201, 'Other doors supported');
  check((await call('requests', { building: '2442', kind: 'other', label: '  3rd   deck lounge ' }, member)).status === 409, 'Other-door whitespace and case normalize');
  check((await call('doors?building=2442', undefined, member)).body[0].door_label === '3rd Deck Lounge', 'Other-door name can be reused');
  check((await call('requests', { building: '2442', kind: 'room', label: '001' }, member)).status === 201, 'Leading zero room numbers preserved');
  const race = await Promise.all([member, second].map(cookie => call('requests', { building: '2443', kind: 'room', label: '224' }, cookie)));
  check(race.filter(r => r.status === 201).length === 1 && race.filter(r => r.status === 409).length === 1, 'Concurrent duplicate submissions create exactly one row');
  const ids = (await call('requests?building=2442', undefined, admin)).body.map(row => row.id);
  const late = (await call('requests', { building: '2442', kind: 'room', label: '305' }, second)).body;
  check((await call('complete', { building: '2442', ids }, admin)).body.completed === ids.length, 'Bulk completion completes the confirmation snapshot');
  check((await call('requests?building=2442', undefined, admin)).body[0].id === late.id, 'Work added after confirmation stays pending');
  history = (await call('history?building=2442&door=112', undefined, admin)).body;
  check(history.completedCount === 2 && history.total === 2, 'Recreated room has two separate completions in log');
  // Exercise batch parameter limits and history pagination with realistic longer-lived data.
  const inserts = Array.from({ length: 110 }, (_, i) => db.prepare('INSERT INTO requests (id, building_id, kind, door_label, door_key, submitted_by, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(`bulk-${i}`, '2445', 'room', String(i + 400), String(i + 400), 'member', Date.now()));
  await db.batch(inserts);
  check((await call('complete', { building: '2445', ids: Array.from({ length: 110 }, (_, i) => `bulk-${i}`) }, admin)).body.completed === 110, 'Bulk completion supports more than 100 SQL parameters');
  const page1 = (await call('history?building=2445', undefined, admin)).body;
  const page2 = (await call('history?building=2445&offset=50', undefined, admin)).body;
  check(page1.total === 110 && page1.rows.length === 50 && page2.rows.length === 50 && !page1.rows.some(a => page2.rows.some(b => a.id === b.id)), 'History pagination is stable');
  check((await call('admin/users', { name: 'Brandon', role: 'member', password }, admin)).status === 201, 'Admin creates account');
  check((await call('admin/users', { name: 'brandon', role: 'member', password }, admin)).status === 409, 'Duplicate names rejected case-insensitively');
  check((await call('admin/user', { id: 'member', role: 'programmer' }, admin)).status === 200, 'Admin assigns programmer role');
  check((await call('admin/user', { id: 'member', active: false }, admin)).status === 200, 'Admin deactivates account');
  check((await call('state', undefined, member)).status === 401, 'Deactivated account loses existing session');
  check((await call('admin/user', { id: 'admin', active: false }, admin)).status === 400, 'Admin cannot deactivate itself');
  check((await call('admin/user', { id: 'second', password: randomBytes(24).toString('hex') }, admin)).status === 200, 'Password reset works');
  check((await call('state', undefined, second)).status === 401, 'Password change invalidates sessions');
  check((await call('logout', {}, admin)).status === 200 && (await call('state', undefined, admin)).status === 401, 'Logout invalidates session');
  for (let i = 0; i < 20; i++) await call('login', { username: 'unknown', password: 'wrong' }, '', { 'CF-Connecting-IP': '192.0.2.10' });
  check((await call('login', { username: 'unknown', password: 'wrong' }, '', { 'CF-Connecting-IP': '192.0.2.10' })).status === 429, 'Repeated failed logins are throttled');
  console.log(`PASS: ${checks} programming-list checks in the real Workers runtime with isolated D1.`);
} finally { await mf.dispose(); }
