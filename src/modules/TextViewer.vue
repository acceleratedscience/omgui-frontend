<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

defineProps({
	filePath: String,
})

const path = computed(() => {
	return route.query.path
})
</script>

<template>
	<main id="module">This is the Text viewer component {{ path }}</main>
	<div v-if="fileStore.data" id="file-content">{{ fileStore.data }}</div>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

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
