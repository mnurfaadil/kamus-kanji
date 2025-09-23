<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { searchByKeyword } from '$lib/search';
  let q = '';
  let results: number[] = [];
  async function go() {
    results = await searchByKeyword(q);
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
    <button class="bg-black text-white rounded px-4" on:click={go}>Cari</button>
  </div>

  {#if results.length}
    <ul class="grid grid-cols-4 gap-3">
      {#each results as ucs}
        <li class="border rounded p-3 text-center hover:bg-zinc-50">
          <a class="text-3xl" href={resolve(`/k/${ucs}`)}>{@html `&#${ucs};`}</a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
