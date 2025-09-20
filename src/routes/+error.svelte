<script>
  export let error;
  export let status;
</script>

<div class="min-h-screen flex flex-col items-center justify-center text-center p-8">
  <h1 class="text-5xl font-bold mb-4">⚠️ {status}</h1>
  <p class="text-lg text-zinc-600 mb-6">
    {error?.message || 'Terjadi kesalahan tak terduga'}
  </p>
  <a href="/" class="bg-black text-white px-4 py-2 rounded">Kembali ke Home</a>
</div>
