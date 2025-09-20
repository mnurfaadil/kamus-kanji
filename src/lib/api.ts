import { asset } from '$app/paths';

// using a route ID plus parameters
export type KanjiEntry = {
  literal: string;
  ucs: number;
  strokes: number;
  readings: { on?: string[]; kun?: string[]; nanori?: string[] };
  meanings: Record<string, string[]>;
  stroke_svg?: { viewBox: string; strokes: { d: string; hint?: string }[] };
  compounds?: { expression: string; reading?: string; senses?: { gloss_id: string }[] }[];
  gloss_bank?: Record<string, Record<string, string>>;
};

export async function loadKanji(ucs: number): Promise<KanjiEntry> {
  const path = asset(`/kanji/${ucs}.json`);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Kanji ${ucs} not found`);
  return res.json();
}

export async function loadIndex(name: 'reading' | 'meaning.id') {
  const path = asset(`/_indexes/${name}.json`);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Index ${name} missing`);
  return res.json() as Promise<Record<string, number[]>>;
}
