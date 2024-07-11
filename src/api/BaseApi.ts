// This service holds all api calls.
// - - -
// Apis are loaded via loadApi() in App.vue
// - - -
// Modeled after:
// https://www.vuemastery.com/courses/real-world-vue3/api-calls-with-axios (service layer)
// https://itnext.io/vue-tricks-smart-api-module-for-vuejs-b0cae563e67b (using classes so we can pass pinia and router in SSR context)

// Modules
import axios from 'axios'

// API URL
const DEFAULT_PORT: number = 8024
const API_URL = (port: number = DEFAULT_PORT): string => `http://localhost:${port}/api/v1/`

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
			this.testApiPort()
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
	 * Check if the API is available on the
	 * default port, or try the next 10 ports.
	 */

	testApiPort() {
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
					this.testApiPort()
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
