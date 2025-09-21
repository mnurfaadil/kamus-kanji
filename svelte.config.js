import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'kamus-kanji';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
    paths: {
    	base: isProd ? `/${repoName}` : ''
    },
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
		prerender: {
			entries: ['/'],
      		handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
