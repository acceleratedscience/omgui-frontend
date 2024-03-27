import BaseApi from './BaseApi'
import type { LocationQuery } from 'vue-router'

export default class MoleculesApi extends BaseApi {
	constructor() {
		super('MoleculesApi')
	}

	//
	//

	// Fetch an RDKit-enriched molecule by its identifier.
	getMolData(identifier: string) {
		return this.apiClient.post(`/get-mol-data`, { identifier })
	}

	// Fetch data required for rendering a molecule - 2D: SVG, 3D: SDF
	getMolVizData(inchi_or_smiles: string) {
		return this.apiClient.post(`/get-mol-viz-data`, { inchi_or_smiles })
	}

	// Fetch a non-enriched molecule from within a moleset file.
	async getMolDataFromMolset(cacheId: number, index: number = 0) {
		return this.apiClient.post('/get-mol-data-from-molset', { cacheId, index })
	}

	// Get one filtered/sorted page from a molset's working copy.
	queryMolset(cacheId: number | null, query: LocationQuery = {}) {
		// console.log(123, 'queryMolset', query)
		return this.apiClient.post('/query-molset', {
			cacheId,
			query,
		})
	}

	// Get my working list of molecules.
	getMyMols(query: LocationQuery = {}) {
		return this.apiClient.post('/get-my-mols', { query })
	}

	// Remove molecules from a molset's working copy.
	// Note: we include the query so we can preserve the filter/sort state.
	removeFromMolset(cacheId: number, indices: number[], query: LocationQuery = {}) {
		return this.apiClient.post('/remove-from-molset', { cacheId, indices, query })
	}

	// Clear a molset's working copy.
	clearMolsetWorkingCopy(cacheId: number) {
		return this.apiClient.post('/clear-molset-working-copy', { cacheId })
	}

	// Save molset changes.
	// This will override the original molset with the contents of the edited working copy.
	saveMolsetChanges(path: string, cacheId: number) {
		return this.apiClient.post('/save-molset-changes', { path, cacheId })
	}
}
