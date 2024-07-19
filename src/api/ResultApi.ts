import BaseApi from './BaseApi'

// Type declarations
import type { LocationQuery } from 'vue-router'

export default class ResultApi extends BaseApi {
	constructor() {
		super('ResultApi')
	}

	//
	//

	// Get result data currently stored in memory.
	getResult(query: LocationQuery = {}) {
		return this.apiClient.post('/get-result', { query })
	}

	// Update result molset.
	// This overrides the result dataframe stored in memory.
	updateResult_molset(cacheId: number) {
		return this.apiClient.post('/update-result-molset', { cacheId })
	}
}
