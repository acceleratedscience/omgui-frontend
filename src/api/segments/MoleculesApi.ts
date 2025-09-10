import BaseApi from '../BaseApi'

// Type declarations
import type { LocationQuery } from 'vue-router'
import type { Smol, TempSmol, Mmol } from '@/types'

// Molecule API
export default class MoleculesApi extends BaseApi {
	constructor() {
		super('MoleculesApi')
	}

	/**
	 * Small molecules
	 */

	///////////////////////////////////////////////////////////////
	// #region - Fetching

	// Fetch an RDKit-enriched molecule by its identifier.
	getSmolData(identifier: string) {
		return this.apiClient.post(`/get-smol-data`, { identifier })
	}

	// Fetch data required for rendering a molecule - 2D: SVG, 3D: SDF
	getSmolVizData(inchi_or_smiles: string) {
		return this.apiClient.post(`/get-smol-viz-data`, { inchi_or_smiles })
	}

	// Fetch a non-enriched molecule from within a moleset file.
	async getMolDataFromMolset(cacheId: number, index: number = 0) {
		return this.apiClient.post('/get-mol-data-from-molset', { cacheId, index }) // Smol, may support mmol later
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Manipulation

	// Save molecule to your mws
	addMolToMWS(mol: Smol | TempSmol) {
		return this.apiClient.post('/add-mol-to-mws', { mol }) // Smol, may support mmol later
	}

	// Remove molecule from your mws
	removeMolFromMWS(mol: Smol | TempSmol) {
		return this.apiClient.post('/remove-mol-from-mws', { mol }) // Smol, may support mmol later
	}

	// Check if a molecule is in your mws
	checkMolInMWS(mol: Smol | TempSmol) {
		return this.apiClient.post('/check-mol-in-mws', { mol }) // Smol, may support mmol later
	}

	// Check if a molecule is in your mws
	enrichSmol(smol: Smol | TempSmol) {
		return this.apiClient.post('/enrich-smol', { smol })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Saving

	// Save new .smol.json file to the workspace.
	saveSmolAsJSON(path: string, smol: Smol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-smol-as-json', { path, smol, newFile, force })
	}

	// Save new .sdf file to the workspace.
	saveSmolAsSDF(path: string, smol: Smol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-smol-as-sdf', { path, smol, newFile, force })
	}

	// Save new .mol file to the workspace.
	saveSmolAsCSV(path: string, smol: Smol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-smol-as-csv', { path, smol, newFile, force })
	}

	// Save new .mol file to the workspace.
	saveSmolAsMDL(path: string, smol: Smol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-smol-as-mdl', { path, smol, newFile, force })
	}

	// Save new .mol file to the workspace.
	saveSmolAsSMILES(path: string, smol: Smol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-smol-as-smiles', { path, smol, newFile, force })
	}

	// Update molset with the molecule data.
	replaceMolInMolset(path: string, mol: Smol, context: 'json' | 'mws', cacheId: number) {
		return this.apiClient.post('/replace-mol-in-molset', { path, mol, context, cacheId }) // Smol, may support mmol later
	}

	// #endregion

	/**
	 * Macromolecules
	 */

	///////////////////////////////////////////////////////////////
	// #region - Fetching

	// Fetch macromolecule by its identifier (FASTA or PDB ID).
	getMmolData(identifier: string) {
		return this.apiClient.post(`/get-mmol-data`, { identifier })
	}

	//#endregion
	///////////////////////////////////////////////////////////////
	// #region - Saving

	// Save new .smol.json file to the workspace.
	saveMmolAsMmolJson(path: string, mmol: Mmol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-mmol-as-mmol-json', { path, mmol, newFile, force })
	}

	// Save new .sdf file to the workspace.
	saveMmolAsPDB(path: string, mmol: Mmol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-mmol-as-pdb', { path, mmol, newFile, force })
	}

	// Save new .sdf file to the workspace.
	saveMmolAsCIF(path: string, mmol: Mmol, newFile: boolean = true, force = false) {
		return this.apiClient.post('/save-mmol-as-cif', { path, mmol, newFile, force })
	}

	// #endregion

	/**
	 * Molecule sets
	 */

	///////////////////////////////////////////////////////////////
	// #region - Fetching

	// Get one filtered/sorted page from a molset's working copy.
	getMolset(cacheId: number | null, query: LocationQuery = {}) {
		// console.log('getMolset', query)
		return this.apiClient.post('/get-molset', {
			cacheId,
			query,
		})
	}

	// Get my working list of molecules.
	getMolset_mws(query: LocationQuery = {}) {
		return this.apiClient.post('/get-molset-mws', { query })
	}

	// Get my working list of molecules.
	getMolset_adhoc(identifiers: string[], query: LocationQuery = {}) {
		return this.apiClient.post('/get-molset-adhoc', { identifiers, query })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Manipulation

	// Remove molecules from a molset's working copy.
	// Note: we include the query so we can preserve the filter/sort state.
	removeFromMolset(cacheId: number, indices: number[], query: LocationQuery = {}) {
		return this.apiClient.post('/remove-from-molset', { cacheId, indices, query })
	}

	// Clear a molset's working copy.
	clearMolsetWorkingCopy(cacheId: number) {
		return this.apiClient.post('/clear-molset-working-copy', { cacheId })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Updating

	// Update a molset.
	// This overrides the currently opened molset.json file with the changes from the working copy.
	updateMolset(path: string, cacheId: number) {
		return this.apiClient.post('/update-molset', { path, cacheId })
	}

	// Update mws
	// This overrides the working list molecules stored in the cmd_pointer with the ones from the working copy.
	updateMolset_mws(cacheId: number) {
		return this.apiClient.post('/update-molset-mws', { cacheId })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Saving

	// Save new .molset.json file.
	// This will copy the working copy to a new file in the workspace.
	saveMolsetAsJSON(path: string, cacheId: number, newFile: boolean, force = false) {
		return this.apiClient.post('/save-molset-as-json', { path, cacheId, newFile, force })
	}

	// Save molset as .sdf file.
	// This will turn the working copy data into an SDF file and store it in the workspace.
	saveMolsetAsSDF(path: string, cacheId: number, removeInvalidMols: boolean = false, newFile: boolean, force = false) {
		return this.apiClient.post('/save-molset-as-sdf', { path, cacheId, removeInvalidMols, newFile, force })
	}

	// Save molset as .csv file.
	// This will turn the working copy data into an CSV file and store it in the workspace.
	saveMolsetAsCSV(path: string, cacheId: number, newFile: boolean, force = false) {
		return this.apiClient.post('/save-molset-as-csv', { path, cacheId, newFile, force })
	}

	// Save molset as .smi file.
	// This will turn the working copy data into a SMI file and store it in the workspace.
	saveMolsetAsSmiles(path: string, cacheId: number, newFile: boolean, force = false) {
		return this.apiClient.post('/save-molset-as-smiles', { path, cacheId, newFile, force })
	}

	// #endregion
}
