import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

/*

ABOUT THE BUILD PROCESS
-----------------------

Every instance of the OpenAD GUI runs on its own port, starting at 8024 and counting up.
This means that every terminal window and every Notebook will use its own port:
http://127.0.0.1:8024/~/
http://127.0.0.1:8025/~/
etc.

Our API base URL in this case is a relative path, so it doesn't care about the port:
/api/v1/

However when the GUI is spun up from a Notebook inside a Docker container, we can only
use one port to run Jupyter Lab (usually 8888) and have to access the GUI via a proxy
url, by using the Jupyter Proxy Server (https://pypi.org/project/jupyter-server-proxy/):
http://localhost:8888/proxy/8024/~/
http://localhost:8888/proxy/8025/~/
etc.

When you access the GUI via a proxied URL, we also need to access everything else via
that proxy URL, i.e. our compiled JS and CSS files, our internal routes (using Vue router)
and our API calls:
/proxy/8024/api/v1/

Usually this is not a big problem, because you can set a base URL in the build configuration.
Our challenge is that this base URL is static, and in our case, our base URL needs to be
dynamic, because it includes the port number which can be anything.

The way we solve this is by creating two builds, one for the regular use case (gui-build)
and one for the proxy use case (gui-build-proxy).

The logic taking care of this lives inside this file, as well as BaseApi.ts for the API calls:

	1.	We create two separate build directories 'gui-build' and 'gui-build-proxy'
		See package.json for the build commands.

	2. 	The proxy build directory uses a placeholder base URL (/__PLACEHOLDER_BASEURL__/)
	
	3.	When the build is complete, setDynamicBaseUrl() is called, which does the following:
		- Sets a <base> tag in the index.html file with the dynamic base URL
		- Change all the hrefs and srcs in the index.html file to be relative
		- Replace the placeholder base URL string in the main JS file with a function
		  that fetches the port number from the URL path on the fly and generates the
		  correct base URL string with that.
	
	4. 	In BaseApi.ts, we have a function API_URL() that returns the base URL for the API
		using the same logic fetching the port number from the URL path.

	5.	After all that is complete, postbuild.js takes the build directories and moves them
		into the main OpenAD repository, given that both repositories are set up per the
		instructions. The instructions are printed at the end of the build process.
		See package.json for the postbuild command.

*/

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
			{
				name: 'replace-placeholder-baseurl',
				closeBundle() {
					if (command === 'build' && mode === 'proxy') {
						setDynamicBaseUrl()
					}
				},
			},
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
				// This doesn't work, don't understand why.
				// Instead need to do it via plugin.
				// closeBundle: closeProxyBundle,
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

// To get the proxy build to work, we have to do some hacky post-processing
// by replacing our placeholder baseUrl with a dynamic one that includes
// whatever port is being used in our proxy url path.
function setDynamicBaseUrl() {
	// A. Update the index.html file:
	const dir = resolve(__dirname, 'gui-build-proxy')
	const indexPath = resolve(dir, 'index.html')
	let indexHtml = readFileSync(indexPath, 'utf-8')

	// 1) Make the main JS and CSS file paths relative so they
	// can be redirected using a dynamically generated base URL.
	indexHtml = indexHtml.replace(/\/__PLACEHOLDER_BASEURL__\//g, '')

	// 2) Make the RDKit path relative.
	indexHtml = indexHtml.replace(/\/rdkit\/RDKit_minimal\.js/, 'rdkit/RDKit_minimal.js')

	// 3) Activate the function that inserts the base URL tag
	// and remove the js comments.
	indexHtml = indexHtml.replace(/<!----/, '')
	indexHtml = indexHtml.replace(/\/\/ .*/, '')
	indexHtml = indexHtml.replace(/---->/, '')
	writeFileSync(indexPath, indexHtml)

	// B. Update the main JS file:
	// 1) Find the name of the main JS file.
	const jsFilename: string | null = indexHtml.match(/<script type="module" crossorigin src="assets\/(index-\w+.js)"><\/script>/)?.[1] ?? null

	// 2) Run a find-and-replace inside the file.
	if (jsFilename) {
		const jsPath = resolve(dir, `assets/${jsFilename}`)

		// Replace the placeholder baseUrl.
		let jsFile = readFileSync(jsPath, 'utf-8')
		jsFile = jsFile.replace(
			/"\/__PLACEHOLDER_BASEURL__\/"/g,
			'`${window.location.pathname.match(/(.*)\\/proxy\\/\\d{4}/)?.[1] ?? ""}/proxy/${window.location.pathname.match(/\\/proxy\\/(\\d{4})/)?.[1] ?? 8024}/`',
		)
		writeFileSync(jsPath, jsFile)
	}
}
