export class Entity {
  constructor(raw) { Object.assign(this, raw); }
}
export class MuscleGroup extends Entity {
  constructor(raw, catalog) { super(raw); this.region = catalog.regions.get(this.regionId); }
}
export class Exercise extends Entity {
  constructor(raw, catalog) {
    super(raw);
    this.family = catalog.families.get(this.familyId);
    this.movement = catalog.movements.get(this.movementId ?? this.family.movementId);
    this.primaryGroups = this.family.primaryGroupIds.map(id => catalog.groups.get(id));
    this.secondaryGroups = this.family.secondaryGroupIds.map(id => catalog.groups.get(id));
    this.source = catalog.sources.get(this.sourceId);
  }
  get groups() { return [...this.primaryGroups, ...this.secondaryGroups]; }
  get weighted() { return this.loadMode === 'external'; }
  get tempoSeconds() { return Object.values(this.tempo ?? {}).reduce((a, b) => a + b, 0); }
  variants(catalog) { return [...catalog.exercises.values()].filter(e => e.familyId === this.familyId && e.id !== this.id); }
}
export class Unit extends Entity {
  constructor(raw, catalog) { super(raw); this.exercises = this.slots.map(s => catalog.exercises.get(s.exerciseId)); }
}
export class Routine extends Entity {
  constructor(raw, catalog) { super(raw); this.units = this.unitIds.map(id => catalog.units.get(id)); }
  get slots() { return this.units.flatMap(u => u.slots); }
  get targetSets() { return this.slots.length * this.rounds; }
}
const map = (rows, Type = Entity, catalog) => new Map(rows.map(r => [r.id, new Type(r, catalog)]));
export class Catalog {
  constructor(raw) {
    for (const key of ['sources', 'regions', 'muscleGroups', 'muscles', 'movements', 'families', 'exercises', 'units', 'routines', 'schedules', 'journeys']) {
      if (!Array.isArray(raw[key]) || new Set(raw[key].map(x => x.id)).size !== raw[key].length) throw Error(`Ungültiger Katalog: ${key}`);
    }
    Object.assign(this, { sources: map(raw.sources), regions: map(raw.regions), movements: map(raw.movements), families: map(raw.families) });
    const requireRef = (table, id) => { if (id != null && !table.has(id)) throw Error(`Unbekannte Referenz: ${id}`); };
    raw.muscleGroups.forEach(g => requireRef(this.regions, g.regionId));
    this.groups = map(raw.muscleGroups, MuscleGroup, this);
    raw.muscles.forEach(m => requireRef(this.groups, m.groupId)); this.muscles = map(raw.muscles);
    raw.families.forEach(f => { requireRef(this.movements, f.movementId);[...f.primaryGroupIds, ...f.secondaryGroupIds].forEach(id => requireRef(this.groups, id)); requireRef(this.sources, f.sourceId); });
    raw.exercises.forEach(e => { requireRef(this.families, e.familyId); requireRef(this.movements, e.movementId); requireRef(this.sources, e.sourceId); });
    this.exercises = map(raw.exercises, Exercise, this);
    raw.units.forEach(u => u.slots.forEach(s => { requireRef(this.exercises, s.exerciseId); requireRef(this.movements, s.movementId); }));
    this.units = map(raw.units, Unit, this);
    raw.routines.forEach(r => r.unitIds.forEach(id => requireRef(this.units, id))); this.routines = map(raw.routines, Routine, this);
    raw.schedules.forEach(s => s.days.forEach(d => requireRef(this.routines, d.routineId))); this.schedules = map(raw.schedules);
    raw.journeys.forEach(j => requireRef(this.schedules, j.scheduleId)); this.journeys = map(raw.journeys);
    validateWorkouts(raw.workouts ?? [], this); this.workouts = map(raw.workouts ?? [], Workout);
  }
}
export class Workout extends Entity {}
export const emptyUser = () => ({ schemaVersion: 1, sessions: [], goals: [], plannedSessions: [], workouts: [] });
const dateValid = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d;
const number = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
const str = (s, max = 500) => typeof s === 'string' && s.length <= max;
// Video prescriptions and actual performance deliberately use separate objects.
const optional = (value, check) => value == null || check(value);
const textOptional = v => optional(v, x => str(x, 20000));
const urlValid = v => optional(v, x => { try { return ['http:', 'https:'].includes(new URL(x).protocol); } catch { return false; } });
export function validateMetrics(m) {
  if (!m || typeof m !== 'object' || Array.isArray(m)) throw Error('Ungültige Messwerte.');
  for (const [key, min, max] of [['reps',1,1000], ['durationSeconds',0,86400], ['loadKg',0,1000], ['effort',1,5]]) {
    if (!optional(m[key], n => number(n,min,max) && (!['reps','effort'].includes(key) || Number.isInteger(n)))) throw Error(`Ungültiger Wert: ${key}`);
  }
  if (m.repsRange != null && (!Array.isArray(m.repsRange) || m.repsRange.length !== 2 || !m.repsRange.every(n => number(n,1,1000) && Number.isInteger(n)) || m.repsRange[0] > m.repsRange[1])) throw Error('Ungültiger Wiederholungsbereich.');
  if (!optional(m.side, x => ['left','right','both','alternating'].includes(x)) || !optional(m.loadBasis, x => ['total','perDumbbell','unknown'].includes(x)) || !textOptional(m.notes) || !textOptional(m.loadNote)) throw Error('Ungültige Messwertdetails.');
  if (m.uncertain != null && typeof m.uncertain !== 'boolean') throw Error('Ungültige Unsicherheit.');
  if (m.tempo != null && (typeof m.tempo !== 'object' || !Object.values(m.tempo).every(n => number(n,0,3600)))) throw Error('Ungültiges Tempo.');
}
export function validateWorkouts(rows, catalog) {
  if (!Array.isArray(rows) || rows.length > 50000) throw Error('Ungültige Trainingsvorlagen.');
  const ids = new Set();
  for (const w of rows) {
    if (!w || !str(w.id,100) || !w.id || ids.has(w.id) || !str(w.name,300) || !w.name || !['fitness-plus','custom'].includes(w.type) || !urlValid(w.url) || !textOptional(w.trainer) || !textOptional(w.notes) || !optional(w.durationSeconds,n => number(n,0,86400)) || !Array.isArray(w.slots) || w.slots.length > 500) throw Error('Ungültige Trainingsvorlage.');
    ids.add(w.id); validateMetrics(w.defaults ?? {});
    const slots = new Set();
    for (const slot of w.slots) {
      if (!str(slot.id,100) || !slot.id || slots.has(slot.id) || (slot.exerciseId != null && !catalog.exercises.has(slot.exerciseId)) || !textOptional(slot.label) || !textOptional(slot.notes)) throw Error('Ungültiger Übungsslot.');
      slots.add(slot.id); validateMetrics(slot.defaults ?? {});
    }
  }
  return rows;
}
export function allWorkouts(catalog, user) { return new Map([...(catalog.workouts ?? new Map()), ...(user.workouts ?? []).map(w => [w.id,w])]); }
export function videoDefaults(workout, slotId) { return { ...workout?.defaults, ...workout?.slots.find(s => s.id === slotId)?.defaults }; }
// Only dated, confirmed sessions enter time-based statistics.
export const datedSession = s => !!s.date && s.status !== 'review';
// Flatten known, comparable actual values; never substitute video weights/durations.
export function comparableEntries(entry) {
  const groups = new Map();
  if (!entry.sets.length && !entry.uncertain && entry.loadBasis !== 'unknown' && Number.isFinite(entry.loadKg)) return [{...entry,complete:false}];
  for (const set of entry.sets) {
    const actual = { ...entry, ...set };
    if (actual.uncertain || actual.loadBasis === 'unknown' || !Number.isFinite(actual.loadKg)) continue;
    const key = JSON.stringify([actual.loadKg,actual.loadBasis ?? 'total',actual.side ?? '',actual.loadNote ?? '']);
    if (!groups.has(key)) groups.set(key,{...actual,sets:[]});
    groups.get(key).sets.push(set);
  }
  return [...groups.values()].map(e => ({...e,complete: e.sets.length === entry.sets.length}));
}
export function validateUser(data, catalog) {
  if (!data || data.schemaVersion !== 1) throw Error('Unbekanntes Datenformat (schemaVersion 1 erwartet).');
  for (const key of ['sessions', 'goals', 'plannedSessions']) {
    const rows = data[key];
    if (!Array.isArray(rows) || rows.length > 50000) throw Error(`Ungültige Sammlung: ${key}`);
    const ids = new Set();
    for (const row of rows) {
      if (!row || !str(row.id, 100) || !row.id || ids.has(row.id)) throw Error(`Ungültige oder doppelte ID in ${key}.`);
      if (row.createdAt !== undefined && (!str(row.createdAt, 40) || Number.isNaN(Date.parse(row.createdAt)))) throw Error('Ungültiger Erfassungszeitpunkt.');
      ids.add(row.id);
    }
  }
  validateWorkouts(data.workouts ?? [], catalog);
  const workouts = allWorkouts(catalog, data);
  for (const s of data.sessions) {
    if ((!dateValid(s.date) && !(s.date == null && s.status === 'review')) || !textOptional(s.notes) || !str(s.context, 100) || !textOptional(s.title) || !textOptional(s.dateLabel) || !optional(s.status,x => ['completed','review'].includes(x)) || !optional(s.workoutId,id => workouts.has(id)) || !urlValid(s.url) || !Array.isArray(s.entries) || s.entries.length > 500) throw Error('Ungültige Trainingseinheit.');
    validateMetrics(s);
    if (!s.entries.length && !s.workoutId && !s.title) throw Error('Training ohne Inhalt.');
    for (const e of s.entries) {
      if (!catalog.exercises.has(e.exerciseId) || !Array.isArray(e.sets) || e.sets.length > 100) throw Error('Ungültige Übung oder Sätze.');
      if (!optional(e.slotId,id => str(id,100))) throw Error('Ungültiger Übungsslot.');
      if (e.videoPrescription != null) validateMetrics(e.videoPrescription);
      validateMetrics(e);
      for (const set of e.sets) validateMetrics(set);
    }
  }
  for (const g of data.goals) if (!catalog.exercises.has(g.exerciseId) || !dateValid(g.deadline) || !number(g.targetReps, 1, 1000) || !Number.isInteger(g.targetReps) || !number(g.targetKg, 0, 1000) || !str(g.loadNote, 100) || !str(g.context, 100)) throw Error('Ungültiges Ziel.');
  for (const p of data.plannedSessions) if (!dateValid(p.date) || !catalog.routines.has(p.routineId) || !number(p.rounds, 1, 4) || !Number.isInteger(p.rounds) || (p.routineId === '6x' && p.rounds > 2)) throw Error('Ungültiger Planungseintrag.');
  return data;
}
export function mergeUser(base, incoming) {
  return Object.fromEntries([['schemaVersion', 1], ...['sessions', 'goals', 'plannedSessions', 'workouts'].map(k => [k, [...new Map([...(base[k] ?? []), ...(incoming[k] ?? [])].map(r => [r.id, r])).values()]])]);
}
export class TrainingSession extends Entity {
  get totalSets() { return this.entries.reduce((n, e) => n + e.sets.length, 0); }
}
export class TrainingLog {
  constructor(user, catalog) { this.user = user; this.catalog = catalog; this.sessions = user.sessions.map(s => new TrainingSession(s)); }
  history(exerciseId, context = null, loadNote = null) {
    return this.sessions.filter(s => datedSession(s) && (context === null || s.context === context)).flatMap(s => s.entries.filter(e => e.exerciseId === exerciseId).flatMap(comparableEntries).filter(e => loadNote === null || (e.loadNote ?? '') === loadNote).map(e => ({ ...e, date: s.date, context: s.context, sessionId: s.id, createdAt: s.createdAt }))).sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''));
  }
  exposure(from, to) {
    const result = Object.fromEntries([...this.catalog.groups.keys()].map(id => [id, 0]));
    for (const s of this.sessions.filter(s => datedSession(s) && s.date >= from && s.date <= to)) for (const e of s.entries) {
      const exercise = this.catalog.exercises.get(e.exerciseId);
      for (const g of exercise.primaryGroups) result[g.id] += e.sets.length;
      for (const g of exercise.secondaryGroups) result[g.id] += e.sets.length * .5;
    }
    return result;
  }
  goalStatus(goal) {
    // Only the same variant, context and band/assistance notation is comparable.
    const comparable = this.history(goal.exerciseId, goal.context, goal.loadNote).filter(e => (e.loadBasis ?? 'total') === 'total' && !e.side && e.sets.some(s => Number.isInteger(s.reps)));
    const qualified = comparable.filter(e => (e.loadBasis ?? 'total') === 'total' && !e.side && e.loadKg >= goal.targetKg && e.sets.some(s => s.reps >= goal.targetReps));
    return { achieved: qualified.length > 0, latest: comparable.at(-1), achievedOn: qualified[0]?.date };
  }
  progressionHint() {
    for (const exercise of this.catalog.exercises.values()) {
      if (exercise.family.kind !== 'integrated') continue;
      const recent = this.history(exercise.id).slice(-2);
      if (recent.length !== 2) continue;
      const [a, b] = recent;
      if (a.sessionId !== b.sessionId && a.context === b.context && a.loadKg === b.loadKg && a.loadNote === b.loadNote && a.loadBasis === b.loadBasis && a.side === b.side && a.sets.length === b.sets.length && recent.every(e => e.complete && e.sets.every(s => s.reps >= 12))) return { exercise, latest: b };
    }
    return null;
  }
  milestones() {
    const records = new Map(), milestones = [];
    for (const s of this.sessions.filter(datedSession).sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''))) for (const entry of s.entries) for (const e of comparableEntries(entry)) {
      const key = JSON.stringify([e.exerciseId, s.context, e.loadKg, e.loadNote, e.loadBasis ?? 'total', e.side]);
      const knownReps = e.sets.map(x => x.reps).filter(Number.isInteger);
      if (!knownReps.length) continue;
      const reps = Math.max(...knownReps);
      if (!records.has(key) || reps > records.get(key)) { records.set(key, reps); milestones.push({ date: s.date, exerciseId: e.exerciseId, reps, loadKg: e.loadKg, loadNote: e.loadNote, loadBasis: e.loadBasis, side: e.side, context: s.context }); }
    }
    return milestones.reverse();
  }
}
