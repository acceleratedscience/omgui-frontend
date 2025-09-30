import BaseApi from '../BaseApi'
import type { LocationQuery } from 'vue-router'

export default class FileSystemApi extends BaseApi {
	constructor() {
		super('FileSystemApi')
	}

	//
	//

	// Get the name of the active workspace
	getWorkspaceName() {
		return this.apiClient.get('/workspace/name')
	}

	// Get the list of workspaces
	getWorkspaces() {
		return this.apiClient.get('/workspace/list')
	}

	// Set the active workspace
	setWorkspace(workspace: string) {
		return this.apiClient.post('/workspace/set', { workspace })
	}

	// Create a workspace
	createWorkspace(workspace: string) {
		return this.apiClient.post('/workspace/create', { workspace })
	}

	// Get list of files in workspace directory
	getFiles(path: string = '') {
		return this.apiClient.post('/file/list', { path })
	}

	// Get file content from path
	getFile(path: string = '', query: LocationQuery = {}) {
		return this.apiClient.post('/file/get', { path, query })
	}

	// Open a file in its OS application
	openFileOS(path_absolute: string = '') {
		return this.apiClient.post('/file/open-os', { path_absolute })
	}

	// Delete a file
	deleteFile(path_absolute: string = '') {
		return this.apiClient.post('/file/delete', { path_absolute })
	}

	test() {
		return this.apiClient(`/test`)
	}
}
