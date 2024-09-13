import BaseApi from './BaseApi'

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

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Manipulation

	// Save molecule to my-mols.
	addMolToMyMols(mol: Smol | TempSmol) {
		return this.apiClient.post('/add-mol-to-mymols', { mol })
	}

	// Remove molecule from my-mols
	removeMolFromMyMols(mol: Smol | TempSmol) {
		return this.apiClient.post('/remove-mol-from-mymols', { mol })
	}

	// Check if a molecule is in my-mols
	checkMolInMyMols(mol: Smol | TempSmol) {
		return this.apiClient.post('/check-mol-in-mymols', { mol })
	}

	// Check if a molecule is in my-mols
	enrichMol(mol: Smol | TempSmol) {
		return this.apiClient.post('/enrich-mol', { mol })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Saving

	// Save new .mol.json file to the workspace.
	saveMolAsJSON(path: string, mol: Smol, newFile: boolean = true) {
		return this.apiClient.post('/save-mol-as-json', { path, mol, newFile })
	}

	// Save new .sdf file to the workspace.
	saveMolAsSDF(path: string, mol: Smol, newFile: boolean = true) {
		return this.apiClient.post('/save-mol-as-sdf', { path, mol, newFile })
	}

	// Save new .mol file to the workspace.
	saveMolAsCSV(path: string, mol: Smol, newFile: boolean = true) {
		return this.apiClient.post('/save-mol-as-csv', { path, mol, newFile })
	}

	// Save new .mol file to the workspace.
	saveMolAsMDL(path: string, mol: Smol, newFile: boolean = true) {
		return this.apiClient.post('/save-mol-as-mdl', { path, mol, newFile })
	}

	// Save new .mol file to the workspace.
	saveMolAsSMILES(path: string, mol: Smol, newFile: boolean = true) {
		return this.apiClient.post('/save-mol-as-smiles', { path, mol, newFile })
	}

	// Update molset with the molecule data.
	replaceMolInMolset(path: string, mol: Smol, context: 'json' | 'my-mols', cacheId: number) {
		return this.apiClient.post('/replace-mol-in-molset', { path, mol, context, cacheId })
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

	// Save new .mol.json file to the workspace.
	saveMmolAsMmolJson(path: string, mol: Mmol, newFile: boolean = true) {
		return this.apiClient.post('/save-mmol-as-mmol-json', { path, mol, newFile })
	}

	// Save new .sdf file to the workspace.
	saveMmolAsPDB(path: string, mol: Mmol, newFile: boolean = true) {
		return this.apiClient.post('/save-mmol-as-pdb', { path, mol, newFile })
	}

	// Save new .sdf file to the workspace.
	saveMmolAsCIF(path: string, mol: Mmol, newFile: boolean = true) {
		console.log(mol)
		return this.apiClient.post('/save-mmol-as-cif', { path, mol, newFile })
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
	getMolset_mymols(query: LocationQuery = {}) {
		return this.apiClient.post('/get-molset-mymols', { query })
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

	// Update my-mols molset
	// This overrides the working list molecules stored in the cmd_pointer with the ones from the working copy.
	updateMolset_mymols(cacheId: number) {
		return this.apiClient.post('/update-molset-mymols', { cacheId })
	}

	// #endregion
	///////////////////////////////////////////////////////////////
	// #region - Saving

	// Save new .molset.json file.
	// This will copy the working copy to a new file in the workspace.
	saveMolsetAsJSON(path: string, cacheId: number, newFile: boolean) {
		return this.apiClient.post('/save-molset-as-json', { path, cacheId, newFile })
	}

	// Save molset as .sdf file.
	// This will turn the working copy data into an SDF file and store it in the workspace.
	saveMolsetAsSDF(path: string, cacheId: number, removeInvalidMols: boolean = false, newFile: boolean) {
		return this.apiClient.post('/save-molset-as-sdf', { path, cacheId, removeInvalidMols, newFile })
	}

	// Save molset as .csv file.
	// This will turn the working copy data into an CSV file and store it in the workspace.
	saveMolsetAsCSV(path: string, cacheId: number, newFile: boolean) {
		return this.apiClient.post('/save-molset-as-csv', { path, cacheId, newFile })
	}

	// Save molset as .smi file.
	// This will turn the working copy data into a SMI file and store it in the workspace.
	saveMolsetAsSmiles(path: string, cacheId: number, newFile: boolean) {
		return this.apiClient.post('/save-molset-as-smiles', { path, cacheId, newFile })
	}

	// #endregion
}
