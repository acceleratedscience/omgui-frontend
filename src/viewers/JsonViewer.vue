<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<BaseIconButton icon="icn-close" btnStyle="soft" mini @click="fileStore.exitViewer" />
	</BreadCrumbs>
	<TextBox v-if="jsonString" :textData="jsonString" />
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import TextBox from '@/components/TextBox.vue'

// Props
const props = defineProps<{
	filePath?: string
	data?: Record<string, any> | null
}>()

/**
 * Computed
 */

// JSON data from the store.
const jsonData = computed(() => {
	if (props.data) return props.data
	const fileStoreData = fileStore.data
	if (fileStoreData?.cacheId && fileStoreData?.mols) {
		// smol.json files come wrapped with meta information
		// so we extract the file data without meta wrapper.
		return fileStoreData.mols
	} else {
		return fileStoreData
	}
})

// JSON data as a string.
const jsonString = computed(() => {
	if (!jsonData.value) return ''
	return JSON.stringify(jsonData.value, null, 4)
})
</script>

<style lang="scss" scoped></style>
