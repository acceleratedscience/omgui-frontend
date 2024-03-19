import BaseApi from './BaseApi'
import type { LocationQuery } from 'vue-router'

export default class MoleculesApi extends BaseApi {
	constructor() {
		super('MoleculesApi')
	}

	//
	//

	getMolData(identifier: string) {
		return this.apiClient.post(`/get-mol-data`, { identifier })
	}

	getMolVizData(inchi_or_smiles: string) {
		return this.apiClient.post(`/get-mol-viz-data`, { inchi_or_smiles })
	}

	// Get one page of a molset, possibly filtered/sorted.
	getMolset(path: string = '', cacheId: number | null, query: LocationQuery = {}) {
		console.log(123, 'getMolset', query)
		return this.apiClient.post('/get-molset', {
			path,
			cacheId,
			query,
		})
	}

	// Remove molecules from a molset cache.
	// Note: we include the query so we can preserve the filter/sort state.
	removeFromMolset(cacheId: number, indices: number[], query: LocationQuery = {}) {
		return this.apiClient.post('/remove-from-molset', { cacheId, indices, query })
	}

	// Clear a molset's cached working copy.
	clearFromCache(cacheId: number) {
		console.log('clearFromCache')
		return this.apiClient.post('/clear-from-cache', { cacheId })
	}
}
