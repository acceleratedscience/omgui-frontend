// This service holds all api calls.
// - - -
// Apis are loaded via loadApi() in App.vue
// - - -
// Modeled after:
// https://www.vuemastery.com/courses/real-world-vue3/api-calls-with-axios (service layer)
// https://itnext.io/vue-tricks-smart-api-module-for-vuejs-b0cae563e67b (using classes so we can pass pinia and router in SSR context)

// Modules
import axios from 'axios'

// Constants
const API_URL = 'http://127.0.0.1:5000/api/v1/'

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

interface ApiService {
	apiClient: any
	setupInterceptors: () => void
}

class ApiService {
	// apiClient: any
	// setupInterceptors!: () => void // ! Is to avoid typescript strict mode error, since we can be sure setupInterceptors will be defined.

	// apiName is just for debugging.
	constructor(apiName: string) {
		// Create axios instance for API.
		this.apiClient = axios.create({
			baseURL: API_URL,
			// withCredentials: noCredentials ? false : true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})

		console.log('Registered API module:', apiName)
		// apiName

		this.setupInterceptors.bind(this)()
	}
}

/**
 * Set up interceptors.
 */
ApiService.prototype.setupInterceptors = async function () {
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
 * File System API
 */

export class FileSystemApi extends ApiService {
	constructor() {
		super('FileSystemApi')
	}

	//
	//

	get_workspace_name() {
		return this.apiClient.get('/get-workspace-name')
	}

	// Get list of files in workspace or workspace directory.
	get_workspace_files(path: string = '') {
		return this.apiClient.post('/get-workspace-files', { path })
	}

	// Get file content from path.
	get_file(path: string = '') {
		return this.apiClient.post('/get-file', { path })
	}

	test() {
		return this.apiClient(`/test`)
	}
}
