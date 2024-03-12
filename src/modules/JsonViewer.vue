<template>
	<main id="module">This is the JSON viewer component {{ path }}</main>
	<pre v-if="molData" id="file-content">{{ molData }}</pre>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { PropType } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

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

const molData = computed(() => {
	return props.data || fileStore.data
})
</script>

<style lang="css" scoped>
#module {
	background: beige;
	padding: 4px;
	margin-bottom: 20px;
}
#file-content {
	white-space: pre-wrap;
}
</style>
