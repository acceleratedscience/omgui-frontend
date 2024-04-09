<template>
	<BaseFetching v-if="loading" />
	<MolGrid :retainCache="true" />
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const mainStore = useMainStore()
const molGridStore = useMolGridStore()
const molViewerStore = useMolViewerStore()

// Components
import MolGrid from '@/components/MolGrid.vue'
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
	const query = molGridStore._setUrlQuery()
	apiFetch(moleculesApi.getMolset(+props.cacheId, query), {
		onSuccess: (data) => {
			molGridStore.setMolset(data)
			// molsetData.value = data
		},
		onError: (err) => {
			console.log('Error in getMolset()', err)
		},
		loading: loading,
		status: status,
		// loadingError: loadingError,
	})
})
</script>

<style lang="css" scoped></style>
