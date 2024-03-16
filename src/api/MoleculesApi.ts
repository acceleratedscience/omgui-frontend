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

	getMolVizData(inchi_or_smiles: string) {
		return this.apiClient.post(`/get-mol-viz-data`, { inchi_or_smiles })
	}

	// Filter a molecule set based on query.
	getMolset(
		path: string = '',
		options: { query?: string; page?: number; pageSize?: number; sort?: string } = {},
	) {
		const { query, page, pageSize, sort } = options
		console.log(123, options)
		return this.apiClient.post('/get-molset', { path, query, page, pageSize, sort })
	}
}
