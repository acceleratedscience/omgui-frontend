import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
// import 'dotenv/config'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	const commonConfig = {
		plugins: [
			vue(),
			svgLoader({
				svgoConfig: {
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeViewBox: false,
								},
							},
						},
					],
				},
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					// Shared CSS imported into each component
					additionalData: '@import "@/assets/_shared.scss";',
				},
			},
		},
	}

	// Command: npm run build
	if (command === 'build') {
		return {
			...commonConfig,
			base: '/__BASE_PATH__/',
			build: {
				// outDir: 'dist',
				rollupOptions: {},
			},
		}
	}

	return commonConfig
})