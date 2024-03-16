/**
 * This store is responsible for
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Type declarations
import type { Molset, MolsetApi } from '@/types'
type SearchMode = 'text' | 'smarts'
type State = {
	// Data
	_mols: Molset | null
	_total: number

	// Query
	_query: string

	// Pagination
	_page: number
	_pageSize: number
	_sort: string

	// Display
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

function getInitialState(): State {
	return {
		// Data
		_mols: null,
		_total: 0,

		// Query
		_query: null,

		// Pagination & Filters
		_page: 1,
		_pageSize: PAGE_SIZE,
		_sort: '',

		// Display
		_availIdentifiers: AVAIL_IDENTIFIERS, // List of available identifiers
		_showIdentifiers: IDFR_DEFAULTS, // List of identifiers to show
		_availProps: [], // List of available properties
		_showProps: PROP_DEFAULT, // List of properties to show
		_focus: null, // Index of the focused molecule
		_sel: [], // Array with selected indices
		_searchMode: 'text', // Search mode: 'text' or 'smarts'
		_searchValue: '',
	}
}

export const useMolGridStore = defineStore('molGridStore', {
	state: () => getInitialState(),
	getters: {
		/**
		 * Data
		 */

		// Entire molecule set.
		mols(): Molset | null {
			return this._mols
		},

		// Total number of molecules.
		total(): number {
			return this._total
		},

		/**
		 * Query
		 */

		query(): string {
			return this._query
		},

		/**
		 * Pagination & Filters
		 */

		// Page number.
		page(): number {
			return this._page
		},

		pageTotal(): number {
			return Math.ceil(this._total / this._pageSize)
		},

		pageSize(): number {
			return this._pageSize
		},

		sort(): string {
			return this._sort
		},

		/**
		 * Display
		 */

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
		/**
		 * Data
		 */

		// Load molecule set.
		setMolset(molsData: MolsetApi) {
			this._mols = molsData.mols
			this._total = molsData.total
			this._page = molsData.page
			this._pageSize = molsData.pageSize

			// Store the available properties to show.
			if (molsData.mols[0]) {
				this._availProps = Object.keys(molsData.mols[0].properties)
			}
		},

		/**
		 * Query
		 */

		setQuery(query: string) {
			this._query = query || ''
			this.updateMols()
		},

		/**
		 * Pagination & Filters
		 */

		// Set page
		setPage(page: number) {
			this._page = page
			this.updateMols()
		},

		// Set page size
		setPageSize(pageSize: number) {
			this._pageSize = pageSize
			this.updateMols()
		},

		setSort(sort: string) {
			if (sort) {
				this._sort = sort
			} else {
				this._sort = ''
			}
			this.updateMols()
		},

		//
		//

		// Update the molecule set with filtered data.
		// This is called by the setFilter actions
		// every time any filter value changes.
		// - Update the URL
		// - Fetch new molecules from the API.
		updateMols() {
			this._updateUrlQuery()

			apiFetch(
				moleculesApi.getMolset(fileStore.path, {
					query: this.query,
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sort,
				}),
				{
					onSuccess: (data) => {
						// console.log(456, data)
						this.setMolset(data)
					},
					onError: (err) => {
						console.log(err)
					},
				},
			)
		},

		// Update URL query.
		_updateUrlQuery() {
			const query = { ...router.currentRoute.value.query }
			// Query
			if (this.query) {
				query.q = this.query
			} else {
				delete query.q
			}

			// Pagination
			if (this.page == 1) {
				delete query.page
			} else {
				query.page = String(this.page)
			}

			// Sort
			if (this.sort) {
				query.sort = this.sort
			} else {
				delete query.sort
			}

			let queryStr = Object.keys(query)
				.map((key) => `${key}=${query[key]}`)
				.join('&')
			queryStr = queryStr.length ? `?${queryStr}` : ''
			const newPath = '/~/' + router.currentRoute.value.params.path + queryStr
			// console.log(newPath)

			router.push(newPath)
		},

		/**
		 * Display
		 */

		// Toggle which identifiers are displayed.
		toggleIdentifier(key: string) {
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
			Object.assign(this, getInitialState())
		},
	},
})
