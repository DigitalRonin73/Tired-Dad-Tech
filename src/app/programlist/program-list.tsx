'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import type { DoorRequest, HistoryResult, State } from '@/lib/programlist/types';
import styles from './programlist.module.css';

type Tab = 'pending' | 'history' | 'manage';
type Filters = { allBuildings: boolean; door: string; kind: string; submittedBy: string; completedBy: string; status: string; dateField: string; from: string; to: string; month: string };
const initialFilters: Filters = { allBuildings: false, door: '', kind: '', submittedBy: '', completedBy: '', status: 'completed', dateField: 'submitted', from: '', to: '', month: '' };
const emptyHistory: HistoryResult = { rows: [], total: 0, completedCount: 0, pendingCount: 0 };
const roleLabel = { admin: 'Admin', programmer: 'Programmer', member: 'Team member' };

class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
async function api<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/programlist/${path}`, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store', signal,
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => { throw new ApiError('The programming list service is unavailable. Please try again.', response.status); });
  if (!response.ok) throw new ApiError(data.error || 'Something went wrong. Please try again.', response.status);
  return data as T;
}
const errorText = (error: unknown) => error instanceof Error ? error.message : 'Could not connect. Please try again.';
function date(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(timestamp);
}
function localDate(value: Date) { return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`; }
function monthDates(value: string) {
  if (!value) return { from: '', to: '', month: '' };
  const [year, month] = value.split('-').map(Number);
  return { from: localDate(new Date(year, month - 1, 1)), to: localDate(new Date(year, month, 0)), month: value };
}
function historyQuery(building: string, filters: Filters, offset: number) {
  const p = new URLSearchParams({ offset: String(offset), status: filters.status, dateField: filters.dateField });
  if (!filters.allBuildings) p.set('building', building);
  for (const key of ['door', 'kind', 'submittedBy', 'completedBy'] as const) if (filters[key]) p.set(key, filters[key]);
  if (filters.from) p.set('from', String(new Date(`${filters.from}T00:00:00`).getTime()));
  if (filters.to) {
    const end = new Date(`${filters.to}T00:00:00`); end.setDate(end.getDate() + 1);
    p.set('to', String(end.getTime()));
  }
  return p.toString();
}

export default function ProgramList() {
  const [state, setState] = useState<State | null>(null);
  const [starting, setStarting] = useState(true);
  const [building, setBuilding] = useState('');
  const [tab, setTab] = useState<Tab>('pending');
  const [pending, setPending] = useState<DoorRequest[]>([]);
  const [otherDoors, setOtherDoors] = useState<{ door_key: string; door_label: string }[]>([]);
  const [kind, setKind] = useState<'room' | 'other'>('room');
  const [label, setLabel] = useState('');
  const [history, setHistory] = useState<HistoryResult>(emptyHistory);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmIds, setConfirmIds] = useState<string[] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const locked = useRef(false);

  const refreshState = useCallback(async () => {
    const next = await api<State>('state');
    setState(next);
    setBuilding(current => {
      if (current) return current;
      let saved = ''; try { saved = localStorage.getItem('programlist-building') || ''; } catch { /* Storage is optional. */ }
      return next.buildings.some(b => b.id === saved) ? saved : next.buildings[0]?.id || '';
    });
  }, []);

  useEffect(() => {
    refreshState().catch(error => { if (!(error instanceof ApiError && error.status === 401)) setError(errorText(error)); }).finally(() => setStarting(false));
  }, [refreshState]);

  useEffect(() => {
    if (!state || !building || tab === 'manage') return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setLoadError('');
      try {
        if (tab === 'pending') {
          const [rows, doors] = await Promise.all([
            api<DoorRequest[]>(`requests?building=${encodeURIComponent(building)}`, undefined, controller.signal),
            api<{ door_key: string; door_label: string }[]>(`doors?building=${encodeURIComponent(building)}`, undefined, controller.signal),
          ]);
          if (!controller.signal.aborted) { setPending(rows); setOtherDoors(doors); }
        } else {
          const result = await api<HistoryResult>(`history?${historyQuery(building, filters, offset)}`, undefined, controller.signal);
          if (!controller.signal.aborted) setHistory(result);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === 401) setState(null);
        else setLoadError(errorText(error));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    void load();
    return () => controller.abort();
  }, [state, building, tab, filters, offset, revision]);

  useEffect(() => {
    if (!state) return;
    const refresh = () => { if (document.visibilityState === 'visible' && !locked.current) setRevision(n => n + 1); };
    const timer = setInterval(refresh, 45000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [state]);

  useEffect(() => {
    if (confirmIds) confirmationRef.current?.showModal();
    else confirmationRef.current?.close();
  }, [confirmIds]);

  async function mutate(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError(''); setNotice('');
    try { await action(); }
    catch (error) {
      if (error instanceof ApiError && error.status === 401 && state) setState(null);
      setError(errorText(error));
    } finally { locked.current = false; setBusy(false); }
  }
  async function refreshAfterSave() {
    setRevision(n => n + 1);
    try { await refreshState(); }
    catch (error) {
      if (error instanceof ApiError && error.status === 401) setState(null);
      else setLoadError('Your change was saved, but the list could not refresh. Use Refresh to load it again.');
    }
  }
  function changeBuilding(value: string) {
    setBuilding(value); setPending([]); setHistory(emptyHistory); setOtherDoors([]); setOffset(0); setLabel(''); setError(''); setNotice('');
    try { localStorage.setItem('programlist-building', value); } catch { /* Storage is optional. */ }
  }
  function changeTab(value: Tab) { setTab(value); setError(''); setNotice(''); setLoadError(''); }
  function updateFilters(changes: Partial<Filters>) { setFilters(current => ({ ...current, ...changes })); setOffset(0); }
  async function signIn(event: FormEvent) {
    event.preventDefault();
    await mutate(async () => { await api('login', { username, password }); setPassword(''); await refreshState(); });
  }
  async function submitDoor(event: FormEvent) {
    event.preventDefault();
    await mutate(async () => {
      const saved = await api<{ label: string }>('requests', { building, kind, label });
      setLabel(''); setNotice(`${kind === 'room' ? 'Room ' : ''}${saved.label} added to Building ${buildingName}.`);
      await refreshAfterSave();
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  }
  async function complete(ids: string[]) {
    setConfirmIds(null);
    await mutate(async () => {
      const result = await api<{ completed: number }>('complete', { building, ids });
      setNotice(result.completed ? `${result.completed === 1 ? '1 door' : `${result.completed} doors`} marked complete.` : 'Those doors have already been completed. The list has been refreshed.');
      await refreshAfterSave();
    });
  }
  const buildingName = state?.buildings.find(b => b.id === building)?.name || building;
  const filterDateError = filters.from && filters.to && filters.from > filters.to;

  if (starting) return <main className={styles.app}><div className={styles.login}><h1>Programming list</h1><p role="status">Loading…</p></div></main>;
  if (!state) return <main className={styles.app}>
    <div className={styles.login}>
      <h1>Programming list</h1><p className={styles.muted}>Sign in to submit doors and track completed work.</p>
      <form onSubmit={signIn} className={styles.stack}>
        <label>Username<input name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={e => setUsername(e.target.value)} required maxLength={40} /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required maxLength={256} /></label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className={styles.primary} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  </main>;

  return <main className={styles.app}>
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1>Programming list</h1>
        <div className={styles.identity}><span>{state.me.name} <span className={styles.muted}>· {roleLabel[state.me.role]}</span></span><button disabled={busy} onClick={() => void mutate(async () => { await api('logout', {}); setState(null); setPending([]); setHistory(emptyHistory); setTab('pending'); setNotice(''); })}>Sign out</button></div>
      </header>
      <nav className={styles.tabs} aria-label="Programming list views">
        <button aria-current={tab === 'pending' ? 'page' : undefined} disabled={busy} onClick={() => changeTab('pending')}>Needs programming</button>
        <button aria-current={tab === 'history' ? 'page' : undefined} disabled={busy} onClick={() => changeTab('history')}>History</button>
        {state.me.role === 'admin' && <button aria-current={tab === 'manage' ? 'page' : undefined} disabled={busy} onClick={() => changeTab('manage')}>Manage</button>}
      </nav>
      {tab !== 'manage' && <div className={styles.buildingBar}>
        <label>Building<select aria-label="Building" value={building} disabled={busy} onChange={e => changeBuilding(e.target.value)}>{state.buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <button className={styles.quiet} disabled={busy || loading} onClick={() => void mutate(async () => { await refreshState(); setRevision(n => n + 1); })}>{loading ? 'Refreshing…' : 'Refresh'}</button>
      </div>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.success} role="status">{notice}</p>}
      {loadError && <p className={styles.error} role="alert">{loadError}</p>}

      {tab === 'pending' && <div className={styles.workGrid}>
        <section className={`${styles.panel} ${styles.addPanel}`} aria-labelledby="add-heading">
          <h2 id="add-heading">Add a door</h2>
          <div className={styles.segment} aria-label="Door type">
            <button aria-pressed={kind === 'room'} disabled={busy} onClick={() => { setKind('room'); setLabel(''); setError(''); }}>Room number</button>
            <button aria-pressed={kind === 'other'} disabled={busy} onClick={() => { setKind('other'); setLabel(''); setError(''); }}>Other door</button>
          </div>
          <form onSubmit={submitDoor} className={styles.stack}>
            <label>{kind === 'room' ? 'Room number' : 'Other door description'}
              <input ref={inputRef} name="door" value={label} disabled={busy} onChange={e => setLabel(e.target.value)} inputMode={kind === 'room' ? 'numeric' : 'text'} pattern={kind === 'room' ? '[0-9]{3}' : undefined} maxLength={kind === 'other' ? 100 : undefined} title={kind === 'room' ? 'Enter exactly 3 digits, such as 112.' : undefined} placeholder={kind === 'room' ? '112' : '3rd deck lounge'} autoComplete="off" required list={kind === 'other' ? 'other-doors' : undefined} aria-describedby="door-hint" />
            </label>
            <p id="door-hint" className={styles.hint}>{kind === 'room' ? 'Exactly 3 digits' : 'Reuse an existing name to keep its history together.'}</p>
            <datalist id="other-doors">{otherDoors.map(d => <option key={d.door_key} value={d.door_label} />)}</datalist>
            <button className={styles.primary} disabled={busy || !building}>{busy ? 'Saving…' : kind === 'room' ? 'Submit room' : 'Submit door'}</button>
          </form>
        </section>
        <section className={styles.panel} aria-labelledby="pending-heading" aria-busy={loading}>
          <div className={styles.sectionHeader}><h2 id="pending-heading">Needs programming</h2><button className={styles.primary} disabled={busy || loading || !pending.length || !!loadError} onClick={() => setConfirmIds(pending.map(r => r.id))}>Complete all</button></div>
          {!pending.length ? <div className={styles.empty}><h3>{loading ? 'Loading doors…' : loadError ? 'List unavailable' : 'All clear'}</h3><p>{loading ? 'Getting the latest programming list.' : loadError ? 'Use Refresh to try again.' : `No doors are waiting for programming in Building ${buildingName}.`}</p></div> : <div className={styles.doorList}>
            {pending.map(row => <article key={row.id} className={styles.doorRow}>
              <h3>{row.door_label}{row.kind === 'other' && <small>Other door</small>}</h3>
              <div className={styles.submission}><span className={styles.muted}>Submitted by</span><span>{row.submitter} · <time dateTime={new Date(row.submitted_at).toISOString()}>{date(row.submitted_at)}</time></span></div>
              <button className={styles.primary} aria-label={`Mark ${row.door_label} complete`} disabled={busy || loading || !!loadError} onClick={() => void complete([row.id])}>Mark complete</button>
            </article>)}
          </div>}
          <p className={styles.footnote}>Each door is a separate submission.</p>
        </section>
      </div>}

      {tab === 'history' && <section aria-labelledby="history-heading">
        <div className={styles.sectionHeader}><div><h2 id="history-heading">Completed / History</h2><p className={styles.muted}>Find a room’s programming log or filter work by person and date.</p></div></div>
        <div className={`${styles.panel} ${styles.filterPanel}`}>
          <label className={styles.check}><input type="checkbox" checked={filters.allBuildings} onChange={e => updateFilters({ allBuildings: e.target.checked })} />Search all buildings</label>
          <div className={styles.filters}>
            <label>Room / other door<input value={filters.door} onChange={e => updateFilters({ door: e.target.value })} placeholder="All doors" /></label>
            <label>Door type<select value={filters.kind} onChange={e => updateFilters({ kind: e.target.value })}><option value="">All types</option><option value="room">Room number</option><option value="other">Other door</option></select></label>
            <label>Submitted by<select value={filters.submittedBy} onChange={e => updateFilters({ submittedBy: e.target.value })}><option value="">Anyone</option>{state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
            <label>Completed by<select value={filters.completedBy} onChange={e => updateFilters({ completedBy: e.target.value })}><option value="">Anyone</option>{state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
            <label>Status<select value={filters.status} onChange={e => updateFilters({ status: e.target.value })}><option value="completed">Completed</option><option value="all">All requests</option><option value="pending">Pending</option></select></label>
            <label>Date to filter<select value={filters.dateField} onChange={e => updateFilters({ dateField: e.target.value })}><option value="submitted">Submitted</option><option value="completed">Completed</option></select></label>
            <label>From<input type="date" value={filters.from} max={filters.to || undefined} onChange={e => updateFilters({ from: e.target.value, month: '' })} /></label>
            <label>Through<input type="date" value={filters.to} min={filters.from || undefined} onChange={e => updateFilters({ to: e.target.value, month: '' })} /></label>
          </div>
          <div className={styles.filterActions}>
            <label>Month<input aria-label="Month" type="month" value={filters.month} onChange={e => updateFilters(monthDates(e.target.value))} /></label>
            <button onClick={() => updateFilters(monthDates(localDate(new Date()).slice(0, 7)))}>This month</button>
            <button className={styles.quiet} onClick={() => { setFilters(initialFilters); setOffset(0); }}>Clear filters</button>
          </div>
          {filterDateError && <p role="alert" className={styles.error}>The start date must come before the end date.</p>}
        </div>
        {!loadError && !filterDateError && <>
          <div className={styles.historySummary} aria-live="polite"><p><strong>{loading ? '…' : history.completedCount}</strong> {filters.door ? 'times programmed' : 'doors programmed'} <span className={styles.muted}>· all time{filters.door ? ` for ${filters.door.trim()}` : ''}{!filters.allBuildings ? ` in Building ${buildingName}` : ' across all buildings'}</span></p><span className={styles.muted}>{loading ? 'Loading matching entries…' : `${history.pendingCount} pending · ${history.total} matching ${history.total === 1 ? 'entry' : 'entries'}`}</span></div>
          <p className={styles.hint}>All-time totals ignore person, date, and status filters. Pending requests do not count as programmed.</p>
          <div className={styles.historyTable} aria-busy={loading}>
            <div className={styles.tableHead}><span>Building / Door</span><span>Submitted</span><span>Completed</span><span>Status</span></div>
            {loading || !history.rows.length ? <div className={styles.empty}><h3>{loading ? 'Loading history…' : 'No matching entries'}</h3><p>Completed work stays here, even when a door is submitted again.</p></div> : history.rows.map(row => <article key={row.id} className={styles.historyRow}>
              <div><span className={styles.mobileLabel}>Building / Door</span><strong>{row.building} · {row.door_label}</strong>{row.kind === 'other' && <small>Other door</small>}</div>
              <div><span className={styles.mobileLabel}>Submitted</span><span>{row.submitter}</span><time dateTime={new Date(row.submitted_at).toISOString()}>{date(row.submitted_at)}</time></div>
              <div><span className={styles.mobileLabel}>Completed</span><span>{row.completer || 'Awaiting programming'}</span>{row.completed_at && <time dateTime={new Date(row.completed_at).toISOString()}>{date(row.completed_at)}</time>}</div>
              <span className={row.completed_at ? styles.completed : styles.waiting}>{row.completed_at ? 'Complete' : 'Pending'}</span>
            </article>)}
          </div>
          <div className={styles.pagination}><span className={styles.muted}>{history.total ? `${offset + 1}–${Math.min(offset + 50, history.total)} of ${history.total}` : '0 entries'}</span><button disabled={offset === 0 || loading} onClick={() => setOffset(n => Math.max(0, n - 50))}>Previous</button><button disabled={offset + 50 >= history.total || loading} onClick={() => setOffset(n => n + 50)}>Next</button></div>
        </>}
      </section>}

      {tab === 'manage' && state.me.role === 'admin' && <Manage state={state} busy={busy} save={async (path, values, message) => {
        let saved = false;
        await mutate(async () => { await api(path, values); saved = true; setNotice(message); await refreshAfterSave(); });
        return saved;
      }} />}
      <dialog ref={confirmationRef} className={styles.dialog} onCancel={() => setConfirmIds(null)} onClose={() => setConfirmIds(null)}>
        <h2>Complete all pending doors?</h2><p>Mark {confirmIds?.length || 0} doors in <strong>Building {buildingName}</strong> complete as {state.me.name}.</p><p className={styles.muted}>Only the requests currently shown will be completed.</p>
        <div className={styles.dialogActions}><button autoFocus onClick={() => setConfirmIds(null)}>Cancel</button><button className={styles.primary} onClick={() => confirmIds && void complete(confirmIds)}>Complete {confirmIds?.length || 0} doors</button></div>
      </dialog>
    </div>
  </main>;
}

function Manage({ state, busy, save }: { state: State; busy: boolean; save: (path: string, values: unknown, message: string) => Promise<boolean> }) {
  const [buildingName, setBuildingName] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('member');
  const [resetUser, setResetUser] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  return <div className={styles.manageGrid}>
    <section className={styles.panel}><h2>Buildings</h2><p className={styles.muted}>{state.buildings.map(b => b.name).join(' · ')}</p>
      <form className={styles.stack} onSubmit={async e => { e.preventDefault(); if (await save('admin/buildings', { name: buildingName }, `Building ${buildingName} added.`)) setBuildingName(''); }}>
        <label>New building number<input value={buildingName} onChange={e => setBuildingName(e.target.value)} inputMode="numeric" pattern="[0-9]+" maxLength={20} required /></label><button className={styles.primary} disabled={busy}>Add building</button>
      </form>
    </section>
    <section className={styles.panel}><h2>Add a team member</h2><form className={styles.stack} onSubmit={async e => { e.preventDefault(); if (await save('admin/users', { name, role, password: newPassword }, `${name} added.`)) { setName(''); setNewPassword(''); } }}>
      <label>First name<input autoComplete="off" value={name} onChange={e => setName(e.target.value)} maxLength={40} required /></label>
      <label>Role<select value={role} onChange={e => setRole(e.target.value)}><option value="member">Team member</option><option value="programmer">Programmer</option></select></label>
      <label>Password<input type="password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} maxLength={256} required /></label>
      <button className={styles.primary} disabled={busy}>Add user</button>
    </form></section>
    <section className={`${styles.panel} ${styles.wide}`}><h2>Team</h2><p className={styles.muted}>Everyone can submit and complete doors. Inactive users remain in history.</p>
      <div className={styles.users}>{state.users.map(u => <div className={styles.userRow} key={u.id}><strong>{u.name}</strong>{u.role === 'admin' ? <span>Admin</span> : <select aria-label={`Role for ${u.name}`} value={u.role} disabled={busy} onChange={e => void save('admin/user', { id: u.id, role: e.target.value }, `${u.name}’s role updated.`)}><option value="member">Team member</option><option value="programmer">Programmer</option></select>}<span className={u.active ? styles.completed : styles.muted}>{u.active ? 'Active' : 'Inactive'}</span>{u.role !== 'admin' && <button disabled={busy} onClick={() => void save('admin/user', { id: u.id, active: !u.active }, `${u.name} ${u.active ? 'deactivated' : 'reactivated'}.`)}>{u.active ? 'Deactivate' : 'Reactivate'}</button>}</div>)}</div>
    </section>
    <section className={styles.panel}><h2>Change a password</h2><form className={styles.stack} onSubmit={async e => { e.preventDefault(); if (await save('admin/user', { id: resetUser, password: resetPassword }, 'Password updated. That user will need to sign in again.')) setResetPassword(''); }}>
      <label>Username<select value={resetUser} onChange={e => setResetUser(e.target.value)} required><option value="">Select a user</option>{state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
      <label>New password<input type="password" autoComplete="new-password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} maxLength={256} required /></label><button className={styles.primary} disabled={busy}>Update password</button>
    </form></section>
  </div>;
}
