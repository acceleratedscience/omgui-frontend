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
// File types are defined in _get_file_type() in file_system.py.
// prettier-ignore
const _map_FileType: MultiMap = {
	dir:    ['directory',    'FileBrowser'],
	mol:    ['molecule',     'MolViewer'],
	molset: ['molecule set', 'MolGrid'],
	json:   ['json',         'JsonViewer'],
	data:   ['data',         'DataViewer'],
	text:   ['text',         'TextViewer'],
	html:   ['html',         'TextViewer'], // Viewer TBD
	img:    ['image',        'TextViewer'], // Viewer TBD
	vid:    ['video',        'TextViewer'], // Viewer TBD
	xml:    ['xml',          'TextViewer'], // Viewer TBD
	pdf:    ['pdf',          'TextViewer'], // Viewer TBD
	svg:    ['svg',          'TextViewer'], // Viewer TBD
	run:    ['run',          'TextViewer'], // Viewer TBD
	rxn:    ['reaction',     'TextViewer'], // Viewer TBD
	md:     ['markdown',     'TextViewer'], // Viewer TBD
	unk:    ['unknown',      'TextViewer'],
	// sdf: ['sdf', 'SdfViewer'], // should become part of mol
}

// Splitting up the above map into two separate maps.
export const map_fileType2DisplayFT: Map = {}
export const map_fileType2Module: Map = {}
for (const key in _map_FileType) {
	map_fileType2DisplayFT[key] = _map_FileType[key][0]
	map_fileType2Module[key] = _map_FileType[key][1]
}
