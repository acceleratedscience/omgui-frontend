import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
					additionalData: '@import "@/assets/_shared.scss";',
				},
			},
		},
	}

	// Command: npm run build
	// This executes: npm run build:proxy && npm run build:no-proxy
	// See package.json for more details.
	if (command === 'build') {
		if (mode === 'proxy') {
			// Command: npm run build:proxy
			return {
				...commonConfig,
				base: '/__PLACEHOLDER_BASEURL__/',
				build: {
					outDir: 'gui-build-proxy',
					rollupOptions: {
						// Add any rollup options here
					},
				},
				closeBundle: closeProxyBundle,
			}
		} else if (mode === 'no-proxy') {
			// Command: npm run build:no-proxy
			return {
				...commonConfig,
				build: {
					outDir: 'gui-build',
					rollupOptions: {
						// Add any rollup options here
					},
				},
			}
		} else {
			return {
				...commonConfig,
			}
		}
	}

	return {
		...commonConfig,
	}
})

// To get the proxy build to work, we have to do some hacky post-processing.
function closeProxyBundle() {
	console.log('****closeProxyBundle')
	// Make the main JS and CSS file paths relative so they
	// can be redirected using a dynamically generated base URL.
	const dir = resolve(__dirname, 'dist')
	const indexPath = resolve(dir, 'index.html')
	let indexHtml = readFileSync(indexPath, 'utf-8')
	indexHtml = indexHtml.replace(/\/__PLACEHOLDER_BASEURL__\//g, '')
	writeFileSync(indexPath, indexHtml)

	// Find the name of the main JS file.
	const jsFilename: string | null = indexHtml.match(/<script type="module" crossorigin src="assets\/(index-\w+.js)"><\/script>/)?.[1] ?? null

	// Run a find-and-replace there next.
	if (jsFilename) {
		const jsPath = resolve(dir, `assets/${jsFilename}`)

		// Replace placeholder in JavaScript files
		let jsFile = readFileSync(jsPath, 'utf-8')
		jsFile = jsFile.replace(/"\/__PLACEHOLDER_BASEURL__\/"/g, '`/proxy/${window.location.pathname.match(/\\/proxy\\/(\\d{4})/)?.[1] ?? 8024}/`')
		writeFileSync(jsPath, jsFile)
	}
}
