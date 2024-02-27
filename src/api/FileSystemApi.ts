import BaseApi from './BaseApi'

export default class FileSystemApi extends BaseApi {
	constructor() {
		super('FileSystemApi')
	}

	//
	//

	getWorkspaceName() {
		return this.apiClient.get('/get-workspace-name')
	}

	// Get list of files in workspace or workspace directory.
	getWorkspaceFiles(path: string = '') {
		return this.apiClient.post('/get-workspace-files', { path })
	}

	// Get file content from path.
	getFile(path: string = '') {
		return this.apiClient.post('/get-file', { path })
	}

	test() {
		return this.apiClient(`/test`)
	}
}
