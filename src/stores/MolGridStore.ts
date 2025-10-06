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
import { useModalStore } from '@/stores/ModalStore'
const fileStore = useFileStore()
const modalStore = useModalStore()

// API
import { apiFetch, moleculesApi, resultApi, dataframeApi } from '@/api'

// Utils
import { query2UrlQuery } from '@/utils/helpers'

// Constants
const PAGE_SIZE = 100
// RDKit-enriched molecules will come with 'canonical_smiles' and 'isomeric_smiles',
// but SDF files and other data sources often just have 'smiles'. They shouldn't be shown together.
const IDFR_DEFAULTS = ['name', 'isomeric_smiles', 'molecular_formula']
const PROP_DEFAULT = ['molecular_weight']

// Type declarations
import type { Smol, Molset, MolsetApi, SearchMode } from '@/types'
type Context = 'json' | 'sdf-file' | 'csv-file' | 'smi-file' | 'result-mols' | 'mws' | 'dataframe' | null
type SaveAsJSONOptions = {
	newFile?: boolean
	force?: boolean
}
type SaveAsSDFOptions = {
	removeInvalidMols?: boolean
	newFile?: boolean
	force?: boolean
}
type SaveAsCSVOptions = {
	newFile?: boolean
	force?: boolean
}
type SaveAsSmilesOptions = {
	newFile?: boolean
	force?: boolean
}
type State = {
	// Context
	_context: Context

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
	_allIndices: number[]
	_matchingIndices: number[]
	_availIdentifiers: string[]
	_showIdentifiers: string[]
	_availProps: string[]
	_showProps: string[]
}

function getInitialState(): State {
	return {
		// Context
		// The different situations in which the molgrid is loaded:
		//
		// - json:
		//   A .molset.json file with our own OMGUI molecule format.
		//   --> Saving changes will update the JSON file.
		//   URL: /~/path/to/results.molset.json
		//
		// - sdf-file:
		//   An .sdf file with molecule data.
		//   --> Saving changes will give you the option to update
		//   the SDF file or create a new .molset.json file.
		//   URL: /~/path/to/results.sdf
		//
		// - csv-file:
		//   A .csv file with molecule data (with SMILES or InChI column)
		//	 that was opened in the molset viewer.
		//	 --> Saving changes will give you the option to update
		//	 the CSV file or create a new .molset.json file.
		//	 URL: /csv-molset/path/to/results.csv -- TO DO
		//
		// - smi-file:
		//   A .smi file that was opened in the molset viewer.
		//	 --> Saving changes will give you the option to update
		//	 the SMILES file or create a new .molset.json file.
		//	 URL: /~/path/to/results.smi
		//
		// - cache:
		//   When looking at molecule data from the CLI memory.
		//	 --> Saving changes will update the dataframe stored in memory.
		//	 URL: /molset/123456789
		//
		// - mws:
		//   When looking at the molecules list.
		//   --> Saving changes will update the molecules stored in the cmd_pointer memory.
		//   URL: /mws
		_context: null,

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
		_resultCount: 0,

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
		_focus: null, // Index of the molecule in focus
		_sel: [], // Array with selected indices
		_allIndices: [], // Array with all indices
		_matchingIndices: [], // Array with indices of molecules matching the query
		_availIdentifiers: [], // List of available identifiers
		_showIdentifiers: IDFR_DEFAULTS, // List of identifiers to show
		_availProps: [], // List of available properties
		_showProps: PROP_DEFAULT, // List of properties to show
	}
}

export const useMolGridStore = defineStore('molGridStore', {
	state: () => getInitialState(),
	getters: {
		// ------------------------------------
		// #region - Context

		context(): Context {
			return this._context
		},

		// #endregion
		// ------------------------------------
		// #region - Status

		active(): boolean {
			return Boolean(this._cacheId)
		},

		hasChanges(): boolean {
			return this._hasChanges
		},

		// #endregion
		// ------------------------------------
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
			return this._mols!.map((mol) => mol.identifiers.isomeric_smiles || mol.identifiers.canonical_smiles || mol.identifiers.smiles)
		},

		resultCount(): number {
			return this._resultCount
		},

		// Total number of molecules.
		total(): number {
			return this._total
		},

		// #endregion
		// ------------------------------------
		// #region - Search

		searchStr(): string {
			return this._searchStr
		},

		// Search mode: 'text' or 'smarts'.
		searchMode(): SearchMode {
			return this._searchMode
		},

		// #endregion
		// ------------------------------------
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
		// ------------------------------------
		// #region - Sort & Filters

		sort(): string {
			return this._sort
		},

		// #endregion
		// ------------------------------------
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

		// Array with all indices.
		allIndices(): number[] {
			return this._allIndices
		},

		// Array with matching indices
		matchingIndices(): number[] {
			return this._matchingIndices
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
			return this._showProps.filter((i) => this.availProps.includes(i))
		},

		// #endregion
	},
	actions: {
		// ------------------------------------
		// #region - Context

		setContext(context: Context) {
			this._context = context
		},

		// #endregion
		// ------------------------------------
		// #region - Status

		setHasChanges(hasChanges: boolean) {
			console.log('>> ', hasChanges)
			this._hasChanges = hasChanges
		},

		// #endregion
		// ------------------------------------
		// #region - Data

		// Update the molecule set with filtered data.
		// This is called by the page/filter/sort actions
		// every time any value changes.
		// - Update the URL
		// - Fetch new molecules from the API.
		async updateMols(fromUrlQuery: boolean = false) {
			const query = fromUrlQuery ? { ...router.currentRoute.value.query } : this._setUrlQuery()

			apiFetch(moleculesApi.getMolset(this._cacheId, query), {
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
			let changed: boolean = false

			// Search string
			if (query.search && this._searchStr != String(query.search)) {
				this._searchStr = (query.search as string) || ''
				changed = true
			}

			// Search mode
			if (this._searchMode != (query.smarts ? 'smarts' : 'text')) {
				this._searchMode = query.smarts ? 'smarts' : 'text'
				changed = true
			}

			// Page
			if (query.page && this._page != Number(query.page)) {
				this._page = Number(query.page)
				changed = true
			}

			// Sort
			if (this._sort != ((query.sort as string) || '')) {
				this._sort = (query.sort as string) || ''
				changed = true
			}

			await nextTick()
			this._disableUpdate = false

			if (changed) this.updateMols(true)
		},

		// Load molecule set into the state.
		async setMolset(molsData: MolsetApi) {
			// console.log('setMolset ((', molsData)
			this._disableUpdate = true

			this._cacheId = molsData.cacheId
			this._mols = molsData.mols
			this._total = molsData.total
			this._resultCount = molsData.resultCount

			this._searchStr = molsData.searchStr
			this._searchMode = molsData.searchMode
			this._sort = molsData.sort ?? ''
			this._allIndices = molsData.allIndices
			this._matchingIndices = molsData.matchingIndices
			this._pageSize = molsData.pageSize
			this._page = molsData.page

			// If no isomeric_smiles are available, we'll display
			// the canonical_smiles or smiles.
			// - - -
			// This is relevant when opening SDF or CSV datasets,
			// where we just display what's available as opposed
			// to calculate our preferred properties and identifiers,
			// as is the case when opening a .smi file.
			const firstMol = molsData.mols[0]
			if (!firstMol.properties.isomeric_smiles) {
				if (firstMol.properties.canonical_smiles) {
					this.setIdentifier('canonical_smiles', true)
					this.setIdentifier('isomeric_smiles', false)
				} else if (firstMol.properties.smiles) {
					this.setIdentifier('smiles', true)
					this.setIdentifier('isomeric_smiles', false)
				}
			}

			// Set highlight substructure.
			if (molsData.searchMode == 'smarts') {
				this._highlight = molsData.searchStr
			}

			// Loop through all molecules and collect all available identifiers and properties.
			molsData.mols.forEach((mol) => {
				Object.keys(mol.properties).forEach((prop) => {
					if (!this._availProps.includes(prop) && mol.properties[prop] != null) {
						this._availProps.push(prop)
					}
				})
				Object.keys(mol.identifiers).forEach((idfr) => {
					if (!this._availIdentifiers.includes(idfr) && mol.identifiers[idfr] != null) {
						this._availIdentifiers.push(idfr)
					}
				})
			})

			await nextTick()
			this._disableUpdate = false
			// console.log(')) setMolset')
		},

		// Remove molecules from our cached working copy.
		removeMols(indices: number[]) {
			apiFetch(moleculesApi.removeFromMolset(this._cacheId!, indices, router.currentRoute.value.query), {
				onSuccess: (data) => {
					this.setMolset(data)
					this.deselectAll()
					this.setHasChanges(true)
				},
				onError: (err) => {
					console.log('Error in removeFromMolset()', err)
				},
			})
		},

		// Keep selected molecules and remove the rest.
		async keepMols(indices: number[]) {
			const indicesToRemove = this._matchingIndices.filter((i) => !indices.includes(i))
			this.removeMols(indicesToRemove)
		},

		// Replace a molecule in a .molset.json file or in your mws.
		// This is used when saving changes to a molecule inside a molset.
		replaceMolInMolset(destinationPath: string, mol: Smol, context: 'json' | 'mws'): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.replaceMolInMolset(destinationPath, mol, context, this._cacheId!), {
					onSuccess: () => {
						this.setHasChanges(true)
						resolve(true)
					},
					onError: (response) => reject(response),
				})
			})
		},

		// Store changes to an existing JSON (.molset.json) file.
		updateMolset(): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.updateMolset(fileStore.path, this._cacheId!), {
					onSuccess: () => {
						this.setHasChanges(false)
						resolve(true)
					},
					onError: (err) => {
						console.log('Error in updateMolset()', err)
						reject(true)
					},
				})
			})
		},

		// When trying to save a molset to a format that requires processing by RDKit
		// and some of the molecules can't be parsed, the API will return a 422 error
		// with a list of invalid molecules. This list is then used to display a modal,
		// allowing the user to try again while discarding the invalid molecules.
		_maybeShowInvalidMolsModal(
			err: { data: { invalidMols?: Smol[] } },
			{ callback, destinationPath, options }: { callback: Function; destinationPath: string; options: SaveAsSDFOptions },
		) {
			// Ignore string error messages.
			if (!err || typeof err !== 'object') return

			const { data } = err as { data: any }
			if (data.invalidMols) {
				console.log(`The following ${data.invalidMols.length} molecules are invalid:`) // Leave this
				const list = data.invalidMols
					.map((mol: Smol) => {
						if (mol) {
							const name = mol['identifiers']['name'] ? mol['identifiers']['name'] + '<br>' : ''
							const smiles =
								mol['identifiers']['isomeric_smiles'] || mol['identifiers']['canonical_smiles'] || mol['identifiers']['smiles']
							console.log(mol.index, smiles) // Leave this
							return `<li><b>${mol.index}</b>: ${name}${smiles}</li>`
						} else {
							return null
						}
					})
					.join('\n')
				return new Promise<boolean>((resolve) => {
					modalStore.alert(
						`The following molecule${data.invalidMols.length > 1 ? 's' : ''} could not be processed by RDKit and will be removed:</p><ul>${list}</ul>`,
						{
							title: 'Invalid molecules detected',
							html: true,
							size: 'md',
							primaryBtn: 'Continue',
							secondaryBtn: true,
							onSubmit: () => {
								const options2: SaveAsSDFOptions = { ...options }
								options2.removeInvalidMols = true
								callback(destinationPath, options2)
								resolve(true)
							},
						},
					)
				})
			}
		},

		// Update the molecule working list.
		updateMolset_mws(): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.updateMws(this._cacheId!), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Update the results stored in memory.
		updateMolset_result(): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(resultApi.updateResult_molset(this._cacheId!), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Update the dataframe stored in a Jupyter variable.
		updateMolset_dataframe(dfName: string): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(dataframeApi.updateDataframe_molset(dfName, this._cacheId!), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		/**
		 * Save-as functions - small molecules
		 */

		// Export molset as a JSON (.molset.json) file.
		saveMolsetAsJSON(destinationPath: string, { newFile = false, force = false }: SaveAsJSONOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolsetAsJSON(destinationPath, this._cacheId!, newFile, force), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Export molset as SDF (.sdf) file.
		async saveMolsetAsSDF(destinationPath: string, options: SaveAsSDFOptions): Promise<boolean> {
			try {
				return await this._saveMolsetAsSDF(destinationPath, options)
			} catch (err: any) {
				this._maybeShowInvalidMolsModal(err, {
					callback: this.saveMolsetAsSDF,
					destinationPath,
					options,
				})
				return Promise.resolve(false)
			}
		},
		_saveMolsetAsSDF(
			destinationPath: string,
			{ removeInvalidMols = false, newFile = false, force = false }: SaveAsSDFOptions = {},
		): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolsetAsSDF(destinationPath, this._cacheId!, removeInvalidMols, newFile, force), {
					onSuccess: () => resolve(true),
					onError: (response) => reject(response),
				})
			})
		},

		// Export molset as CSV (.csv) file.
		async saveMolsetAsCSV(destinationPath: string, options: SaveAsCSVOptions = {}): Promise<boolean> {
			try {
				return await this._saveMolsetAsCSV(destinationPath, options)
			} catch (err: any) {
				this._maybeShowInvalidMolsModal(err, {
					callback: this.saveMolsetAsCSV,
					destinationPath,
					options,
				})
				return Promise.resolve(false)
			}
		},
		_saveMolsetAsCSV(destinationPath: string, { newFile = false, force = false }: SaveAsCSVOptions = {}): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolsetAsCSV(destinationPath, this._cacheId!, newFile, force), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// Save molset as SMILES (.smi) file.
		async saveMolsetAsSmiles(destinationPath: string, options: SaveAsSmilesOptions = {}): Promise<boolean> {
			try {
				return await this._saveMolsetAsSmiles(destinationPath, options)
			} catch (err: any) {
				this._maybeShowInvalidMolsModal(err, {
					callback: this.saveMolsetAsSmiles,
					destinationPath,
					options,
				})
				return Promise.resolve(false)
			}
		},
		_saveMolsetAsSmiles(destinationPath: string, { newFile = false, force = false }: SaveAsSmilesOptions): Promise<boolean> {
			return new Promise<boolean>((resolve, reject) => {
				apiFetch(moleculesApi.saveMolsetAsSmiles(destinationPath, this._cacheId!, newFile, force), {
					onSuccess: () => resolve(true),
					onError: () => reject(true),
				})
			})
		},

		// #endregion
		// ------------------------------------
		// #region - Search

		// Set search string
		setSearchStr(searchStr: string) {
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
		// ------------------------------------
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
		// ------------------------------------
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
			return this._matchingIndices.indexOf(index) + 1
		},

		// #endregion
		// ------------------------------------
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

		// Set an identifier to (not) be displayed.
		setIdentifier(key: string, state: boolean) {
			if (state === false) {
				this._showIdentifiers = this._showIdentifiers.filter((i) => i !== key)
			} else if (state === true) {
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

		// #endregion
		// ------------------------------------
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
