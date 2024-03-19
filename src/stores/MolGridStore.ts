/**
 * This store is responsible for
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'
import { nextTick } from 'vue'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Type declarations
import type { Molset, MolsetApi } from '@/types'
type SearchMode = 'text' | 'smarts'
type State = {
	// Status
	_disableUpdate: boolean

	// Data
	_cacheId: number | null
	_mols: Molset | null
	_total: number

	// Query
	_searchStr: string

	// Pagination
	_page: number
	_pageSize: number
	_sort: string

	// Display
	_focus: number | null
	_sel: number[]
	_matching: number[]
	_searchMode: SearchMode
	_availIdentifiers: string[]
	_showIdentifiers: string[]
	_availProps: string[]
	_showProps: string[]
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
		// When the user changes any of the filter/sort values, we launch
		// an API request to update the molecules (updateMols). But because
		// the UI elements are linked to the store values by means of
		// :modelValue/@update:modelValue, programmatically changing any
		// of these values will trigger the UI elements to update which in
		// turn will also trigger the API request. To avoid this, we set
		// _disableUpdate to true whenever we are updating the store.
		_disableUpdate: true,

		// Data
		_cacheId: null,
		_mols: null,
		_total: 0,

		// Query
		_searchStr: '',
		_searchMode: 'text', // Search mode: 'text' or 'smarts'

		// Pagination & Filters
		_page: 1,
		_pageSize: PAGE_SIZE,
		_sort: '',

		// Display
		_focus: null, // Index of the focused molecule
		_sel: [], // Array with selected indices
		_matching: [], // Array with indices of molecules matching the query
		_availIdentifiers: AVAIL_IDENTIFIERS, // List of available identifiers
		_showIdentifiers: IDFR_DEFAULTS, // List of identifiers to show
		_availProps: [], // List of available properties
		_showProps: PROP_DEFAULT, // List of properties to show
	}
}

export const useMolGridStore = defineStore('molGridStore', {
	state: () => getInitialState(),
	getters: {
		/**
		 * Data
		 */

		// Molecules visible on this page
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

		searchStr(): string {
			return this._searchStr
		},

		// Search mode: 'text' or 'smarts'.
		searchMode(): SearchMode {
			return this._searchMode
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

		// Array with matching indices
		matching(): number[] {
			return this._matching
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
	},
	actions: {
		/**
		 * Data
		 */

		// Update the molecule set with filtered data.
		// This is called by the setFilter actions
		// every time any filter value changes.
		// - Update the URL
		// - Fetch new molecules from the API.
		async updateMols() {
			const query = this._setUrlQuery()

			apiFetch(moleculesApi.getMolset(fileStore.path, this._cacheId, query), {
				onSuccess: (data) => {
					this.setMolset(data)
				},
				onError: (err) => {
					console.log('Error in getMolset()', err)
				},
			})
		},

		// Load molecule set.
		async setMolset(molsData: MolsetApi) {
			console.log('setMolset', molsData)
			console.log('(((')
			this._disableUpdate = true

			this._cacheId = molsData.cacheId
			this._mols = molsData.mols
			this._searchStr = molsData.searchStr
			this._sort = molsData.sort ?? ''
			this._matching = molsData.matching
			this._total = molsData.total
			this._pageSize = molsData.pageSize
			this._page = molsData.page
			// console.log(this._page, molsData.page, molsData.pageTotal)
			// this._page = Math.min(molsData.page, molsData.pageTotal)

			// Store the available properties to show.
			if (molsData.mols[0]) {
				this._availProps = Object.keys(molsData.mols[0].properties)
			}

			await nextTick()
			this._disableUpdate = false
			console.log(')))')
		},

		// Remove molecules from cached set.
		removeMols(indices: number[]) {
			apiFetch(
				moleculesApi.removeFromMolset(
					this._cacheId!,
					indices,
					router.currentRoute.value.query,
				),
				{
					onSuccess: (data) => {
						this.setMolset(data)
						this.deselectAll()
					},
					onError: (err) => {
						console.log('Error in removeFromMolset()', err)
					},
				},
			)
		},

		// Keep selected molecules and remove rest from the set.
		async keepMols(indices: number[]) {
			const indicesToRemove = this._matching.filter((i) => !indices.includes(i))
			console.log(345, indicesToRemove)
			this.removeMols(indicesToRemove)
		},

		/**
		 * Query
		 */

		// Set query
		setSearchQuery(query: string) {
			this._searchStr = query || ''
			if (!this._disableUpdate) {
				console.log('>>> 4', this._disableUpdate)
				this.updateMols() // This calls _updateUrlQuery
			}
		},

		// Search mode
		setSearchMode(mode: SearchMode) {
			this._searchMode = mode
		},

		// Update URL query.
		_setUrlQuery() {
			const query = { ...router.currentRoute.value.query }
			// Query
			if (this.searchStr) {
				query.search = this.searchStr
			} else {
				delete query.search
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

			// Turn query into string and update router
			let queryStr = Object.keys(query)
				.map((key) => `${key}=${query[key]}`)
				.join('&')
			queryStr = queryStr.length ? `?${queryStr}` : ''
			const newPath = '/~/' + router.currentRoute.value.params.path + queryStr
			router.push(newPath)

			// Return quuery object so we can send teh API request
			return query
		},

		/**
		 * Pagination & Filters
		 */

		// Set page
		setPage(page: number) {
			this._page = page

			if (!this._disableUpdate) {
				console.log('>>> 3')
				this.updateMols()
			}
		},

		// Set page size (not used atm)
		setPageSize(pageSize: number) {
			this._pageSize = pageSize

			if (!this._disableUpdate) {
				console.log('>>> 2')
				this.updateMols()
				this.resetPagination()
			}
		},

		// Reset pagination every time filtering changes.
		resetPagination() {
			this._page = 1
		},

		setSort(sort: string) {
			if (sort) {
				this._sort = sort
			} else {
				this._sort = ''
			}

			if (!this._disableUpdate) {
				console.log('>>> 1')
				this.updateMols()
			}
		},

		// Calculate the display index of a molecule
		// based on its absolute index in the set.
		// - - -
		// The absolute index is tied to position of the molecule
		// in the original set, while the display index is tied
		// to the position of the molecule as it is displayed,
		// after filtering and sorting.
		getDisplayIndex(index: number) {
			return this._matching.indexOf(index) + 1
		},

		/**
		 * Display
		 */

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
		deselectAll(ask: boolean = false) {
			if (ask && this._sel.length > 3) {
				if (confirm(`Deselect ${this._sel.length} molecules?`)) {
					this._sel = []
				}
			} else {
				this._sel = []
			}
		},

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
			if (key == 'name') return
			if (this._showProps.includes(key)) {
				this._showProps = this._showProps.filter((i) => i !== key)
			} else {
				this._showProps.push(key)
			}
		},
		enableProp(key: string) {
			if (key == 'name') return
			if (!this._showProps.includes(key)) {
				this._showProps.push(key)
			}
		},

		// Clear
		async clear() {
			this._disableUpdate = true
			console.log('C L E A R')
			this.clearWorkingCopy()
			Object.assign(this, getInitialState())
			await nextTick()
			this._disableUpdate = false
			console.log('D O N E')
		},

		// When you open a molset, we make a working copy
		// on your hard disk so you can edit it. We delete
		// this copy when you close the molset.
		clearWorkingCopy() {
			apiFetch(moleculesApi.clearFromCache(this._cacheId!), {
				onError: (err) => {
					console.log('Error in clearFromCache()', err)
				},
			})
		},
	},
})
