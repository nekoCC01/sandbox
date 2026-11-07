import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Catalog,TrainingLog,emptyUser,validateUser,mergeUser} from '../js/models.mjs';
import {UserStore} from '../js/storage.mjs';
const raw=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url)));
const catalog=new Catalog(raw);
const session=(id='s1',reps=12,loadKg=10,exerciseId='goblet-squat',context='3xa',loadNote='')=>({id,date:'2026-11-01',context,notes:'',entries:[{exerciseId,loadKg,loadNote,sets:[{reps,effort:3}]}]});
const withSessions=(...sessions)=>({...emptyUser(),sessions});
test('catalog links all course variants, six movements and hierarchy',()=>{
 assert.equal(catalog.movements.size,6); assert.equal([...catalog.exercises.values()].filter(e=>e.sourceId!=='training-notes-2026').length,66);
 assert.equal(catalog.exercises.get('lunge').movement.id,'squat');
 assert.equal(catalog.exercises.get('good-morning').movement.id,'hinge');
 assert.equal(catalog.exercises.get('db-bicep-curl').movement,undefined);
 assert.equal(catalog.routines.get('6x').slots.length,6);
 assert.equal(catalog.groups.get('quads').region.name,'Unterkörper');
 assert.equal(catalog.exercises.get('push-up').variants(catalog).length,5);
});
test('invalid catalog reference fails instead of silently losing anatomy',()=>{
 const bad=structuredClone(raw);bad.families[0].primaryGroupIds=['missing'];assert.throws(()=>new Catalog(bad));
});
test('user validation rejects unknown references, malformed dates, duplicates, invalid reps and 6X rounds',()=>{
 for(const change of [s=>s.date='2026-02-30',s=>s.entries[0].exerciseId='missing',s=>s.entries[0].sets[0].reps=0,s=>s.entries[0].loadKg=NaN,s=>s.entries[0].sets[0].effort=1.5]) {const s=session();change(s);assert.throws(()=>validateUser(withSessions(s),catalog));}
 assert.throws(()=>validateUser(withSessions(session(),session()),catalog));
 assert.throws(()=>validateUser({...emptyUser(),plannedSessions:[{id:'p',date:'2026-11-01',routineId:'6x',rounds:3}]},catalog));
});
test('merge is idempotent, incoming updates same ID and preserves other records',()=>{
 const result=mergeUser(withSessions(session('a'),session('b')),withSessions(session('a',13)));
 assert.equal(result.sessions.length,2);assert.equal(result.sessions[0].entries[0].sets[0].reps,13);
 assert.deepEqual(mergeUser(result,result),result);
});
test('exposure counts primary and secondary sets only inside selected range',()=>{
 const log=new TrainingLog(withSessions(session()),catalog),exposure=log.exposure('2026-11-01','2026-11-07');
 assert.equal(exposure.quads,1);assert.equal(exposure.abs,.5);assert.equal(exposure.biceps,0);
 assert.equal(log.exposure('2026-11-02','2026-11-07').quads,0);
});
test('goals do not compare variants, contexts or band details; one qualifying set achieves goal',()=>{
 const goal={exerciseId:'goblet-squat',context:'3xa',targetKg:10,targetReps:12,loadNote:''};
 for(const s of [session('a',12,10,'db-lunge'),session('a',12,10,'goblet-squat','free'),session('a',12,10,'goblet-squat','3xa','different')]) assert.equal(new TrainingLog(withSessions(s),catalog).goalStatus(goal).achieved,false);
 assert.equal(new TrainingLog(withSessions(session()),catalog).goalStatus(goal).achieved,true);
});
test('milestones keep records separate by load and context',()=>{
 const log=new TrainingLog(withSessions(session('a'),session('b',11),session('c',13),session('d',8,20)),catalog);
 assert.deepEqual(log.milestones().map(x=>[x.reps,x.loadKg]),[[8,20],[13,10],[12,10]]);
});
function memory(){let value=null;return {getItem:()=>value,setItem:(k,v)=>{value=v;}};}
test('storage reload persists data; concurrent tab changes cannot overwrite',()=>{
 const storage=memory(),a=new UserStore(emptyUser(),catalog,storage),b=new UserStore(emptyUser(),catalog,storage);
 a.add('sessions',session());assert.equal(new UserStore(emptyUser(),catalog,storage).data.sessions.length,1);
 assert.throws(()=>b.add('sessions',session('other')),/anderen Tab/);
});
test('quota errors leave application state unchanged',()=>{
 const storage={getItem:()=>null,setItem:()=>{throw Error('Quota');}},store=new UserStore(emptyUser(),catalog,storage);
 assert.throws(()=>store.add('sessions',session()),/Quota/);assert.equal(store.data.sessions.length,0);
});
test('corrupt browser data is retained and cannot be overwritten',()=>{
 const storage={getItem:()=>'{bad',setItem:()=>{throw Error('should not write');}},store=new UserStore(emptyUser(),catalog,storage);
 assert.equal(store.readOnly,true);assert.throws(()=>store.add('sessions',session()),/nicht überschrieben/);
});
test('progression hint requires matching context, load, round count and two complete entries',()=>{
 const a=session('a'),b=session('b');
 assert.equal(new TrainingLog(withSessions(a,b),catalog).progressionHint().exercise.id,'goblet-squat');
 b.context='free';assert.equal(new TrainingLog(withSessions(a,b),catalog).progressionHint(),null);
 b.context='3xa';b.entries[0].sets.push({reps:12,effort:3});assert.equal(new TrainingLog(withSessions(a,b),catalog).progressionHint(),null);
});
