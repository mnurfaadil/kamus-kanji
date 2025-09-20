<script lang="ts">
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { loadKanji, type KanjiEntry } from '$lib/api';
  let data: KanjiEntry | null = null;
  let err: string | null = null;
  $: ucs = Number($page.params.ucs);

  onMount(async () => {
    try { data = await loadKanji(ucs); } catch (e) { err = String(e); }
  });

  function play() {
    const paths = document.querySelectorAll<SVGPathElement>('#kanji path');
    paths.forEach(p => {
      p.style.opacity = '0.2';
      p.style.strokeDasharray = '400';
      p.style.strokeDashoffset = '400';
      p.getAnimations().forEach(a => a.cancel());
    });
    let i = 0;
    const tick = () => {
      if (!paths[i]) return;
      paths[i].style.opacity = '1';
      paths[i].animate([{ strokeDashoffset: 400 }, { strokeDashoffset: 0 }], { duration: 550, fill: 'forwards' });
      i++; if (i < paths.length) setTimeout(tick, 600);
    };
    tick();
  }
  
  function back() {
    goto(resolve('/'));
  }
</script>

{#if err}<p class="p-4 text-red-600">{err}</p>
{:else if !data}<p class="p-4">Loading…</p>
{:else}
  <div class="max-w-3xl mx-auto p-4 space-y-6">
    <div class="flex items-center gap-2">
    <a
      href={resolve('/')}
      on:click|preventDefault={back}
      class="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
      aria-label="Kembali ke pencarian"
    >
      ← Kembali
    </a>
  </div>
  <div class="flex items-center justify-between">
    <h1 class="text-5xl font-bold">{data.literal}</h1>
    <button class="bg-black text-white px-4 py-2 rounded" on:click={play}>▶️ Play Stroke</button>
  </div>

  {#if data.stroke_svg}
    <svg id="kanji" viewBox={data.stroke_svg.viewBox} class="w-64 h-64 border rounded">
      {#each data.stroke_svg.strokes as s}
        <path d={s.d} fill="none" stroke="currentColor" stroke-width="4" style="opacity:.2" />
      {/each}
    </svg>
  {/if}

  <div class="grid grid-cols-2 gap-4">
    <div>
      <h2 class="font-semibold">Bacaan</h2>
      <p><b>On:</b> {data.readings.on?.join('、') || '-'}</p>
      <p><b>Kun:</b> {data.readings.kun?.join('、') || '-'}</p>
    </div>
    <div>
      <h2 class="font-semibold">Arti</h2>
      <p>{data.meanings.id?.join(', ') || data.meanings.en?.join(', ')}</p>
    </div>
  </div>

  {#if data.compounds?.length}
    <div>
      <h2 class="font-semibold mb-2">Contoh Kata</h2>
      <ul class="space-y-2">
        {#each data.compounds as w}
          <li class="border rounded p-3">
            <div class="flex items-center justify-between">
              <div class="text-xl">{w.expression}</div>
              <div class="text-zinc-500">{w.reading}</div>
            </div>
            {#if w.senses?.length}
              <ul class="text-sm list-disc ml-5 mt-1">
                {#each w.senses as s}
                  <li>
                    {data.gloss_bank?.id?.[s.gloss_id] || s.gloss_id}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
{/if}
