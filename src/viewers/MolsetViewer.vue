<template>
	<MolViewer v-if="molViewerStore.molFromMolset" context="molset" />
	<template v-else>
		<BreadCrumbs v-if="fileStore.active" :pathArray="fileStore.breadCrumbPathArray">
			<template v-if="molGridStore.resultCount < molGridStore.total">
				Showing {{ prettyNr(molGridStore.resultCount) }} / {{ prettyNr(molGridStore.total) }}
			</template>
			<template v-else>Total: {{ prettyNr(molGridStore.total) }}</template>
		</BreadCrumbs>
		<BreadCrumbsNot v-else :collapsed="true">
			<template v-if="molGridStore.resultCount < molGridStore.total">
				Showing {{ prettyNr(molGridStore.resultCount) }} / {{ prettyNr(molGridStore.total) }}
			</template>
			<template v-else>Total: {{ prettyNr(molGridStore.total) }}</template>
		</BreadCrumbsNot>
		<MolGrid :retainCache="retainCache" />
	</template>
	<!-- </div> -->
</template>

<script setup lang="ts">
// Vue
import { watch } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const fileStore = useFileStore()
const molGridStore = useMolGridStore()
const molViewerStore = useMolViewerStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import MolGrid from '@/components/MolGrid.vue'
import IconButton from '@/components/IconButton.vue'
import MolViewer from '@/viewers/MolViewer.vue'

// Utils
import { prettyNr } from '@/utils/helpers'

// Props
defineProps<{
	retainCache?: boolean
}>()

/**
 * Logic
 */

// Open molecule if ?show is set in the URL query.
parseMolFromMolsetUrlQuery()
// molGridStore.parseUrlQuery()

/**
 * Hooks
 */

watch(
	() => route.query,
	() => {
		parseMolFromMolsetUrlQuery()
		molGridStore.parseUrlQuery()
	},
)

/**
 * Methods
 */

function parseMolFromMolsetUrlQuery() {
	// console.log('** parseMolFromMolsetUrlQuery')
	const query = router.currentRoute.value.query
	if (query?.show) {
		const index = Number(query.show)
		if (index != molViewerStore.molFromMolsetIndex) {
			molViewerStore.setMolFromMolsetIndex(index, true)
		}
		_fetchMolDataFromMolset(molGridStore.cacheId, index)
	} else {
		molViewerStore.setMolFromMolsetIndex(null, true)
	}
}

// Fetch a molecule from a molset.
function _fetchMolDataFromMolset(cacheId: number | null = null, index: number) {
	// console.log('Fetch from:', cacheId)
	if (!cacheId) return
	apiFetch(moleculesApi.getMolDataFromMolset(cacheId, index), {
		onSuccess: (data) => {
			molViewerStore.setMolData(data)
			if (molViewerStore.inchi) molViewerStore.fetchMolVizData(molViewerStore.inchi)
		},
		onError: (err) => {
			console.log('Error in getMolDataFromMolset()', err)
		},
	})
}
</script>

<style lang="scss" scoped></style>
