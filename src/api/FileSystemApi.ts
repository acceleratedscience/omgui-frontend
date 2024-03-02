import BaseApi from './BaseApi'

export default class FileSystemApi extends BaseApi {
	constructor() {
		super('FileSystemApi')
	}

	//
	//

	// Get the list of workspaces.
	getWorkspaces() {
		return this.apiClient.get('/get-workspaces')
	}

	// Get the name of the active workspace.
	getWorkspace() {
		return this.apiClient.get('/get-workspace')
	}

	setWorkspace(workspace: string) {
		return this.apiClient.post('/set-workspace', { workspace })
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
