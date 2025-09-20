import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
const repo = 'kamus-kanji'; // ganti

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
    paths: {
      base: dev ? '' : `/${repo}`
    },
	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
		prerender: {
			entries: ['/'],
      		handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
