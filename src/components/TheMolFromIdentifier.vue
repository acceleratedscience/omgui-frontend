<template>
	<BaseError v-if="loadingError" :loadingError backLink="/mol" />
	<BaseFetchingFile v-else-if="loading || doubleLoading" />
	<template v-else-if="route.query.use == 'json'">
		<JsonViewer :data="molViewerStore.smol" />
	</template>
	<MolViewer v-else context="identifier" :loading="loading" :loadingError="loadingError" @retryLoad="fetchMolDataByIdentifier(identifier)" />
</template>

<script setup lang="ts">
// Vue
import { watch, ref } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
const molViewerStore = useMolViewerStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Components
import BaseError from '@/components/BaseError.vue'
import JsonViewer from '@/viewers/JsonViewer.vue'
import MolViewer from '@/viewers/MolViewer.vue'
import BaseFetchingFile from '@/components/BaseFetchingFile.vue'

// Utils
import initRDKit from '@/utils/rdkit/initRDKit'
// import domLog from '@/utils/dom-log'

// Type declarations
import type { JSMol } from '@/utils/rdkit/tsTypes'
type MolTypeFromRoute = 'smol' | 'mmol' | 'mol' | 'headless-smol' | 'headless-mmol' | 'headless-mol'

// Props
const props = defineProps<{
	identifier: string
}>()

// Definitions
const loading = ref<boolean>(false)
const doubleLoading = ref<boolean>(false) // Special loader for when we're fetching both smol and mmol data.
// const loadingError = ref<boolean>(false)
const loadingError = ref<string>('')
const molType = ref<MolTypeFromRoute>(route.matched[0].name as MolTypeFromRoute)

/**
 * Logic
 */

// While waiting for the API, prepopulate the UI where possible.
if (props.identifier.startsWith('InChI=')) {
	// InChI --> prepopulate inchi field only.
	molViewerStore.setSmolIdentifier('inchi', props.identifier)
	molViewerStore.fetchSmolVizData(props.identifier)
} else {
	// SMILES --> prepopulate other identifiers and generate the SVG.
	// OTHER --> this won't do anything, we'll call molViewerStore.fetchSmolVizData later.
	tryPrepopulateFromSmiles(props.identifier)
	molViewerStore.fetchSmolVizData(props.identifier)
}

fetchMolDataByIdentifier(props.identifier)

/**
 * Hooks
 */

// Update data when going from one mol-by-identifier to another.
watch(
	() => props.identifier,
	(newVal) => {
		molViewerStore.clear()
		if (newVal) {
			fetchMolDataByIdentifier(newVal)
		}
	},
)

/**
 * Methods
 */

// Fetch molecule data from the API based on the identifier.
async function fetchMolDataByIdentifier(identifier: string | null = null) {
	// console.log('fetchMolData', identifier)
	if (!identifier) return

	loading.value = true
	loadingError.value = ''

	// Because we get the molType from the route name,
	// it will have "headless-" prepended when running
	// inside an iframe.
	molType.value = molType.value.replace(/^headless-/, '') as MolTypeFromRoute

	if (molType.value == 'mol') {
		// When molType is 'mol', we don't know if the identifier
		// is a smol or mmol, so we first do a smol search, then
		// a mmol search if the smol search fails. The doubleLoading
		// lets us maintain the loading status until both calls have
		// completed.
		doubleLoading.value = true
		_getSmolData(
			identifier,
			() => {
				// smol - onSuccess
				doubleLoading.value = false
			},
			() => {
				// smol - onError
				_getMmolData(
					identifier,
					() => {
						// mmol - onSuccess
						doubleLoading.value = false
					},
					() => {
						// mmol - onError
						doubleLoading.value = false
					},
				)
			},
		)
	} else if (['smol', 'mol'].includes(molType.value)) {
		_getSmolData(identifier)
	} else if (molType.value == 'mmol') {
		_getMmolData(identifier)
	}
}

function _getSmolData(identifier: string, onSuccess: () => void = () => {}, onError: () => void = () => {}) {
	apiFetch(moleculesApi.getSmolData(identifier), {
		onSuccess: (data) => {
			// // #fetching-error
			// // To test error handling.
			// loadingError.value = 'Some status message'
			// loading.value = false
			// console.log('ERROOOO')
			// return

			// If the molviewer is loaded directly with a smiles or inchi as
			// the identifier, we pre-loaded the visualisation data with a
			// separate API call. But for any other identifier, we need to
			// wait until we get the inchi back.
			const needsVizData = !molViewerStore.inchi

			// Update HTML
			molViewerStore.setMolData(data, 'smol')

			if (needsVizData) {
				molViewerStore.fetchSmolVizData(molViewerStore.inchi!)
			}
			onSuccess()
		},
		onError: onError,
		loading: loading,
		loadingError: loadingError,
	})
}

function _getMmolData(identifier: string, onSuccess: () => void = () => {}, onError: () => void = () => {}) {
	apiFetch(moleculesApi.getMmolData(identifier), {
		onSuccess: (data) => {
			// // #fetching-error
			// // To test error handling.
			// loadingError.value = 'Some status message'
			// loading.value = false
			// console.log('ERROOOO')
			// return

			// Update HTML
			molViewerStore.setMolData(data, 'mmol')

			onSuccess()
		},
		onError: onError,
		loading: loading,
		loadingError: loadingError,
	})
}

// If the identifier is a SMILES, we can use rdkit-js to generate
// most other identifiers and generate the SVG on the fly, without
// having to wait for the API.
async function tryPrepopulateFromSmiles(identifier: string) {
	await initRDKit()
	let rdkMol: JSMol | null = window.RDKit.get_mol(identifier)

	// If the identifier is anything other than a SMILES,
	// rdkMol will be null and we abort.
	if (!rdkMol) return

	// Prepopulate
	const inchi = rdkMol.get_inchi()
	molViewerStore.setSmolIdentifier('canonical_smiles', identifier) // This will trigger the SVG rendering
	molViewerStore.setSmolIdentifier('inchi', inchi)
	molViewerStore.setSmolIdentifier('inchikey', window.RDKit.get_inchikey_for_inchi(inchi))

	// // Rendering the  3D Molecule from the frontend is
	// // currently not possible with rdkit-js, but when it is,
	// // we can use the following code to generate the 3D molecule.
	// // https://github.com/rdkit/rdkit-js/issues/338
	//
	// // Add explicit hydrogen atoms, which are
	// // displayed as spikes in the 3D render.
	// rdkMol.add_hs()
	//
	// // Generate 3D coordinates.
	// // Functionality missing :(
	//
	// // Generate SDF format.
	// const sdf = rdkMol.get_molblock()
	// molViewerStore.setMolVizData(null, sdf)
	// init3DViewer()
}
</script>

<style lang="css" scoped></style>
