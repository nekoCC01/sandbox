#!/usr/bin/env node
import {readFile,writeFile,rename,unlink} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Catalog,validateUser,mergeUser} from '../js/models.mjs';
const target=new URL('../data/user.json',import.meta.url);
const temp=new URL(`../data/.user-${process.pid}.tmp`,import.meta.url);
try {
 const path=process.argv[2];
 if(!path || process.argv.length!==3) throw Error('Aufruf: node apps/fitness-tracker/scripts/persist.mjs /pfad/fitness-user.json');
 const catalog=new Catalog(JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8')));
 const before=validateUser(JSON.parse(await readFile(target,'utf8')),catalog);
 const incoming=validateUser(JSON.parse(await readFile(path,'utf8')),catalog);
 const next=validateUser(mergeUser(before,incoming),catalog);
 await writeFile(temp,JSON.stringify(next,null,2)+'\n',{flag:'wx'});
 await rename(temp,target);
 console.log(`Gespeichert: ${fileURLToPath(target)}\n${next.sessions.length} Trainings · ${next.goals.length} Ziele · ${next.plannedSessions.length} Termine\nGleiche IDs: Importstand gewinnt. Bitte git diff prüfen und selbst committen.`);
} catch(error) {
 await unlink(temp).catch(()=>{});
 console.error(`Nicht übernommen: ${error.message}`);process.exitCode=1;
}
