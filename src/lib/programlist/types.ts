export type Role = 'admin' | 'programmer' | 'member';
export type Person = { id: string; name: string; role: Role; active: number };
export type Building = { id: string; name: string; pending: number };
export type DoorRequest = {
  id: string; building_id: string; building: string; kind: 'room' | 'other';
  door_label: string; door_key: string; submitted_by: string; submitter: string;
  submitted_at: number; completed_by: string | null; completer: string | null;
  completed_at: number | null;
};
export type State = { me: Person; users: Person[]; buildings: Building[]; completedToday: number };
export type HistoryResult = { rows: DoorRequest[]; total: number; completedCount: number; pendingCount: number };
