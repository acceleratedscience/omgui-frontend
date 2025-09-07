<template>
	<MolViewer v-if="!mainStore.blockRouting && molViewerStore.molFromMolset" context="molset" />
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
		<TheMolGrid :retainCache="retainCache" />
	</template>
	<!-- </div> -->
</template>

<script setup lang="ts">
// Vue
import { watch } from 'vue'

// Router
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()
const molViewerStore = useMolViewerStore()
const modalStore = useModalStore()

// API
import { apiFetch, moleculesApi } from '@/api'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import TheMolGrid from '@/components/TheMolGrid.vue'
import MolViewer from '@/viewers/MolViewer.vue'

// Utils
import { prettyNr } from '@/utils/helpers'

// Type declarations
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// Props
const props = defineProps<{
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

// Block any exit attempt when there are unsaved changes.
window.onbeforeunload = function () {
	if (molGridStore.hasChanges) return true
	if (!props.retainCache) molGridStore.clear()
}
onBeforeRouteLeave(onBeforeExit)
onBeforeRouteUpdate(onBeforeExit)

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
			molViewerStore.setMolData(data, 'smol')
			const identifier = molViewerStore.inchi || molViewerStore.smiles
			if (identifier) molViewerStore.fetchSmolVizData(identifier)
		},
		onError: (err) => {
			console.log('Error in getMolDataFromMolset()', err)
		},
	})
}

// Block route change when there are unsaved changes.
async function onBeforeExit(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
	// console.log('onBeforeExit MOLSET', molGridStore.hasChanges)
	if (molGridStore.hasChanges) {
		mainStore.setBlockRouting(true)
		await modalStore.alert('If you leave, all molset changes will be lost.', {
			title: 'Unsaved molset changes',
			primaryBtn: 'Stay',
			secondaryBtn: 'Discard',
			onCancel: () => {
				if (to.path != from.path && !props.retainCache) {
					molGridStore.clear()
				}
				molGridStore.setHasChanges(false)
				mainStore.setBlockRouting(false)
				next()
			},
			onSubmit: () => {
				next(false)
			},
		})
	} else {
		if (to.path != from.path && !props.retainCache) {
			molGridStore.clear()
		}
		next()
	}
}
</script>

<style lang="scss" scoped></style>
