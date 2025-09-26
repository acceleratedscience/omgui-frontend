import BaseApi from '../BaseApi'

export default class MainApi extends BaseApi {
	constructor() {
		super('MainApi')
	}

	//
	//

	getConfig() {
		return this.apiClient.get('/get-config')
	}

	// Execute command.
	execCommand(command: string) {
		return this.apiClient.post('/exec-command', { command })
	}
}
