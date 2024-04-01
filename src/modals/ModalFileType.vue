<template>
	<cv-modal :visible="modalStore.visible" size="xs" @primary-click="onSubmit" :primaryButtonDisabled="submitDisabled">
		<template v-slot:title>{{ capitalize(fileStore.fileType ?? '') }} viewer</template>
		<template v-slot:content>
			<p v-if="fileStore.fileTypeOverride" class="error-msg">
				This is a <b>{{ displayDefaultFileType }}</b> file, but you are currently viewing it in the <b>{{ displayFileType }}</b> viewer.
			</p>
			<!-- Previous version listed file types instead of viewers, but that doesn't make sense I think -->
			<!-- Can be deleted - see // Trash below -->
			<!-- <cv-dropdown v-model="selectedFileType" label="Select viewer">
				<cv-dropdown-item v-for="[fileType, displayFileType] in fileTypeList" :key="fileType" :value="fileType">
					{{ displayFileType }}
					<template v-if="fileType == fileStore.defaultFileType">(default)</template>
				</cv-dropdown-item>
			</cv-dropdown> -->
			<cv-dropdown v-model="selectedViewer" label="Select viewer">
				<cv-dropdown-item v-for="[viewerName, viewerDisplayName] in viewerList" :key="viewerName" :value="viewerName">
					{{ viewerDisplayName }}
					<template v-if="viewerName == fileStore.moduleName">(default)</template>
				</cv-dropdown-item>
			</cv-dropdown>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>{{ submitText }}</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, onMounted } from 'vue'
import type { ComputedRef } from 'vue'
import { useRouter } from 'vue-router'

// Stores
import { useModalStore } from '@/stores/ModalStore'
import { useFileStore } from '@/stores/FileStore'
const modalStore = useModalStore()
const fileStore = useFileStore()

// Utils
import { map_fileType2DisplayFT } from '@/utils/maps'
import { capitalize } from '@/utils/helpers'

// Definitions
const router = useRouter()
const emit = defineEmits(['mounted'])

/*
 * Computed
 */

// Mapping needed to display file type "mol" as "molecule" etc.
const displayFileType: ComputedRef<string | null> = computed(() => (fileStore.fileType ? map_fileType2DisplayFT[fileStore.fileType] : null))
const displayDefaultFileType: ComputedRef<string | null> = computed(() =>
	fileStore.defaultFileType ? map_fileType2DisplayFT[fileStore.defaultFileType] : null,
)
// const fileTypeList: ComputedRef<string[][]> = computed(() => { // Trash
// 	let fileTypes: string[][] = Object.entries(map_fileType2DisplayFT)
// 	fileTypes = fileTypes.filter(([key]) => key != 'unk')
// 	return fileTypes
// })
const viewerList: string[][] = [
	['TextViewer', 'text viewer', 'text'],
	['JsonViewer', 'JSON viewer', 'json'],
	['DataViewer', 'data viewer', 'data'],
	['MolViewer', 'molecule viewer', 'mol'],
	['MolsetViewer', 'molecule set viewer', 'molset'],
]
// const selectedFileType = ref<string | null>(fileStore.defaultFileType) // Trash
const selectedViewer = ref<string | null>(fileStore.moduleName)
const submitText: ComputedRef<string> = computed(() =>
	// fileStore.fileTypeOverride && selectedFileType.value == fileStore.defaultFileType ? 'Reset' : 'Switch', // Trash
	fileStore.fileTypeOverride && selectedViewer.value == fileStore.moduleName ? 'Reset' : 'Switch',
)
const submitDisabled: ComputedRef<boolean> = computed(() => {
	// return selectedFileType.value == fileStore.fileType // Trash
	return selectedViewer.value == fileStore.moduleName
})

/*
 * Hooks
 */

onMounted(() => emit('mounted'))

/*
 * Functions
 */

// async function onSubmit() { // Archive
// 	if (selectedFileType.value == fileStore.defaultFileType) {
// 		router.push({ path: router.currentRoute.value.path })
// 	} else {
// 		router.push('?use=' + selectedFileType.value)
// 	}
// 	modalStore.hide()
// }
async function onSubmit() {
	if (selectedViewer.value == fileStore.defaultModuleName) {
		router.push({ path: router.currentRoute.value.path })
	} else {
		const selectedViewerFileTypeFiltered: string[][] | null = viewerList.filter(([viewerName]) => viewerName == selectedViewer.value)
		const selectedViewerFileType: string | null = selectedViewerFileTypeFiltered ? selectedViewerFileTypeFiltered[0][2] : null
		if (selectedViewerFileType) router.push('?use=' + selectedViewerFileType)
	}
	modalStore.hide()
}
</script>

<style lang="css" scoped></style>
