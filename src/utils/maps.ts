// This file is for centralizing any mapping information,
// like file extensions to file types, file types to modules, etc.

//
//

// Type declaration
type Map = {
	[key: string]: string
}
type MultiMap = {
	[key: string]: string[]
}

// Maps file extensions to file types. The file type
// is displayed in the breadcrumbs, and it controls
// which module is used to view which file.
export const map_Ext2fileType: Map = {
	_default: 'unknown',
	txt: 'text',
	csv: 'data',
	json: 'json',
	'mol.json': 'mol',
	sdf: 'sdf', // should become part of mol
}

// Maps the different file types to their full
// display name and their respective module names.
const _map_FileType: MultiMap = {
	unknown: ['unknown', 'TextViewer'],
	text: ['text', 'TextViewer'],
	data: ['data', 'DataViewer'],
	json: ['json', 'JsonViewer'],
	mol: ['molecule', 'MolViewer'],
	sdf: ['sdf', 'SdfViewer'], // should become part of mol
}

// Splitting up the above map into two separate maps.
export const map_fileType2DisplayFT: Map = {}
export const map_fileType2Module: Map = {}
for (const key in _map_FileType) {
	map_fileType2DisplayFT[key] = _map_FileType[key][0]
	map_fileType2Module[key] = _map_FileType[key][1]
}
