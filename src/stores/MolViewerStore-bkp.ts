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
import type { Smol, TempSmol } from '@/types'
type State = {
	_mol: Smol | TempSmol
	_mdl: string | null
	_svg: string | null
	_molFromMolsetIndex: number | null
	_loading: boolean
	_hasChanges: boolean
}
type SaveAsOptions = {
	newFile?: boolean
}

function getInitialState(): State {
	return {
		_mol: { identifiers: {} },
		_mdl: null, // 3D data, what's contained in .mol and .sdf files
		_svg: null, // 2D data

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
		mol(): Smol | TempSmol {
			return this._mol
		},
		isEmpty(): boolean {
			return !Object.keys(this._mol.identifiers).length
		},
		// Differentiate between small molecules (smiles, inchi) and macromolecules (fasta)
		isMacromol(): boolean {
			return Boolean(!this._mol.identifiers.inchi && !this._mol.identifiers.smiles)
		},
		name(): string {
			return this._mol.identifiers?.name || 'Unnamed Molecule'
		},
		nameSlug(): string {
			return slugify(this.name)
		},
		inchi(): string | null {
			return this._mol?.identifiers?.inchi || null
		},
		smiles(): string | null {
			return this._mol?.identifiers?.isomeric_smiles ?? this._mol?.identifiers?.canonical_smiles ?? this._mol?.identifiers?.smiles
		},

		// Cycle through the available identifiers to find the first one.
		identifier(): string | null {
			return (
				this.inchi || this.smiles || this._mol?.identifiers?.inchikey || this._mol?.identifiers?.name || this._mol?.identifiers?.cid || null
			)
		},
		enriched(): boolean {
			return (this._mol as Smol)?.enriched
		},

		hasChanges(): boolean {
			return this._hasChanges
		},

		mdl(): string | null {
			return this._mdl
		},
		svg(): string | null {
			return this._svg
		},

		// Indicated whether we're viewing a molecule from a molset.
		molFromMolset(): boolean {
			// console.log('molFromMolset', Boolean(this._molFromMolsetIndex))
			return Boolean(this._molFromMolsetIndex)
		},

		// When viewing a molecule from a molset, this is the index of the molecule.
		molFromMolsetIndex(): number | null {
			return this._molFromMolsetIndex
		},

		loading(): boolean {
			return this._loading
		},

		// A combination string of "key: value" pairs used as tooltip.
		propertiesString(): Record<string, string> {
			if (!this._mol || !('properties' in this._mol)) return {}

			const props: Record<string, string> = {}
			for (const prop in this._mol.properties) {
				let val: string | number = this._mol.properties[prop]
				if (val || val === 0) val = val.toString()
				if (val) {
					props[prop] = `${prop}: ${val}`
				}
			}

			return props
		},
	},
	actions: {
		setMolData(mol: Smol) {
			console.log('setMolData', mol)
			this._mol = mol
			this._loading = false
		},
		setMolIdentifier(identifier: 'inchi' | 'inchikey' | 'canonical_smiles', value: string) {
			this._mol.identifiers[identifier] = value
		},
		async fetchMolVizData(inchi_or_smiles: string) {
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
			if (svg) this._svg = svg
			if (mdl) this._mdl = mdl
		},
		setMolFromMolsetIndex(index: number | null, dontPushRoute = false) {
			// console.log('setMolFromMolsetIndex:', index, dontPushRoute)
			this._molFromMolsetIndex = index

			if (!dontPushRoute) {
				const query = index ? `?show=${index}` : ''
				const path = router.currentRoute.value.path + query
				router.push(path)
			}

			// TRASH - no longer needed
			// Timeout needed for route.query watcher in MolsetViewer to trigger.
			// setTimeout(() => {
			// 	this._molFromMolsetIndex = index
			// }, 1)
		},

		async enrichMol() {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.enrichMol(this.mol), {
					onSuccess: (data) => {
						this._mol = data
						this.setHasChanges(true)
						this.setEnriched(true)
						resolve(true)
					},
					onError: (response) => reject(response),
				})
			})
		},

		setEnriched(enriched: boolean) {
			;(this._mol as Smol).enriched = enriched
		},

		setHasChanges(hasChanges: boolean) {
			this._hasChanges = hasChanges
		},

		/**
		 * Save-as functions
		 */

		// Save molecule as a new JSON (.mol.json) file.
		saveMolAsJSON(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsJSON(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Save molecule as a new SDF (.sdf) file.
		saveMolAsSDF(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsSDF(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as a new CSV (.csv) file.
		saveMolAsCSV(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsCSV(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as a new MDL (.mol) file.
		// This removed all parameters from the molecule.
		saveMolAsMDL(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsMDL(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Save molecule as a new SMILES (.smi) file.
		// This removed all parameters from the molecule.
		saveMolAsSMILES(destinationPath: string, { newFile = false }: SaveAsOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolAsSMILES(destinationPath, this.mol as Smol, newFile), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// TRASH - no longer needed
		// parseUrlQuery() {
		// 	const query = router.currentRoute.value.query
		// 	if (query?.show) {
		// 		const index = Number(query.show)
		// 		if (index != this.molFromMolsetIndex) {
		// 			this.setMolFromMolsetIndex(index, true)
		// 		}
		// 	}
		// },
		clear() {
			// console.log('C L EA R')
			Object.assign(this, getInitialState())
		},
	},
})
