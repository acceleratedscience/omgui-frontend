/**
 * This store is responsible for storing the protein
 * data which is displayed in the protein viewer.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Utils
import { slugify } from '@/utils/helpers'

// Type declarations
import type { Macromol } from '@/types'
type State = {
	_mmolType: string | null
	_mmol: Macromol
	_pdb: string | null
	_mmolFromMmolsetIndex: number | null
	_loading: boolean
	// _hasChanges: boolean
}
type SaveAsOptions = {
	newFile?: boolean
}

function getInitialState(): State {
	return {
		_mmolType: null,
		_mmol: null,
		_pdb: null, // pdb file content, used for 3D visualization

		// When viewing a macromolecule from a mmolset,
		// this is controls which molecule to show.
		_mmolFromMmolsetIndex: null,

		// Macromolecule loading status
		_loading: true,

		// Lets us block exit when there are unsaved changes.
		// _hasChanges: false,
	}
}

export const useMmolViewerStore = defineStore('mmolViewerStore', {
	state: () => getInitialState(),
	getters: {
		mmol(): Macromol {
			return this._mmol
		},

		id(): string {
			return this._mmol?.header?.idcode || 'Unknown Protein'
		},

		mmolType(): string | null {
			return this._mmolType
		},

		// hasChanges(): boolean {
		// 	return this._hasChanges
		// },

		pdb(): string | null {
			return this._pdb
		},

		// Indicated whether we're viewing a macromolecule from a mmolset.
		mmolFromMmolset(): boolean {
			return Boolean(this._mmolFromMmolsetIndex)
		},

		// When viewing a macromolecule from a mmolset, this is the index of the macromolecule.
		mmolFromMmolsetIndex(): number | null {
			return this._mmolFromMmolsetIndex
		},

		loading(): boolean {
			return this._loading
		},

		// // A combination string of "key: value" pairs used as tooltip.
		// propertiesString(): Record<string, string> {
		// 	if (!this._mol || !('properties' in this._mol)) return {}

		// 	const props: Record<string, string> = {}
		// 	for (const prop in this._mol.properties) {
		// 		let val: string | number = this._mol.properties[prop]
		// 		if (val || val === 0) val = val.toString()
		// 		if (val) {
		// 			props[prop] = `${prop}: ${val}`
		// 		}
		// 	}

		// 	return props
		// },
	},
	actions: {
		setMmolData(mmol: Macromol) {
			console.log('setMmolData', mmol)
			if (mmol?.mmol_type == 'protein') {
				this._mmolType = 'protein'
				this._mmol = { header: mmol.header }
				this._pdb = mmol.pdb || null
			}
			this._loading = false
		},
		setMmolFromMmolsetIndex(index: number | null, dontPushRoute = false) {
			// console.log('setMmolFromMmolsetIndex:', index, dontPushRoute)
			this._mmolFromMmolsetIndex = index

			if (!dontPushRoute) {
				const query = index ? `?show=${index}` : ''
				const path = router.currentRoute.value.path + query
				router.push(path)
			}
		},

		// setHasChanges(hasChanges: boolean) {
		// 	this._hasChanges = hasChanges
		// },

		/**
		 * Save-as functions
		 */

		// Save molecule as a new JSON (.mmol.json) file.
		saveMmolAsJSON(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				// apiFetch(moleculesApi.saveMolAsJSON(destinationPath, this.mol as Mol, newFile), {
				// 	onSuccess: () => resolve(true),
				// 	onError: () => reject(true),
				// })
			})
		},

		// Save molecule as a new PDB (.pdb) file.
		saveMmolAsPDB(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				// apiFetch(moleculesApi.saveMolAsSDF(destinationPath, this.mol as Mol, newFile), {
				// 	onSuccess: () => resolve(true),
				// 	onError: (response) => reject(response),
				// })
			})
		},

		clear() {
			Object.assign(this, getInitialState())
		},
	},
})
