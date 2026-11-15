export const SCHEMA_VERSION = 2;
export const emptyUser = () => ({schemaVersion: 2, sessions: []});
const fail = message => { throw Error(message); };
const text = (v, max=500) => typeof v === 'string' && v.length > 0 && v.length <= max;
const positive = v => typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= 86400;
const weight = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1000;
const dateValid = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
const urlValid = v => { try { return ['http:','https:'].includes(new URL(v).protocol); } catch { return false; } };
function rows(values, name) {
  if (!Array.isArray(values) || values.length > 50000 || values.some(v => !v || !text(v.id,100)) || new Set(values.map(v=>v.id)).size !== values.length) fail(`Ungültige Sammlung: ${name}`);
  return new Map(values.map(v=>[v.id,v]));
}
function defaults(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k=>!['durationSeconds','reps','loadKg'].includes(k))) fail('Ungültige Vorgaben.');
  if (value.durationSeconds != null && !positive(value.durationSeconds) || value.reps != null && (!positive(value.reps) || !Number.isInteger(value.reps)) || value.loadKg != null && !weight(value.loadKg)) fail('Ungültige Vorgaben.');
}
export class Catalog {
  constructor(raw) {
    if (raw.schemaVersion !== 2) fail('Katalog benötigt schemaVersion 2.');
    for (const key of ['sources','regions','muscleGroups','muscles','movements','families','exercises','workouts']) this[key === 'muscleGroups' ? 'groups' : key] = rows(raw[key],key);
    const ref = (map,id) => { if (!map.has(id)) fail(`Unbekannte Referenz: ${id}`); };
    for (const g of this.groups.values()) ref(this.regions,g.regionId);
    for (const m of this.muscles.values()) ref(this.groups,m.groupId);
    for (const f of this.families.values()) { if(f.movementId) ref(this.movements,f.movementId); for(const id of [...f.primaryGroupIds,...f.secondaryGroupIds]) ref(this.groups,id); }
    this.exercises = new Map([...this.exercises].map(([id,e])=> {
      ref(this.families,e.familyId); const family=this.families.get(e.familyId); const movementId=e.movementId ?? family.movementId; if(movementId) ref(this.movements,movementId);
      if (!['reps','duration'].includes(e.measurement) || e.equipment.some(k=>k!=='dumbbell') || e.equipment.includes('dumbbell') && ![1,2].includes(e.dumbbells)) fail('Ungültige Übung.');
      return [id,{...e,family,movement:this.movements.get(movementId),primaryGroups:family.primaryGroupIds.map(id=>this.groups.get(id)),secondaryGroups:family.secondaryGroupIds.map(id=>this.groups.get(id))}];
    }));
    for (const w of this.workouts.values()) {
      if (!text(w.name,300) || !['fitness-plus','custom','single'].includes(w.type) || w.url != null && !urlValid(w.url) || !Array.isArray(w.slots) || !w.slots.length || w.slots.length>500) fail('Ungültiges Workout.');
      defaults(w.defaults); rows(w.slots,'Slots');
      for (const s of w.slots) { ref(this.exercises,s.exerciseId); defaults(s.defaults); const d=slotDefaults(w,s); if(w.type!=='single' && !d.reps && !d.durationSeconds) fail('Workout benötigt Zeit oder Wiederholungen pro Slot.'); }
    }
  }
}
export const slotDefaults = (w,s) => ({...w.defaults,...s.defaults});
export function resolveEntry(exercise, values, prescription) {
  const loadKg=exercise.equipment.includes('dumbbell') ? values.loadKg : undefined;
  if(exercise.equipment.includes('dumbbell') && !weight(loadKg)) fail('Bitte das tatsächliche Gewicht pro Hantel eintragen.');
  const result={...(loadKg!=null?{loadKg}:{}), prescription:{...prescription}};
  if(exercise.measurement==='duration') {
    const durationSeconds=values.durationSeconds ?? prescription.durationSeconds;
    if(!positive(durationSeconds)) fail('Bitte die aktive Dauer eintragen.');
    return {...result,durationSeconds};
  }
  if(values.reps!=null) {
    if(!positive(values.reps)||!Number.isInteger(values.reps)) fail('Bitte eine ganze Wiederholungszahl eintragen.');
    return {...result,reps:values.reps,repsSource:'manual',...(prescription.durationSeconds?{durationSeconds:prescription.durationSeconds}:{})};
  }
  if(prescription.durationSeconds) return {...result,reps:Math.round(prescription.durationSeconds/5*10)/10,repsSource:'estimated',durationSeconds:prescription.durationSeconds};
  if(prescription.reps) return {...result,reps:prescription.reps,repsSource:'prescribed'};
  fail('Bitte Wiederholungen eintragen.');
}
export function validateUser(data,catalog) {
  if(!data || data.schemaVersion!==2 || Object.keys(data).some(k=>!['schemaVersion','sessions'].includes(k))) fail('Nur das neue Datenformat (schemaVersion 2) kann importiert werden. Alte Daten bleiben im Archiv.');
  rows(data.sessions,'Sessions');
  for(const s of data.sessions) {
    const w=catalog.workouts.get(s.workoutId);
    if(!w || !dateValid(s.date) || s.notes!=null && (typeof s.notes!=='string'||s.notes.length>20000) || !Array.isArray(s.entries) || s.entries.length!==w.slots.length || s.createdAt!=null && !Number.isFinite(Date.parse(s.createdAt))) fail('Ungültige Session.');
    const ids=new Set();
    for(const e of s.entries) {
      const slot=w.slots.find(slot=>slot.id===e.slotId), ex=catalog.exercises.get(e.exerciseId);
      if(!slot || slot.exerciseId!==e.exerciseId || ids.has(e.slotId)) fail('Ungültige Übungszuordnung.'); ids.add(e.slotId);
      if(Object.keys(e).some(k=>!['slotId','exerciseId','loadKg','loadUnresolvedKg','reps','repsSource','durationSeconds','prescription'].includes(k))) fail('Unbekannte Messwerte.');
      defaults(e.prescription);
      if (e.loadUnresolvedKg != null && (!s.source?.originalText || !weight(e.loadUnresolvedKg) || e.loadKg != null)) fail('Ungeklärtes Gewicht benötigt eine Originalquelle.');
      if(ex.equipment.includes('dumbbell') ? !weight(e.loadKg) && !weight(e.loadUnresolvedKg) : e.loadKg!=null || e.loadUnresolvedKg!=null) fail('Ungültiges Gewicht.');
      if(e.durationSeconds!=null && !positive(e.durationSeconds)) fail('Ungültige Dauer.');
      if(ex.measurement==='duration') { if(!positive(e.durationSeconds)||e.reps!=null||e.repsSource!=null) fail('Halteübungen benötigen eine Dauer.'); }
      else {
        if(!positive(e.reps)||!['manual','estimated','prescribed'].includes(e.repsSource)||e.repsSource!=='estimated'&&!Number.isInteger(e.reps)) fail('Ungültige Wiederholungen.');
        if(e.repsSource==='estimated' && (!positive(e.prescription?.durationSeconds)||e.reps!==Math.round(e.prescription.durationSeconds/5*10)/10||e.durationSeconds!==e.prescription.durationSeconds)) fail('Ungültige Schätzung.');
        if(e.repsSource==='prescribed' && e.reps!==e.prescription?.reps) fail('Ungültige Wiederholungsvorgabe.');
      }
    }
  }
  return data;
}
export function mergeUser(base,incoming) { return {schemaVersion:2,sessions:[...new Map([...base.sessions,...incoming.sessions].map(s=>[s.id,s])).values()]}; }
export const activeSeconds = e => e.durationSeconds ?? e.reps*5;
export class TrainingLog {
  constructor(user,catalog) { this.sessions=user.sessions; this.catalog=catalog; }
  inRange(from,to) { return this.sessions.filter(s=>s.date>=from&&s.date<=to); }
  exposure(from,to) {
    const values=Object.fromEntries([...this.catalog.groups.keys()].map(id=>[id,0]));
    for(const s of this.inRange(from,to)) for(const e of s.entries) { const ex=this.catalog.exercises.get(e.exerciseId), seconds=activeSeconds(e); for(const g of ex.primaryGroups) values[g.id]+=seconds; for(const g of ex.secondaryGroups) values[g.id]+=seconds*.5; }
    return values;
  }
  movements(from,to) {
    const values=Object.fromEntries([...this.catalog.movements.keys(),'additional'].map(id=>[id,0]));
    for(const s of this.inRange(from,to)) for(const e of s.entries) values[this.catalog.exercises.get(e.exerciseId).movement?.id ?? 'additional']+=activeSeconds(e);
    return values;
  }
}
