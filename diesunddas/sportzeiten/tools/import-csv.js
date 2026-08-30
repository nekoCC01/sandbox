const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const input = path.join(root, "Strecken & Zeiten - Tabellenblatt1.csv");
const output = path.join(root, "data", "runs.json");

function parseCsv(text) {
  const rows=[]; let row=[],field="",quoted=false;
  for(let i=0;i<text.length;i++){const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++}else quoted=!quoted}else if(char===","&&!quoted){row.push(field);field=""}else if((char==="\n"||char==="\r")&&!quoted){if(char==="\r"&&text[i+1]==="\n")i++;row.push(field);rows.push(row);row=[];field=""}else field+=char}
  if(field||row.length){row.push(field);rows.push(row)} return rows;
}

function seconds(value) { const parts=value.split(":").map(Number); if(parts.length===2)parts.unshift(0); return parts[0]*3600+parts[1]*60+parts[2]; }
function isoDate(note) {
  const match=note.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/); if(!match)return null;
  const year=match[3].length===2?Number(match[3])+2000:Number(match[3]); return `${year}-${match[2].padStart(2,"0")}-${match[1].padStart(2,"0")}`;
}
function person(note) {
  const n=note.toLowerCase();
  const known=[["daniela tost","daniela-tost"],["daniel kasai","daniel"],["daniel","daniel"],["akiko kasai","akiko"],["akiko","akiko"],["frank maier","frank-maier"],["dirk holtstiege","dirk-holtstiege"],["dieter schwarzkopf","dieter-schwarzkopf"],["dennis mehlfeld","dennis-mehlfeld"],["claudius michalak","claudius-michalak"],["pascal dethlefs","pascal-dethlefs"],["haftom welday","haftom-welday"],["towett vincent kimutai","towett-vincent-kimutai"],["kangogo, albert","albert-kangogo"],["zeit von josef","josef"],["papa","papa"]];
  return known.find(([needle])=>n.includes(needle))?.[1]||null;
}
function event(note) {
  const n=note.toLowerCase();
  if(n.includes("hella halbmarathon"))return "hella-halbmarathon";
  if(n.includes("blankeneser heldenlauf"))return "blankeneser-heldenlauf";
  if(n.includes("b2run"))return "b2run";
  if(n.includes("köhlbrandbrücke"))return "koehlbrandbrueckenlauf";
  if(n.includes("alstertal"))return "alstertallauf";
  if(n.includes("wilhelmsburg"))return "halbmarathon-wilhelmsburg";
  if(n.includes("sportscheck alster run"))return "sportscheck-alster-run";
  return null;
}

const rows=parseCsv(fs.readFileSync(input,"utf8"));
const runs=rows.slice(5).filter(row=>row[0].trim()&&row[1].trim()).map((row,index)=>{
  const notes=(row[12]||"").trim().replace(/^\((.*)\)$/,"$1"), date=isoDate(notes), who=person(notes), eventName=event(notes);
  const type=notes ? (eventName||/marathon|bestzeit/i.test(notes)?"race":"reference") : "example";
  return { id:`csv-${String(index+1).padStart(3,"0")}`, date, person:who, distanceKm:Number(row[0].replace(",",".")), durationSeconds:seconds(row[1]), event:eventName, type, notes };
});
const result={schemaVersion:1,source:"Strecken & Zeiten - Tabellenblatt1.csv",updatedAt:new Date().toISOString(),runs};
fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,`${JSON.stringify(result,null,2)}\n`);
console.log(`${runs.length} Einträge nach ${path.relative(root,output)} geschrieben.`);
