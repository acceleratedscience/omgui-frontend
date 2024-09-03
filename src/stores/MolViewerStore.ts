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
import { slugify } from '@/utils/helpers'

// Type declarations
import type { MolType, Smol, TempSmol, Protein, ProteinApi } from '@/types'
type State = {
	_molType: MolType
	smol: {
		_mol: Smol | TempSmol
		_mdl: string | null
		_svg: string | null
	}
	_protein: {
		_mol: Protein | null
		_pdb: string | null
	}
	_molFromMolsetIndex: number | null
	_loading: boolean
	_hasChanges: boolean
}
type SaveAsOptions = {
	newFile?: boolean
}

function getInitialState(): State {
	return {
		// The type will define where we save/read molecule data from to/from.
		// I.e. smol, protein, etc.
		_molType: null,

		// Small molecule data
		smol: {
			_mol: { identifiers: {} },
			_mdl: null, // mol/sdf file content, used for 3D visualization
			_svg: null, // 2D data
		},

		// Protein data
		_protein: {
			_mol: null,
			_pdb: null, // pdb file content, used for 3D visualization
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
		mol(): Smol | TempSmol | Protein | null {
			if (this._molType == 'smol') {
				return this.smol._mol
			} else if (this._molType == 'protein') {
				return this._protein._mol
			} else {
				return null
			}
		},
		name(): string {
			if (this._molType == 'smol') {
				return this.smol._mol.identifiers?.name || 'Unnamed Molecule'
			} else if (this._molType == 'protein') {
				return this._protein._mol?.idcode || 'Unknown Protein'
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
			if (this._molType == 'smol') {
				return this.smol._mol?.identifiers?.inchi || null
			} else {
				return null
			}
		},
		smiles(): string | null {
			if (this._molType == 'smol') {
				return (
					this.smol._mol?.identifiers?.isomeric_smiles ||
					this.smol._mol?.identifiers?.canonical_smiles ||
					this.smol._mol?.identifiers?.smiles
				)
			} else {
				return null
			}
		},
		// Cycle through the available identifiers to find the best available one.
		identifier(): string | null {
			if (this._molType == 'smol') {
				return (
					this.inchi ||
					this.smiles ||
					this.smol._mol?.identifiers?.inchikey ||
					this.smol._mol?.identifiers?.name ||
					this.smol._mol?.identifiers?.cid ||
					null
				)
			} else {
				return null
			}
		},
		mdl(): string | null {
			if (this._molType == 'smol') {
				return this.smol._mdl
			} else {
				return null
			}
		},
		svg(): string | null {
			if (this._molType == 'smol') {
				return this.smol._svg
			} else {
				return null
			}
		},
		enriched(): boolean {
			if (this._molType == 'smol') {
				return !!this.smol._mol?.enriched
			} else {
				return false
			}
		},
		// A combination string of "key: value" pairs used as tooltip.
		propertiesString(): Record<string, string> | null {
			if (this._molType == 'smol') {
				if (!this.smol._mol || !('properties' in this.smol._mol)) return {}

				const props: Record<string, string> = {}
				for (const prop in this.smol._mol.properties) {
					let val: string | number = this.smol._mol.properties[prop]
					if (val || val === 0) val = val.toString()
					if (val) {
						props[prop] = `${prop}: ${val}`
					}
				}
				return props
			} else {
				return null
			}
		},

		/**
		 * Macromolecule getters
		 */

		proteinData(): Protein | null {
			return this._protein._mol
		},
		proteinPdb(): string | null {
			return this._protein._pdb
		},
	},
	actions: {
		setMolData(mol: Smol | ProteinApi, molType: 'smol' | 'protein') {
			// console.log('--setMolData', molType, mol)
			if (molType == 'smol') {
				this._molType = 'smol'
				this.smol._mol = mol as Smol
			} else if (molType == 'protein') {
				this._molType = 'protein'
				this._protein._mol = (mol as ProteinApi).header
				this._protein._pdb = (mol as ProteinApi).pdb
			}
			this._loading = false
		},
		setMolIdentifier(identifier: 'inchi' | 'inchikey' | 'canonical_smiles', value: string) {
			if (this._molType == 'smol') {
				this.smol._mol.identifiers[identifier] = value
			}
		},
		async fetchMolVizData(inchi_or_smiles: string) {
			if (this._molType == 'smol') {
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
			}
		},
		setMolVizData(svg: string, mdl: string) {
			if (this._molType == 'smol') {
				if (svg) this.smol._svg = svg
				if (mdl) this.smol._mdl = mdl
			}
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
		async enrichMol() {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.enrichMol(this.mol as Smol), {
						onSuccess: (data) => {
							this.smol._mol = data
							this.setHasChanges(true)
							this.setEnriched(true)
							resolve(true)
						},
						onError: (response) => reject(response),
					})
				})
			}
		},
		setEnriched(enriched: boolean) {
			if (this._molType == 'smol') {
				this.smol._mol.enriched = enriched
			}
		},
		setHasChanges(hasChanges: boolean) {
			this._hasChanges = hasChanges
		},

		/**
		 * Save-as functions - general
		 */

		// Save molecule as a new JSON (.mol.json) file.
		saveMolAsJSON(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.saveMolAsJSON(destinationPath, this.mol as Smol, newFile), {
						onSuccess: () => resolve(true),
						onError: () => reject(true),
					})
				})
			} else {
				return Promise.resolve(false)
			}
		},

		// Save molecule as a new CSV (.csv) file.
		saveMolAsCSV(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.saveMolAsCSV(destinationPath, this.mol as Smol, newFile), {
						onSuccess: () => resolve(true),
						onError: (response) => reject(response),
					})
				})
			} else {
				return Promise.resolve(false)
			}
		},

		/**
		 * Save-as functions - small molecules
		 */

		// Save molecule as a new SDF (.sdf) file.
		saveMolAsSDF(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.saveMolAsSDF(destinationPath, this.mol as Smol, newFile), {
						onSuccess: () => resolve(true),
						onError: (response) => reject(response),
					})
				})
			} else {
				return Promise.resolve(false)
			}
		},

		// Save molecule as a new MDL (.mol) file.
		// This removed all parameters from the molecule.
		saveMolAsMDL(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.saveMolAsMDL(destinationPath, this.mol as Smol, newFile), {
						onSuccess: () => resolve(true),
						onError: (response) => reject(response),
					})
				})
			} else {
				return Promise.resolve(false)
			}
		},

		// Save molecule as a new SMILES (.smi) file.
		// This removed all parameters from the molecule.
		saveMolAsSMILES(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			if (this._molType == 'smol') {
				return new Promise<boolean>((resolve, reject) => {
					apiFetch(moleculesApi.saveMolAsSMILES(destinationPath, this.mol as Smol, newFile), {
						onSuccess: () => resolve(true),
						onError: (response) => reject(response),
					})
				})
			} else {
				return Promise.resolve(false)
			}
		},

		clear() {
			Object.assign(this, getInitialState())
		},
	},
})
