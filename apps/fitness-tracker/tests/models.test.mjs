import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Catalog,TrainingLog,resolveEntry,slotDefaults,validateUser,emptyUser,mergeUser} from '../js/models.mjs';
import {UserStore,STORAGE_KEY} from '../js/storage.mjs';
const raw=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url)));
const catalog=new Catalog(raw), ex=id=>catalog.exercises.get(id);
const entry=(id,values,prescription={})=>({slotId:'s1',exerciseId:id,...resolveEntry(ex(id),values,prescription)});
const session=e=>({id:'test',date:'2026-11-15',workoutId:'single-'+e.exerciseId,entries:[e]});
const user=e=>({...emptyUser(),sessions:[session(e)]});
test('clean catalog and archived source remain separate',async()=>{
 const old=JSON.parse(await readFile(new URL('../data/archive/2026-11-15/user.json',import.meta.url)));
 assert.equal(old.sessions.length,29);assert.equal(raw.exercises.length,30);
 assert.equal(raw.workouts.filter(w=>w.type==='fitness-plus').length,2);
 assert.ok(raw.exercises.every(e=>e.equipment.every(k=>k==='dumbbell')));
 assert.equal(validateUser(JSON.parse(await readFile(new URL('../data/user.json',import.meta.url))),catalog).sessions.length,7);
 assert.throws(()=>validateUser(old,catalog),/Datenformat/);
});
test('time estimates, manual repetitions and hold duration follow distinct rules',()=>{
 assert.deepEqual(resolveEntry(ex('air-squat'),{},{durationSeconds:30}),{prescription:{durationSeconds:30},reps:6,repsSource:'estimated',durationSeconds:30});
 assert.equal(resolveEntry(ex('air-squat'),{reps:9},{durationSeconds:30}).reps,9);
 assert.equal(resolveEntry(ex('air-squat'),{},{reps:12}).repsSource,'prescribed');
 const hold=resolveEntry(ex('plank'),{},{durationSeconds:30});assert.equal(hold.reps,undefined);assert.equal(hold.durationSeconds,30);
 assert.throws(()=>resolveEntry(ex('air-squat'),{},{}));assert.throws(()=>resolveEntry(ex('air-squat'),{reps:8.5},{}));
 assert.throws(()=>resolveEntry(ex('db-row'),{reps:10},{}),/Gewicht/);
});
test('defaults override per slot and saved prescriptions survive template changes',()=>{
 const w={defaults:{loadKg:7,durationSeconds:40}},s={defaults:{loadKg:5}};
 assert.deepEqual(slotDefaults(w,s),{loadKg:5,durationSeconds:40});
 const p=slotDefaults(w,s),e=entry('db-row',{loadKg:5},p);w.defaults.durationSeconds=60;
 assert.equal(e.prescription.durationSeconds,40);assert.equal(e.reps,8);validateUser(user(e),catalog);
});
test('invalid references, ranges, estimates, dates and incomplete slots are rejected',()=>{
 const valid=user(entry('air-squat',{reps:10}));validateUser(valid,catalog);
 for(const change of [d=>d.sessions[0].date='2026-02-30',d=>d.sessions[0].entries[0].repsRange=[8,9],d=>d.sessions[0].entries[0].side='left',d=>d.sessions[0].entries=[],d=>d.sessions[0].entries[0].slotId='missing',d=>d.sessions[0].workoutId='missing']){const d=structuredClone(valid);change(d);assert.throws(()=>validateUser(d,catalog));}
 const d=user(entry('air-squat',{},{durationSeconds:30}));d.sessions[0].entries[0].reps=8;assert.throws(()=>validateUser(d,catalog));
});
test('body map uses time and movement distribution includes complementary exercises',()=>{
 const e=entry('air-squat',{reps:10}),d=user(e),log=new TrainingLog(d,catalog),from='2026-11-01',to='2026-11-30';
 assert.equal(log.exposure(from,to).quads,50);assert.equal(log.exposure('2026-10-01','2026-10-31').quads,0);
 assert.equal(log.movements(from,to)[ex('air-squat').movement.id],50);
 const hold=entry('plank',{durationSeconds:30}),moves=new TrainingLog(user(hold),catalog).movements(from,to);assert.equal(Object.values(moves).reduce((a,b)=>a+b,0),30);
});
test('storage isolates v1, merges idempotently, and preserves state on quota and concurrent writes',()=>{
 const values=new Map([['fitness-tracker.user.v1','old-data']]),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 const store=new UserStore(emptyUser(),catalog,storage),data=user(entry('air-squat',{reps:10}));
 store.import(data);store.import(data);assert.equal(store.data.sessions.length,1);assert.equal(values.get('fitness-tracker.user.v1'),'old-data');
 assert.deepEqual(mergeUser(data,data),data);const before=store.serialize();storage.setItem=()=>{throw Error('quota');};assert.throws(()=>store.save(emptyUser()),/quota/);assert.equal(store.serialize(),before);
 values.set(STORAGE_KEY,'changed');assert.throws(()=>store.save(data),/anderen Tab/);
});
test('corrupt new browser data blocks writes and remains untouched',()=>{
 const storage={getItem:()=>'{broken',setItem:()=>assert.fail('must not write')};const store=new UserStore(emptyUser(),catalog,storage);assert.equal(store.readOnly,true);assert.throws(()=>store.save(emptyUser()));
});

test('restored logs retain proven reps, full Fitness+ rounds and unresolved loads',async()=>{
 const data=validateUser(JSON.parse(await readFile(new URL('../data/user.json',import.meta.url))),catalog);
 const get=id=>data.sessions.find(s=>s.id===id);
 assert.equal(get('md-2026-0928-wall').entries[0].reps,60);
 assert.equal(get('md-2026-1001-wall').entries[0].reps,100);
 assert.equal(get('md-2026-0930-single-db-shoulder-press').entries[0].reps,24);
 assert.equal(get('md-2026-0930-single-db-row').entries[0].reps,24);
 const single=get('md-2026-1008-hinge').entries[0];assert.equal(single.reps,12);assert.equal(single.loadKg,undefined);assert.equal(single.loadUnresolvedKg,10);
 const fitness=get('md-2026-1019-strength');assert.equal(fitness.entries.length,18);
 assert.equal(fitness.entries.filter(e=>e.repsSource==='estimated').length,5);
 assert.equal(fitness.entries.at(-1).reps,4);
 assert.equal(fitness.entries.filter(e=>e.exerciseId==='floor-bridge').reduce((sum,e)=>sum+e.reps,0),29);
 assert.equal(fitness.entries.reduce((sum,e)=>sum+e.durationSeconds,0),720);
 assert.ok(data.sessions.every(s=>s.source.originalText));
 const broken=structuredClone(data);delete broken.sessions[0].source;assert.throws(()=>validateUser(broken,catalog));
});
