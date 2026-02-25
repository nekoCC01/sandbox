import fs from 'node:fs';
import path from 'node:path';

const baseDir = process.cwd();
const inputPath = path.join(baseDir, 'astro', 'transits.txt');
const rawOutPath = path.join(baseDir, 'astro', 'transits.raw.json');
const dedupOutPath = path.join(baseDir, 'astro', 'transits.deduped.json');
const dupReportOutPath = path.join(baseDir, 'astro', 'transits.duplicates.json');

const monthMap = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

function toIsoDate(dmy) {
  const m = dmy.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/);
  if (!m) {
    throw new Error(`Unparseable date: "${dmy}"`);
  }
  const day = m[1].padStart(2, '0');
  const mon = monthMap[m[2]];
  const year = m[3];
  if (!mon) {
    throw new Error(`Unknown month in date: "${dmy}"`);
  }
  return `${year}-${mon}-${day}`;
}

function parseTimeString(timeString) {
  const m = timeString.match(/^(\d{1,2}\s[A-Za-z]{3}\s\d{4})\s+to\s+(\d{1,2}\s[A-Za-z]{3}\s\d{4}),\s*(.+)$/);
  if (!m) {
    throw new Error(`Unparseable timestring: "${timeString}"`);
  }

  const startRaw = m[1];
  const endRaw = m[2];
  const rest = m[3].trim();

  let exactHits = [];
  if (!/^no date of exact$/i.test(rest)) {
    const parts = rest.split(/;\s*/);
    exactHits = parts.map((part) => {
      const mm = part.match(/^exact\s+(\d{1,2}\s[A-Za-z]{3}\s\d{4})(?:\s+([A-Z]+))?$/i);
      if (!mm) {
        throw new Error(`Unparseable exact hit: "${part}" from "${timeString}"`);
      }
      const token = (mm[2] || '').toUpperCase();
      const motion =
        token === 'R'
          ? 'retrograde'
          : token === 'SR'
            ? 'stationing_retrograde'
            : token === 'SD'
              ? 'stationing_direct'
              : 'direct';
      return {
        date: toIsoDate(mm[1]),
        motion,
      };
    });
  }

  return {
    range: {
      startDate: toIsoDate(startRaw),
      endDate: toIsoDate(endRaw),
    },
    exactHits,
  };
}

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split(/\r?\n/);

const rawEntries = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line.startsWith('Transiting ')) {
    continue;
  }

  let j = i + 1;
  while (j < lines.length && lines[j].trim() === '') {
    j++;
  }
  if (j >= lines.length) {
    throw new Error(`Missing time line after title at line ${i + 1}`);
  }

  const title = line;
  const rawTimeString = lines[j].trim();
  const parsed = parseTimeString(rawTimeString);

  rawEntries.push({
    id: `transit-${String(rawEntries.length + 1).padStart(4, '0')}`,
    title,
    rawTimeString,
    range: parsed.range,
    exactHits: parsed.exactHits,
  });

  i = j;
}

const grouped = new Map();
for (const entry of rawEntries) {
  const dedupeKey = JSON.stringify({
    title: entry.title,
    startDate: entry.range.startDate,
    endDate: entry.range.endDate,
    exactHits: entry.exactHits,
  });

  if (!grouped.has(dedupeKey)) {
    grouped.set(dedupeKey, []);
  }
  grouped.get(dedupeKey).push(entry);
}

const dedupedEntries = [];
const duplicates = [];
for (const [dedupeKey, group] of grouped.entries()) {
  dedupedEntries.push(group[0]);
  if (group.length > 1) {
    duplicates.push({
      dedupeKey: JSON.parse(dedupeKey),
      count: group.length,
      ids: group.map((e) => e.id),
    });
  }
}

fs.writeFileSync(rawOutPath, `${JSON.stringify(rawEntries, null, 2)}\n`, 'utf8');
fs.writeFileSync(dedupOutPath, `${JSON.stringify(dedupedEntries, null, 2)}\n`, 'utf8');
fs.writeFileSync(dupReportOutPath, `${JSON.stringify(duplicates, null, 2)}\n`, 'utf8');

console.log(`Raw entries: ${rawEntries.length}`);
console.log(`Deduped entries: ${dedupedEntries.length}`);
console.log(`Duplicate groups: ${duplicates.length}`);
console.log(`Removed as duplicates: ${rawEntries.length - dedupedEntries.length}`);
