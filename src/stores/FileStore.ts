/**
 * This store is responsible for the storing and displaying
 * of an individual file using the appropriate module.
 * When the file is a directory, the FileBrowser module is loaded.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Utils
import { map_fileType2Module } from '@/utils/maps'

// Type declarations
import type { FileErrCode, File } from '@/types'
type State = {
	_meta: {
		size: number | null
		timeCreated: number | null
		timeEdited: number | null
		fileType: string
		ext: string
		ext2: string
		errCode: FileErrCode
	}
	_filename: string
	_path: string
	_pathAbsolute: string
	_data: string
}

// Initial state
function getInitialState(): State {
	return {
		_meta: {
			size: null, // File size in bytes
			timeCreated: null, // Timestamp in ms
			timeEdited: null, // Timestamp in ms
			fileType: '', // File type based on the extension, 'dir' for directories
			ext: '',
			ext2: '', // Secondary extension (e.g. foobar.mol.json --> mol)
			errCode: null, // Error code from the API
		},
		_filename: '',
		_path: '', // File path relative to the workspace
		_pathAbsolute: '', // Absolute file path
		_data: '', // Content of file
	}
}

export const useFileStore = defineStore('fileStore', {
	// The state matched the API output as defined in fuke_system.py > _compile_file_data()
	state: () => getInitialState(),

	getters: {
		data(): string {
			return this._data
		},
		path(): string {
			return this._path
		},
		pathAbsolute(): string {
			return this._pathAbsolute
		},
		isDir(): boolean {
			return this._meta.fileType == 'dir'
		},
		errCode(): string | null {
			return this._meta.errCode
		},

		// The file's extension.
		ext(): string {
			return this._meta.ext
		},

		// The file's secondary extension (e.g. .mol.json).
		ext2(): string {
			return this._meta.ext2
		},

		// The file type based on the extension.
		defaultFileType(): string {
			return this._meta.fileType
		},

		// Lets us detect when a file is being
		// viewed with a non-default module.
		fileTypeOverride(): boolean {
			return !!router.currentRoute.value.query?.use
		},

		// The final file type, which may be overridden
		fileType(): string {
			return this.fileTypeOverride
				? router.currentRoute.value.query?.use?.toString() || this.defaultFileType
				: this.defaultFileType
		},

		// The filename of the module we'll use to view the file.
		moduleName(): string {
			return map_fileType2Module[this.fileType]
		},

		// Indicates whether we recognize the file's extension.
		// When we don't, we default to the TextViewer module
		// and display a warning to the user.
		invalidExt(): boolean {
			if (this.isDir || !this.path) return false
			return this.defaultFileType == 'unk' && !this.fileTypeOverride
		},
	},
	actions: {
		// Load file or directory.
		loadItem(file: File) {
			if (!file) return
			this._meta.size = file._meta.size || null
			this._meta.timeCreated = file._meta.timeCreated || null
			this._meta.timeEdited = file._meta.timeEdited || null
			this._meta.fileType = file._meta.fileType || ''
			this._meta.ext = file._meta.ext || ''
			this._meta.ext2 = file._meta.ext2 || ''
			this._meta.errCode = file._meta.errCode || null
			this._filename = file.filename || ''
			this._path = file.path || ''
			this._pathAbsolute = file.pathAbsolute || ''
			this._data = file.data || ''
		},

		// Clear store.
		clear() {
			Object.assign(this, getInitialState())
		},
	},
})
