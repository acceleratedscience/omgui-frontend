import BaseApi from '../BaseApi'

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
		return this.apiClient.post('/result', { query })
	}

	// Update result molset.
	// This overrides the result dataframe stored in memory.
	updateResult_molset(cacheId: number) {
		return this.apiClient.post('/result/update', { cacheId })
	}

	// Update result data.
	// This overrides the result dataframe stored in memory.
	updateResult_data(cacheId: number) {
		// Placeholder for when dataviewer is integrated.
	}
}
