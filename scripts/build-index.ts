import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const KDIR = 'static/kanji';
const OUT = 'static/_indexes';
mkdirSync(OUT, { recursive: true });

type KanjiJSON = {
  readings?: {
    on?: string[];   // mis. ["ガク", "ガク"]
    kun?: string[];  // mis. ["まな.ぶ"]
  };
  meanings?: {
    id?: string[];   // mis. ["belajar", "ilmu"]
  };
};

// index: reading -> [ucs[]]
const reading: Record<string, number[]> = {};
// index: meaning (id) -> [ucs[]]
const meaningID: Record<string, number[]> = {};

for (const f of readdirSync(KDIR)) {
  if (!f.endsWith('.json')) continue;

  // Ambil kode UCS dari nama file (decimal)
  const base = f.slice(0, -'.json'.length);
  const ucs = parseInt(base, 10);
  if (!Number.isFinite(ucs)) {
    // Lewati file jika nama tidak numerik decimal
    // (kalau pakai hex, ganti ke parseInt(base, 16))
    continue;
  }

  // Baca dan parse JSON
  let j: KanjiJSON | null = null;
  try {
    j = JSON.parse(readFileSync(join(KDIR, f), 'utf8'));
  } catch {
    // Lewati file yang korup
    continue;
  }
  if (!j) continue;

  // Readings
  const on = Array.isArray(j.readings?.on) ? j.readings!.on : [];
  const kun = Array.isArray(j.readings?.kun) ? j.readings!.kun : [];

  for (const raw of [...on, ...kun]) {
    const r = String(raw).trim();
    if (!r) continue;
    if (!reading[r]) reading[r] = [];
    if (!reading[r].includes(ucs)) reading[r].push(ucs);
  }

  // Meanings (ID saja)
  const mids = Array.isArray(j.meanings?.id) ? j.meanings!.id : [];
  for (const m of mids) {
    const key = String(m).trim().toLowerCase();
    if (!key) continue;
    if (!meaningID[key]) meaningID[key] = [];
    if (!meaningID[key].includes(ucs)) meaningID[key].push(ucs);
  }
}

// (Opsional) sort ascending ucs per key biar deterministik
for (const k of Object.keys(reading)) reading[k].sort((a, b) => a - b);
for (const k of Object.keys(meaningID)) meaningID[k].sort((a, b) => a - b);

// Tulis output (pretty)
writeFileSync(join(OUT, 'reading.json'), JSON.stringify(reading, null, 0), 'utf8');
writeFileSync(join(OUT, 'meaning.id.json'), JSON.stringify(meaningID, null, 0), 'utf8');
