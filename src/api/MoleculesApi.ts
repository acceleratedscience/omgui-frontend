import BaseApi from './BaseApi'

export default class MoleculesApi extends BaseApi {
	constructor() {
		super('MoleculesApi')
	}

	//
	//

	getMolData(identifier: string) {
		return this.apiClient.post(`/get-mol-data`, { identifier })
	}

	getMolVizData(inchi: string) {
		return this.apiClient.post(`/get-mol-viz-data`, { inchi })
	}

	// Filter a molecule set based on query.
	filterMolset(path: string = '', query: string = '') {
		return this.apiClient.post('/filter-molset', { path, query })
	}
}
