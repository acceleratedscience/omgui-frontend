/**
 * This file is for centralizing any mapping information,
 * like file types to modules, etc.
 */

// Type declaration
type Map = {
	[key: string]: string
}
type MultiMap = {
	[key: string]: string[]
}

// Maps the different file types to their full
// display name and their respective module names.
const _map_FileType: MultiMap = {
	unknown: ['unknown', 'TextViewer'],
	text: ['text', 'TextViewer'],
	data: ['data', 'DataViewer'],
	json: ['json', 'JsonViewer'],
	mol: ['molecule', 'MolViewer'],
	molset: ['molecule set', 'MolGrid'],
	sdf: ['sdf', 'SdfViewer'], // should become part of mol
}

// Splitting up the above map into two separate maps.
export const map_fileType2DisplayFT: Map = {}
export const map_fileType2Module: Map = {}
for (const key in _map_FileType) {
	map_fileType2DisplayFT[key] = _map_FileType[key][0]
	map_fileType2Module[key] = _map_FileType[key][1]
}
