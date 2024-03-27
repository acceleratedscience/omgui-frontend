<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<IconButton icon="icn-close" btnStyle="soft" mini @click="router.push({ path: router.currentRoute.value.path })" />
	</BreadCrumbs>
	<pre v-if="jsonData" id="json-data"><div v-for="line, i in jsonDataLines" :key="i">{{ line }}</div></pre>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { PropType } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import IconButton from '@/components/IconButton.vue'

// Type declarations
type Props = {
	filePath: string
	data: Record<string, any>
}

// Props
const props = defineProps({
	filePath: {
		type: String as PropType<Props['filePath']>,
		required: false,
	},
	data: {
		type: Object as PropType<Props['data']>,
		required: false,
	},
})

/**
 * Computed
 */

const path = computed(() => {
	return route.query.path
})

const jsonData = computed(() => {
	if (props.data) {
		return props.data
	}

	const fileStoreData = fileStore.data

	if (fileStoreData?.cacheId && fileStoreData?.mols) {
		// mol.json files --> extract file data without meta wrapper.
		return fileStoreData.mols
	} else {
		return {}
	}
})

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
