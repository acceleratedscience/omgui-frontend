<template>
	<OverflowMenu :options="overflowOptions" :disabled="disabled" />
</template>

<script setup lang="ts">
// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()

// Components
import OverflowMenu from '@/components/OverflowMenu.vue'

// Modals
import { useModalSaveFile } from '@/modals/modal-save-file'
const modalSaveFile = useModalSaveFile()

// Type declarations
import type { ActionOption } from '@/types'

// Props
defineProps<{
	disabled: boolean
}>()

// Definitions
const overflowOptions: ActionOption[] = [
	{
		val: 'save-as',
		disp: 'Save as...',
		action: actionSaveAs,
	},
]
if (fileStore.active && ['mmol', 'mol', 'cif', 'pdb'].includes(fileStore.fileType as string)) {
	overflowOptions.push({
		val: 'delete',
		disp: 'Delete',
		action: actionDeleteFile, // Todo: Add confirmation modal
	})
}

/**
 * Methods
 */

// Save as...
function actionSaveAs() {
	if (fileStore.fileType == 'mol') {
		return modalSaveFile('smol', true, { defaultName: molViewerStore.nameSlug })
	} else if ((fileStore.fileType as string) == 'cif') {
		return modalSaveFile('cif', true, { defaultName: molViewerStore.nameSlug })
	} else if ((fileStore.fileType as string) == 'pdb') {
		return modalSaveFile('pdb', true, { defaultName: molViewerStore.nameSlug })
	} else if ((fileStore.fileType as string) == 'mmol') {
		if (molViewerStore.proteinData3DFormat == 'cif') {
			return modalSaveFile('cif', true, { defaultName: molViewerStore.nameSlug })
		} else if (molViewerStore.proteinData3DFormat == 'pdb') {
			return modalSaveFile('pdb', true, { defaultName: molViewerStore.nameSlug })
		}
	}
}

// Delete
async function actionDeleteFile() {
	const success: boolean = await fileStore.deleteFile(fileStore.pathAbsolute)
	if (success) router.push('/~/' + fileStore.pathDir)
}
</script>

<style lang="scss" scoped>
.btn-wrap {
	height: 40px;
	position: relative;
}
.btn-wrap select {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	cursor: pointer;
}

@media (hover: hover) {
	// Replicate the default BaseIconButton hover effect
	// which is disabled because of the dropdown overlay.
	.btn-wrap:hover .icn-btn {
		background: rgba(0, 0, 0, 0.05);
	}
}
</style>
