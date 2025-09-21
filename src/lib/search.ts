import { loadIndex } from '$lib/api';
import { toHiragana, toKatakana } from 'wanakana';
import { merge } from './common';

const CACHE: Record<string, Record<string, number[]>> = {};

export async function searchByKeyword(q: string) {
  if (!CACHE['reading']) CACHE['reading'] = await loadIndex('reading');
  if (!CACHE['meaning.id']) CACHE['meaning.id'] = await loadIndex('meaning.id');

  // normalize: romaji → hiragana, katakana → hiragana
  const key = q.trim().toLowerCase();
  const keyH = toHiragana(key);
  const keyK = toKatakana(key);

  const resultHiragana = CACHE['reading'][keyH] || [];
  const resultKatakana = CACHE['reading'][keyK] || [];
  const resultArti = CACHE['meaning.id'][key] || [];
  return merge(resultHiragana, resultKatakana, resultArti);
}
