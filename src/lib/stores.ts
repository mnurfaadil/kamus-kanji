import { writable } from 'svelte/store';

export const uiLang = writable<'id' | 'en'>('id');
export const strokeSpeedMs = writable(750);
export const showHints = writable(true);
