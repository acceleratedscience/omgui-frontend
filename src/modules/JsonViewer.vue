<template>
	<main id="module">This is the JSON viewer component {{ path }}</main>
	<pre v-if="molData" id="file-content">{{ molData }}</pre>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Props
const props = defineProps({
	filePath: {
		type: String,
		required: false,
	},
	data: {
		type: Object as () => Record<string, any> | undefined | null, // Silly but to shut up TS errors.
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
