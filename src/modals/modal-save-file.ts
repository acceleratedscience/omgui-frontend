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
					ext: 'molset.json',
				},
				{
					onSubmit: ({ destinationPath }: { destinationPath: string }) => {
						molGridStore.saveMolsetAsJSON(destinationPath)

						// Forwarding to the JSON file makes it hard to notice
						// anything happened, so instead we forward to the file
						// preview in the filebrowser.
						//
						// This would forward to the actual JSON:
						// router.push('/~/' + destinationPath)
						const filebrowserPath = path2FileBrowserPath(destinationPath)
						router.push('/~/' + filebrowserPath)
					},
				},
			)
		} else if (modalType == 'molset-options') {
			// Molset --> provide export options
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir,
					filename: fileStore.filenameNaked,
					dataType: 'molset',
				},
				{
					onSubmit: async ({ destinationPath, ext }: { destinationPath: string; ext: string }) => {
						let success: boolean = false
						if (ext == 'molset.json') {
							success = await molGridStore.saveMolsetAsJSON(destinationPath, { newFile: true })
						} else if (ext == 'sdf') {
							success = await molGridStore.saveMolsetAsSDF(destinationPath, { newFile: true })
						} else if (ext == 'csv') {
							success = await molGridStore.saveMolsetAsCSV(destinationPath, { newFile: true })
						} else if (ext == 'smi') {
							success = await molGridStore.saveMolsetAsSmiles(destinationPath, { newFile: true })
						}
						if (success) {
							const filebrowserPath = path2FileBrowserPath(destinationPath)
							router.push('/~/' + filebrowserPath)
						}
					},
				},
			)
		} else if (modalType == 'mol-options') {
			// Mol --> provide export options
			const fileStoreFilename = fileStore.moduleName == 'MolViewer' ? fileStore.filenameNaked : null
			return modalStore.display(
				'ModalSaveFile',
				{
					path: fileStore.pathDir || '',
					filename: fileStoreFilename || params.defaultName || 'untitled',
					dataType: 'mol',
				},
				{
					onSubmit: async ({ destinationPath, ext }: { destinationPath: string; ext: string }) => {
						let success: boolean = false
						if (ext == 'mol.json') {
							success = await molViewerStore.saveMolAsJSON(destinationPath, { newFile: true })
						} else if (ext == 'sdf') {
							success = await molViewerStore.saveMolAsSDF(destinationPath, { newFile: true })
						} else if (ext == 'csv') {
							success = await molViewerStore.saveMolAsCSV(destinationPath, { newFile: true })
						} else if (ext == 'mol') {
							success = await molViewerStore.saveMolAsMDL(destinationPath, { newFile: true })
						} else if (ext == 'smi') {
							success = await molViewerStore.saveMolAsSMILES(destinationPath, { newFile: true })
						}
						if (success) {
							const filebrowserPath = path2FileBrowserPath(destinationPath)
							router.push('/~/' + filebrowserPath)
						}
					},
				},
			)
		}
		// To shut up ts linter. This won't be reached.
		return new Promise(() => {})
	}
}
