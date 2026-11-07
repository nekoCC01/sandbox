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
  get tempoSeconds() { return Object.values(this.tempo).reduce((a,b) => a+b, 0); }
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
const map = (rows, Type=Entity, catalog) => new Map(rows.map(r => [r.id, new Type(r, catalog)]));
export class Catalog {
  constructor(raw) {
    for (const key of ['sources','regions','muscleGroups','muscles','movements','families','exercises','units','routines','schedules','journeys']) {
      if (!Array.isArray(raw[key]) || new Set(raw[key].map(x=>x.id)).size !== raw[key].length) throw Error(`Ungültiger Katalog: ${key}`);
    }
    Object.assign(this, {sources:map(raw.sources), regions:map(raw.regions), movements:map(raw.movements), families:map(raw.families)});
    const requireRef = (table,id) => { if (id != null && !table.has(id)) throw Error(`Unbekannte Referenz: ${id}`); };
    raw.muscleGroups.forEach(g=>requireRef(this.regions,g.regionId));
    this.groups = map(raw.muscleGroups, MuscleGroup, this);
    raw.muscles.forEach(m=>requireRef(this.groups,m.groupId)); this.muscles = map(raw.muscles);
    raw.families.forEach(f=>{ requireRef(this.movements,f.movementId); [...f.primaryGroupIds,...f.secondaryGroupIds].forEach(id=>requireRef(this.groups,id)); requireRef(this.sources,f.sourceId); });
    raw.exercises.forEach(e=>{ requireRef(this.families,e.familyId); requireRef(this.movements,e.movementId); requireRef(this.sources,e.sourceId); });
    this.exercises = map(raw.exercises, Exercise, this);
    raw.units.forEach(u=>u.slots.forEach(s=>{ requireRef(this.exercises,s.exerciseId); requireRef(this.movements,s.movementId); }));
    this.units = map(raw.units, Unit, this);
    raw.routines.forEach(r=>r.unitIds.forEach(id=>requireRef(this.units,id))); this.routines = map(raw.routines, Routine, this);
    raw.schedules.forEach(s=>s.days.forEach(d=>requireRef(this.routines,d.routineId))); this.schedules = map(raw.schedules);
    raw.journeys.forEach(j=>requireRef(this.schedules,j.scheduleId)); this.journeys = map(raw.journeys);
  }
}
export const emptyUser = () => ({schemaVersion:1,sessions:[],goals:[],plannedSessions:[]});
const dateValid = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0,10) === d;
const number = (n,min,max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
const str = (s,max=500) => typeof s === 'string' && s.length <= max;
export function validateUser(data, catalog) {
  if (!data || data.schemaVersion !== 1) throw Error('Unbekanntes Datenformat (schemaVersion 1 erwartet).');
  for (const key of ['sessions','goals','plannedSessions']) {
    const rows = data[key];
    if (!Array.isArray(rows) || rows.length > 50000) throw Error(`Ungültige Sammlung: ${key}`);
    const ids = new Set();
    for (const row of rows) {
      if (!row || !str(row.id,100) || !row.id || ids.has(row.id)) throw Error(`Ungültige oder doppelte ID in ${key}.`);
      if (row.createdAt !== undefined && (!str(row.createdAt,40) || Number.isNaN(Date.parse(row.createdAt)))) throw Error('Ungültiger Erfassungszeitpunkt.');
      ids.add(row.id);
    }
  }
  for (const s of data.sessions) {
    if (!dateValid(s.date) || !str(s.notes) || !str(s.context,100) || !Array.isArray(s.entries) || !s.entries.length || s.entries.length > 100) throw Error('Ungültige Trainingseinheit.');
    for (const e of s.entries) {
      if (!catalog.exercises.has(e.exerciseId) || !str(e.loadNote,100) || !number(e.loadKg,0,1000) || !Array.isArray(e.sets) || !e.sets.length || e.sets.length > 20) throw Error('Ungültige Übung oder Last.');
      for (const set of e.sets) if (!number(set.reps,1,1000) || !Number.isInteger(set.reps) || (!number(set.effort,1,5) || !Number.isInteger(set.effort))) throw Error('Ungültige Wiederholungen oder Anstrengung.');
    }
  }
  for (const g of data.goals) if (!catalog.exercises.has(g.exerciseId) || !dateValid(g.deadline) || !number(g.targetReps,1,1000) || !Number.isInteger(g.targetReps) || !number(g.targetKg,0,1000) || !str(g.loadNote,100) || !str(g.context,100)) throw Error('Ungültiges Ziel.');
  for (const p of data.plannedSessions) if (!dateValid(p.date) || !catalog.routines.has(p.routineId) || !number(p.rounds,1,4) || !Number.isInteger(p.rounds) || (p.routineId === '6x' && p.rounds > 2)) throw Error('Ungültiger Planungseintrag.');
  return data;
}
export function mergeUser(base, incoming) {
  return Object.fromEntries([['schemaVersion',1], ...['sessions','goals','plannedSessions'].map(k => [k,[...new Map([...base[k],...incoming[k]].map(r=>[r.id,r])).values()]])]);
}
export class TrainingSession extends Entity {
  get totalSets() { return this.entries.reduce((n,e)=>n+e.sets.length,0); }
}
export class TrainingLog {
  constructor(user,catalog) { this.user=user; this.catalog=catalog; this.sessions=user.sessions.map(s=>new TrainingSession(s)); }
  history(exerciseId,context=null,loadNote=null) {
    return this.sessions.filter(s=>(context===null || s.context===context)).flatMap(s=>s.entries.filter(e=>e.exerciseId===exerciseId && (loadNote===null || e.loadNote===loadNote)).map(e=>({...e,date:s.date,context:s.context,sessionId:s.id,createdAt:s.createdAt}))).sort((a,b)=>a.date.localeCompare(b.date)||(a.createdAt||'').localeCompare(b.createdAt||''));
  }
  exposure(from,to) {
    const result = Object.fromEntries([...this.catalog.groups.keys()].map(id=>[id,0]));
    for (const s of this.sessions.filter(s=>s.date>=from && s.date<=to)) for (const e of s.entries) {
      const exercise=this.catalog.exercises.get(e.exerciseId);
      for (const g of exercise.primaryGroups) result[g.id]+=e.sets.length;
      for (const g of exercise.secondaryGroups) result[g.id]+=e.sets.length*.5;
    }
    return result;
  }
  goalStatus(goal) {
    // Only the same variant, context and band/assistance notation is comparable.
    const comparable=this.history(goal.exerciseId,goal.context,goal.loadNote);
    const qualified=comparable.filter(e=>e.loadKg>=goal.targetKg && e.sets.some(s=>s.reps>=goal.targetReps));
    return {achieved:qualified.length>0, latest:comparable.at(-1), achievedOn:qualified[0]?.date};
  }
  progressionHint() {
    for (const exercise of this.catalog.exercises.values()) {
      if (exercise.family.kind !== 'integrated') continue;
      const recent = this.history(exercise.id).slice(-2);
      if (recent.length !== 2) continue;
      const [a,b] = recent;
      if (a.context===b.context && a.loadKg===b.loadKg && a.loadNote===b.loadNote && a.sets.length===b.sets.length && recent.every(e=>e.sets.every(s=>s.reps>=12))) return {exercise,latest:b};
    }
    return null;
  }
  milestones() {
    const records=new Map(), milestones=[];
    for (const s of [...this.sessions].sort((a,b)=>a.date.localeCompare(b.date)||(a.createdAt||'').localeCompare(b.createdAt||''))) for (const e of s.entries) {
      const key=JSON.stringify([e.exerciseId,s.context,e.loadKg,e.loadNote]);
      const reps=Math.max(...e.sets.map(x=>x.reps));
      if (!records.has(key) || reps>records.get(key)) { records.set(key,reps); milestones.push({date:s.date,exerciseId:e.exerciseId,reps,loadKg:e.loadKg,loadNote:e.loadNote,context:s.context}); }
    }
    return milestones.reverse();
  }
}
