// This service holds all api calls.
// - - -
// Apis are loaded via loadApi() in App.vue
// - - -
// Modeled after:
// https://www.vuemastery.com/courses/real-world-vue3/api-calls-with-axios (service layer)
// https://itnext.io/vue-tricks-smart-api-module-for-vuejs-b0cae563e67b (using classes so we can pass pinia and router in SSR context)

// Modules
import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000/'

//
//
//
//

class ApiService {
  // apiName is just for debugging.
  constructor(pinia, router, apiName) {
    this.router = router

    // Create axios instance for API.
    this.apiClient = axios.create({
      baseURL: API_URL,
      // withCredentials: noCredentials ? false : true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    // 	console.log('Registered API module:', apiName)
    apiName

    this.setupInterceptors.bind(this)()
  }
}

/**
 * Set up interceptors.
 */
ApiService.prototype.setupInterceptors = async function () {
  // Intercept requests
  this.apiClient.interceptors.request.use(
    async (req) => {
      // Request interceptor go here
      // Attach auth tokens etc.
      return req
    },
    // Do nothing with request errors
    (error) => Promise.reject(error)
  )

  // Intercept responses
  this.apiClient.interceptors.response.use(
    async (res) => {
      // Response interceptors here
      // Store guest authTokens, handle errors, etc.
      return res
    },

    // Handle response errors
    async (err) => {
      return _handleError(err)
    }
  )

  // Catch errors and return { status, error }
  function _handleError(err) {
    let { code, response } = err
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
  constructor(pinia, router) {
    super(pinia, router, 'FileSystemApi')
  }

  //
  //

  workspace(path) {
    return this.apiClient.post('/workspace', { path })
  }

  test() {
    return this.apiClient(`/test`)
  }
}
