import adapter from '@sveltejs/adapter-netlify';
import proprocess from "svelte-preprocess";

const config = {
  preprocess: proprocess({
    scss: {
      prependData: `@import './src/app.scss';`
    }
  }),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
