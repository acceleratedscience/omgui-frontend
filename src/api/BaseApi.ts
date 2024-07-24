// This service holds all api calls.
// - - -
// Apis are loaded via loadApi() in App.vue
// - - -
// Modeled after:
// https://www.vuemastery.com/courses/real-world-vue3/api-calls-with-axios (service layer)
// https://itnext.io/vue-tricks-smart-api-module-for-vuejs-b0cae563e67b (using classes so we can pass pinia and router in SSR context)

// This is for this ts file to recognize the type for process.env.NODE_ENV
// Note types were installed as a dev dependency @types/node
/// <reference types="node" />

// Modules
import axios from 'axios'

// API URL
// - - -
// Every CLI or Jupyter Notebook runs on a different port, starting at 8024 and up.
const DEFAULT_PORT: number = 8024
const proxyPort: number | null = Number((window.location.pathname ?? '').match(/^\/proxy\/(\d{4})/)?.[1]) ?? null
const API_URL = (port: number = DEFAULT_PORT): string => {
	return process.env.NODE_ENV == 'development'
		? // When we're running the development server,
			// we try connecting to the API on port 8024 or up.
			`http://127.0.0.1:${port}/api/v1/`
		: proxyPort
			? // When we're running the server on a proxy URL, we get the
				// port from the URL's path and include it into our API calls.
				`/proxy/${proxyPort}/api/v1/`
			: // For regular use, the API is just a relative path.
				'/api/v1/'
}

// Type declarations
type AxiosError = {
	response: {
		status: number
		statusText: string
		data?: any
	}
	code: string
}

//
//
//
//

type BaseApiType = {
	apiClient: any
	altPort: number
	setupInterceptors: () => void
}

class BaseApi implements BaseApiType {
	static isInitialized = false
	apiClient: any
	altPort: number

	constructor(apiName: string | null = null) {
		// Create axios instance for API.
		this.apiClient = axios.create({
			baseURL: API_URL(),
			// withCredentials: noCredentials ? false : true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})

		if (apiName) {
			console.log('Registered API module:', apiName)
		}

		this.setupInterceptors()
		this.altPort = DEFAULT_PORT

		// API health check
		if (!BaseApi.isInitialized) {
			if (process.env.NODE_ENV == 'development') this.findDevApiPort()
			BaseApi.isInitialized = true
		}
	}

	/**
	 * Set up response/request interceptors.
	 */

	async setupInterceptors() {
		// Intercept requests
		this.apiClient.interceptors.request.use(
			async (req: object) => {
				// Request interceptor go here
				// Attach auth tokens etc.
				return req
			},
			// Do nothing with request errors
			(error: object) => Promise.reject(error),
		)

		// Intercept responses
		this.apiClient.interceptors.response.use(
			async (res: object) => {
				// Response interceptors here
				// Store guest authTokens, handle errors, etc.
				return res
			},

			// Handle response errors
			async (err: AxiosError) => {
				return _handleError(err)
			},
		)

		// Catch errors and return { status, error }
		function _handleError(err: AxiosError) {
			let { response } = err
			const { code } = err
			if (response) {
				// Regular http error (might still have data)
				const { status, data } = response
				// HTTP/2 doesn't support response.statusText, can add manual statusText to response.
				const statusText = data.statusText || response.statusText
				delete data.statusText
				response = { status, statusText, data }
			} else {
				// Invalid URL
				if (code == 'ENOTFOUND') {
					// Mongo error when file is not found
					response = { status: 500, statusText: 'Invalid URL' }
				} else {
					response = { status: 500, statusText: 'API Offline' }
				}
			}
			return response
		}
	}

	/**
	 * When running the development server (port 5173), we need the
	 * OpenAD server to run elsewhere in order for the API to work.
	 * By default this will be on port 8024, though if we can't find
	 * it there we'll try the next 10 ports.
	 */

	findDevApiPort() {
		this.apiClient.get('/health').then((res: any) => {
			if (res.status == 200) {
				if (this.altPort > DEFAULT_PORT) {
					const warnMsg: string[] = [
						'',
						// '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
						'%cThe API gate was moved.%c',
						`The API was not available on the default :${DEFAULT_PORT} port,`,
						'but we found it on a fallback port:',
						`${API_URL(this.altPort)}`,
						// '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
						'',
						'You can ignore the API errors above.',
						'',
					]
					console.log(warnMsg.join('\n'), 'color:orange;font-weight:bold;font-size:14px;text-transform:uppercase', '')
				} else {
					// console.log(`The OpenAD API is available on ${API_URL()}`)
				}
			} else {
				if (this.altPort < DEFAULT_PORT + 10) {
					this.altPort++
					this.apiClient.defaults.baseURL = API_URL(this.altPort)
					this.findDevApiPort()
				} else {
					const listOfPorts = Array.from({ length: 10 }, (_, i) => DEFAULT_PORT + i + 1) // prettier-ignore
					setTimeout(() => {
						const errorMsg: string[] = [
							'',
							'- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
							'%cThe API is not available.%c',
							`It should be available on ${API_URL()}.`,
							'We also checked the following fallback ports:',
							listOfPorts.join(', '),
							'- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
							'',
						]
						console.log(errorMsg.join('\n'), 'color:#d00;font-weight:bold;font-size:14px;text-transform:uppercase', '')
					}, 0)
				}
			}
		})
	}
}

export default BaseApi
