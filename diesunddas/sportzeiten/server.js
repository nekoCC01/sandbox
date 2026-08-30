const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const root = __dirname;
const dataFile = path.join(root, "data", "runs.json");
const port = Number(process.env.PORT) || 8080;
const types = new Set(["race", "training", "reference", "example", "unknown"]);
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".csv":"text/csv; charset=utf-8" };

function json(response, status, body) { response.writeHead(status, { "Content-Type":"application/json; charset=utf-8" }); response.end(JSON.stringify(body)); }
function durationSeconds(value) { const parts=String(value).split(":").map(Number); if(parts.length!==3||parts.some(Number.isNaN)||parts[1]>59||parts[2]>59)return null; return parts[0]*3600+parts[1]*60+parts[2]; }
function slug(value, required=false) { const clean=String(value||"").trim(); if((required&&!clean)||!/^[-a-z0-9]*$/.test(clean))return null; return clean||null; }

async function addRun(request, response) {
  let raw=""; for await (const chunk of request) { raw+=chunk; if(raw.length>100_000)return json(response,413,{error:"Anfrage ist zu groß."}); }
  try {
    const input=JSON.parse(raw), seconds=durationSeconds(input.duration), person=slug(input.person,true), event=slug(input.event);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date||"")||!person||!event&&String(input.event||"").trim()||!Number.isFinite(input.distanceKm)||input.distanceKm<=0||!seconds||!types.has(input.type)) return json(response,400,{error:"Bitte alle Felder im erwarteten Format ausfüllen."});
    const data=JSON.parse(await fs.readFile(dataFile,"utf8"));
    const run={id:`${input.date}-${person}-${crypto.randomUUID().slice(0,8)}`,date:input.date,person,distanceKm:input.distanceKm,durationSeconds:seconds,event,type:input.type,notes:String(input.notes||"").trim()};
    data.runs.push(run); data.updatedAt=new Date().toISOString();
    const temporary=`${dataFile}.tmp`; await fs.writeFile(temporary,`${JSON.stringify(data,null,2)}\n`); await fs.rename(temporary,dataFile);
    json(response,201,{run});
  } catch(error) { console.error(error); json(response,400,{error:"Der Eintrag konnte nicht gespeichert werden."}); }
}

const server=http.createServer(async(request,response)=>{
  if(request.method==="POST"&&request.url==="/api/runs")return addRun(request,response);
  if(request.method!=="GET")return json(response,405,{error:"Methode nicht erlaubt."});
  const requested=request.url==="/"?"/index.html":decodeURIComponent(request.url.split("?")[0]);
  const file=path.resolve(root,`.${requested}`);
  if(!file.startsWith(`${root}${path.sep}`))return json(response,403,{error:"Zugriff verweigert."});
  try { const content=await fs.readFile(file); response.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","X-Content-Type-Options":"nosniff"}); response.end(content); }
  catch(error) { json(response,error.code==="ENOENT"?404:500,{error:"Datei nicht gefunden."}); }
});
server.listen(port,"127.0.0.1",()=>console.log(`Sportzeiten: http://127.0.0.1:${port}`));
