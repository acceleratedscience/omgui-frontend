/**
 * This store is responsible for rendering the molecule grid.
 * It handles the state as well as the API calls.
 * - - -
 * For optimal viewing in Visual Studio Code:
 * cmd + k, cmd + j, cmd + k, cmd + 3
 */

/**

Routing architecture
- - - - - - - - - - -
This is a little hard to untangle, so for the record.
Please note the role of _disableUpdate to prevent double API calls.

Scenario A:
1.	User loads page (with URL query)
2.	File data is loaded into the fileStore via ViewerDispatch.vue -> fileStore.loadItem()
3.	Data is loaded from the fileStore into the molGridStore via MolSetViewer.vue -> molGridStore.setMolset()
4.	The values from the URL query were parsed in the backend and are part of the API response,
	so the state is updated with the query values, also via setMolset()
Scenario B:
1.	User changes search/page/sort via UI
2.	v-model pushes changes to store via setter functions, eg. setSort()
3.	Setter function calls updateMols(), which:
	A:	Updates the URL query
		--> The route.query watcher in MolSetViewer.vue calls parseUrlQuery()
		--> parseUrlQuery() compares URL query with store values, doesn't find any changes and does nothing
	B:	Calls API to fetch updated list of molecules
		--> On success, the store is updated with new molecules via setMolset()
		--> Also via setMolset(), the state is updated with the query values returned from the API
			but this doesn't do anything because the values are the same as the store values
Scenario C:
1.	User goes back or forward in browser history
2.	The route.query watcher in MolSetViewer.vue calls parseUrlQuery()
3.	parseUrlQuery() compares URL query with store values, detects the changes,
	updates the store with the new values, and then calls updateMols(fromUrlQuery=true)
4.	Because of (fromUrlQuery=true), updateMols() doesn't update to the URL query,
	instead fetches new molecules from the API using the values of the current urlQuery.
5.	On success, the store is updated with new molecules via setMolset()
6.	Also via setMolset(), the state is updated with the query values returned from the API

**/

// Vue
import { defineStore } from 'pinia'
import router from '@/router'
import { nextTick } from 'vue'
import type { LocationQuery } from 'vue-router'

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Utils
import { query2UrlQuery } from '@/utils/helpers'

// Constants
const PAGE_SIZE = 100
const AVAIL_IDENTIFIERS = ['name', 'inchi', 'inchikey', 'canonical_smiles', 'isomeric_smiles', 'formula', 'pid']
const IDFR_DEFAULTS = ['name', 'canonical_smiles', 'formula']
const PROP_DEFAULT = ['molecular_weight']

// Type declarations
import type { Molset, MolsetApi, SearchMode } from '@/types'
type State = {
	// Status
	_disableUpdate: boolean
	_hasChanges: boolean

	// Data
	_cacheId: number | null
	_mols: Molset | null
	_total: number
	_resultCount: number

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
		// - - -
		// Because the filter/sort UI elements are linked to the store's query values
		// by means of v-model, programmatically changing any of these values when
		// processing an API request triggers the UI elements values to update which in
		// turn would trigger a second API request. To avoid this, _disableUpdate prevents
		// the setter functions linked to the v-model from calling the API.
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
		///////////////////////////////////////////////////////////////
		//
		// #region - Status

		hasChanges(): boolean {
			return this._hasChanges
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Data

		cacheId(): number | null {
			return this._cacheId
		},

		// Molecules visible on this page
		mols(): Molset | null {
			return this._mols
		},

		// Whatever smiles is available for rendering out 2D graphic.
		molSmiles(): string[] {
			return this._mols!.map((mol) => mol.identifiers.isomeric_smiles ?? mol.identifiers.canonical_smiles ?? mol.identifiers.smiles)
		},

		resultCount(): number {
			return this._resultCount
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
			return Math.ceil(this._resultCount / this._pageSize)
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
		async updateMols(fromUrlQuery: boolean = false) {
			const query = fromUrlQuery ? { ...router.currentRoute.value.query } : this._setUrlQuery()

			apiFetch(moleculesApi.queryMolset(this._cacheId, query), {
				onSuccess: (data) => {
					// console.log(123, data)
					this.setMolset(data)
				},
				onError: (err) => {
					console.log('Error in getMolset()', err)
				},
			})
		},

		// Update URL query.
		_setUrlQuery() {
			// console.log('_setUrlQuery')
			const query = { ...router.currentRoute.value.query }
			// Search string
			if (this.searchStr) {
				query.search = this.searchStr
			} else {
				delete query.search
			}

			// Search mode
			if (this.searchMode == 'smarts') {
				query.smarts = '1'
			} else {
				delete query.smarts
			}

			// Page
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
			const urlQuery = query2UrlQuery(query)
			const newPath = router.currentRoute.value.path + urlQuery
			router.push(newPath)

			// Return quuery object so we can send teh API request
			return query
		},

		// Compare the values in the URL query with the store values,
		// and if changes are detected, update the store and update
		// the molecules.
		// This is called every time the route query changes, but
		// will only do anything when the user is going back or forward
		// in the browser history.
		async parseUrlQuery() {
			const query: LocationQuery = router.currentRoute.value.query
			this._disableUpdate = true
			// console.log(11, this._searchStr, query.search)
			// await nextTick()
			// console.log(12, this._searchStr, query.search)
			let hasChanges: boolean = false

			// Search string
			if (query.search && this._searchStr != String(query.search)) {
				// console.log('A')
				this._searchStr = (query.search as string) || ''
				hasChanges = true
			}

			// Search mode
			if (this._searchMode != (query.smarts ? 'smarts' : 'text')) {
				// console.log('B')
				this._searchMode = query.smarts ? 'smarts' : 'text'
				hasChanges = true
			}

			// Page
			if (query.page && this._page != Number(query.page)) {
				// console.log('C')
				this._page = Number(query.page)
				hasChanges = true
			}

			// Sort
			if (this._sort != ((query.sort as string) || '')) {
				// console.log('D')
				this._sort = (query.sort as string) || ''
				hasChanges = true
			}

			await nextTick()
			this._disableUpdate = false

			// console.log('parseUrlQuery', hasChanges ? '--> UPDATE MOLS' : '')
			if (hasChanges) this.updateMols(true)
		},

		// Load molecule set into the state.
		async setMolset(molsData: MolsetApi) {
			console.log('setMolset ((')
			this._disableUpdate = true

			this._cacheId = molsData.cacheId
			this._mols = molsData.mols
			this._total = molsData.total
			this._resultCount = molsData.resultCount

			this._searchStr = molsData.searchStr
			this._searchMode = molsData.searchMode
			this._sort = molsData.sort ?? ''
			this._matching = molsData.matching
			this._pageSize = molsData.pageSize
			this._page = molsData.page

			// Set highlight substructure.
			if (molsData.searchMode == 'smarts') {
				this._highlight = molsData.searchStr
			}

			// Store the available properties to show.
			if (molsData.mols[0]) {
				this._availProps = Object.keys(molsData.mols[0].properties)
			}

			await nextTick()
			this._disableUpdate = false
			console.log(')) setMolset')
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
			console.log('** setSearchStr')
			this._searchStr = searchStr || ''
			if (this.searchMode == 'smarts') {
				this.setHighlight(searchStr)
			}
			if (!this._disableUpdate) {
				this.updateMols() // This calls _setUrlQuery
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
			console.log('setSearMode %%', mode)

			if (!this._disableUpdate) {
				this.updateMols()
			}
		},

		// #endregion
		///////////////////////////////////////////////////////////////
		//
		// #region - Pagination

		// Set page
		setPage(page: number) {
			console.log('setPage')
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
			console.log('setSort', sort)
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
			// console.log('** enableProp', key)
			key = key.replace(/^-/, '')
			if (key == 'name') return // name is not in props, we don't want it to be added double.
			if (this._showProps.includes(key)) {
				this._showProps = this._showProps.filter((i) => i !== key)
			} else {
				this._showProps.push(key)
			}
		},
		enableProp(key: string) {
			// console.log('>> enableProp', key)
			key = key.replace(/^-/, '')
			if (key == 'name') return // name is not in props, we don't want it to be added double.
			if (!this._showProps.includes(key)) {
				this._showProps.push(key)
			}
		},

		// Open the molecule detail page.
		// This gets triggered when clicking the open button.
		openMolecule(index: number) {
			molViewerStore.setMolFromMolsetIndex(index)
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
			apiFetch(moleculesApi.clearMolsetWorkingCopy(this._cacheId!), {
				onError: (err) => {
					console.log('Error in clearMolsetWorkingCopy()', err)
				},
			})
		},

		// #endregion
	},
})
