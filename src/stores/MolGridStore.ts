/**
 * This store is responsible for rendering the molecule grid.
 * It handles the state as well as the API calls.
 * - - -
 * For optimal viewing in Visual Studio Code:
 * cmd + k, cmd + j, cmd + k, cmd + 3
 */

// Vue
import { defineStore } from 'pinia'
import router from '@/router'
import { nextTick } from 'vue'

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Constants
const PAGE_SIZE = 100
const AVAIL_IDENTIFIERS = ['name', 'inchi', 'inchikey', 'canonical_smiles', 'isomeric_smiles', 'formula', 'pid']
const IDFR_DEFAULTS = ['name', 'isomeric_smiles', 'formula']
const PROP_DEFAULT = ['molecular_weight']

// Type declarations
import type { Molset, MolsetApi } from '@/types'
type SearchMode = 'text' | 'smarts'
type State = {
	// Status
	_disableUpdate: boolean
	_hasChanges: boolean

	// Data
	_cacheId: number | null
	_mols: Molset | null
	_total: number

	// Search
	_searchStr: string
	_searchMode: SearchMode

	// Pagination
	_page: number
	_pageSize: number

	// Sort & Filters
	_sort: string

	// Display
	_highlight: string
	_focus: number | null
	_sel: number[]
	_matching: number[]
	_availIdentifiers: string[]
	_showIdentifiers: string[]
	_availProps: string[]
	_showProps: string[]
}

function getInitialState(): State {
	return {
		// Status
		// When the user changes any of the filter/sort values, we launch
		// an API request to update the molecules (updateMols). But because
		// the UI elements are linked to the store values by means of
		// :modelValue/@update:modelValue, programmatically changing any
		// of these values will trigger the UI elements to update which in
		// turn will also trigger the API request. To avoid this, we set
		// _disableUpdate to true whenever we are updating the store.
		_disableUpdate: true,
		_hasChanges: false,

		// Data
		_cacheId: null,
		_mols: null,
		_total: 0,

		// Search
		_searchStr: '',
		_searchMode: 'text', // Search mode: 'text' or 'smarts'

		// Pagination
		_page: 1,
		_pageSize: PAGE_SIZE,

		// Sort & Filters
		_sort: '',

		// Display
		_highlight: '', // Substring that will be highlighted in the SVG
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
		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Status

		hasChanges(): boolean {
			return this._hasChanges
		},

		///////////////////////////////////////////////////////////////
		//
		// #region - Data

		// Molecules visible on this page
		mols(): Molset | null {
			return this._mols
		},

		// Total number of molecules.
		total(): number {
			return this._total
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Search

		searchStr(): string {
			return this._searchStr
		},

		// Search mode: 'text' or 'smarts'.
		searchMode(): SearchMode {
			return this._searchMode
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Pagination

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

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Sort & Filters

		sort(): string {
			return this._sort
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Display

		// Substring that will be highlighted in the SVG.
		highlight(): string {
			return this._highlight
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

		// #endregion
	},
	actions: {
		///////////////////////////////////////////////////////////////
		//
		// #region - Data

		// Update the molecule set with filtered data.
		// This is called by the page/filter/sort actions
		// every time any value changes.
		// - Update the URL
		// - Fetch new molecules from the API.
		async updateMols() {
			const query = this._setUrlQuery()

			const smartsMode = this._searchMode == 'smarts'
			apiFetch(moleculesApi.getMolset(fileStore.path, this._cacheId, query, smartsMode), {
				onSuccess: (data) => {
					this.setMolset(data)
				},
				onError: (err) => {
					console.log('Error in getMolset()', err)
				},
			})
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

		// Load molecule set into the state.
		async setMolset(molsData: MolsetApi) {
			// console.log('setMolset', molsData)
			this._disableUpdate = true

			this._cacheId = molsData.cacheId
			this._mols = molsData.mols
			this._searchStr = molsData.searchStr
			this._sort = molsData.sort ?? ''
			this._matching = molsData.matching
			this._total = molsData.total
			this._pageSize = molsData.pageSize
			this._page = molsData.page

			// Store the available properties to show.
			if (molsData.mols[0]) {
				this._availProps = Object.keys(molsData.mols[0].properties)
			}

			await nextTick()
			this._disableUpdate = false
		},

		// Remove molecules from our cached working copy.
		removeMols(indices: number[]) {
			apiFetch(moleculesApi.removeFromMolset(this._cacheId!, indices, router.currentRoute.value.query), {
				onSuccess: (data) => {
					this.setMolset(data)
					this.deselectAll()
					this._hasChanges = true
				},
				onError: (err) => {
					console.log('Error in removeFromMolset()', err)
				},
			})
		},

		// Keep selected molecules and remove the rest.
		async keepMols(indices: number[]) {
			const indicesToRemove = this._matching.filter((i) => !indices.includes(i))
			this.removeMols(indicesToRemove)
		},

		// Save changes to the molecule set.
		saveChanges() {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolsetChanges(fileStore.path, this._cacheId!), {
					onSuccess: () => {
						console.log(444, this._hasChanges)
						this._hasChanges = false
						resolve(true)
						// this.clearWorkingCopy()
					},
					onError: (err) => {
						console.log('Error in saveMolsetChanges()', err)
						reject(err)
					},
				})
			})
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Search

		// Set search string
		setSearchStr(searchStr: string) {
			// console.log('****setHighlight')
			this._searchStr = searchStr || ''
			if (this._searchMode == 'smarts') {
				this.setHighlight(searchStr)
			}
			if (!this._disableUpdate) {
				this.updateMols() // This calls _updateUrlQuery
			}
		},

		// Search mode
		setSearchMode(mode: SearchMode) {
			if (mode == 'text') {
				this.setHighlight('')
			} else if (mode == 'smarts') {
				this.setHighlight(this._searchStr)
			}
			this._searchMode = mode
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Pagination

		// Set page
		setPage(page: number) {
			this._page = page

			if (!this._disableUpdate) {
				this.updateMols()
			}
		},

		// Set page size (not used atm)
		setPageSize(pageSize: number) {
			this._pageSize = pageSize

			if (!this._disableUpdate) {
				this.updateMols()
				this.resetPagination()
			}
		},

		// Reset pagination every time filtering changes.
		resetPagination() {
			this._page = 1
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Sort & Filters

		setSort(sort: string) {
			if (sort) {
				this._sort = sort
			} else {
				this._sort = ''
			}

			if (!this._disableUpdate) {
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

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Display

		// Highlight substring in the SVG.
		setHighlight(str: string) {
			this._highlight = str
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

		// Open the molecule detail page.
		openMolecule(index: number) {
			molViewerStore.setMolFromMolsetIndex(index)
			// const path = `/~/${fileStore.path}?show=${index}`
			// router.push(path)
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Clearing

		// Clear
		async clear() {
			this._disableUpdate = true
			this.clearWorkingCopy()
			Object.assign(this, getInitialState())
			await nextTick()
			this._disableUpdate = false
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
