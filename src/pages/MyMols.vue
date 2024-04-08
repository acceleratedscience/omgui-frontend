<template>
	<h3 v-if="!molViewerStore.molFromMolset">My Molecules</h3>
	<BaseFetching v-if="loading" />
	<template v-else-if="status == 204">
		<p>You haven't saved any molecules yet.</p>
		<p>To add molecules to your working set, run <span class="code">add molecule &lt;identifier&gt;</span> in your terminal.</p>
	</template>
	<template v-else>
		<p v-if="!molViewerStore.molFromMolset">
			This is your working set of molecules, it is cleared at the end of your session.<br />
			If you want to preserve this molecule set, you can save it to your workspace.
		</p>
		<MolsetViewer :breadcrumbs="false" />
	</template>
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
import MolsetViewer from '@/viewers/MolsetViewer.vue'
import BaseFetching from '@/components/BaseFetching.vue'

// Definitions
const loading = ref<boolean>(false)
const loadingError = ref<string>('')
const status = ref<number | null>(null)

/**
 * Hooks
 */

onMounted(() => {
	const query = molGridStore._setUrlQuery()
	apiFetch(moleculesApi.getMyMols(query), {
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
