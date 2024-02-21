/**
 * This store is responsible for the storing and displaying
 * of an individual file using the appropriate module.
 * When the file is a directory, the FileBrowser module is loaded.
 */

import { defineStore } from 'pinia'

// Type declarations
type ErrCode = null | 'not_found' | 'no_permission' | 'is_dir' | 'decode' | 'io' | 'unknown' // From open_file() in API, see helpers -> general.py
type FileState = {
	_data: string
	_path: string
	_pathFull: string
	_isDir: boolean
	_errCode: ErrCode
}
type ExtMap = {
	[key: string]: string
}

// Maps file extensions to module names.
const EXT_MAP: ExtMap = {
	default: 'TextViewer',
	csv: 'DataViewer',
	txt: 'TextViewer',
}

export const useFileStore = defineStore('fileStore', {
	state: (): FileState => ({
		_data: '', // Content of file
		_path: '', // Path of file relative to the workspace
		_pathFull: '', // Path of file relative to the system
		_isDir: false, // Whether the path is a directory
		_errCode: null, // Error code from the API
	}),
	getters: {
		data(): string {
			return this._data
		},
		path(): string {
			return this._path
		},
		pathFull(): string {
			return this._pathFull
		},
		isDir(): boolean {
			return this._isDir
		},
		errCode(): string | null {
			return this._errCode
		},

		// The file's extension.
		ext(): string | null {
			const hasExt = this._path.indexOf('.') >= 0
			if (hasExt) {
				return this._path.split('.').pop() || null
			} else {
				return null
			}
		},

		// The filename of the module we'll use to view the file.
		moduleName(): string {
			return this.ext ? EXT_MAP[this.ext] || EXT_MAP.default : EXT_MAP.default
		},

		// Indicates whether we recognize the file's extension.
		// When we don't, we default to the TextViewer module
		// and display a warning to the user.
		invalidExt(): boolean {
			if (this._isDir || !this._path) return false
			return this.ext ? !(this.ext in EXT_MAP) : true
		},
	},
	actions: {
		loadItem(file: {
			data: string
			path: string
			pathFull: string
			isDir: boolean
			errCode: ErrCode
		}) {
			this._data = file.data
			this._path = file.path
			this._pathFull = file.pathFull
			this._isDir = file.isDir
			this._errCode = file.errCode
		},
		// setData(data: string) {
		// 	this._data = data
		// },
		// setPath(path: string, pathFull: string) {
		// 	this._path = path
		// 	this._pathFull = pathFull
		// },
		// setIsDir(isDir: boolean) {
		// 	this.clear()
		// 	this._isDir = isDir
		// },
		// setError(errCode: ErrCode) {
		// 	this.clear()
		// 	this._errCode = errCode
		// },
		// clearError() {
		// 	this._errCode = null
		// },
		clear() {
			this._data = ''
			this._path = ''
			this._errCode = null
			this._isDir = false
		},
	},
})
