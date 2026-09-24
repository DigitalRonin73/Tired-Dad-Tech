#!/usr/bin/env python3
"""Create a private, insert-only seed file; never print passwords or hashes."""
import getpass
import hashlib
import os
from pathlib import Path
import secrets
import uuid

NAMES = ['John', 'Erin', 'Kathi', 'Ray', 'Dustin', 'Logan', 'Jamal', 'Derrick', 'Prince', 'Matt', 'Brandon', 'Elijah']

def password_hash(password):
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()
    return f'pbkdf2:100000:{salt}:{digest}'

def quote(value):
    return "'" + value.replace("'", "''") + "'"

def main():
    destination = Path(__file__).resolve().parents[1] / '.programlist-local' / 'initial-users.sql'
    if destination.exists():
        raise SystemExit('Private seed file already exists; left unchanged.')
    admin = getpass.getpass('Admin password (hidden): ')
    team = getpass.getpass('Team password (hidden): ')
    if not admin or not team:
        raise SystemExit('Both passwords are required.')
    rows = [('Scott', 'admin', admin)] + [(name, 'member', team) for name in NAMES]
    sql = ['-- Private provisioning data. Do not commit or publish.']
    for name, role, password in rows:
        values = ', '.join(quote(v) for v in [str(uuid.uuid4()), name, role, password_hash(password)])
        sql.append(f'INSERT INTO users (id, name, role, password_hash) VALUES ({values}) ON CONFLICT(name) DO NOTHING;')
    destination.parent.mkdir(mode=0o700, exist_ok=True)
    fd = os.open(destination, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as file:
        file.write('\n'.join(sql) + '\n')
    print('Private seed prepared for 13 accounts. Existing accounts will not be overwritten.')

if __name__ == '__main__':
    main()
