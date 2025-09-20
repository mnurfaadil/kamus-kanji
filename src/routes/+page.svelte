<script lang="ts">
  import { onMount } from 'svelte';
  import { searchByReading, searchByMeaningID } from '$lib/search';
  let q = 'laut', mode: 'reading' | 'meaning' = 'meaning';
  let results: number[] = [];
  async function go() {
    results = mode === 'reading' ? await searchByReading(q) : await searchByMeaningID(q);
  }
  onMount(async () => {
    go()
  });
</script>

<div class="mx-auto max-w-2xl p-4 space-y-4">
  <h1 class="text-2xl font-bold">Cari Kanji</h1>
  <div class="flex gap-2">
    <input class="input input-bordered flex-1 border rounded px-3 py-2"
           placeholder="ketik yomi (かな/カナ/romaji) atau arti (ID)"
           bind:value={q} on:keydown={(e)=>e.key==='Enter'&&go()} />
    <select class="border rounded px-2 min-w-[120px]" bind:value={mode}>
      <option value="reading">Reading</option>
      <option value="meaning">Arti (ID)</option>
    </select>
    <button class="bg-black text-white rounded px-4" on:click={go}>Cari</button>
  </div>

  {#if results.length}
    <ul class="grid grid-cols-4 gap-3">
      {#each results as ucs}
        <li class="border rounded p-3 text-center hover:bg-zinc-50">
          <a class="text-3xl" href={`/k/${ucs}`}>⛩️</a>
          <div class="text-xs text-zinc-500 mt-1">{ucs}</div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
