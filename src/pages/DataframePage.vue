<template>
	<!-- <pre>!{{ TEMP_DATA }}!</pre> -->
	<BaseFetching v-if="loading" />
	<template v-else-if="empty">
		<h3>
			Dataframe <i>{{ dfName }}</i>
		</h3>
		<p>
			There is no dataframe named <i>'{{ dfName }}'</i>.
		</p>
	</template>
	<pre v-else-if="TEMP_DATA">{{ TEMP_DATA }}</pre>
	<template v-else-if="loadingError">
		<div class="error-msg">Something went wrong loading this dataframe.</div>
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
import { apiFetch, dataframeApi } from '@/api/ApiService'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Components
import MolsetViewer from '@/viewers/MolsetViewer.vue'
import BaseFetching from '@/components/BaseFetching.vue'

// Props
const props = defineProps<{
	dfName: string
}>()

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
	apiFetch(dataframeApi.getDataframe(props.dfName, query), {
		onSuccess: (data) => {
			if (data && data.type == 'empty') {
				empty.value = true
				return
			} else if (data && data.type == 'molset') {
				molGridStore.setMolset(data.data)
				molGridStore.setContext('dataframe')
			} else if (data && data.type == 'data') {
				// Todo: implement dataviewer
				TEMP_DATA.value = data.data
			} else {
				console.log('Unknown data type:', data)
				TEMP_DATA.value = data
			}
		},
		loading: loading,
		loadingError: loadingError,
		status: status,
	})
})
</script>

<style lang="css" scoped></style>
