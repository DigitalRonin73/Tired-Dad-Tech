import type { D1Database } from '@cloudflare/workers-types';
import type { Person, Role } from './types';

type Env = { PROGRAMLIST_DB: D1Database };
type Context = { request: Request; env: Env };
const cookieName = 'programlist_session';
const sessionSeconds = 7 * 24 * 60 * 60;
const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (text: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(text)));
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}
function field(body: Record<string, unknown>, name: string, max = 100) {
  const value = body[name];
  if (typeof value !== 'string' || value.length > max) throw new HttpError(400, `Please enter a valid ${name}.`);
  return value;
}
function sessionCookie(request: Request, token: string, maxAge: number) {
  return `${cookieName}=${token}; Path=/api/programlist; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
async function hashPassword(password: string, salt = hex(crypto.getRandomValues(new Uint8Array(16)).buffer)) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `pbkdf2:100000:${salt}:${hex(hash)}`;
}
async function passwordMatches(password: string, stored: string) {
  const pieces = stored.split(':');
  if (pieces.length !== 4 || pieces[0] !== 'pbkdf2' || pieces[1] !== '100000') return false;
  const actual = await hashPassword(password, pieces[2]);
  let difference = actual.length ^ stored.length;
  for (let i = 0; i < actual.length; i++) difference |= actual.charCodeAt(i) ^ (stored.charCodeAt(i) || 0);
  return difference === 0;
}
async function tokenHash(request: Request) {
  const token = request.headers.get('Cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  return token ? sha256(token) : '';
}
async function authenticated(request: Request, db: D1Database) {
  const person = await db.prepare('SELECT u.id, u.name, u.role, u.active FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1')
    .bind(await tokenHash(request), Date.now()).first<Person>();
  if (!person) throw new HttpError(401, 'Please sign in to continue.');
  return person;
}
const selectRequests = `SELECT r.*, b.name AS building, s.name AS submitter, c.name AS completer
  FROM requests r JOIN buildings b ON b.id = r.building_id
  JOIN users s ON s.id = r.submitted_by LEFT JOIN users c ON c.id = r.completed_by`;

export async function handleRequest({ request, env }: Context): Promise<Response> {
  try {
    if (!env.PROGRAMLIST_DB) throw new HttpError(503, 'The programming list database is not connected yet.');
    const db = env.PROGRAMLIST_DB;
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/programlist\/?/, '').replace(/\/$/, '');
    const method = request.method;
    if (!['GET', 'POST'].includes(method)) throw new HttpError(405, 'Method not allowed.');
    let body: Record<string, unknown> = {};
    if (method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) throw new HttpError(403, 'Please use the programming list on this website.');
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new HttpError(415, 'JSON is required.');
      const text = await request.text();
      if (text.length > 32768) throw new HttpError(413, 'This request is too large.');
      try { body = JSON.parse(text); } catch { throw new HttpError(400, 'Invalid request.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Invalid request.');
    }

    if (path === 'login' && method === 'POST') {
      const name = field(body, 'username', 40).trim();
      const password = field(body, 'password', 256);
      const now = Date.now();
      const key = await sha256(request.headers.get('CF-Connecting-IP') || 'local');
      await db.batch([
        db.prepare('DELETE FROM login_attempts WHERE expires_at <= ?').bind(now),
        db.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now),
        db.prepare('INSERT INTO login_attempts (key, attempts, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1').bind(key, now + 15 * 60 * 1000),
      ]);
      const attempt = await db.prepare('SELECT attempts FROM login_attempts WHERE key = ?').bind(key).first<{ attempts: number }>();
      if (attempt && attempt.attempts > 20) throw new HttpError(429, 'Too many sign-in attempts. Please try again in 15 minutes.');
      const user = await db.prepare('SELECT * FROM users WHERE name = ? COLLATE NOCASE AND active = 1').bind(name).first<Person & { password_hash: string }>();
      // Do the same password work even when the username is unknown.
      const valid = await passwordMatches(password, user?.password_hash || `pbkdf2:100000:unused-salt:${'0'.repeat(64)}`);
      if (!user || !valid) throw new HttpError(401, 'Username or password is incorrect.');
      const token = hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
      await db.batch([
        db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256(token), user.id, now + sessionSeconds * 1000),
        db.prepare('DELETE FROM login_attempts WHERE key = ?').bind(key),
      ]);
      return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request, token, sessionSeconds) });
    }
    if (path === 'logout' && method === 'POST') {
      await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await tokenHash(request)).run();
      return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(request, '', 0) });
    }
    const me = await authenticated(request, db);

    if (path === 'state' && method === 'GET') {
      const [users, buildings] = await db.batch([
        db.prepare('SELECT id, name, role, active FROM users ORDER BY name COLLATE NOCASE'),
        db.prepare('SELECT b.*, (SELECT COUNT(*) FROM requests r WHERE r.building_id = b.id AND r.completed_at IS NULL) AS pending FROM buildings b ORDER BY length(b.name), b.name'),
      ]);
      return json({ me, users: users.results, buildings: buildings.results });
    }
    if (path === 'doors' && method === 'GET') {
      return json((await db.prepare("SELECT door_key, MIN(door_label) AS door_label FROM requests WHERE building_id = ? AND kind = 'other' GROUP BY door_key ORDER BY door_label COLLATE NOCASE").bind(url.searchParams.get('building') || '').all()).results);
    }
    if (path === 'requests' && method === 'GET') {
      return json((await db.prepare(`${selectRequests} WHERE r.building_id = ? AND r.completed_at IS NULL ORDER BY r.kind DESC, r.door_key, r.submitted_at`).bind(url.searchParams.get('building') || '').all()).results);
    }
    if (path === 'requests' && method === 'POST') {
      const building = field(body, 'building');
      const kind = field(body, 'kind');
      let label = field(body, 'label');
      if (kind === 'room' && !/^[0-9]{3}$/.test(label)) throw new HttpError(400, 'Room numbers must contain exactly 3 digits.');
      if (kind === 'other') label = label.trim().replace(/\s+/g, ' ');
      if (!['room', 'other'].includes(kind) || !label || /[\x00-\x1f]/.test(label)) throw new HttpError(400, 'Please enter a room number or other door description.');
      const b = await db.prepare('SELECT name FROM buildings WHERE id = ?').bind(building).first<{ name: string }>();
      if (!b) throw new HttpError(400, 'Select a building from the list.');
      const key = normalize(label);
      const existing = await db.prepare('SELECT door_label FROM requests WHERE building_id = ? AND kind = ? AND door_key = ? LIMIT 1').bind(building, kind, key).first<{ door_label: string }>();
      if (existing) label = existing.door_label;
      const id = crypto.randomUUID();
      const result = await db.prepare('INSERT INTO requests (id, building_id, kind, door_label, door_key, submitted_by, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(building_id, kind, door_key) WHERE completed_at IS NULL DO NOTHING')
        .bind(id, building, kind, label, key, me.id, Date.now()).run();
      if (!result.meta.changes) throw new HttpError(409, `${kind === 'room' ? 'Room ' : ''}${label} in Building ${b.name} is already on the programming list.`);
      return json({ id, label }, 201);
    }
    if (path === 'complete' && method === 'POST') {
      const building = field(body, 'building');
      const ids = body.ids;
      if (!Array.isArray(ids) || !ids.length || ids.length > 500 || ids.some(id => typeof id !== 'string' || id.length > 40)) throw new HttpError(400, 'Select between 1 and 500 pending doors.');
      // Only complete the exact requests shown in the confirmation, never newly added work.
      const statements = [];
      const completedAt = Date.now();
      for (let start = 0; start < ids.length; start += 90) {
        const chunk = ids.slice(start, start + 90);
        statements.push(db.prepare(`UPDATE requests SET completed_by = ?, completed_at = ? WHERE building_id = ? AND completed_at IS NULL AND id IN (${chunk.map(() => '?').join(',')})`)
          .bind(me.id, completedAt, building, ...chunk));
      }
      const results = await db.batch(statements);
      return json({ completed: results.reduce((sum, result) => sum + result.meta.changes, 0) });
    }
    if (path === 'history' && method === 'GET') {
      const p = url.searchParams;
      const clauses: string[] = [];
      const args: (string | number)[] = [];
      const add = (sql: string, value: string | number) => { clauses.push(sql); args.push(value); };
      if (p.get('building')) add('r.building_id = ?', p.get('building')!);
      if (p.get('door')) add('r.door_key = ?', normalize(p.get('door')!));
      if (p.get('kind')) {
        if (!['room', 'other'].includes(p.get('kind')!)) throw new HttpError(400, 'Invalid door type.');
        add('r.kind = ?', p.get('kind')!);
      }
      const doorWhere = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const counts = await db.prepare(`SELECT COUNT(CASE WHEN r.completed_at IS NOT NULL THEN 1 END) AS completedCount, COUNT(CASE WHEN r.completed_at IS NULL THEN 1 END) AS pendingCount FROM requests r ${doorWhere}`).bind(...args).first();
      if (p.get('submittedBy')) add('r.submitted_by = ?', p.get('submittedBy')!);
      if (p.get('completedBy')) add('r.completed_by = ?', p.get('completedBy')!);
      const status = p.get('status') || 'completed';
      if (status === 'completed') clauses.push('r.completed_at IS NOT NULL');
      else if (status === 'pending') clauses.push('r.completed_at IS NULL');
      else if (status !== 'all') throw new HttpError(400, 'Invalid status.');
      const dateColumn = p.get('dateField') === 'completed' ? 'r.completed_at' : 'r.submitted_at';
      for (const [param, comparison] of [['from', '>='], ['to', '<']]) {
        if (p.get(param)) {
          const value = Number(p.get(param));
          if (!Number.isSafeInteger(value) || value < 0) throw new HttpError(400, 'Invalid date range.');
          add(`${dateColumn} ${comparison} ?`, value);
        }
      }
      const offset = Number(p.get('offset') || 0);
      if (!Number.isSafeInteger(offset) || offset < 0) throw new HttpError(400, 'Invalid page.');
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const [rows, total] = await db.batch([
        db.prepare(`${selectRequests} ${where} ORDER BY r.submitted_at DESC, r.id DESC LIMIT 50 OFFSET ?`).bind(...args, offset),
        db.prepare(`SELECT COUNT(*) AS total FROM requests r ${where}`).bind(...args),
      ]);
      return json({ rows: rows.results, total: (total.results[0] as { total: number }).total, ...counts });
    }
    if (path.startsWith('admin/') && me.role !== 'admin') throw new HttpError(403, 'Only Scott’s admin account can manage users and buildings.');
    if (path === 'admin/buildings' && method === 'POST') {
      const name = field(body, 'name', 20).trim();
      if (!/^[0-9]{1,20}$/.test(name)) throw new HttpError(400, 'Enter a building number using digits only.');
      const result = await db.prepare('INSERT INTO buildings (id, name) VALUES (?, ?) ON CONFLICT(name) DO NOTHING').bind(name, name).run();
      if (!result.meta.changes) throw new HttpError(409, 'That building is already in the dropdown.');
      return json({ ok: true }, 201);
    }
    if (path === 'admin/users' && method === 'POST') {
      const name = field(body, 'name', 40).trim();
      const role = field(body, 'role') as Role;
      const password = field(body, 'password', 256);
      if (!/^[\p{L}][\p{L}' -]{0,39}$/u.test(name) || !['member', 'programmer'].includes(role) || !password.length) throw new HttpError(400, 'Enter a first name, role, and password.');
      const result = await db.prepare('INSERT INTO users (id, name, role, password_hash) VALUES (?, ?, ?, ?) ON CONFLICT(name) DO NOTHING').bind(crypto.randomUUID(), name, role, await hashPassword(password)).run();
      if (!result.meta.changes) throw new HttpError(409, 'That username already exists.');
      return json({ ok: true }, 201);
    }
    if (path === 'admin/user' && method === 'POST') {
      const id = field(body, 'id');
      const target = await db.prepare('SELECT id, role FROM users WHERE id = ?').bind(id).first<Person>();
      if (!target) throw new HttpError(404, 'User not found.');
      const statements = [];
      if (body.role !== undefined || body.active !== undefined) {
        if (target.role === 'admin') throw new HttpError(400, 'The admin account must remain active and keep its admin role.');
        if (body.role !== undefined) {
          const role = field(body, 'role');
          if (!['member', 'programmer'].includes(role)) throw new HttpError(400, 'Invalid role.');
          statements.push(db.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, id));
        }
        if (body.active !== undefined) {
          if (typeof body.active !== 'boolean') throw new HttpError(400, 'Invalid account status.');
          statements.push(db.prepare('UPDATE users SET active = ? WHERE id = ?').bind(body.active ? 1 : 0, id));
        }
      }
      if (body.password !== undefined) {
        const password = field(body, 'password', 256);
        if (!password) throw new HttpError(400, 'Enter a password.');
        statements.push(db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(await hashPassword(password), id));
      }
      if (!statements.length) throw new HttpError(400, 'No changes supplied.');
      // Disabling an account or changing its password invalidates existing sessions.
      if (body.active === false || body.password !== undefined) statements.push(db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id));
      await db.batch(statements);
      return json({ ok: true });
    }
    throw new HttpError(404, 'Not found.');
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    // Never log request bodies, cookies, password hashes, or raw database errors.
    return json({ error: 'The list could not be saved or loaded. Please try again.' }, 500);
  }
}
