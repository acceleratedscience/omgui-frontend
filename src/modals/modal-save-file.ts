/**
 * This file contains different presets for the save-as
 * modal that can be reused across the application.
 *
 * Usage:
 * import { useModalSaveFile } from '@/modals'
 * const modalSaveFile = useModalSaveFile()
 *
 * modalSaveFile('molset-json')
 */

// Router
import { useRouter } from 'vue-router'

// Stores
import { useModalStore } from '@/stores/ModalStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'

// Utils
import { path2FileBrowserPath } from '@/utils/helpers'

// Type declarations
import type { MolFileDataType } from '@/types'

//
//

// Display the save-file modal with the appropriate options.
// This lets the user browse their workspace to select a destination
// and optionally select a file type.
export function useModalSaveFile() {
	const router = useRouter()
	const modalStore = useModalStore()
	const fileStore = useFileStore()
	const molGridStore = useMolGridStore()
	const molViewerStore = useMolViewerStore()

	return function modalSaveFile(modalType: string, params: any = {}): Promise<boolean> {
		if (modalType == 'molset-json') {
			// Molset --> Save JSON file
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir,
					filename: fileStore.filenameNaked,
					// ext: 'molset.json',
					dataType: 'molset',
				},
				{ onSubmit: doSubmit },
			)
		} else if (modalType == 'molset-options') {
			// Molset --> Provide export options
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir,
					filename: fileStore.filenameNaked,
					dataType: 'molset',
				},
				{ onSubmit: doSubmit },
			)
		} else if (modalType == 'smol-options') {
			// Smol --> Provide export options
			const fileStoreFilename = fileStore.moduleName == 'MolViewer' ? fileStore.filenameNaked : null
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir || '',
					filename: fileStoreFilename || params.defaultName || 'untitled',
					dataType: 'smol',
				},
				{ onSubmit: doSubmit },
			)
		} else if (modalType == 'cif-options') {
			// Protein --> Provide export options
			const fileStoreFilename = fileStore.moduleName == 'MolViewer' ? fileStore.filenameNaked : null
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir || '',
					filename: fileStoreFilename || params.defaultName || 'untitled',
					dataType: 'cif',
				},
				{ onSubmit: doSubmit },
			)
		} else if (modalType == 'pdb-options') {
			// Protein --> Provide export options
			const fileStoreFilename = fileStore.moduleName == 'MolViewer' ? fileStore.filenameNaked : null
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir || '',
					filename: fileStoreFilename || params.defaultName || 'untitled',
					dataType: 'pdb',
				},
				{ onSubmit: doSubmit },
			)
		}
		// To shut up ts linter. This won't be reached.
		return new Promise(() => {})
	}

	//
	//

	// The onSubmit is called in ModalSaveFile.vue
	async function doSubmit(
		{ destinationPath, ext, srcDataType }: { destinationPath: string; ext: string; srcDataType: MolFileDataType },
		force: boolean = false,
	) {
		try {
			if (srcDataType == 'molset') {
				if (ext == 'molset.json') {
					await molGridStore.saveMolsetAsJSON(destinationPath, { newFile: true, force })
				} else if (ext == 'sdf') {
					await molGridStore.saveMolsetAsSDF(destinationPath, { newFile: true, force })
				} else if (ext == 'csv') {
					await molGridStore.saveMolsetAsCSV(destinationPath, { newFile: true, force })
				} else if (ext == 'smi') {
					await molGridStore.saveMolsetAsSmiles(destinationPath, { newFile: true, force })
				}
			} else if (srcDataType == 'smol') {
				if (ext == 'mol.json') {
					await molViewerStore.saveMolAsJSON(destinationPath, { newFile: true, force })
				} else if (ext == 'sdf') {
					await molViewerStore.saveMolAsSDF(destinationPath, { newFile: true, force })
				} else if (ext == 'csv') {
					await molViewerStore.saveMolAsCSV(destinationPath, { newFile: true, force })
				} else if (ext == 'mol') {
					await molViewerStore.saveMolAsMDL(destinationPath, { newFile: true, force })
				} else if (ext == 'smi') {
					await molViewerStore.saveMolAsSMILES(destinationPath, { newFile: true, force })
				}
			} else if (['cif', 'pdb'].includes(srcDataType)) {
				if (ext == 'mmol.json') {
					await molViewerStore.saveMmolAsMmolJson(destinationPath, { newFile: true, force })
				} else if (ext == 'cif') {
					await molViewerStore.saveMmolAsCIF(destinationPath, { newFile: true, force })
				} else if (ext == 'pdb') {
					await molViewerStore.saveMmolAsPDB(destinationPath, { newFile: true, force })
				}
			}

			const filebrowserPath = path2FileBrowserPath(destinationPath)
			router.push('/~/' + filebrowserPath)
		} catch (err: any) {
			const errMsg = err?.data || 'An error occurred while saving the file.'
			const status = err?.status
			if (!err?.status) console.error(err)
			if (status == 409) {
				// If the file already exists, ask the user if they want to overwrite it.
				modalStore.confirm(errMsg, {
					title: 'Overwrite existing file?',
					onSubmit: () => doSubmit({ destinationPath, ext, srcDataType }, true),
				})
			} else {
				modalStore.alert(errMsg, { title: 'Error' })
			}
		}
	}
}
