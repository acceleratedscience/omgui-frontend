import BaseApi from '../BaseApi'
import type { LocationQuery } from 'vue-router'

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
	getFile(path: string = '', query: LocationQuery = {}) {
		return this.apiClient.post('/get-file', { path, query })
	}

	// Open a file in its OS application.
	openFileOS(path_absolute: string = '') {
		return this.apiClient.post('/open-file-os', { path_absolute })
	}

	// Delete a file.
	deleteFile(path_absolute: string = '') {
		return this.apiClient.post('/delete-file', { path_absolute })
	}

	test() {
		return this.apiClient(`/test`)
	}
}
