import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Catalog,TrainingLog,emptyUser,validateUser,mergeUser,videoDefaults} from '../js/models.mjs';
import {UserStore} from '../js/storage.mjs';
const read=async file=>JSON.parse(await readFile(new URL('../data/'+file,import.meta.url)));
const catalog=new Catalog(await read('catalog.json')), imported=await read('user.json');
const s=(entries=[],more={})=>({id:'s',date:'2026-10-01',context:'fitness-plus',title:'Unvollständig',entries,...more});
const data=(...sessions)=>({...emptyUser(),sessions});
test('import preserves completed and review records, provenance and original notes',()=>{
 validateUser(imported,catalog);
 assert.equal(imported.sessions.filter(s=>s.status==='completed').length,23);
 assert.equal(imported.sessions.filter(s=>s.status==='review').length,6);
 assert.equal(catalog.workouts.size,15);
 assert.ok(imported.sessions.every(s=>s.source.originalText.includes('# ')));
 assert.ok(imported.sessions.filter(s=>s.status==='review').every(s=>s.date===null));
 assert.equal(imported.sessions.find(s=>s.id==='md-2026-0930-single').entries[0].loadKg,8);
 assert.equal(imported.sessions.find(s=>s.id==='md-2026-1026-press').workoutId,undefined);
 assert.deepEqual(mergeUser(imported,imported),imported);
});
test('workout-only, exercise-only and duration-only sessions validate without fake reps, effort or weight',()=>{
 for(const row of [s([], {workoutId:'apple-1579923027'}),s([{exerciseId:'wall-push-up',sets:[]}]),s([{exerciseId:'plank',sets:[{durationSeconds:30}]}])]) {
  validateUser(data(row),catalog);const log=new TrainingLog(data(row),catalog);
  assert.deepEqual(log.milestones(),[]);assert.equal(log.progressionHint(),null);
 }
 const log=new TrainingLog(data(s([],{workoutId:'apple-1579923027'})),catalog);
 assert.ok(Object.values(log.exposure('2026-10-01','2026-10-31')).every(n=>n===0));
});
test('video slot defaults override general defaults and never count as actual performance',()=>{
 const workout={id:'w',type:'fitness-plus',name:'Video',defaults:{loadKg:10,durationSeconds:40,loadBasis:'perDumbbell'},slots:[{id:'squat',exerciseId:'goblet-squat',defaults:{loadKg:14}},{id:'raise',exerciseId:'db-lateral-raise',defaults:{loadKg:4}}]};
 const user={...data(s([{exerciseId:'goblet-squat',slotId:'squat',sets:[]}],{workoutId:'w'})),workouts:[workout]};
 validateUser(user,catalog);assert.deepEqual(videoDefaults(workout,'raise'),{loadKg:4,durationSeconds:40,loadBasis:'perDumbbell'});
 assert.equal(user.sessions[0].entries[0].loadKg,undefined);
 assert.deepEqual(new TrainingLog(user,catalog).milestones(),[]);
});
test('uncertain reps, ranges, unknown weight conventions and undated entries cannot create records',()=>{
 for(const entry of [
  {loadKg:10,sets:[{reps:12,uncertain:true}]},
  {loadKg:10,sets:[{repsRange:[8,9]}]},
  {loadKg:10,loadBasis:'unknown',sets:[{reps:12}]},
 ]) {
  const user=data(s([{exerciseId:'goblet-squat',...entry}]));validateUser(user,catalog);
  assert.deepEqual(new TrainingLog(user,catalog).milestones(),[]);
 }
 const log=new TrainingLog(data(s([{exerciseId:'goblet-squat',loadKg:10,sets:[{reps:12}]}],{date:null,status:'review'})),catalog);
 assert.deepEqual(log.history('goblet-squat'),[]);
 assert.ok(Object.values(log.exposure('2026-01-01','2026-12-31')).every(n=>n===0));
});
test('set weights remain separate; per-hantel values cannot satisfy total-weight goals',()=>{
 const log=new TrainingLog(data(s([{exerciseId:'goblet-squat',sets:[{loadKg:9,reps:10},{loadKg:14,reps:7},{loadKg:14,reps:5}]}])),catalog);
 assert.deepEqual(log.history('goblet-squat').map(e=>[e.loadKg,e.sets.length]),[[9,1],[14,2]]);
 const user=data(s([{exerciseId:'goblet-squat',loadKg:14,loadBasis:'perDumbbell',sets:[{reps:12}]}]));
 assert.equal(new TrainingLog(user,catalog).goalStatus({exerciseId:'goblet-squat',context:'fitness-plus',loadNote:'',targetKg:14,targetReps:12}).achieved,false);
});
test('invalid optional metrics, workout references and unsafe links are rejected',()=>{
 for(const more of [{workoutId:'unknown'},{url:'javascript:alert(1)'},{date:null,status:'completed'}])assert.throws(()=>validateUser(data(s([],more)),catalog));
 for(const metrics of [{durationSeconds:-1},{repsRange:[10,8]},{loadKg:Infinity},{effort:6},{side:'invalid'}])assert.throws(()=>validateUser(data(s([{exerciseId:'plank',sets:[metrics]}])),catalog));
 assert.throws(()=>validateUser({...emptyUser(),workouts:[{id:'w',name:'bad',type:'fitness-plus',url:'javascript:alert(1)',slots:[]}]},catalog));
});
test('personal video defaults survive export, reload and a legacy-data merge',()=>{
 let raw=null;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};
 const store=new UserStore(imported,catalog,storage);
 store.add('workouts',{id:'personal',name:'Personal',type:'fitness-plus',slots:[],defaults:{loadKg:5}});
 const reload=new UserStore(imported,catalog,storage);
 assert.equal(reload.data.workouts[0].defaults.loadKg,5);
 assert.equal(JSON.parse(reload.serialize()).sessions.length,29);
 const legacy={schemaVersion:1,sessions:[],goals:[],plannedSessions:[]};
 assert.equal(mergeUser(reload.data,legacy).workouts.length,1);
});

test('weight-only observations remain available to weight history without invented rep records',()=>{
 const user=data(s([{exerciseId:'floor-press',loadKg:11,loadBasis:'perDumbbell',sets:[]}]));
 validateUser(user,catalog);const log=new TrainingLog(user,catalog);
 assert.equal(log.history('floor-press')[0].loadKg,11);
 assert.deepEqual(log.milestones(),[]);
 assert.equal(log.progressionHint(),null);
});
