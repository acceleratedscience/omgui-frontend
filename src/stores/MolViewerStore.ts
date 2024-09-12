/**
 * This store is responsible for storing the molecule
 * data which is displayed in the molecule viewer.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Utils
import { slugify, isObject } from '@/utils/helpers'

// Type declarations
import type { MolType, Smol, TempSmol, Protein, Mmol, Format3D, MolMeta } from '@/types'

type State = {
	_molType: MolType
	_smol: {
		data: Smol | TempSmol
		data3D: string | null // mdl format, basically a singular sdf
		data2D: string | null // svg
		meta: MolMeta | null
	}
	_mmol: Mmol
	_molFromMolsetIndex: number | null
	_loading: boolean
	_hasChanges: boolean
}
type SaveAsOptions = {
	newFile?: boolean
}

function getInitialState(): State {
	return {
		// Defines where we read/save molecule data from/to
		// I.e. smol, protein, etc.
		_molType: null,

		// Small molecule data
		_smol: {
			data: { identifiers: {} },
			data3D: null,
			data2D: null,
			meta: null,
		},

		// Protein data
		_mmol: {
			data: null,
			data3DFormat: null,
			data3D: null,
			meta: null,
		},

		// When viewing a molecule from a molset,
		// this is controls which molecule to show.
		_molFromMolsetIndex: null,

		// Molecule loading status
		_loading: true,

		// Lets us block exit when there are unsaved changes.
		_hasChanges: false,
	}
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: () => getInitialState(),
	getters: {
		/**
		 * General getters
		 */

		molType(): MolType {
			return this._molType
		},
		isSmol(): boolean {
			return this._molType == 'smol'
		},
		isMmol(): boolean {
			return !!(this._molType && this._molType != 'smol')
		},
		isProtein(): boolean {
			return this._molType == 'protein'
		},

		mol(): Smol | TempSmol | Protein | null {
			if (this.isSmol) {
				return this._smol.data
			} else if (this.isMmol) {
				return this._mmol.data
			} else {
				return null
			}
		},
		name(): string {
			if (this.isSmol) {
				return this._smol.data.identifiers?.name || 'Unnamed Molecule'
			} else if (this.isProtein) {
				return this._mmol.data?.entry?.id || 'Unknown Protein'
			} else {
				return ''
			}
		},
		nameSlug(): string {
			return slugify(this.name)
		},
		// Indicates whether we're viewing a molecule from a molset.
		molFromMolset(): boolean {
			return !!this._molFromMolsetIndex
		},
		// When viewing a molecule from a molset, this is the index of the molecule.
		molFromMolsetIndex(): number | null {
			return this._molFromMolsetIndex
		},
		isEmpty(): boolean {
			return !this._molType
		},
		hasChanges(): boolean {
			return this._hasChanges
		},
		loading(): boolean {
			return this._loading
		},

		/**
		 * Small molecule getters
		 */

		inchi(): string | null {
			if (!this.isSmol) return null
			return this._smol.data?.identifiers?.inchi || null
		},
		smiles(): string | null {
			if (!this.isSmol) return null
			return (
				this._smol.data?.identifiers?.isomeric_smiles ||
				this._smol.data?.identifiers?.canonical_smiles ||
				this._smol.data?.identifiers?.smiles
			)
		},
		// Cycle through the available identifiers to find the best available one.
		identifier(): string | null {
			if (!this.isSmol) return null
			return (
				this.inchi ||
				this.smiles ||
				this._smol.data?.identifiers?.inchikey ||
				this._smol.data?.identifiers?.name ||
				this._smol.data?.identifiers?.cid ||
				null
			)
		},
		mdl(): string | null {
			if (!this.isSmol) return null
			return this._smol.data3D
		},
		svg(): string | null {
			if (!this.isSmol) return null
			return this._smol.data2D
		},
		enriched(): boolean {
			if (!this.isSmol) return false
			return !!this._smol.data?.enriched
		},
		// A combination string of "key: value" pairs used as tooltip.
		propertiesString(): Record<string, string> | null {
			if (!this.isSmol) return null
			if (!this._smol.data || !('properties' in this._smol.data)) return null

			const props: Record<string, string> = {}
			for (const prop in this._smol.data.properties) {
				let val: string | number = this._smol.data.properties[prop]
				if (val || val === 0) val = val.toString()
				if (val) {
					props[prop] = `${prop}: ${val}`
				}
			}
			return props
		},

		/**
		 * Macromolecule getters
		 */
		mmol(): Mmol {
			return this._mmol
		},
		protein(): Mmol | null {
			if (!this.isProtein) return null
			return this._mmol
		},
		proteinData(): Protein | null {
			if (!this.isProtein) return null
			return this._mmol.data
		},
		proteinDataHuman(): Record<string, string | number | null> | null {
			if (!this.isProtein) return null
			const data = this._mmol.data
			const humanData: Record<string, any> = {}
			for (const key in data) {
				const humanKey = _massageKey(key)

				if (Array.isArray(data[key]) && isObject(data[key][0])) {
					// Humanize arrays of objects
					if (['pdbx_struct_oper_list'].includes(key)) {
						// Fields with list of matrix data
						console.log(999, data[key])
						const humanArray = data[key].map((data) => _formMatrix(data))
						humanData[humanKey] = humanArray
					} else {
						// regular arrays of objects
						const humanArray = data[key].map((ogVal) => {
							const val: Record<string, any> = {}
							for (const key2 in ogVal) {
								const humanTableKey = _massageTableKey(key2)
								val[humanTableKey] = _massageValue(ogVal[key2])
							}
							return val
						})
						humanData[humanKey] = humanArray
					}
				} else if (isObject(data[key])) {
					// Humanize objects
					let humanObj: Record<string, any> | string[][] | null = {}

					if (['entry'].includes(key)) {
						// Fields we ignore
						humanObj = null
					} else if (['atom_sites', 'database_PDB_matrix'].includes(key)) {
						// Fields with matrix data
						humanObj = _formMatrix(data[key])
					} else {
						// General objects
						for (const key2 in data[key]) {
							const humanTableKey = _massageTableKey(key2)
							humanObj[humanTableKey] = _massageValue(data[key][key2])
						}
					}
					if (humanObj) humanData[humanKey] = humanObj
				} else if (data[key] && typeof data[key] === 'string') {
					// Humanize strings
					humanData[humanKey] = _massageValue(data[key])
				}
			}
			return humanData
		},
		proteinData3D(): string | null {
			if (!this.isProtein) return null
			return this._mmol.data3D
		},
		proteinData3DFormat(): Format3D {
			if (!this.isProtein) return null
			return this._mmol.data3DFormat
		},
	},
	actions: {
		/**
		 * General actions
		 */

		setMolData(mol: Smol | Mmol, molType: 'smol' | 'protein') {
			console.log('--setMolData', molType, mol)
			if (molType == 'smol') {
				mol = mol as Smol
				this._molType = 'smol'
				this._smol.data = mol
			} else if (molType == 'protein') {
				mol = mol as Mmol
				this._molType = 'protein'
				this._mmol.data = mol.data
				this._mmol.header = mol.header // temp
				this._mmol.data3DFormat = mol.data3DFormat as Format3D
				this._mmol.data3D = mol.data3D
				this._mmol.meta = mol.meta
			}
			this._loading = false
		},
		setMolFromMolsetIndex(index: number | null, dontPushRoute = false) {
			// console.log('setMolFromMolsetIndex:', index, dontPushRoute)
			this._molFromMolsetIndex = index

			if (!dontPushRoute) {
				const query = index ? `?show=${index}` : ''
				const path = router.currentRoute.value.path + query
				router.push(path)
			}
		},

		/**
		 * Small molecule actions
		 */

		setMolIdentifier(identifier: 'inchi' | 'inchikey' | 'canonical_smiles', value: string) {
			if (!this.isSmol) return
			this._smol.data.identifiers[identifier] = value
		},
		async fetchMolVizData(inchi_or_smiles: string) {
			if (!this.isSmol) return
			// console.log('* fetchMolVizData')
			apiFetch(moleculesApi.getMolVizData(inchi_or_smiles), {
				onSuccess: (data) => {
					if (data.svg) {
						// console.log('fetchMolVizData')
						this.setMolVizData(data.svg, data.mdl)
					}
				},
				onError: (err) => {
					console.log('Error in getMolVizData()', err)
				},
			})
		},
		setMolVizData(svg: string, mdl: string) {
			if (!this.isSmol) return
			if (svg) this._smol.data2D = svg
			if (mdl) this._smol.data3D = mdl
		},
		async enrichMol() {
			if (!this.isSmol) return
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.enrichMol(this.mol as Smol), {
					onSuccess: (data) => {
						this._smol.data = data
						this.setHasChanges(true)
						this.setEnriched(true)
						resolve(true)
					},
					onError: (response) => reject(response),
				})
			})
		},
		setEnriched(enriched: boolean) {
			if (!this.isSmol) return
			this._smol.data.enriched = enriched
		},
		setHasChanges(hasChanges: boolean) {
			this._hasChanges = hasChanges
		},

		/**
		 * Save-as functions - small molecules
		 */

		// Save molecule as JSON (.mol.json) file.
		saveMolAsJSON(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isSmol) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsJSON(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Save molecule as CSV (.csv) file.
		saveMolAsCSV(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isSmol) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsCSV(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as SDF (.sdf) file.
		saveMolAsSDF(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isSmol) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsSDF(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as MDL (.mol) file.
		saveMolAsMDL(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isSmol) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsMDL(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as SMILES (.smi) file.
		// This removes all parameters from the molecule.
		saveMolAsSMILES(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isSmol) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsSMILES(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		/**
		 * Save-as functions - proteins
		 */

		saveMmolAsMmolJson(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			console.log('# saveMmolAsMmolJson', this._molType)
			if (!this.isProtein) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMmolAsMmolJson(destinationPath, this.mmol as Mmol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		saveMmolAsPDB(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isProtein) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMmolAsPDB(destinationPath, this.mmol as Mmol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		saveMmolAsCIF(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (!this.isProtein) return Promise.resolve(false)
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMmolAsCIF(destinationPath, this.mmol as Mmol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		clear() {
			Object.assign(this, getInitialState())
		},
	},
})

/**
 * String translators for CIF data,
 * making fields more human-readable.
 */
function _massageKey(str: string): string {
	str = str.replace(/^pdbx_/i, '')
	str = str.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") // prettier-ignore
	str = str.replace('SG Project', 'Structural Genomics Project')
	str = str.replace('Chem Comp', 'Chemical Composition')
	str = str.replace('Struct Asym', 'Structural Asymmetric Unit')
	str = str.replace(/\bexptl\b/gi, 'Experimental')
	str = str.replace(/\bnmr\b/gi, 'NMR')
	str = str.replace(/\bstruct\b/gi, 'Structure')
	str = str.replace(/\bgen\b/gi, 'Generation')
	str = str.replace(/\bref\b/gi, 'Reference')
	str = str.replace(/\bseq\b/gi, 'Sequence')
	str = str.replace(/\bdiffrn\b/gi, 'Diffraction')
	str = str.trim()

	return str
}

function _massageTableKey(str: string): string {
	str = str.replace(/^pdbx_/i, '')
	str = str.split('_').join(' ')
	str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
	str = str.replace(/\bdb\b/gi, 'DB')
	str = str.replace(/\bid\b/gi, 'ID')
	str = str.replace(/\bdoi\b/gi, 'DOI')
	str = str.trim()
	// str = '--' + str
	return str
}

function _massageValue(str: string | null): string | null {
	if (!str) return null
	if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith(';') && str.endsWith(';'))) {
		str = str.slice(1, -1)
	}
	if (str === str.toUpperCase()) {
		str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
	}
	if (str == 'entry id') console.log('-1', `-${str}-`, str.replace(/\bid\b/gi, 'ID'))
	str = str == '?' ? null : str
	str = str ? str.trim() : null
	return str
}

function _formMatrix(obj: Record<string, string>): { matrix: string[][]; vector: string[]; fields: { [key: string]: string } } {
	// return obj
	const matrix: string[][] = []
	const vector: string[] = []
	const fields: { [key: string]: string } = {}
	for (const key in obj) {
		// Parse matrix row and columnn from fract_transf_matrix[1][2]
		const keyArr = key.split('[')
		if (keyArr.length == 3) {
			const row = +keyArr[1].replace(']', '') - 1
			const col = +keyArr[2].replace(']', '') - 1
			matrix[row] = matrix[row] || []
			matrix[row][col] = obj[key]
			// console.log('>', row, col, obj[key])
		} else if (keyArr.length == 2) {
			// Parse translation vector and store it in the last row
			vector.push(obj[key])
		} else {
			fields[key] = obj[key]
		}
	}
	// console.log('matrix:', matrix)
	// console.log('vector:', vector)
	return {
		matrix,
		vector,
		fields,
	}
}
