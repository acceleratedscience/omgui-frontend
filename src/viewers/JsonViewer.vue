<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<IconButton icon="icn-close" btnStyle="soft" mini @click="fileStore.exitViewer" />
	</BreadCrumbs>
	<pre v-if="jsonData" id="json-data"><div v-for="line, i in jsonDataLines" :key="i">{{ line }}</div></pre>
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
import IconButton from '@/components/IconButton.vue'

// Props
const props = defineProps<{
	filePath?: string
	data?: Record<string, any>
}>()

/**
 * Computed
 */

const jsonData = computed(() => {
	if (props.data) return props.data
	const fileStoreData = fileStore.data
	if (fileStoreData?.cacheId && fileStoreData?.mols) {
		// mol.json files --> extract file data without meta wrapper.
		return fileStoreData.mols
	} else {
		return fileStoreData
	}
})

// Spltting up the data into lines
// so we can add line numbers with CSS.
const jsonDataLines = computed(() => {
	if (!jsonData.value) return []
	const jsonStr = JSON.stringify(jsonData.value, null, '\t')
	return jsonStr.split('\n')
})
</script>

<style lang="scss" scoped>
#json-data {
	white-space: pre-wrap;
	font-size: $font-size-small;
	border: solid 1px $black-10;
	background: $extra-soft-bg;
}
#json-data {
	counter-reset: line;
}
#json-data div:before {
	counter-increment: line;
	content: counter(line);
	display: inline-block;
	width: 40px;
	border-right: 1px solid $black-10;
	padding: 0 5px;
	margin-right: 20px;
	text-align: right;
	color: $black-30;
}
#json-data div:first-child:before {
	padding-top: 10px;
}
#json-data div:last-child:before {
	padding-bottom: 10px;
}
</style>
