<template>
	<BaseFetching v-if="loading" />
	<template v-else-if="empty">
		<h3>Result</h3>
		<p>
			This page displays any data result from the CLI.<br />
			There is currently no result stored in memory.
		</p>
		<p>To give it a try, run in your terminal:</p>
		<span class="code" style="margin-top: 8px; display: inline-block">set context gt4sd</span><br />
		<span class="code" style="margin-top: 8px; display: inline-block">search for similar molecules to 'C1(C(=C)C([O-])C1C)=O'</span><br />
		<span class="code" style="margin-top: 8px; display: inline-block">result open</span>
	</template>
	<pre v-else-if="TEMP_DATA">{{ TEMP_DATA }}</pre>
	<template v-else-if="loadingError">
		<div class="error-msg">Something went wrong loading this molecule set.</div>
		<div class="status-msg" v-if="loadingError">{{ status }}: {{ loadingError }}</div>
	</template>
	<MolsetViewer v-else />
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// API
import { apiFetch, resultApi } from '@/api'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Components
import MolsetViewer from '@/viewers/MolsetViewer.vue'
import BaseFetching from '@/components/BaseFetching.vue'

// Definitions
const empty = ref<boolean>(false)
const loading = ref<boolean>(false)
const loadingError = ref<string>('')
const status = ref<number | null>(null)
const TEMP_DATA = ref<string>('')

/**
 * Hooks
 */

onMounted(() => {
	const query = route.query
	apiFetch(resultApi.getResult(query), {
		onSuccess: (data) => {
			if (data && data.type == 'empty') {
				empty.value = true
				return
			} else if (data && data.type == 'molset') {
				molGridStore.setMolset(data.data)
				molGridStore.setContext('result-mols')
			} else if (data && data.type == 'data') {
				// Todo: implement dataviewer
				TEMP_DATA.value = data.data
			} else {
				console.log('Unknown data type:', data)
			}
		},
		loading: loading,
		loadingError: loadingError,
		status: status,
	})
})
</script>

<style lang="css" scoped></style>
