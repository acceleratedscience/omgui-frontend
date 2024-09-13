/**
 * Molecules shared
 */

type MmolType = 'protein'
export type MolType = 'smol' | MmolType | null

/**
 * Small molecules
 */

// A molecule object, as returned by the API.
export type Smol = {
	index?: number // For the position in the molset
	identifiers: {
		name: string
		inchi: string
		inchikey: string
		canonical_smiles: string // The "regular" SMILES
		isomeric_smiles: string
		smiles: string // We don't use this field but when opening SDF files it may be used
		cid: string
		molecular_formula: string
		[key: string]: string // To shut up ts errors.
	}
	synonyms: string[]
	properties: {
		[key: string]: string | number
	}
	property_sources: {
		[key: string]: {
			[key: string]: string
		}
	}
	analysis: any[]
	enriched: boolean
}

// This lets us set some properties on a molecule
// before the full molecule is loaded, without ts complaining.
export type TempSmol = {
	identifiers: Record<string, string>
	enriched?: boolean
}

/**
 * Macromolecules
 */

// Macromolecule
// - - -
// Unlike small molecules, with macromolecules like proteins
// we can't fetch 3D data on the fly so we store the 3D data
// in the molecule dictionary.
export type Mmol = {
	_molType?: MmolType | null // Optional because in the MolViewerStore we store the molType one level higher
	_keyMap: {
		// Used to map humanized data keys to original keys
		[key: string]: string
	}
	data: Protein | null
	data3DFormat: Format3D
	data3D: string | null
	meta: MolMeta | null
}

export type MolMeta = {
	notes: string
	labels: string[]
}

// Miew supported 3D data formats:
// https://github.com/search?q=repo%3Aepam%2Fmiew+this._options.fileType+%3D+&type=code
export type Format3D = 'sdf' | 'pdb' | 'cif' | 'xyz' | 'cml' | 'gro' | 'ccp4' | 'mol2' | 'dsn6' | 'mmtf' | null

// Protein
export type Protein = {
	__map__?: {
		[key: string]: string
	}
	[key: string]: any
}

// Api protein payload
// Todo: merge with Mmol
export type MmolApi = {
	mol_type: 'protein' | string
	name: string
	data: Protein
	data_3d: string
	data_3d_format: string
	meta: {
		notes: string
		labels: string[]
	}
}

/**
 * Molecule sets
 */

// A set of molecules.
export type Molset = Smol[]

// The API response for molset page.
export type MolsetApi = {
	cacheId: number
	mols: Molset // Paginated subset of the molset
	total: number
	resultCount: number
	searchStr: string
	searchMode: SearchMode
	sort: string
	allIndices: number[]
	matchingIndices: number[]
	page: number
	pageSize: number
	pageTotal: number
}

/**
 * File System
 */

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
		fileType: 'dir'
		size: number | null
		timeCreated: number | null
		timeEdited: number | null
	}

	filename: string
	path: string
	pathAbsolute: string

	// Selection state in the file browser, not from API
	sel?: boolean
}

export type File = {
	_meta: {
		fileType: FileType | null
		size: number | null
		timeCreated: number | null
		timeEdited: number | null
		//
		ext: string
		ext2: string
		errCode: FileErrCode
	}

	filename: string
	path: string
	pathAbsolute: string

	// Selection state, used in the file browser.
	sel?: boolean

	// File contents, used by the different file viewers.
	data?: any

	// Computed, not from API
	dispSize?: string
	dispTimeCreated?: string
	dispTimeEdited?: string
}

// Error codes are defined in open_file() in API, see helpers -> general.py
export type FileErrCode = null | 'not_found' | 'no_permission' | 'is_dir' | 'decode' | 'io' | 'unknown'

// File types are defined in _get_file_type() in API, see workers -> file_system.py
// They are translated into the corresponsing name / module name in @/types/maps.ts › _map_FileType()
export type FileType =
	| 'dir'
	| 'mol'
	| 'molset'
	| 'pdb'
	| 'json'
	| 'mdl'
	| 'data'
	| 'smi'
	| 'text'
	| 'html'
	| 'img'
	| 'vid'
	| 'xml'
	| 'pdf'
	| 'svg'
	| 'run'
	| 'rxn'
	| 'md'
	| 'unk'
	| null

// // A file item in one of the file browser's columns,
// // or a file being displayed by one of the viewer modules.
// export type File = Dir & {
// 	_meta: {
// 		ext: string
// 		ext2: string
// 		errCode: FileErrCode
// 	}

// 	// File contents, not used in filebrowser
// 	data?: string

// 	// Computed, not from API
// 	dispSize?: string
// 	dispTimeCreated?: string
// 	dispTimeEdited?: string
// }

/**
 * Other
 */

export type SearchMode = 'text' | 'smarts'

// The URL query object as part of the route.
export type UrlQuery = Record<string, string | (string | null)[]>

// Option menu with actions
export type ActionOption = {
	val: string
	disp: string
	action: () => void
}
