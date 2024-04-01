<template>
	<!-- {{ molViewerStore.molFromMolset }}<br /><br /><br /> -->
	<!-- <div v-show="molViewerStore.molFromMolset">
		<MolViewer />
	</div> -->
	<MolViewer v-if="molViewerStore.molFromMolset" />
	<!-- <div v-show="!molViewerStore.molFromMolset"> -->
	<template v-else>
		<BreadCrumbs v-if="breadcrumbs" :pathArray="fileStore.breadCrumbPathArray">
			<template v-if="molGridStore.resultCount < molGridStore.total">
				Showing {{ prettyNr(molGridStore.resultCount) }} / {{ prettyNr(molGridStore.total) }}
			</template>
			<template v-else>Total: {{ prettyNr(molGridStore.total) }}</template>
			<IconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
		</BreadCrumbs>
		<MolGrid />
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
import MolGrid from '@/components/MolGrid.vue'
import IconButton from '@/components/IconButton.vue'
import MolViewer from '@/viewers/MolViewer.vue'

// Utils
import { prettyNr } from '@/utils/helpers'

// Props
withDefaults(defineProps<{ breadcrumbs?: boolean }>(), {
	breadcrumbs: true,
})

/**
 * Logic
 */

// Open molecule if ?view is set in the URL.
parseMolFromMolsetUrlQuery()

/**
 * Hooks
 */

watch(
	() => route.query,
	() => {
		console.log('ROUTE CHANGE')
		parseMolFromMolsetUrlQuery()
		// if (molViewerStore.molFromMolset) {
		// 	// Looking at a molecules inside a molset.
		// 	parseMolFromMolsetUrlQuery()
		// } else {
		// 	// Looking at the molset.
		// 	molGridStore.parseUrlQuery()
		// }
	},
)

/**
 * Methods
 */

function parseMolFromMolsetUrlQuery() {
	console.log('** parseMolFromMolsetUrlQuery')
	const query = router.currentRoute.value.query
	if (query?.show) {
		const index = Number(query.show)
		if (index != molViewerStore.molFromMolsetIndex) {
			molViewerStore.setMolFromMolsetIndex(index, true)
		}
		_fetchMolDataFromMolset(molGridStore.cacheId, index)
	}
}

// Fetch a molecule from a molset.
function _fetchMolDataFromMolset(cacheId: number | null = null, index: number) {
	// console.log('Fetch from:', cacheId)
	if (!cacheId) return
	apiFetch(moleculesApi.getMolDataFromMolset(cacheId, index), {
		onSuccess: (data) => {
			molViewerStore.setMolData(data)
			if (!molViewerStore.sdf && molViewerStore.inchi) {
				molViewerStore.fetchMolVizData(molViewerStore.inchi)
			}
		},
		onError: (err) => {
			console.log('Error in getMolDataFromMolset()', err)
		},
		// loading: loading,
		// loadingError: loadingErrorMsg,
	})
}
</script>

<style lang="scss" scoped></style>
