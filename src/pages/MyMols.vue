<template>
	<h3>My Molecules</h3>
	<p>
		This is your working set of molecules, it is cleared at the end of your session.<br />
		If you want to preserve this molecule set, you can save it to your workspace.
	</p>
	<MolGrid />
</template>

<script setup lang="ts">
// Vue
import { onMounted } from 'vue'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const mainStore = useMainStore()
const molGridStore = useMolGridStore()

// Components
import MolGrid from '@/viewers/MolGrid.vue'

/**
 * Hooks
 */

onMounted(() => {
	const query = molGridStore._setUrlQuery()
	apiFetch(moleculesApi.getMyMols(query), {
		onSuccess: (data) => {
			console.log(133, data)
			molGridStore.setMolset(data)
		},
		onError: (err) => {
			console.log('Error in getMolset()', err)
		},
	})
})
</script>

<style lang="css" scoped></style>
