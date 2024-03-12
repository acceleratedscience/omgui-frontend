/**
 * This store is responsible for
 */

// Vue
import { defineStore } from 'pinia'

// Type declarations
import type { Mol } from '@/stores/MolViewerStore'
export type Molset = Mol[]
type SearchMode = 'text' | 'smarts'
type State = {
	_molset: Molset | null
	_page: number
	_pageSize: number
	_availIdentifiers: string[]
	_showIdentifiers: string[]
	_availProps: string[]
	_showProps: string[]
	_focus: number | null
	_sel: number[]
	_searchMode: SearchMode
	_searchValue: string
}

// Constants
const PAGE_SIZE = 100
const AVAIL_IDENTIFIERS = [
	'name',
	'inchi',
	'inchikey',
	'canonical_smiles',
	'isomeric_smiles',
	'formula',
	'pid',
]
const IDFR_DEFAULTS = ['name', 'isomeric_smiles', 'formula']
const PROP_DEFAULT = ['molecular_weight']

export const useMolGridStore = defineStore('molGridStore', {
	state: (): State => ({
		_molset: null,
		_page: 1,
		_pageSize: PAGE_SIZE,
		_availIdentifiers: AVAIL_IDENTIFIERS, // List of available identifiers
		_showIdentifiers: IDFR_DEFAULTS, // List of identifiers to show
		_availProps: [], // List of available properties
		_showProps: PROP_DEFAULT, // List of properties to show
		_focus: null, // Index of the focused molecule
		_sel: [], // Array with selected indices
		_searchMode: 'text',
		_searchValue: '',
	}),
	getters: {
		// Entire molecule set.
		molset(): Molset | null {
			return this._molset
		},

		// One page of a molecule set.
		molsetPage(): Molset | null {
			const start = (this._page - 1) * this._pageSize
			const end = start + this._pageSize
			return this._molset ? this._molset.slice(start, end) : null
		},

		// Page number.
		page(): number {
			return this._page
		},

		pageTotal(): number {
			return this._molset ? Math.ceil(this._molset.length / this._pageSize) : 0
		},

		// List of all identifiers.
		availIdentifiers(): string[] {
			return this._availIdentifiers
		},

		// List of identifiers to show.
		showIdentifiers(): string[] {
			return this._showIdentifiers
		},

		// List of available properties.
		availProps(): string[] {
			return this._availProps
		},

		// List of properties to show.
		showProps(): string[] {
			return this._showProps
		},

		// Index of the molecule in focus.
		focus(): number | null {
			return this._focus
		},

		// Array with selected indices.
		sel(): number[] {
			return this._sel
		},

		// If any molecules are selected.
		hasSel(): boolean {
			return this._sel.length > 0
		},

		// Search mode: 'text' or 'smarts'.
		searchMode(): SearchMode {
			return this._searchMode
		},

		// Content of the search box.
		searchValue(): string {
			return this._searchValue
		},
	},
	actions: {
		// Load molecule set.
		setMolset(molset: Molset) {
			this._molset = molset

			// Store the available properties to show.
			if (molset[0]) {
				this._availProps = Object.keys(molset[0].properties)
			}
		},

		// Pagination
		setPage(page: number) {
			this._page = page
		},
		nextPage() {
			this._page++
		},
		prevPage() {
			this._page--
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

		// Focus
		setFocus(index: number) {
			this._focus = index
		},
		unsetFocus() {
			this._focus = null
		},

		// Selection
		setSel(sel: number[]) {
			this._sel = sel
		},
		addSel(sel: number[]) {
			// Add sel to _sell without duplicates
			this._sel = [...new Set([...this._sel, ...sel])]
		},
		removeSel(sel: number[]) {
			this._sel = this._sel.filter((i) => !sel.includes(i))
		},
		toggleSel(index: number) {
			if (this._sel.includes(index)) {
				this._sel = this._sel.filter((i) => i !== index)
			} else {
				this._sel.push(index)
			}
		},
		deselectAll() {
			if (this._sel.length > 3) {
				if (confirm(`Deselect ${this._sel.length} molecules?`)) {
					this._sel = []
				}
			} else {
				this._sel = []
			}
		},

		// Search mode
		setSearchMode(mode: SearchMode) {
			this._searchMode = mode
		},

		// Content of the search box.
		setSearchValue(value: string) {
			this._searchValue = value
		},

		// Clear
		clear() {
			this._molset = null
			this._showProps = []
			this._showIdentifiers = []
			this._focus = null
			this._sel = []
		},
	},
})
