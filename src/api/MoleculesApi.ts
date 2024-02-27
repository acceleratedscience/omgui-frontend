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
}
