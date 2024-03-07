/**
 * This store is responsible for
 */

// Vue
import { defineStore } from 'pinia'

// Type declarations
import type { Mol } from '@/stores/MolViewerStore'
export type Molset = Mol[]

// Type declarations
type ShowIdentifiers = {
	[key: string]: boolean
}
type State = {
	_molset: Molset | null
	_availIdentifiers: string[]
	_showIdentifiers: string[]
	_availProps: string[]
	_showProps: string[]
	_focus: number | null
	_sel: number[]
}

export const useMolGridStore = defineStore('molGridStore', {
	state: (): State => ({
		_molset: null,
		_availIdentifiers: [
			// Static
			'name',
			'inchi',
			'inchikey',
			'canonical_smiles',
			'isomeric_smiles',
			'formula',
			'pid',
		], // List of available identifiers
		_showIdentifiers: ['name', 'isomeric_smiles'], // List of identifiers to show
		_availProps: [], // List of available properties
		_showProps: [], // List of properties to show
		_focus: null, // Index of the focused molecule
		_sel: [], // Array with selected indices
	}),
	getters: {
		molset(): Molset | null {
			return this._molset
		},
		availIdentifiers(): string[] {
			return this._availIdentifiers
		},
		showIdentifiers(): string[] {
			return this._showIdentifiers
		},
		availProps(): string[] {
			return this._availProps
		},
		showProps(): string[] {
			return this._showProps
		},
		focus(): number | null {
			return this._focus
		},
		sel(): number[] {
			return this._sel
		},
	},
	actions: {
		setMolsetData(molset: Molset) {
			this._molset = molset

			// Store the available properties to show.
			if (molset[0]) {
				this._availProps = Object.keys(molset[0].properties)
			}
		},

		// Toggle which identifiers are displayed.
		toggleIdentifier(key: string) {
			console.log(22, key, this._showIdentifiers.includes(key), this._showIdentifiers)
			if (this._showIdentifiers.includes(key)) {
				this._showIdentifiers = this._showIdentifiers.filter((i) => i !== key)
			} else {
				this._showIdentifiers.push(key)
			}
		},

		// Toggle which properties are displayed.
		toggleProp(key: string) {
			if (this._showProps.includes(key)) {
				this._showProps = this._showProps.filter((i) => i !== key)
			} else {
				this._showProps.push(key)
			}
		},

		setFocus(index: number) {
			this._focus = index
		},
		unsetFocus() {
			this._focus = null
		},
		toggleSel(index: number) {
			if (this._sel.includes(index)) {
				this._sel = this._sel.filter((i) => i !== index)
			} else {
				this._sel.push(index)
			}
		},
		deselectAll() {
			this._sel = []
		},
		clear() {
			this._molset = null
			this._showProps = []
			this._showIdentifiers = []
			this._focus = null
			this._sel = []
		},
	},
})
