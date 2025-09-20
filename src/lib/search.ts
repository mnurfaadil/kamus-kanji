import { loadIndex } from '$lib/api';

const CACHE: Record<string, Record<string, number[]>> = {};

function hira(s: string) {
  // konversi Katakana ke Hiragana (biar konsisten di index)
  return s.replace(/[\u30a1-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// romaji -> hiragana (mini; cukup untuk MVP)
const romajiMap: Record<string, string> = {
  kyo: 'きょ', kyu: 'きゅ', kya: 'きゃ',
  shi: 'し', chi: 'ち', tsu: 'つ',
  // ... tambahkan bertahap
};
function romaToHira(q: string) {
  q = q.toLowerCase();
  for (const [k, v] of Object.entries(romajiMap)) q = q.replaceAll(k, v);
  return q;
}

export async function searchByReading(q: string) {
  if (!CACHE['reading']) CACHE['reading'] = await loadIndex('reading');
  let key = q.trim();
  // normalize: romaji->hira, katakana->hiragana
  if (/^[a-z]+$/.test(key)) key = romaToHira(key);
  key = hira(key);
  return CACHE['reading'][key] || [];
}

export async function searchByMeaningID(q: string) {
  if (!CACHE['meaning.id']) CACHE['meaning.id'] = await loadIndex('meaning.id');
  const key = q.trim().toLowerCase();
  return CACHE['meaning.id'][key] || [];
}
