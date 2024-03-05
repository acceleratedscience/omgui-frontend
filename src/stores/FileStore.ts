/**
 * This store is responsible for the storing and displaying
 * of an individual file using the appropriate module.
 * When the file is a directory, the FileBrowser module is loaded.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Utils
import { map_Ext2fileType, map_fileType2Module } from '@/utils/maps'

// Type declarations
type ErrCode = null | 'not_found' | 'no_permission' | 'is_dir' | 'decode' | 'io' | 'unknown' // From open_file() in API, see helpers -> general.py
type State = {
	_data: string
	_path: string
	_pathFull: string
	_isDir: boolean
	_errCode: ErrCode
}

export const useFileStore = defineStore('fileStore', {
	state: (): State => ({
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

		// The file's secondary extension (e.g. .mol.json).
		ext2(): string | null {
			const hasExt2 = this._path.split('.').length >= 3
			if (hasExt2) {
				const splitPath = this._path.split('.')
				splitPath.pop() // Remove the primary extension
				return splitPath.pop() || null
			} else {
				return null
			}
		},

		// The file type based on the extension.
		defaultFileType(): string {
			if (this.ext) {
				if (this.ext2) {
					return map_Ext2fileType[`${this.ext2}.${this.ext}`] || map_Ext2fileType._default
				} else {
					return map_Ext2fileType[this.ext] || map_Ext2fileType._default
				}
			} else {
				return map_Ext2fileType._default
			}
		},

		// Lets us detect when a file is being
		// viewed with a non-default module.
		fileTypeOverride(): boolean {
			return !!router.currentRoute.value.query?.use
		},

		// The final file type, which may be overridden
		fileType(): string {
			return this.fileTypeOverride
				? router.currentRoute.value.query?.use?.toString() || map_Ext2fileType._default
				: this.defaultFileType
		},

		// The filename of the module we'll use to view the file.
		moduleName(): string {
			return map_fileType2Module[this.fileType]
		},

		// Indicates whether the default module is being
		// overridden by using the ?use= query parameter.
		forcedModule(): boolean {
			return !!router.currentRoute.value.query?.use
		},

		// Indicates whether we recognize the file's extension.
		// When we don't, we default to the TextViewer module
		// and display a warning to the user.
		invalidExt(): boolean {
			if (this._isDir || !this._path) return false
			return this.ext ? !(this.ext in map_Ext2fileType) : true
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
			if (!file) return
			this._data = file.data
			this._path = file.path
			this._pathFull = file.pathFull
			this._isDir = file.isDir
			this._errCode = file.errCode
		},
		clear() {
			// console.log('* clearing file store *')
			this._data = ''
			this._path = ''
			this._errCode = null
			this._isDir = false
		},
	},
})
