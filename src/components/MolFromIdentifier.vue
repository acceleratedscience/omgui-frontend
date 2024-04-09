<template>
	<template v-if="molViewerStore.mol && route.query.use == 'json'">
		<JsonViewer :data="molViewerStore.mol" />
	</template>
	<MolViewer context="identifier" :loading="loading" :loadingError="loadingError" @retryLoad="fetchMolDataByIdentifier(identifier)" />
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
import JsonViewer from '@/viewers/JsonViewer.vue'
import MolViewer from '@/viewers/MolViewer.vue'

// Props
const props = defineProps<{
	identifier: string
}>()

// Definitions
const loading = ref<boolean>(false)
// const loadingError = ref<boolean>(false)
const loadingError = ref<string>('')

// Utils
import initRDKit from '@/utils/rdkit/initRDKit'

// Type declarations
import type { JSMol } from '@/utils/rdkit/tsTypes'

/**
 * Logic
 */

// While waiting for the API, prepopulate the UI where possible.
if (props.identifier.startsWith('InChI=')) {
	// InChI --> prepopulate inchi field only.
	molViewerStore.setMolIdentifier('inchi', props.identifier)
	molViewerStore.fetchMolVizData(props.identifier)
} else {
	// SMILES --> prepopulate other identifiers and generate the SVG.
	// OTHER --> this won't do anything, we'll call molViewerStore.fetchMolVizData later.
	tryPrepopulateFromSmiles(props.identifier)
	molViewerStore.fetchMolVizData(props.identifier)
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
	console.log('fetchMolData', identifier)
	if (!identifier) return

	let success = false
	loading.value = true
	loadingError.value = ''

	apiFetch(moleculesApi.getMolData(identifier), {
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
			molViewerStore.setMolData(data)
			success = true

			if (needsVizData) {
				molViewerStore.fetchMolVizData(molViewerStore.inchi!)
			}
		},
		loading: loading,
		loadingError: loadingError,
	})

	return success
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
	molViewerStore.setMolIdentifier('canonical_smiles', identifier) // This will trigger the SVG rendering
	molViewerStore.setMolIdentifier('inchi', inchi)
	molViewerStore.setMolIdentifier('inchikey', window.RDKit.get_inchikey_for_inchi(inchi))

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
