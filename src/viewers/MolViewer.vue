<!-- 
	The molviewer can be loaded in two different ways:
	- File: /~/dopamine.mol.json
	- Direct: /molviewer/dopamine

	Because of this, fetchMolData() and fetchMolVizData() need to be called
	on a number of different occasions to cover all use cases:
	
	fetchMolData()
	- #case-A-1: File/Direct - When the component is loaded.
	- #case-A-2: Direct - When going from one mol-by-identifier to another, by watching props.identifier.
	
	fetchMolVizData()
	- #case-B-1: File/Direct - When the component is loaded.
	- #case-B-2: File - When going from one mol file to another, by watching inchi.
	- #case-B-3: Direct - After then fetchMolData() has completed, when the identifier was not a SMILES or inchi.

	When testing, make sure to always check the following scenarios:
	- Open molecule file
	- Find molecule by identifier
	- Go from one molecule-by-identifier to another
	- Go from one molecule file to another
	- Go from one molecule file to a molecule-by-identifier
	- Go from one molecule-by-identifier to a molecule file
 -->

<template>
	<!-- Links for testing going from one molecule to another -->
	<!-- <router-link to="/~/_mols/mol_a.mol.json">file A</router-link>&nbsp;&nbsp;
	<router-link to="/~/_mols/mol_b.mol.json">file B</router-link>&nbsp;&nbsp;
	<router-link to="/molviewer/penguinone">idfr A</router-link>&nbsp;&nbsp;
	<router-link to="/molviewer/serotonin">idfr B</router-link>
	<br /><br /><br /> -->

	<!-- JSON-only view -->
	<!--
		Note: this is only used when molviewer is loaded directly.
		When we're opening a file, there's general viewer override
		logic which lives in the fileStore, see fileTypeOverride.
	 -->
	<template v-if="mol && route.query.use == 'json'">
		<JsonViewer :data="mol" />
	</template>

	<template v-else>
		<!-- Visualization -->
		<div id="mol-render" :class="{ headless: mainStore.headless }">
			<!--
				We could use the MolRender component to render the SVG in the frontend,
				the same way we do it in the MolGrid module. However, MolRender requires
				a SMILES string as input structure and rdkit-js doesn't let us convert
				InChI to SMILES, so when the identifier string is an InChI, we have to
				wait for the main fetchMolData API call to complete in order to get the
				SMILES, which results in a huge delay. So instead we fetch the SVG from
				the API together with the 3D data in a separate call, which is much faster.
			-->
			<!-- <div class="container-2d">
				<MolRender
					v-if="mol.identifiers.canonical_smiles"
					id="mol-svg"
					:structure="mol.identifiers.canonical_smiles.toString()"
					:width="300"
					:height="300"
					svg-mode
				/>
			</div> -->
			<div class="container-2d" v-html="molViewerStore.svg"></div>
			<MolRender3D :sdf="molViewerStore.sdf" :mol="molViewerStore.mol" />
		</div>

		<!-- Page content -->
		<div id="content-wrap">
			<!-- Left main column -->
			<div class="col-left">
				<!-- {{ sourceType }} -->
				<BreadCrumbsNot v-if="sourceType == 'identifier'" :backto="{ name: 'molviewer-input' }">
					<IconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
				</BreadCrumbsNot>
				<BreadCrumbs v-else :pathArray="pathArray">
					<IconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
				</BreadCrumbs>

				<!-- Title -->
				<div id="title-wrap">
					<div class="v-align">
						<SvgServe
							class="icn-file-mol"
							:class="{ loading: loading }"
							:icon="sourceType == 'molset' ? 'icn-file-molset' : 'icn-file-mol'"
							size="large"
						/>
					</div>
					<h2 id="data-name" data-val="{{ molName }}" :class="{ loading: loading }">
						{{ capitalize(molName) }}
					</h2>
					<div class="filler"></div>
					<IconButton icon="icn-star-large-outline" iconHover="icn-star" colorHover="rgba(0,0,0,.3)" colorToggle="#d3bf0b" :toggle="true" />
					<BasePagination v-if="molViewerStore.molFromMolset" v-model="modelPagination" :total="molGridStore.total" />
					<IconButton
						v-if="molViewerStore.molFromMolset"
						icon="icn-close"
						icnSize="small"
						btnStyle="carbon"
						@click="molViewerStore.setMolFromMolsetIndex(null)"
					/>
					<IconButton
						v-else
						icon="icn-close"
						icnSize="small"
						btnStyle="default"
						@click="fileStore.exitViewer"
						:style="{ 'margin-right': '-8px' }"
					/>
				</div>

				<template v-if="mol">
					<!-- Identification -->
					<div id="identification">
						<!-- @{{ molViewerStore.enriched }}! -->
						<div v-if="molViewerStore.enriched || mol?.identifiers?.inchi">
							<b v-copy-on-click :data-copy="`InChI: ${mol?.identifiers?.inchi}`">InChI: </b>
							<span v-if="mol?.identifiers?.inchi" id="data-inchi" v-copy-on-click>{{ mol?.identifiers?.inchi }}</span>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="molViewerStore.enriched || mol?.identifiers?.inchikey">
							<b v-copy-on-click :data-copy="`InChIKey: ${mol?.identifiers?.inchikey}`">InChIKey: </b>
							<span v-if="mol?.identifiers?.inchikey" id="data-inchikey" v-copy-on-click>{{ mol?.identifiers?.inchikey }}</span>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="mol?.identifiers?.smiles && (!mol?.identifiers?.canonical_smiles || mol?.identifiers?.isomeric_smiles)">
							<b v-copy-on-click :data-copy="`SMILES: ${mol?.identifiers?.smiles}`">SMILES: </b>
							<span id="data-smiles" v-copy-on-click>{{ mol?.identifiers?.smiles }}</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="molViewerStore.enriched || mol?.identifiers?.canonical_smiles">
							<b v-copy-on-click :data-copy="`Canonical SMILES: ${mol?.identifiers?.canonical_smiles}`">Canonical SMILES: </b>
							<span v-if="mol?.identifiers?.canonical_smiles" id="data-canonical-smiles" v-copy-on-click>{{
								mol?.identifiers?.canonical_smiles
							}}</span>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="molViewerStore.enriched || mol?.identifiers?.isomeric_smiles">
							<b v-copy-on-click :data-copy="`Isomeric SMILES: ${mol?.identifiers?.isomeric_smiles}`">Isomeric SMILES: </b>
							<span v-if="mol?.identifiers?.isomeric_smiles" id="data-isomeric-smiles" v-copy-on-click>{{
								mol?.identifiers?.isomeric_smiles
							}}</span>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="molViewerStore.enriched || mol?.identifiers?.formula">
							<b v-copy-on-click :data-copy="`Formula: ${mol?.identifiers?.formula}`">Formula: </b>
							<span v-if="mol?.identifiers?.formula" id="data-isomeric-smiles" v-copy-on-click>{{ mol?.identifiers?.formula }}</span>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<div v-if="molViewerStore.enriched || mol.identifiers?.cid">
							<b v-copy-on-click :data-copy="`PubChem CID: ${mol.identifiers.cid}`">PubChem CID: </b>
							<a
								v-if="mol?.identifiers?.cid"
								id="data-cid"
								:href="`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.identifiers?.cid}`"
								target="_blank"
								>{{ mol.identifiers.cid }}</a
							>
							<span v-else class="blank">-</span>
							<BaseFetching v-if="loading" text="" failText="x" :error="loadingError" />
						</div>
						<br />
						<cv-button
							v-if="!loading && !molViewerStore.enriched && !mol.identifiers?.cid"
							size="small"
							kind="secondary"
							@click="enrichMolecule"
						>
							Enrich
						</cv-button>
					</div>

					<hr />

					<!-- Fetching status -->
					<BaseFetching v-if="loading && !loadingError" text="Fetching molecule data" :error="loadingError" />

					<!-- Fetching error -->
					<!-- To test, see #fetching-error below -->
					<div v-else-if="loadingError" id="fetch-fail" class="error-msg">
						<div>
							Something went wrong fetching the molecule data.
							<div class="status-msg" v-if="loadingErrorMsg">
								{{ loadingErrorMsg }}
							</div>
						</div>
						<div>
							<cv-button kind="danger" size="field" @click="fetchMolDataByIdentifier">Retry</cv-button>
						</div>
					</div>

					<!-- Molecule data -->
					<template v-else>
						<!-- Synonyms -->
						<div id="synonyms" :style="{ '--truncated-height': truncatedSynonymsHeight }">
							<h3>Synonyms</h3>
							<div class="flip-v">
								<a v-if="truncateSynonyms" href="#" class="toggle-expand" @click.prevent="toggleExpand"></a>

								<div v-if="synonymCount && 'synonyms' in mol" class="cloak">
									<div class="synonyms-wrap" :style="{ height: synonymsHeight }">
										<div
											v-for="(synonym, i) in mol?.synonyms"
											:key="i"
											:title="synonym"
											:style="{ width: synonymColWidth }"
											v-copy-on-click
										>
											{{ synonym }}
										</div>
									</div>
								</div>
								<BaseFetching v-else-if="loading" :error="loadingError" />
								<template v-else>This molecule does not have any synonyms.</template>
							</div>
						</div>

						<hr />

						<!-- Properties -->
						<div id="properties">
							<h3>Properties</h3>
							<div v-if="'properties' in mol" class="param-wrap" :style="stylePropWrap">
								<div
									v-for="(val, key) in mol?.properties"
									:key="key"
									:title="molViewerStore.propertiesString[key]"
									:class="{ empty: !val && val !== 0 }"
									:style="{ width: propColWidth }"
								>
									<div v-copy-on-click :data-copy="`${key}: ${val}`" class="key">{{ key }}:</div>
									<div class="filler"></div>
									<div v-copy-on-click class="val">{{ val || val === 0 ? val : '-' }}</div>
								</div>
							</div>
						</div>

						<!-- <hr /> -->

						<!-- <div id="analysis">
							<h3>Analysis</h3>
							Coming soon...
						</div> -->
					</template>
				</template>
			</div>

			<!-- Right column (to be enabled later) - See #enableright below -->
			<div v-if="!loading && false" class="col-right">
				<h4>Notes</h4>
				<textarea id="ip-notes"></textarea>
			</div>
		</div>
	</template>

	<!-- <pre>{{ molViewerStore.sdf }}</pre> -->
</template>

<script setup lang="ts">
// Vue
import { ref, onBeforeUnmount, computed, watch } from 'vue'
import type { ComputedRef, WritableComputedRef } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const mainStore = useMainStore()
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import JsonViewer from '@/viewers/JsonViewer.vue'
import IconButton from '@/components/IconButton.vue'
import SvgServe from '@/components/SvgServe.vue'
import BaseFetching from '@/components/BaseFetching.vue'
import BasePagination from '@/components/BasePagination.vue'
import MolRender3D from '@/components/MolRender3D.vue'

// Utils
import { capitalize } from '@/utils/helpers'
import initRDKit from '@/utils/rdkit/initRDKit'

// Type declarations
import type { Mol, TempMol } from '@/types'
import type { JSMol } from '@/utils/rdkit/tsTypes'

// Props
const props = defineProps<{
	identifier?: string
}>()

// Definitions
const loading = ref<boolean>(false)
const loadingError = ref<boolean>(false)
const loadingErrorMsg = ref<string>('')
const paramColMinWidth: number = 250
const synonymColMinWidth: number = 150

function testtt() {
	console.log(11111, 'testtt')
	molViewerStore.setMolFromMolsetIndex(null)
	// molViewerStore._molFromMolsetIndex = null
	setTimeout(() => {
		console.log('ROUTER PUSH')
		router.push(route.path + '?x=1')
	}, 2000)
}

/**
 * Computed
 */

// Molecule data
const mol: ComputedRef<Mol | TempMol> = computed(() => molViewerStore.mol)

// The molecule viewer is used for differenbt sources with different routes.
// - identifier: /molviewer/dopamine
// - molFile:    /~/dopamine.mol.json
// - molset:     /molviewer/~/my_mols.molset.json?index=1
const sourceType: ComputedRef<'identifier' | 'molFile' | 'molset'> = computed(() => {
	if (route.name == 'molviewer' || route.name == 'headless-molviewer') {
		return 'identifier'
	} else {
		if (molViewerStore.molFromMolset) {
			return 'molset'
		} else {
			return 'molFile'
		}
	}
})

// Path array for breadcrumbs
const pathArray: ComputedRef<string[]> = computed(() => {
	return sourceType.value == 'molset'
		? fileStore.breadCrumbPathArray.concat(['mol #' + molViewerStore.molFromMolsetIndex?.toString()])
		: fileStore.breadCrumbPathArray
})

// Title
const molName: ComputedRef<string> = computed(() => {
	return mol.value?.identifiers?.name ? mol.value.identifiers.name : loading.value ? 'Loading' : 'Unnamed Molecule'
})

// Pagination model
const modelPagination: WritableComputedRef<number> = computed({
	get: () => molViewerStore.molFromMolsetIndex || 1,
	set: molViewerStore.setMolFromMolsetIndex,
})

// Synonyms section
const synonymCount: ComputedRef<number> = computed(() => {
	if (!('synonyms' in mol.value)) return 0
	return mol.value?.synonyms ? mol.value.synonyms.length : 0
})
const synonymsHeight: ComputedRef<string> = computed(() => {
	const height = Math.ceil(synonymCount.value / synonymColCount.value) * 22
	return `${height}px`
})
const synonymColCount: ComputedRef<number> = computed(() => {
	if (!mainStore.contentWidth) return 4
	return Math.floor(mainStore.contentWidth / synonymColMinWidth) || 1
})
const synonymColWidth: ComputedRef<string> = computed(() => {
	return `calc((100% - ${(synonymColCount.value - 1) * 20}px) / ${synonymColCount.value})`
})
const truncateSynonyms: ComputedRef<boolean> = computed(() => {
	const maxCount = 5 * synonymColCount.value + synonymColCount.value
	return synonymCount.value > maxCount
})
const truncatedSynonymsHeight: ComputedRef<string> = computed(() => {
	return truncateSynonyms.value ? '110px' : ''
})

// Properties section
const propColCount: ComputedRef<number> = computed(() => {
	if (!mainStore.contentWidth) return 3
	return Math.floor(mainStore.contentWidth / paramColMinWidth) || 1
})
const propColWidth: ComputedRef<string> = computed(() => {
	return `calc((100% - ${(propColCount.value - 1) * 40}px) / ${propColCount.value})`
})
const stylePropWrap: ComputedRef<{ height?: string }> = computed(() => {
	if (!('properties' in mol.value)) return {}
	const count = mol.value?.properties ? Object.keys(mol.value.properties).length : 0
	const height = Math.ceil(count / propColCount.value) * 22
	return height ? { height: `${height}px` } : {}
})

/**
 * Logic
 */

// Fetch mol data from the API.
// For molecule files, data is loaded from within ViewerDispatch.vue -> molViewerStore.setMolData()
if (props.identifier) {
	console.log('by identifier')
	fetchMolDataByIdentifier(props.identifier) // #case-A-1
} else {
	console.log('by file', molViewerStore.isEmpty)
	if (molViewerStore.isEmpty) {
		const data: Mol = fileStore.data
		molViewerStore.setMolData(data)
	}
}

// While waiting for the API, prepopulate the UI where possible.
if (props.identifier) {
	if (props.identifier.startsWith('InChI=')) {
		// InChI --> prepopulate inchi field only.
		molViewerStore.setMolIdentifier('inchi', props.identifier)
		fetchMolVizData(props.identifier) // #case-B-1
	} else {
		// SMILES --> prepopulate other identifiers and generate the SVG.
		// OTHER --> this won't do anything, we'll call fetchMolVizData later.
		tryPrepopulateFromSmiles(props.identifier)
		fetchMolVizData(props.identifier) // #case-B-1
	}
} else if (molViewerStore.inchi) {
	// When opening a molecule file.
	fetchMolVizData(molViewerStore.inchi) // #case-B-1
} else if (molViewerStore.smiles) {
	// When opening a molecule file.
	fetchMolVizData(molViewerStore.smiles) // #case-B-1
}

/**
 * Hooks
 */

// Clear store on exit.
onBeforeUnmount(clearMolData)

// Update data when going from one mol-by-identifier to another.
watch(
	() => props.identifier,
	(newVal) => {
		clearMolData()
		if (newVal) {
			fetchMolDataByIdentifier(newVal) // #case-A-2
		}
	},
)

// When going from one molecule file to another, fetchMolVizData will be
// called before the molecule is loaded, so we need to call it again here.
watch(
	() => [molViewerStore.inchi, molViewerStore.smiles],
	([newInchi, newSmiles], [oldInchi, oldSmiles]) => {
		if (sourceType.value != 'identifier') {
			if (newInchi && newInchi != oldInchi) {
				fetchMolVizData(newInchi as string) // #case-B-2
			} else if (newSmiles && newSmiles != oldSmiles) {
				fetchMolVizData(newSmiles as string) // #case-B-2
			}
		}
	},
)

/**
 * Methods
 */

function clearMolData() {
	molViewerStore.clear()
}

// Fetch molecule data from the API based on the identifier.
async function fetchMolDataByIdentifier(identifier: string | null = null) {
	// console.log('fetchMolData', identifier)
	if (!identifier) return

	let success = false
	loading.value = true
	loadingError.value = false
	loadingErrorMsg.value = ''

	try {
		const response = await moleculesApi.getMolData(identifier)
		if (response.status == 200) {
			// console.timeEnd('fetchMolData')

			// // #fetching-error
			// // To test error handling.
			// loadingError.value = true
			// loadingErrorMsg.value = 'Some status message'
			// loading.value = false
			// return

			// Update HTML
			molViewerStore.setMolData(response.data)
			success = true

			// If the molviewer is loaded directly with a smiles or inchi as
			// the identifier, we pre-loaded the visualisation data with a
			// separate API call. But for any other identifier, we need to
			// wait until we get the inchi back.
			if (!molViewerStore.sdf && molViewerStore.inchi) {
				fetchMolVizData(molViewerStore.inchi) // #case-B-3
			}
		} else {
			// Handle API errors.
			loadingError.value = true
			loadingErrorMsg.value = response.statusText
			console.error(loadingErrorMsg, response)
		}

		loading.value = false
	} catch (err) {
		// Catch-all error.
		console.error(loadingError.value, err)
	}
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

// TO BE REPLACES WITH STORE FUNCTION
// Fetch visualization data from the API.
// I.e. a 2D SVG and an SDF string with 3D coordinates.
async function fetchMolVizData(inchi_or_smiles: string) {
	// console.log('fetchMolVizData')
	try {
		// console.time('fetchMolVizData')
		const response = await moleculesApi.getMolVizData(inchi_or_smiles)
		if (response.status == 200) {
			// console.log(994, response.data)
			// console.timeEnd('fetchMolVizData')

			// This function will also be called with other identifiers,
			// in which case nothing happens.
			if (response.data.svg) {
				// console.log('fetchMolVizData')
				molViewerStore.setMolVizData(response.data.svg, response.data.sdf)
			}
		} else {
			console.error(response.statusText)
		}
	} catch (err) {
		// Catch-all error.
		console.error('Something went wrong fetching the molecule`s visualization data.', err)
	}
}

// Enrich molecule with RDKit data
function enrichMolecule() {
	console.log('E N R I C H')
}

// Toggle synonym truncation.
function toggleExpand(e: Event) {
	;(e.currentTarget as Element).classList.toggle('expand')
}
</script>

<style lang="scss" scoped>
/**
 * Layout
 */

#content-wrap {
	display: flex;
	gap: 0 40px;
}
#content-wrap .col-left {
	flex: 1 1;
	max-width: 100%;
	// max-width: calc(100% - 290px); // Enable this line to enable the right column. #enableright
}
#content-wrap .col-right {
	flex: 0 0 250px;
	background: fafafa;
}

/**
 * Visualization
 */

#mol-render {
	width: calc(100% + 32px);
	height: 300px;
	margin: -16px;
	margin-bottom: 40px;
	box-sizing: border-box;
	display: flex;
	gap: 4px;
	grid-column-start: 1;
	grid-column-end: 12;
}
#mol-render.headless {
	margin-bottom: 20px;
}
#mol-render > div:not(.fullscreen) {
	width: 50%;
	height: 100%;
	position: relative;
	max-height: 100%;
	border-radius: 3px;
	overflow: hidden;
}

// 2D molecule
#mol-render .container-2d {
	background: $soft-bg;
	display: flex;
	align-items: center;
	justify-content: center;
}
#mol-render .container-2d:deep() svg {
	max-width: 100%;
}
#mol-render .container-2d:deep() svg rect:first-child {
	display: none;
}

/**
 * Header
 */

#title-wrap {
	display: flex;
	margin-bottom: 16px;
}

// Molecule Icon
#title-wrap .v-align {
	margin-bottom: 10px;
	margin-right: 5px;
}
#title-wrap .icn-file-mol {
	margin-left: -4px;
}
#title-wrap .icn-file-mol.loading {
	animation: rotate 3s infinite linear;
}

// Title
#title-wrap h1.loading {
	opacity: 0.3;
}
#title-wrap h1.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}

// Filler
#title-wrap .filler {
	flex: 1;
}

// Pagination
#title-wrap .pagination {
	margin-left: 8px;
}

#identification div {
	margin-bottom: 4px;
}
#identification .blank {
	color: $black-30;
}

/**
 * Fail message
 */

#fetch-fail {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 40px 0;
}
#fetch-fail .status-msg {
	color: $black-30;
	font-size: $font-size-small;
	line-height: $line-height-small;
	margin-top: 4px;
}

/*
 * Synonyms
 */

#synonyms .synonyms-wrap {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0 20px;
}
#synonyms .synonyms-wrap div {
	// width is set dynamically, see synonymColWidth
	height: 22px;
	line-height: 22px;
	box-sizing: border-box;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* Toggle truncation */
#synonyms .flip-v {
	display: flex;
	flex-direction: column-reverse;
}
#synonyms .toggle-expand::before {
	content: 'Show all';
}
#synonyms .toggle-expand.expand::before {
	content: 'Minimize';
}
#synonyms .toggle-expand {
	height: 22px;
	line-height: 22px;
	margin-top: 10px;
}
#synonyms .toggle-expand:not(.expand) + .cloak {
	height: var(--truncated-height);
	overflow: hidden;
}

/*
 * Properties
 */

#properties .param-wrap {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	height: 200px;
	gap: 0 40px;
}
#properties .param-wrap > div {
	// width is set dynamically, see paramColWidth
	height: 22px;
	line-height: 22px;
	box-sizing: border-box;
	display: flex;
}
#properties .param-wrap div.empty {
	opacity: 0.3;
}
#properties .param-wrap > div .key {
	flex: 0 0 auto;
	padding-right: 4px;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 30px);
}
#properties .param-wrap > div .val {
	text-align: right;
	flex: 0 1 auto;
	padding-left: 4px;
	min-width: 0;
	// font-style: italic;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
#properties .param-wrap > div .filler {
	flex: 1 1;
	overflow: hidden;
}
#properties .param-wrap > div .filler::before {
	content: '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .';
	opacity: 0.3;
}

/*
 * Right Column
 */

#ip-notes {
	width: 100%;
	height: 200px;
	padding: 8px;
	box-sizing: border-box;
	border: solid 1px $black-10;
	border-radius: 3px;
	background: $soft-bg;
}

/**
 * Responsive
 */

@media (max-width: $bp-medium) {
	#content-wrap {
		flex-direction: column;
		gap: 40px 0;
	}
	#content-wrap .col-left {
		max-width: none;
	}
}
</style>
