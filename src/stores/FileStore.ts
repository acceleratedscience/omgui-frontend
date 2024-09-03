/**
 * This store is responsible for the storing and displaying
 * of an individual file using the appropriate module.
 * When the file is a directory, the FileBrowser module is loaded.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolViewerStore } from './MolViewerStore'

// Utils
import { map_fileType2Module } from '@/utils/maps'

// Type declarations
import type { File, FileType } from '@/types'
// The State type is just a copy of the File type but with underscored keys.
type State = AddUnderscore<File>
type AddUnderscore<T> = {
	[P in keyof T as `_${string & P}`]: T[P]
}

// API
import { apiFetch, fileSystemApi } from '@/api/ApiService'

// Initial state
function getInitialState(): State {
	return {
		__meta: {
			size: null, // File size in bytes
			timeCreated: null, // Timestamp in ms
			timeEdited: null, // Timestamp in ms
			fileType: null, // File type based on the extension, 'dir' for directories
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
		data(): any {
			return this._data
		},
		filename(): string {
			return this._filename
		},
		// Filename without extension.
		filenameNaked(): string {
			const regex1 = new RegExp(`\\.${this.ext}$`)
			const regex2 = new RegExp(`\\.${this.ext2}$`)
			return this._filename.replace(regex1, '').replace(regex2, '')
		},
		path(): string {
			return this._path
		},
		// The path without the filename.
		pathDir(): string {
			const regex = new RegExp(`\\/?${this._filename}$`)
			return this._path.replace(regex, '')
		},
		breadCrumbPathArray(): string[] {
			const mainStore = useMainStore()
			return [mainStore.workspace as string, ...this._path.split('/')].filter(Boolean)
		},
		pathAbsolute(): string {
			return this._pathAbsolute
		},
		isDir(): boolean {
			return this.__meta.fileType == 'dir'
		},
		errCode(): string | null {
			return this.__meta.errCode
		},

		// The file's extension.
		ext(): string {
			return this.__meta.ext
		},

		// The file's secondary extension (e.g. .mol.json).
		ext2(): string {
			return this.__meta.ext2
		},

		// The file type based on the extension.
		defaultFileType(): FileType {
			return this.__meta.fileType
		},

		// Lets us detect when a file is being
		// viewed with a non-default module.
		fileTypeOverride(): boolean {
			return !!router.currentRoute.value.query?.use
		},

		// The final file type, which may be overridden
		fileType(): FileType {
			// const molViewerStore = useMolViewerStore()
			return this.fileTypeOverride
				? (router.currentRoute.value.query?.use?.toString() as FileType) || this.defaultFileType
				: this.defaultFileType
			// : molViewerStore.molFromMolset
			// 	? 'mol'
			// 	: this.defaultFileType
		},

		// The filename of the module we'll use to view the file.
		moduleName(): string {
			return map_fileType2Module[this.fileType || 'unk']
		},

		// The filename of the module we'll use to view the file.
		defaultModuleName(): string {
			return map_fileType2Module[this.defaultFileType || 'unk']
		},

		// Indicates whether we recognize the file's extension.
		// When we don't, we default to the TextViewer module
		// and display a warning to the user.
		invalidExt(): boolean {
			if (this.isDir || !this.path) return false
			return this.defaultFileType == 'unk' && !this.fileTypeOverride
		},

		active(): boolean {
			return !!this._filename
		},
	},
	actions: {
		// Load file or directory.
		loadItem(file: File) {
			if (!file) return
			// console.log('file data:', file.data)
			this.__meta.size = file._meta.size || null
			this.__meta.timeCreated = file._meta.timeCreated || null
			this.__meta.timeEdited = file._meta.timeEdited || null
			this.__meta.fileType = file._meta.fileType || null
			this.__meta.ext = file._meta.ext || ''
			this.__meta.ext2 = file._meta.ext2 || ''
			this.__meta.errCode = file._meta.errCode || null
			this._filename = file.filename || ''
			this._path = file.path || ''
			this._pathAbsolute = file.pathAbsolute || ''
			this._data = file.data || ''
		},

		// Return to a file's parent folder in the filebrowser,
		// or remove the ?use query parameter if we're viewing
		// a file with a non-default viewer.
		exitViewer() {
			console.log('exitViewer')
			const route = router.currentRoute.value
			if (route.query.use) {
				router.push({ path: router.currentRoute.value.path })
			} else {
				const path = ['/~'].concat(this._path.split('/'))
				path.pop()
				console.log('>', path.join('/'))
				router.push({ path: path.join('/') })
			}
		},

		// Delete a file.
		deleteFile(pathAbsolute: string) {
			return new Promise<boolean>((resolve, reject) => {
				if (!pathAbsolute) {
					console.error('fileStore.deleteFile(): No file path provided.')
					return reject(false)
				}
				apiFetch(fileSystemApi.deleteFile(pathAbsolute), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Clear store.
		clear() {
			Object.assign(this, getInitialState())
		},
	},
})
