CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'programmer', 'member')),
  password_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);
CREATE TABLE buildings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE requests (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id),
  kind TEXT NOT NULL CHECK (kind IN ('room', 'other')),
  door_label TEXT NOT NULL,
  door_key TEXT NOT NULL,
  submitted_by TEXT NOT NULL REFERENCES users(id),
  submitted_at INTEGER NOT NULL,
  completed_by TEXT REFERENCES users(id),
  completed_at INTEGER,
  CHECK ((kind = 'room' AND length(door_label) = 3 AND door_label NOT GLOB '*[^0-9]*') OR (kind = 'other' AND length(door_label) BETWEEN 1 AND 100)),
  CHECK ((completed_at IS NULL AND completed_by IS NULL) OR (completed_at IS NOT NULL AND completed_by IS NOT NULL))
);
CREATE UNIQUE INDEX one_pending_door ON requests(building_id, kind, door_key) WHERE completed_at IS NULL;
CREATE INDEX room_history ON requests(building_id, kind, door_key, submitted_at DESC);
CREATE INDEX submitted_history ON requests(submitted_at DESC);
CREATE INDEX completed_history ON requests(completed_at DESC);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL
);
CREATE INDEX session_expiry ON sessions(expires_at);
CREATE TABLE login_attempts (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
INSERT INTO buildings (id, name) VALUES
  ('2442', '2442'), ('2443', '2443'), ('2445', '2445'),
  ('2446', '2446'), ('2447', '2447'), ('2448', '2448');
