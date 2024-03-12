// The contents of one column in the file browser.
export type Level = {
	_meta: {
		empty: boolean
		empty_hidden: boolean
	}

	dirname: string // Name of column, aka parent directory
	dirs: Dir[]
	dirsHidden: Dir[]
	files: File[]
	filesHidden: File[]
}

// A directory item in one of the file browser's columns.
export type Dir = {
	_meta: {
		fileType: string // 'dir' for directories
		size: number | null
		timeCreated: number | null
		timeEdited: number | null
	}

	filename: string
	path: string
	pathAbsolute: string
	sel?: boolean // Selection state in the file browser, not from API
}

// A file item in one of the file browser's columns,
// or a file being displayed by one of the viewer modules.
export type File = Dir & {
	_meta: {
		ext: string
		ext2: string
		errCode: FileErrCode
	}
	data?: string // Not used in filebrowser
	dispSize?: string // Computed, not from API
	dispTimeCreated?: string // Computed, not from API
	dispTimeEdited?: string // Computed, not from API
}

// Error codes are defined in open_file() in API, see helpers -> general.py
export type FileErrCode =
	| null
	| 'not_found'
	| 'no_permission'
	| 'is_dir'
	| 'decode'
	| 'io'
	| 'unknown'
