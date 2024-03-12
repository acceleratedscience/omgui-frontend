<template>
	<!-- JSON-only view -->
	<!--
		Note: this is only used when molviewer is loaded directly.
		When we're opening a file, there's general viewer override
		logic which lives in the fileStore, see fileTypeOverride.
	 -->
	<template v-if="route.query.use">
		<JsonViewer :data="mol" />
	</template>

	<!-- Input screen -->
	<div v-else-if="!isFile && (!props.identifier || loadingError)">
		<h3>Display any molecule</h3>
		<p>
			Accepted identifiers are:
			<b><a href="#" @click.prevent="(e) => fillIn('inchi')">InChI</a></b>
			or <b><a href="#" @click.prevent="(e) => fillIn('smiles')">SMILES</a></b
			>.<br />
			When a molecule is listed on PubChem, you can also use its
			<b><a href="#" @click.prevent="(e) => fillIn('name')">name</a></b
			>, <b><a href="#" @click.prevent="(e) => fillIn('inchikey')">InChIKey</a></b> or
			<b><a href="#" @click.prevent="(e) => fillIn('pid')">PID</a></b
			>.
		</p>
		<form id="input-form" @submit.prevent="displayMol">
			<div v-if="loadingError" class="error-msg">{{ loadingError }}</div>
			<div class="fields">
				<cv-text-input
					v-model="ipIdentifier"
					type="text"
					placeholder="dopamine"
					:hide-label="true"
				/>
				<cv-button size="default" :disabled="!!loading">{{
					loading ? 'Loading...' : 'Display'
				}}</cv-button>
			</div>
		</form>
	</div>

	<!-- Molecule viewer -->
	<template v-else>
		<div id="mol-render" :class="{ headless: mainStore.headless }">
			<div class="container-2d" v-html="molViewerStore.svg"></div>
			<div class="container-3d" ref="$container3d"></div>
		</div>

		<div id="content-wrap">
			<!-- Left main column -->
			<div class="col-left">
				<BreadCrumbs v-if="isFile" :path="fileStore.path" />
				<div id="title-wrap">
					<div class="v-align">
						<SvgServe
							class="icn-file-mol"
							:class="{ loading: loading }"
							filename="icn-file-mol"
							size="large"
						/>
					</div>
					<h2 id="data-name" data-val="{{ molName }}" :class="{ loading: loading }">
						{{ capitalize(molName) }}
					</h2>
					<IconButton v-if="!loading" icon="icn-star" colorOn="#d3bf0b" />
				</div>

				<template v-if="mol">
					<div id="identification">
						<div>
							<b>InChI: </b>
							<span id="data-inchi">{{ mol?.identifiers?.inchi }}</span>
						</div>
						<div>
							<b>InChIKey: </b>
							<span id="data-inchikey">{{ mol?.identifiers?.inchikey }}</span>
						</div>
						<div>
							<b>Canonical SMILES: </b>
							<span id="data-canonical-smiles">{{
								mol?.identifiers?.canonical_smiles
							}}</span>
						</div>
						<div>
							<b>Isomeric SMILES: </b>
							<span id="data-isomeric-smiles">{{
								mol?.identifiers?.isomeric_smiles
							}}</span>
						</div>
						<div>
							<b>Formula: </b>
							<span id="data-isomeric-smiles">{{ mol?.identifiers?.formula }}</span>
						</div>
						<div>
							<b>PubChem CID: </b>
							<a
								v-if="mol?.identifiers?.cid"
								id="data-cid"
								:href="`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.identifiers.cid}`"
								target="_blank"
								>{{ mol.identifiers.cid }}</a
							>
							<span
								v-else-if="loading"
								id="fetching-pubchem"
								:class="{ error: !!loadingError }"
								>Fetching</span
							>
							<span v-else-if="!!loadingError" class="error"
								>Failed to connect -
								<a href="#" @click="(e) => fetchMolData()">retry</a></span
							>
						</div>
						<br />
						<router-link to="?use=json" class="dumb">Show JSON</router-link>
					</div>

					<hr />

					<div id="synonyms" :style="{ '--truncated-height': truncatedSynonymsHeight }">
						<h3>Synonyms</h3>
						<div class="flip-v">
							<a
								v-if="truncateSynonyms"
								href="#"
								class="toggle-expand"
								@click.prevent="toggleExpand"
							></a>
							<template v-else-if="mol?.synonyms?.length === 0"
								>This molecule does not have any synonyms.</template
							>
							<div class="cloak">
								<div class="synonyms-wrap" :style="{ height: synonymsHeight }">
									<div
										v-for="(synonym, i) in mol?.synonyms"
										:key="i"
										:title="synonym"
										:style="{ width: synonymColWidth }"
									>
										{{ synonym }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr />

					<div id="parameters">
						<h3>Parameters</h3>
						<div class="param-wrap" :style="{ height: paramsHeight }">
							<div
								v-for="(val, key) in mol?.properties"
								:key="key"
								:title="molViewerStore.propertiesString[key]"
								:class="{ empty: !val && val !== 0 }"
								:style="{ width: paramColWidth }"
							>
								<div class="key">{{ key }}:</div>
								<div class="filler"></div>
								<div class="val">{{ val || val === 0 ? val : '-' }}</div>
							</div>
						</div>
					</div>

					<hr />

					<div id="analysis">
						<h3>Analysis</h3>
						Coming soon...
					</div>
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
// Libraries
// import Miew from 'miew'
// @ts-ignore
import Miew from '@/TEMP/miew/dist/miew.module' // https://github.com/epam/miew/issues/524
import '@/TEMP/miew/dist/miew.min.css'
// @ts-ignore
import * as $3Dmol from '3dmol/build/3Dmol.js'

// Vue
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed, watch } from 'vue'
import type { ComputedRef } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore, type Mol } from '@/stores/MolViewerStore'
const mainStore = useMainStore()
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()

// API
import { moleculesApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import JsonViewer from '@/modules/JsonViewer.vue'
import IconButton from '@/components/IconButton.vue'
import SvgServe from '@/components/SvgServe.vue'

// Util
import { capitalize } from '@/utils/helpers'

// Definitions
const props = defineProps<{ identifier?: string }>()
const $container3d = ref<Element | null>(null)
const loading = ref<Boolean>(false)
const loadingError = ref<String | false>(false)
const ipIdentifier = ref<String>('')
const paramColMinWidth = 250
const synonymColMinWidth = 150

/**
 * Computed
 */

// Molecule data
const mol: ComputedRef<Mol | null> = computed(() => molViewerStore.mol)

// Title
const molName: ComputedRef<string> = computed(() => {
	return mol.value?.identifiers?.name
		? mol.value.identifiers.name
		: loading.value
			? 'Loading'
			: 'Unnamed Molecule'
})

// Detect how the molecule viewer was opened:
// - Viewing a file: /~/dopamine.mol.json
// - Directly: /molviewer/dopamine
const isFile: ComputedRef<boolean> = computed(() => {
	return route.name == 'filebrowser' || route.name == 'headless-filebrowser'
})

// Synonyms
const synonymCount: ComputedRef<number> = computed(() => {
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

// Parameters
const paramColCount: ComputedRef<number> = computed(() => {
	if (!mainStore.contentWidth) return 3
	return Math.floor(mainStore.contentWidth / paramColMinWidth) || 1
})
const paramColWidth: ComputedRef<string> = computed(() => {
	return `calc((100% - ${(paramColCount.value - 1) * 40}px) / ${paramColCount.value})`
})
const paramsHeight: ComputedRef<string> = computed(() => {
	const count = mol.value?.properties ? Object.keys(mol.value.properties).length : 0
	const height = Math.ceil(count / paramColCount.value) * 22
	return `${height}px`
})

/**
 * Hooks
 */

onMounted(async () => {
	// When toggling headless mode, we need to re-render the 3D molecule.
	if (molViewerStore.mol && molViewerStore.sdf) {
		init3DViewer()
	}
})

onBeforeMount(async () => {
	// When toggling headless mode, we don't wanna reload the molecule.
	if (molViewerStore.mol && molViewerStore.sdf) return

	if (isFile.value) {
		// A molecule file is opened --> only fetch viz data.
		if (fileStore.data) {
			try {
				const molData = JSON.parse(fileStore.data)
				// molData.synonyms = [] // For testing truncation
				molViewerStore.setMolData(molData)
				fetchMolVizData()
				loading.value = false
			} catch (err) {
				console.error(err)
			}
		}
	} else if (props.identifier) {
		// When the molecule viewer is launched from the CLI or Jupyter
		// (by `display molecule dopamine` for example), we calculate some
		// of the molecule data in the backend and pass it to the frontend
		// as the ?data= query parameter. This allows us to display some
		// more molecule data while we wait for the rest of the molecule
		// to be fetched. See mol_commands.py > show_mol() in backend repo.
		//
		// To do: we should implement RDKit in the frontend so we can always
		// display identifiers and visualisation before the API returns.
		if (route.query.data) {
			const preliminaryData = JSON.parse(route.query.data as string)
			if (preliminaryData) {
				const { mol, svg, sdf } = preliminaryData
				if (mol) molViewerStore.setMolData(mol)
				if (svg) molViewerStore.setMolVizData(svg, sdf)
			}
		}

		// Find mol by identifier --> load mol + fetch viz data.
		fetchMolData()
	}
})

// Clear store on exit.
onBeforeUnmount(clearMolData)

// Update data when going from one mol to another.
watch(
	() => props.identifier,
	(newVal) => {
		clearMolData()
		if (newVal) {
			fetchMolData(newVal)
		}
	},
)

/**
 * Methods
 */

function clearMolData() {
	if ($container3d.value) $container3d.value.innerHTML = ''
	molViewerStore.clearMol()
}

// Pre-fill the input screen form.
function fillIn(idKey: string) {
	type Identifiers = {
		inchi: string
		smiles: string
		name: string
		inchikey: string
		pid: string
		[key: string]: string
	}

	const identifiers: Identifiers = {
		inchi: 'InChI=1S/C10H14O/c1-7-5-9(11)6-8(2)10(7,3)4/h5-6H,1-4H3',
		smiles: 'CC1=CC(=O)C=C(C1(C)C)C',
		name: 'penguinone',
		inchikey: 'RHIYIMQPIGYWEK-UHFFFAOYSA-N',
		pid: '12564106',
	}
	ipIdentifier.value = identifiers[idKey]
}

// Display a molecule based on user input identifier.
async function displayMol() {
	if (ipIdentifier.value) {
		const success = await fetchMolData(ipIdentifier.value.toString())
		if (success) {
			router.push({
				name: 'molviewer',
				params: { identifier: ipIdentifier.value.toString() },
			})
		}
	}
}

// Fetch molecule data from the API based on teh identifier.
async function fetchMolData(identifier: string | null = null) {
	identifier = identifier || props.identifier || null
	if (!identifier) return

	let success = false
	loading.value = true
	loadingError.value = false

	try {
		const response = await moleculesApi.getMolData(identifier)
		if (response.status == 200) {
			// Update HTML
			molViewerStore.setMolData(response.data)
			fetchMolVizData()
			success = true
		} else {
			// Handle API errors.
			loadingError.value = response.statusText
			console.error(loadingError.value, response)
			ipIdentifier.value = props.identifier || ''
		}

		loading.value = false
	} catch (err) {
		// Catch-all error.
		loadingError.value = 'Something went wrong fetching the molecule data.'
		console.error(loadingError.value, err)
		ipIdentifier.value = props.identifier || ''
	}
	return success
}

// Fetch visualization data from the API.
// I.e. a 2D SVG and an SDF string with 3D coordinates.
async function fetchMolVizData() {
	const inchi = molViewerStore.mol?.identifiers?.inchi
	if (!inchi) return
	try {
		const response = await moleculesApi.getMolVizData(inchi)
		if (response.status == 200) {
			molViewerStore.setMolVizData(response.data.svg, response.data.sdf)
			init3DViewer()
		} else {
			console.error(response.statusText)
		}
	} catch (err) {
		// Catch-all error.
		console.error('Something went wrong fetching the molecule`s visualization data.', err)
	}
}

// Render 3D molecule.
async function init3DViewer() {
	if (!$container3d.value || !molViewerStore.sdf) return

	// Using 3DMol library - 3dmol.org
	// render3d_3DMol($container3d.value, molViewerStore.sdf)
	render3d_miew($container3d.value, molViewerStore.sdf)
}

// 3D mol A --> Using the Miew library - https://lifescience.opensource.epam.com/miew
function render3d_miew($container: Element, sdf: string) {
	const viewer = new Miew({
		container: $container as HTMLDivElement,
		// Required for the molecule data without residues, because default mode, Cartoon, visualizes residues.
		// https://github.com/epam/miew/blob/25fea24038de937cd142049ec77b27bc1866001a/packages/lib/examples/load_from_string.html
		// reps: [
		// 	{
		// 		mode: 'BS',
		// 		colorer: 'EL',
		// 		material: 'DF',
		// 	},
		// ],
		settings: {
			// https://github.com/epam/miew/blob/25fea24038de937cd142049ec77b27bc1866001a/packages/lib/src/settings.js`
			axes: false,
			fps: false,
			// autoRotation: -0.03,
			// @ts-ignore
			bg: { color: 0xffffff, transparent: true },
		},
	})
	if (viewer.init()) {
		viewer.run()
		viewer.load(sdf, { sourceType: 'immediate', fileType: 'sdf' })
	}
}

// 3D mol B --> Using the 3DMol library - https://3dmol.org
// Doesn't have balls-and-stick visualization, only stick.
function render3d_3DMol($container: Element, sdf: string) {
	const config = { backgroundColor: 0xffffff, backgroundAlpha: 0 }
	const viewer = $3Dmol.createViewer($container, config)
	viewer.addModel(sdf, 'sdf')

	// Check styling options: https://3dmol.org/tests/example.html
	// More advances visualizing: https://3dmol.org/viewer.html?pdb=1YCR&select=chain:A&style=cartoon;stick&select=chain:B&style=line;sphere&select=resi:19,23,26;chain:B&style=stick;sphere&select=resi:19,23,26;chain:B&labelres=backgroundOpacity:0.8;fontSize:14
	viewer.setStyle({}, { stick: {} })
	// viewer.setStyle({}, { sphere: {} })
	// viewer.setStyle({ hetflag: false }, { cartoon: {} })
	// viewer.addSurface(
	// 	$3Dmol.SurfaceType.MS,
	// 	{
	// 		map: { prop: 'partialCharge', scheme: new $3Dmol.Gradient.RWB(-0.6, 0.6) },
	// 		opacity: 0.85,
	// 	},
	// 	{ chain: 'B' },
	// 	{ chain: 'B' },
	// )
	// viewer.addSurface(
	// 	$3Dmol.SurfaceType.VDW,
	// 	{},
	// 	{ hetflag: false, chain: 'A' },
	// 	{ hetflag: false, chain: 'A' },
	// )
	viewer.zoomTo()
	viewer.render()
	// _colorSS(viewer)

	// function _colorSS(viewer) {
	// 	var m = viewer.getModel()
	// 	m.setColorByFunction({}, function (atom) {
	// 		// console.log(atom, atom.elem, atom.capDrawn, atom.hetflag, atom.bonds, atom.bondOrder)
	// 		if (atom.elem == 'O') return 'red'
	// 		else if (atom.elem == 'C') return 'yellow'
	// 		else return 'gray'
	// 	})
	// 	viewer.render()
	// }
}

// Toggle synonym truncation.
function toggleExpand(e: Event) {
	;(e.currentTarget as Element).classList.toggle('expand')
}
</script>

<style lang="scss" scoped>
/**
 * Input screen
 */

#input-form .fields {
	display: flex;
	gap: 8px;
}
#input-form .fields > div {
	flex: 1;
}
// Carbon fix
#input-form .fields > div:deep(.bx--text-input) {
	height: 48px;
}
#input-form .fields > button {
	flex: 0;
}
#input-form .error-msg {
	margin-bottom: 10px;
}

/**
 * Layout
 */

#content-wrap {
	display: flex;
	gap: 0 40px;
}
#content-wrap .col-left {
	flex: 1 1;
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
#mol-render > div {
	width: 50%;
	height: 100%;
	position: relative;
	max-height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 3px;
	overflow: hidden;
}

// 2D molecule
#mol-render .container-2d {
	background: $soft-bg;
}
#mol-render .container-2d:deep() svg rect {
	display: none;
}

// 3D molecule
#mol-render .container-3d {
	background: $soft-bg;
}
#mol-render .container-3d canvas {
	outline: none;
}

// Miew styling
#mol-render .container-3d:deep() .atom-info {
	position: absolute;
	bottom: 0;
	left: 0;
	pointer-events: initial;
	color: $black-30;
}
#mol-render .container-3d:deep() .atom-info p {
	font-size: $font-size-small;
	margin: 0;
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
#title-wrap h1.loading {
	opacity: 0.3;
}
#title-wrap h1.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
#identification div {
	margin-bottom: 4px;
}

/* PubChem loader */
#fetching-pubchem {
	color: #999;
	font-style: italic;
}
#fetching-pubchem.error {
	color: #d00;
}
#fetching-pubchem:not(.error)::after {
	content: '';
	animation: ellipsis 800ms infinite;
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
 * Parameters
 */

#parameters .param-wrap {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	height: 200px;
	gap: 0 40px;
}
#parameters .param-wrap > div {
	// width is set dynamically, see paramColWidth
	height: 22px;
	line-height: 22px;
	box-sizing: border-box;
	display: flex;
}
#parameters .param-wrap div.empty {
	opacity: 0.3;
}
#parameters .param-wrap > div .key {
	flex: 0 0 auto;
	padding-right: 4px;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 30px);
}
#parameters .param-wrap > div .val {
	text-align: right;
	flex: 0 1 auto;
	padding-left: 4px;
	min-width: 0;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
#parameters .param-wrap > div .filler {
	flex: 1 1;
	overflow: hidden;
}
#parameters .param-wrap > div .filler::before {
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
