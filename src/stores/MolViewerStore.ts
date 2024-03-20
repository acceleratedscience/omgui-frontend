/**
 * This store is responsible for storing the molecule
 * data which is displayed in the molecule viewer.
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Stores
import { useFileStore } from '@/stores/FileStore'

// Type declarations
import type { Mol, TempMol } from '@/types'
type State = {
	_mol: Mol | TempMol
	_sdf: string | null
	_svg: string | null
	_molFromMolsetIndex: number
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: (): State => ({
		_mol: { identifiers: {} },
		_sdf: null,
		_svg: null,
		// When viewing a molecule from a molset,
		// this is controls which molecule to show.
		_molFromMolsetIndex: 1,
	}),
	getters: {
		mol(): Mol | TempMol {
			return this._mol
		},
		inchi(): string | null {
			return this._mol.identifiers.inchi || null
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
			const fileStore = useFileStore()
			return Boolean(fileStore.defaultFileType == 'molset' && Number(router.currentRoute.value.query?.show))
		},

		// When viewing a molecule from a molset, this is the index of the molecule.
		molFromMolsetIndex(): number {
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
			this._mol = mol
		},
		setMolIdentifier(identifier: 'inchi' | 'inchikey' | 'canonical_smiles', value: string) {
			this._mol.identifiers[identifier] = value
		},
		setMolVizData(svg: string, sdf: string) {
			if (svg) this._svg = svg
			if (sdf) this._sdf = sdf
		},
		setMolFromMolsetIndex(nr: number) {
			this._molFromMolsetIndex = nr
			router.push({ query: { show: nr.toString() } })
		},
		clearMol() {
			this._mol = { identifiers: {} }
			this._sdf = null
			this._svg = null
		},
	},
})
