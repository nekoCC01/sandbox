import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {emptyUser} from '../js/models.mjs';
const app=new URL('../',import.meta.url);
test('persist CLI validates, merges idempotently and leaves repo unchanged on rejected input',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'fitness-persist-'));
 try {
  for(const dir of ['data','js','scripts'])await cp(new URL(dir,app),join(temp,dir),{recursive:true});
  const input=join(temp,'input.json'),target=join(temp,'data/user.json');
  const data={...emptyUser(),plannedSessions:[{id:'p1',date:'2026-11-10',routineId:'3xa',rounds:2}]};
  await writeFile(input,JSON.stringify(data));
  const run=()=>spawnSync(process.execPath,[join(temp,'scripts/persist.mjs'),input],{encoding:'utf8',cwd:tmpdir()});
  assert.equal(run().status,0);assert.equal(run().status,0);
  assert.equal(JSON.parse(await readFile(target)).plannedSessions.length,1);
  const before=await readFile(target,'utf8');
  data.plannedSessions[0].routineId='unknown';await writeFile(input,JSON.stringify(data));
  assert.equal(run().status,1);assert.equal(await readFile(target,'utf8'),before);
 } finally {await rm(temp,{recursive:true,force:true});}
});
