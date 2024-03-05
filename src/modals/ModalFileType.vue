<template>
	<cv-modal
		:visible="modalStore.visible"
		size="xs"
		@primary-click="onSubmit"
		:primaryButtonDisabled="submitDisabled"
	>
		<template v-slot:title>{{ capitalize(fileStore.fileType) }} viewer</template>
		<template v-slot:content>
			<p v-if="fileStore.fileTypeOverride" class="error-msg">
				This is a <b>{{ displayDefaultFileType }}</b> file, but you are currently viewing it
				in the <b>{{ displayFileType }}</b> viewer.
			</p>
			<cv-dropdown v-model="selectedFileType" label="Select viewer">
				<cv-dropdown-item
					v-for="[fileType, displayFileType] in fileTypeList"
					:key="fileType"
					:value="fileType"
				>
					{{ displayFileType }}
					<template v-if="fileType == fileStore.defaultFileType">(default)</template>
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

// Mapping needed to displat file type "mol" as "molecule" etc.
const displayFileType: ComputedRef<string> = computed(
	() => map_fileType2DisplayFT[fileStore.fileType],
)
const displayDefaultFileType: ComputedRef<string> = computed(
	() => map_fileType2DisplayFT[fileStore.defaultFileType],
)
const fileTypeList: ComputedRef<string[][]> = computed(() => {
	let fileTypes: string[][] = Object.entries(map_fileType2DisplayFT)
	fileTypes = fileTypes.filter(([ft]) => ft != 'unknown')
	return fileTypes
})
const selectedFileType = ref<string>(fileStore.defaultFileType)
const submitText: ComputedRef<string> = computed(() =>
	fileStore.fileTypeOverride && selectedFileType.value == fileStore.defaultFileType
		? 'Reset'
		: 'Switch',
)
const submitDisabled: ComputedRef<boolean> = computed(() => {
	return selectedFileType.value == fileStore.fileType
})

/*
 * Hooks
 */

onMounted(() => emit('mounted'))

/*
 * Functions
 */

async function onSubmit() {
	if (selectedFileType.value == fileStore.defaultFileType) {
		router.push({ path: router.currentRoute.value.path })
	} else {
		router.push('?use=' + selectedFileType.value)
	}
	modalStore.hide()
}
</script>

<style lang="css" scoped></style>
