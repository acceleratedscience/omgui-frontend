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
import { useModalStore } from '@/stores/ModalStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()
const modalStore = useModalStore()

// Components
import OverflowMenu from '@/components/OverflowMenu.vue'

// Modals
import { useModalSaveFile } from '@/modals/modal-save-file'
const modalSaveFile = useModalSaveFile()

// Type declarations
import type { MolFileDataType, ActionOption } from '@/types'

// Props
const props = defineProps<{
	dataType: MolFileDataType
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
if (fileStore.active && ['smol', 'mmol', 'cif', 'pdb'].includes(fileStore.fileType as string)) {
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
	console.log('dataType: ', props.dataType)

	// smol.json
	if (props.dataType == 'smol') return modalSaveFile('smol', true, { defaultName: molViewerStore.nameSlug })

	// cif / mmol.json with cif data
	if (props.dataType == 'cif') return modalSaveFile('cif', true, { defaultName: molViewerStore.nameSlug })

	// pdb / mmol.json with pdb data
	if (props.dataType == 'pdb') return modalSaveFile('pdb', true, { defaultName: molViewerStore.nameSlug })

	console.error(`actionSaveAs() -> props.dataType "${props.dataType}" not recognized`)
}

// Delete
async function actionDeleteFile() {
	modalStore.confirm('This cannot be undone.', {
		title: 'Please confirm deletion',
		primaryBtn: 'Delete',
		onSubmit: async () => {
			const success: boolean = await fileStore.deleteFile(fileStore.pathAbsolute)
			if (success) router.push('/~/' + fileStore.pathDir)
		},
	})
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
