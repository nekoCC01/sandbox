import { allWorkouts, validateWorkouts, videoDefaults } from './models.mjs';
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const options = (rows,selected) => [...rows].map(r => `<option value="${esc(r.id)}" ${selected === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('');
const field = (label,name,value='',type='text') => `<label>${label}<input name="${name}" value="${esc(value)}" type="${type}" ${type==='number'?'min="0" step="any"':''}></label>`;
const basis = (name,value='total') => `<label>Gewichtsangabe<select name="${name}">${[['','Wie übergeordnete Angabe'],['total','Gesamtlast'],['perDumbbell','Pro Hantel'],['unknown','Ungeklärt']].map(([v,l])=>`<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('')}</select></label>`;
let api, dialog;
const state = () => api.getState();
const workouts = () => allWorkouts(state().catalog,state().store.data);
function open(title,body,save) {
 dialog.innerHTML=`<form><div class="dialog-heading"><h2>${esc(title)}</h2><button type="button" data-close-flex class="icon-button" aria-label="Schließen">×</button></div>${body}<p class="form-error" role="alert"></p><button class="button primary full">Speichern</button></form>`;
 dialog.querySelector('[data-close-flex]').onclick=()=>dialog.close();
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();try{save(new FormData(e.currentTarget));dialog.close();api.render();}catch(err){dialog.querySelector('.form-error').textContent=err.message;}};
 dialog.showModal();
}
const videoText = m => [m.durationSeconds != null ? `${m.durationSeconds} s` : '', m.loadKg != null ? `${m.loadKg} kg${m.loadBasis==='perDumbbell'?' pro Hantel':m.loadBasis==='total'?' gesamt':' (Bezug ungeklärt)'}` : '', m.reps != null ? `${m.reps} Wdh.` : ''].filter(Boolean).join(' · ');
const n = (form,key) => {const v=form.get(key);return v==null||v.trim()===''?undefined:Number(v);};
function metrics(f,p,old={}) {
 const result={...old};
 for(const k of ['loadKg','durationSeconds','effort']) {delete result[k];const value=n(f,p+k);if(value!==undefined)result[k]=value;}
 if(f.get(p+'loadBasis'))result.loadBasis=f.get(p+'loadBasis');else delete result.loadBasis;
 delete result.reps;delete result.repsRange;delete result.uncertain;
 let reps=String(f.get(p+'reps')??'').trim();
 if(reps.endsWith('?')) {result.uncertain=true;reps=reps.slice(0,-1).trim();}
 if(reps.includes('-'))result.repsRange=reps.split('-').map(Number);else if(reps) result.reps=Number(reps);
 if(f.get(p+'side'))result.side=f.get(p+'side');else delete result.side;
 return result;
}
function metricFields(p,m={},defaults=false) {
 return `<div class="form-row">${field(defaults?'Videogewicht (kg)':'Tatsächliches Gewicht (kg)',p+'loadKg',m.loadKg,'number')}${basis(p+'loadBasis',m.loadBasis??'')}</div><div class="form-row">${field(defaults?'Vorgegebene Dauer (Sekunden)':'Tatsächliche Dauer (Sekunden)',p+'durationSeconds',m.durationSeconds,'number')}${field('Wiederholungen (optional)',p+'reps',(m.reps??m.repsRange?.join('-')??'')+(m.uncertain?'?':''))}</div>${defaults?'':`<div class="form-row">${field('Anstrengung 1–5 (optional)',p+'effort',m.effort,'number')}<label>Seite<select name="${p}side">${[['','Unbestimmt'],['left','Links'],['right','Rechts'],['both','Beide'],['alternating','Abwechselnd']].map(([v,l])=>`<option value="${v}" ${v===m.side?'selected':''}>${l}</option>`).join('')}</select></label></div>`}`;
}
export function workoutLibrary() {
 return `<section class="card"><div class="card-head"><div><h2>Trainingsvorlagen · Fitness+</h2><p class="sub">Videovorgaben und deine tatsächlichen Werte bleiben getrennt. Leere Felder bedeuten unbekannt.</p></div><button class="button primary" data-new-workout>＋ Vorlage</button></div>${[...workouts().values()].map(w=>`<article class="space-top"><h3>${esc(w.name)}</h3><p>${esc(w.trainer??'')}${w.durationSeconds?` · ${w.durationSeconds/60} min Video`:''} ${w.url?` · <a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">Video öffnen ↗</a>`:''}</p><p>${esc(w.notes)}</p>${w.defaults?.loadKg!=null?`<p>Standardgewicht im Video: ${w.defaults.loadKg} kg</p>`:''}<ol>${w.slots.map(s=>`<li>${esc(state().catalog.exercises.get(s.exerciseId)?.name??s.label??'Unbekannte Übung')}${s.defaults?.durationSeconds!=null?` · ${s.defaults.durationSeconds} s Vorgabe`:''}${s.defaults?.loadKg!=null?` · ${s.defaults.loadKg} kg im Video`:''}</li>`).join('')}</ol><div class="inline-actions"><button class="button" data-record-workout="${esc(w.id)}">Absolviertes Training erfassen</button><button class="button" data-edit-workout="${esc(w.id)}">Videovorgaben bearbeiten</button></div></article>`).join('')}</section>`;
}
function editWorkout(id) {
 const {catalog,store}=state();let w=structuredClone(workouts().get(id)??{id:crypto.randomUUID(),name:'',type:'fitness-plus',slots:[]});
 function show(){
 open('Trainingsvorlage / Videovorgaben',`${field('Titel','name',w.name)}<label>Typ<select name="type"><option value="fitness-plus">Apple Fitness+</option><option value="custom" ${w.type==='custom'?'selected':''}>Eigenes Training</option></select></label>${field('Video-URL (optional)','url',w.url,'url')}${field('Trainer (optional)','trainer',w.trainer)}${field('Videolänge in Sekunden (optional)','durationSeconds',w.durationSeconds,'number')}<label>Notizen<textarea name="notes">${esc(w.notes)}</textarea></label><h3>Standardwerte für das Video</h3>${metricFields('default-',w.defaults,true)}<h3>Übungen in Videoreihenfolge</h3><p>Pro Auftreten der Übung ein Slot. Abweichende Slotwerte überschreiben den Videostandard.</p>${w.slots.map((s,i)=>`<fieldset><legend>Slot ${i+1}</legend><label>Übung<select name="s${i}-exerciseId"><option value="">Noch unbekannt</option>${options(catalog.exercises.values(),s.exerciseId)}</select></label>${field('Bezeichnung (optional)',`s${i}-label`,s.label)}${metricFields(`s${i}-`,s.defaults,true)}<button type="button" class="button" data-remove-slot="${i}">Slot entfernen</button></fieldset>`).join('')}<button type="button" class="button" id="add-slot">＋ Übungsslot</button>`,f=>{
 read(f);validateWorkouts([w],catalog);store.save({...store.data,workouts:[...(store.data.workouts??[]).filter(x=>x.id!==w.id),w]});
 });
 dialog.querySelector('#add-slot').onclick=()=>{read(new FormData(dialog.querySelector('form')));w.slots.push({id:crypto.randomUUID()});show();};
 dialog.querySelectorAll('[data-remove-slot]').forEach(b=>b.onclick=()=>{read(new FormData(dialog.querySelector('form')));w.slots.splice(Number(b.dataset.removeSlot),1);show();});
 }
 function read(f){w={...w,name:f.get('name'),type:f.get('type'),url:f.get('url')||undefined,trainer:f.get('trainer')||undefined,durationSeconds:n(f,'durationSeconds'),notes:f.get('notes'),defaults:metrics(f,'default-',w.defaults),slots:w.slots.map((s,i)=>({...s,exerciseId:f.get(`s${i}-exerciseId`)||undefined,label:f.get(`s${i}-label`),defaults:metrics(f,`s${i}-`,s.defaults)}))};}
 show();
}
export function openSession(id,wid,seed={}) {
 const {catalog,store}=state(); const w=workouts().get(wid??store.data.sessions.find(x=>x.id===id)?.workoutId);
 let s=structuredClone(store.data.sessions.find(x=>x.id===id)??{id:crypto.randomUUID(),date:seed.date??api.today(),context:seed.context??(w?'fitness-plus':'free'),title:w?.name??'',workoutId:wid,notes:'',entries:w?.slots.filter(x=>x.exerciseId).map(slot=>({exerciseId:slot.exerciseId,slotId:slot.id,videoPrescription:videoDefaults(w,slot.id),sets:[]}))??(seed.exerciseId?[{exerciseId:seed.exerciseId,sets:[]}]:[])});
 function read(f){s={...s,date:f.get('date')||null,status:f.get('status'),title:f.get('title'),context:f.get('context'),notes:f.get('notes'),entries:s.entries.map((e,i)=>({...e,exerciseId:f.get(`e${i}-exerciseId`),...metrics(f,`e${i}-`,e),loadNote:f.get(`e${i}-loadNote`),notes:f.get(`e${i}-notes`),sets:e.sets.map((set,j)=>metrics(f,`e${i}-s${j}-`,set))}))};}
 function show(){
 open('Training erfassen / bearbeiten',`${field('Titel','title',s.title)}${field('Datum (bei ungeklärtem Datum leer lassen)','date',s.date,'date')}<label>Trainingskontext<select name="context">${options([['free','Freies Training'],['3xa','3X A'],['3xb','3X B'],['6x','6X'],['amrap','AMRAP-Test'],['fitness-plus','Apple Fitness+']].map(([id,name])=>({id,name})).concat(!['free','3xa','3xb','6x','amrap','fitness-plus'].includes(s.context)?[{id:s.context,name:s.context}]:[]),s.context)}</select></label><label>Status<select name="status"><option value="completed" ${s.status!=='review'?'selected':''}>Absolviert</option><option value="review" ${s.status==='review'?'selected':''}>Zur Prüfung · ohne Auswertung</option></select></label><label>Notizen<textarea name="notes" rows="3">${esc(s.notes)}</textarea></label><p>Alle Leistungswerte sind optional. Wiederholungen: z. B. 12, 8-9 oder 12? bei unsicherer Zählung. Videovorgaben werden nicht als Istwerte übernommen.</p>${s.entries.map((e,i)=>`<fieldset><legend>Übung ${i+1}</legend>${e.slotId ? `<p class="field-help">Videovorgabe: ${esc(videoText(e.videoPrescription??videoDefaults(w,e.slotId))) || 'keine Werte bekannt'}</p>` : ''}<label>Übung<select name="e${i}-exerciseId">${options(catalog.exercises.values(),e.exerciseId)}</select></label>${metricFields(`e${i}-`,e)}${field('Lastdetails',`e${i}-loadNote`,e.loadNote)}${field('Übungsnotiz',`e${i}-notes`,e.notes)}${e.sets.map((set,j)=>`<fieldset><legend>Satz ${j+1}</legend>${metricFields(`e${i}-s${j}-`,set)}<button type="button" class="button" data-remove-set="${i}:${j}">Satz entfernen</button></fieldset>`).join('')}<button type="button" class="button" data-add-set="${i}">＋ Tatsächlich absolvierten Satz hinzufügen</button> <button type="button" class="button" data-remove-entry="${i}">Übung entfernen</button></fieldset>`).join('')}<button type="button" class="button" id="add-entry">＋ Übung hinzufügen</button>`,f=>{
 read(f);for(const e of s.entries)if(e.slotId && !workouts().get(s.workoutId)?.slots.some(slot=>slot.id===e.slotId && slot.exerciseId===e.exerciseId))delete e.slotId;if(s.date>api.today())throw Error('Absolviertes Training darf nicht in der Zukunft liegen.');
 const existing=store.data.sessions.some(x=>x.id===s.id);store.save({...store.data,sessions:existing?store.data.sessions.map(x=>x.id===s.id?s:x):[...store.data.sessions,s]});
 });
 const change=fn=>()=>{read(new FormData(dialog.querySelector('form')));fn();show();};
 dialog.querySelector('#add-entry').onclick=change(()=>s.entries.push({exerciseId:'goblet-squat',sets:[]}));
 dialog.querySelectorAll('[data-add-set]').forEach(b=>b.onclick=change(()=>s.entries[Number(b.dataset.addSet)].sets.push({})));
 dialog.querySelectorAll('[data-remove-set]').forEach(b=>b.onclick=change(()=>{const [i,j]=b.dataset.removeSet.split(':').map(Number);s.entries[i].sets.splice(j,1);}));
 dialog.querySelectorAll('[data-remove-entry]').forEach(b=>b.onclick=change(()=>s.entries.splice(Number(b.dataset.removeEntry),1)));
 }
 show();
}
export function initializeFlexibleUI(config) {
 api=config;dialog=document.createElement('dialog');dialog.className='flexible-dialog';document.body.append(dialog);
 document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-new-workout'))editWorkout();
 if(b.dataset.editWorkout)editWorkout(b.dataset.editWorkout);
 if(b.dataset.recordWorkout)openSession(null,b.dataset.recordWorkout);
 if(b.dataset.editFull)openSession(b.dataset.editFull);
 if(b.hasAttribute('data-new-full'))openSession();
 });
}
