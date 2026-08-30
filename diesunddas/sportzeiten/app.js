const state = { runs: [] };
const typeNames = { race: "Rennen", training: "Training", reference: "Referenz", example: "Beispiel", unknown: "Unbekannt" };
const clock = seconds => `${Math.floor(seconds/3600)}:${String(Math.floor(seconds%3600/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
const pace = run => { const p=Math.round(run.durationSeconds/run.distanceKm); return `${Math.floor(p/60)}:${String(p%60).padStart(2,"0")} min/km`; };
const name = slug => slug ? slug.split("-").map(word=>word[0].toUpperCase()+word.slice(1)).join(" ") : "—";
const date = value => value ? new Intl.DateTimeFormat("de-DE").format(new Date(`${value}T12:00:00`)) : "—";
const distanceName = value => value===21.1 ? "Halbmarathon · 21,1 km" : value===42.2 ? "Marathon · 42,2 km" : `${value.toLocaleString("de-DE")} km`;
const localHosts = new Set(["127.0.0.1", "localhost", "::1"]);
document.querySelector("#add-run-link").hidden = !localHosts.has(window.location.hostname);

function selection() {
  const person=document.querySelector("#person-filter").value, type=document.querySelector("#type-filter").value, event=document.querySelector("#event-filter").value, distance=document.querySelector("#distance-filter").value;
  return state.runs.filter(run => (person==="all"||run.person===person) && (type==="all"||(type==="activity"?["race","training"].includes(run.type):run.type===type)) && (event==="all"||run.event===event) && (distance==="all"||run.distanceKm===Number(distance)));
}

function renderSummary(runs) {
  const km=runs.reduce((sum,run)=>sum+run.distanceKm,0), seconds=runs.reduce((sum,run)=>sum+run.durationSeconds,0);
  const fastest=runs.length?Math.min(...runs.map(run=>run.durationSeconds/run.distanceKm)):null;
  const values=[["Einträge",runs.length.toLocaleString("de-DE")],["Gesamtdistanz",`${km.toLocaleString("de-DE",{maximumFractionDigits:1})} km`],["Gesamtzeit",`${Math.floor(seconds/3600)}:${String(Math.floor(seconds%3600/60)).padStart(2,"0")} h`],["Schnellste Pace",fastest?`${Math.floor(fastest/60)}:${String(Math.round(fastest%60)).padStart(2,"0")} min/km`:"—"]];
  document.querySelector("#summary").replaceChildren(...values.map(([label,value])=>{const card=document.createElement("article"),small=document.createElement("span"),strong=document.createElement("strong");card.className="metric";small.className="muted";small.textContent=label;strong.textContent=value;card.append(small,strong);return card;}));
}

function renderChart(runs) {
  const data=runs.filter(run=>run.date).sort((a,b)=>a.date.localeCompare(b.date)), target=document.querySelector("#chart");
  if(!data.length){target.innerHTML='<div class="empty">Für diese Auswahl gibt es keine datierten Läufe.</div>';return;}
  const w=900,h=280,l=46,r=18,t=18,b=42,ps=data.map(run=>run.durationSeconds/run.distanceKm/60),min=Math.floor(Math.min(...ps)*2)/2-.25,max=Math.ceil(Math.max(...ps)*2)/2+.25;
  const x=i=>l+i*(w-l-r)/Math.max(1,data.length-1), y=p=>t+(p-min)*(h-t-b)/Math.max(.1,max-min);
  const grid=Array.from({length:5},(_,i)=>{const p=min+(max-min)*i/4,yy=y(p),m=Math.floor(p),s=Math.round((p-m)*60);return `<line x1="${l}" y1="${yy}" x2="${w-r}" y2="${yy}" stroke="#d9ded8"/><text x="${l-8}" y="${yy+4}" text-anchor="end" fill="#66716b" font-size="11">${m}:${String(s).padStart(2,"0")}</text>`}).join("");
  const line=data.map((run,i)=>`${x(i)},${y(ps[i])}`).join(" "), dots=data.map((run,i)=>`<circle cx="${x(i)}" cy="${y(ps[i])}" r="4" fill="#236b45"><title>${name(run.person)} · ${name(run.event)}\n${date(run.date)} · ${run.distanceKm.toLocaleString("de-DE")} km\nZeit ${clock(run.durationSeconds)} · Pace ${pace(run)}</title></circle>`).join("");
  const labels=data.map((run,i)=>(i===0||i===data.length-1||data.length<8)?`<text x="${x(i)}" y="${h-13}" text-anchor="middle" fill="#66716b" font-size="11">${run.date.slice(0,4)}</text>`:"").join("");
  target.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Pace über die Zeit">${grid}<polyline points="${line}" fill="none" stroke="#236b45" stroke-width="2.5" stroke-linejoin="round"/>${dots}${labels}</svg>`;
}

function renderTable(runs) {
  document.querySelector("#runs-body").replaceChildren(...runs.map(run=>{const row=document.createElement("tr");[date(run.date),name(run.person),name(run.event),`${run.distanceKm.toLocaleString("de-DE")} km`,clock(run.durationSeconds),pace(run),typeNames[run.type]||run.type,run.notes||""].forEach((value,i)=>{const cell=document.createElement("td");if(i===6){const tag=document.createElement("span");tag.className="tag";tag.textContent=value;cell.append(tag)}else cell.textContent=value;row.append(cell)});const action=document.createElement("td"),button=document.createElement("button");button.className="table-action";button.type="button";button.textContent="Entsprechungen";button.addEventListener("click",()=>showEquivalents(run));action.append(button);row.append(action);return row}));
  document.querySelector("#result-count").textContent=`${runs.length} Einträge`;
}

function sortedRuns(runs) {
  const order=document.querySelector("#sort-order").value, paceValue=run=>run.durationSeconds/run.distanceKm;
  return [...runs].sort((a,b)=>{
    if(order==="pace-asc")return paceValue(a)-paceValue(b)||(b.date||"").localeCompare(a.date||"");
    if(order==="pace-desc")return paceValue(b)-paceValue(a)||(b.date||"").localeCompare(a.date||"");
    return (b.date||"").localeCompare(a.date||"");
  });
}

function showEquivalents(run) {
  const dialog=document.querySelector("#equivalents-dialog"), source=document.querySelector("#equivalents-source"), list=document.querySelector("#equivalents-list");
  const context=[name(run.person),name(run.event),date(run.date)].filter(value=>value!=="—").join(" · ");
  source.textContent=`${context ? `${context} — ` : ""}${run.distanceKm.toLocaleString("de-DE")} km in ${clock(run.durationSeconds)} (${pace(run)})`;
  list.replaceChildren(...[1,10,21.1,42.2].flatMap(distance=>{const term=document.createElement("dt"),value=document.createElement("dd");term.textContent=`${distance.toLocaleString("de-DE")} km`;value.textContent=clock(Math.round(run.durationSeconds/run.distanceKm*distance));return [term,value]}));
  dialog.showModal();
}

function render(){const runs=selection();renderSummary(runs);renderChart(runs);renderTable(sortedRuns(runs))}

async function init(){try{const response=await fetch("data/runs.json");if(!response.ok)throw new Error(`Daten konnten nicht geladen werden (${response.status}).`);state.runs=(await response.json()).runs;const people=[...new Set(state.runs.map(run=>run.person).filter(Boolean))].sort(),personSelect=document.querySelector("#person-filter");personSelect.append(new Option("Alle Personen","all"),...people.map(person=>new Option(name(person),person)));personSelect.value=people.includes("daniel")?"daniel":"all";const events=[...new Set(state.runs.map(run=>run.event).filter(Boolean))].sort((a,b)=>name(a).localeCompare(name(b),"de")),eventSelect=document.querySelector("#event-filter");eventSelect.append(new Option("Alle Events","all"),...events.map(event=>new Option(name(event),event)));const distances=[...new Set(state.runs.map(run=>run.distanceKm))].sort((a,b)=>a-b),distanceSelect=document.querySelector("#distance-filter");distanceSelect.append(new Option("Alle Strecken","all"),...distances.map(distance=>new Option(distanceName(distance),String(distance))));for(const control of [personSelect,document.querySelector("#type-filter"),eventSelect,distanceSelect,document.querySelector("#sort-order")])control.addEventListener("change",render);render()}catch(error){document.querySelector("#error").textContent=`${error.message} Bitte die Seite über „node server.js“ öffnen.`}}
init();
