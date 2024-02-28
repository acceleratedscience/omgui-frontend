/**
 * This store is responsible for storing the molecule data which is displayed in the molecule viewer.
 */

import { defineStore } from 'pinia'

// Type declarations
export type Mol = {
	identifiers: {
		name: string
		inchi: string
		inchikey: string
		canonical_smiles: string
		cid: string
		formula: string
		isomeric_smiles: string
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
}
type State = {
	_mol: Mol | null
	_sdf: string | null
	_svg: string | null
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: (): State => ({
		_mol: null,
		_sdf: null,
		_svg: null,
	}),
	getters: {
		mol(): Mol | null {
			return this._mol
		},
		sdf(): string | null {
			return this._sdf
		},
		svg(): string | null {
			return this._svg
		},
		propertiesString(): Record<string, string> {
			if (!this._mol) return {}

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
		setMolVizData(svg: string, sdf: string) {
			this._svg = svg
			this._sdf = sdf
		},
		clearMol() {
			this._mol = null
			this._sdf = null
			this._svg = null
		},
	},
})
