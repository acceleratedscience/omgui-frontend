/**
 * This store is responsible for storing the molecule
 * data which is displayed in the molecule viewer.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Stores
import { useFileStore } from '@/stores/FileStore'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Type declarations
import type { Mol, TempMol } from '@/types'
type State = {
	_mol: Mol | TempMol
	_sdf: string | null
	_svg: string | null
	_molFromMolsetIndex: number | null
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: (): State => ({
		_mol: { identifiers: {} },
		_sdf: null,
		_svg: null,
		// When viewing a molecule from a molset,
		// this is controls which molecule to show.
		_molFromMolsetIndex: null,
	}),
	getters: {
		mol(): Mol | TempMol {
			return this._mol
		},
		inchi(): string | null {
			return this._mol?.identifiers?.inchi || null
		},
		smiles(): string | null {
			return this._mol?.identifiers?.isomeric_smiles ?? this._mol?.identifiers?.canonical_smiles ?? this._mol?.identifiers?.smiles
		},
		enriched(): boolean {
			return (this._mol as Mol)?.enriched
		},
		// molLoaded(): boolean {
		// 	return !!this._mol.identifiers.name
		// },
		sdf(): string | null {
			return this._sdf
		},
		svg(): string | null {
			return this._svg
		},

		// Indicated whether we're viewing a molecule from a molset.
		molFromMolset(): boolean {
			return Boolean(this._molFromMolsetIndex)
			// const fileStore = useFileStore()
			// return Boolean(fileStore.defaultFileType == 'molset' && this._molFromMolsetIndex)
		},

		// When viewing a molecule from a molset, this is the index of the molecule.
		molFromMolsetIndex(): number | null {
			return this._molFromMolsetIndex
			// return Number(router.currentRoute.value.query?.show)
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
		setMolData(mol: Mol) {
			// console.log('setMolData')
			this._mol = mol
		},
		setMolIdentifier(identifier: 'inchi' | 'inchikey' | 'canonical_smiles', value: string) {
			this._mol.identifiers[identifier] = value
		},
		async fetchMolVizData(inchi_or_smiles: string) {
			// console.log('fetchMolVizData')
			apiFetch(moleculesApi.getMolVizData(inchi_or_smiles), {
				onSuccess: (data) => {
					if (data.svg) {
						// console.log('fetchMolVizData')
						this.setMolVizData(data.svg, data.sdf)
					}
				},
				onError: (err) => {
					console.log('Error in getMolVizData()', err)
				},
			})
		},
		setMolVizData(svg: string, sdf: string) {
			if (svg) this._svg = svg
			if (sdf) this._sdf = sdf
		},
		setMolFromMolsetIndex(index: number | null, dontPushRoute = false) {
			// console.log(99, 'setMolFromMolsetIndex:', index)
			this._molFromMolsetIndex = index

			if (!dontPushRoute) {
				// const fileStore = useFileStore()
				const query = index ? `?show=${index}` : ''
				// const path = `/~/${fileStore.path}${query}`
				const path = router.currentRoute.value.path + query
				router.push(path)
				// router.push({ query: { show: nr.toString() } })
			}
		},

		// parseUrlQuery() {
		// 	const query = router.currentRoute.value.query
		// 	if (query?.show) {
		// 		const index = Number(query.show)
		// 		if (index != this.molFromMolsetIndex) {
		// 			this.setMolFromMolsetIndex(index, true)
		// 		}
		// 	}
		// },
		clearMol() {
			this._mol = { identifiers: {} }
			this._sdf = null
			this._svg = null
			this._molFromMolsetIndex = null
		},
	},
})
