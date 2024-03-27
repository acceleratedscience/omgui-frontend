<template>
	<main id="module">This is the Text viewer component {{ path }}</main>
	<div v-if="fileStore.data" id="file-content">{{ fileStore.data }}</div>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { PropType } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Type declarations
type Props = {
	filePath: string
}

// Props
const props = defineProps({
	filePath: String as PropType<Props['filePath']>,
})

/**
 * Computed
 */

const path = computed(() => {
	return route.query.path
})
</script>

<style lang="css" scoped>
#module {
	background: peachpuff;
	padding: 4px;
	margin-bottom: 20px;
}
#file-content {
	white-space: pre-wrap;
}
</style>
