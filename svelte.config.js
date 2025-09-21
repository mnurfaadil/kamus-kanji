import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
		paths: {
			base:
				process.env.GITHUB_REPOSITORY &&
					!process.env.GITHUB_REPOSITORY.endsWith('.github.io')
					? '/' + process.env.GITHUB_REPOSITORY.split('/')[1]
					: ''
		},
		prerender: {
			entries: ['/'],
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
