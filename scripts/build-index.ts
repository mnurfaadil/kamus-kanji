import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const KDIR = 'public/kanji';
const OUT = 'public/_indexes';
mkdirSync(OUT, { recursive: true });

const reading: Record<string, number[]> = {};
const meaningID: Record<string, number[]> = {};

for (const f of readdirSync(KDIR)) {
  if (!f.endsWith('.json')) continue;
  const ucs = Number(f.replace('.json', ''));
  const j = JSON.parse(readFileSync(join(KDIR, f), 'utf8'));

  // readings
  const on = j?.readings?.on || [];
  const kun = j?.readings?.kun || [];
  for (const r of [...on, ...kun]) {
    if (reading && reading[r]) {
      (reading[r]).push(ucs);
    }
  }

  // meanings (ID only here)
  const mids: string[] = j?.meanings?.id || [];
  for (const m of mids) {
    const key = String(m).toLowerCase();
    if (meaningID && meaningID[key]) {
      (meaningID[key]).push(ucs);
    }
  }
}

writeFileSync(join(OUT, 'reading.json'), JSON.stringify(reading));
writeFileSync(join(OUT, 'meaning.id.json'), JSON.stringify(meaningID));
