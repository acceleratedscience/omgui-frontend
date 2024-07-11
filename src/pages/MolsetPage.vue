<template>
	<BaseFetching v-if="loading" />
	<template v-else-if="loadingError">
		<div class="error-msg">Something went wrong loading this molecule set.</div>
		<div class="status-msg" v-if="loadingError">{{ status }}: {{ loadingError }}</div>
	</template>
	<MolsetViewer v-else :retainCache="true" />
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Components
import MolsetViewer from '@/viewers/MolsetViewer.vue'
import BaseFetching from '@/components/BaseFetching.vue'

// Definitions
const loading = ref<boolean>(false)
const loadingError = ref<string>('')
const status = ref<number | null>(null)

// Props
const props = defineProps<{
	cacheId: string
}>()

/**
 * Hooks
 */

onMounted(() => {
	const query = route.query
	apiFetch(moleculesApi.getMolset(+props.cacheId, query), {
		onSuccess: (data) => {
			molGridStore.setMolset(data)
			molGridStore.setContext(null)
		},
		onError: (err) => {
			console.log('Error in getMolset()', err)
		},
		loading: loading,
		loadingError: loadingError,
		status: status,
	})
})
</script>

<style lang="css" scoped></style>
