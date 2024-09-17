<template>
	<cv-button
		v-if="showButton"
		size="small"
		kind="primary"
		class="btn-save"
		:class="{ saving, 'save-as': saveAs }"
		:disabled="saving"
		@click="onSaveClick"
	></cv-button>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()

// Modals
import { useModalSaveFile } from '@/modals/modal-save-file'
const modalSaveFile = useModalSaveFile()

// Type declarations
import type { ComputedRef } from 'vue'
import type { Smol } from '@/types'

// Definitions
const saving = ref<boolean>(false)

/**
 * Computed
 */

// Molecule is a non-JSOn file.
const isForeignFile: ComputedRef<boolean> = computed(() => {
	return fileStore.active && !['smol', 'molset'].includes(fileStore.fileType || '')
})

// Control the button text, either 'Save' or 'Save as...'
const saveAs: ComputedRef<boolean> = computed(() => {
	if (molGridStore.active) {
		// molset.json / my-mols --> Update the source.
		if (molGridStore.context == 'json' || molGridStore.context == 'my-mols') return false
	} else if (fileStore.fileType == 'smol') {
		// smol.json --> Update the source.
		return false
	}
	// Everything else --> Save as...
	return true
})

// Show the save button whenever there are changes.
const showButton: ComputedRef<boolean> = computed(() => {
	return molViewerStore.hasChanges
})

/*
 * Hooks
 */

/*
 * Methods
 */

async function onSaveClick() {
	let success = false
	saving.value = true

	// Note: modalSaveFile will push the router to the new file path if successful.
	// To avoid the onBeforeExit logic to be triggered, we set hasChanges to false
	// while the modal is active, then set it to the appropriate state when done.
	//
	// Note that both hasChanges / onBeforeExit exist both in the molViewerStore
	// & molGridStore / MolViewer & MolsetViewer respectively.

	if (molGridStore.active) {
		// Molecule inside of a molset.
		if (molGridStore.context == 'json') {
			// .molset.json file --> Update the JSON file.
			success = await molGridStore.replaceMolInMolset(fileStore.path, molViewerStore.smol as Smol, molGridStore.context)
		} else if (molGridStore.context == 'my-mols') {
			// My mols --> Update your working molecule set.
			success = await molGridStore.replaceMolInMolset(fileStore.path, molViewerStore.smol as Smol, molGridStore.context)
		} else {
			// Result mols / Non-JSON molset files (SDF, maybe others later) --> Display save-as modal.
			molGridStore.setHasChanges(false) // See note on top
			success = await modalSaveFile('smol', true, { defaultName: molViewerStore.nameSlug })
			molGridStore.setHasChanges(!success)
		}
	} else if (!fileStore.active || isForeignFile.value) {
		// Not a file (molecule viewer) or a foreign file --> Display save-as modal.
		molViewerStore.setHasChanges(false) // See note on top
		success = await modalSaveFile('smol', true, { defaultName: molViewerStore.nameSlug })
		molViewerStore.setHasChanges(!success)
	} else if (fileStore.fileType == 'smol') {
		// .smol.json file --> Update the current JSON file.
		success = await molViewerStore.saveSmolAsJSON(fileStore.path, { newFile: false })
	}

	// Success
	if (success) {
		molViewerStore.setHasChanges(false)
		molGridStore.setHasChanges(false)
	}
	saving.value = false
}
</script>

<style lang="scss" scoped>
.btn-save {
	width: 120px;
	padding-right: 0;
}
.btn-save::before {
	content: 'Save';
}
.btn-save.save-as::before {
	content: 'Save as...';
}
.btn-save.saving {
	pointer-events: none;
}
.btn-save.saving::before {
	content: 'Saving';
}
.btn-save.saving::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
</style>
