<template>
	<!-- JSON-only view -->
	<!-- <template v-if="route.query.raw">
		<router-link :to="route.path">Exit JSON view</router-link>

		<BreadCrumbs v-if="isFile" :path="fileStore.path" />
		<pre>{{ mol }}</pre>
	</template> -->

	<!-- Input screen -->
	<div v-if="!isFile && (!props.identifier || loadingError)">
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
					placeholder="aspirin"
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
			<!-- Left -->
			<div class="col-left">
				<BreadCrumbs v-if="isFile" :path="fileStore.path" />
				<div id="title-wrap">
					<div class="icn-mol" :class="{ loading: loading }"></div>
					<h2 id="data-name" data-val="{{ molName }}" :class="{ loading: loading }">
						{{ molName }}
					</h2>

					<div id="btn-bookmark" class="icn-star" :class="{ hide: loading }"></div>
				</div>

				<!-- <router-link to="/molviewer/aspirin">aspirin</router-link> |
				<router-link to="/molviewer/ibuprofen">ibuprofen</router-link><br /><br /> -->

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
								v-if="loading"
								id="fetching-pubchem"
								:class="{ error: !!loadingError }"
								>Fetching</span
							>
							<span v-else-if="!!loadingError" class="error"
								>Failed to connect -
								<a href="#" @click="(e) => fetchMolData()">retry</a></span
							>
						</div>
						<!-- <div><router-link :to=""></router-link></div> -->
					</div>

					<br />
					<hr />
					<br />

					<div id="synonyms">
						<h3>Synonyms</h3>
						<div class="flip-v">
							<a href="#" class="toggle-expand hide" @click.prevent="toggleExpand"
								><span></span
							></a>
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

					<br />
					<hr />
					<br />

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

					<br />
					<hr />
					<br />

					<div id="analysis">
						<h3>Analysis</h3>
						Comin soon...
					</div>

					<br />
					<hr />
					<br />

					<a
						id="show-json"
						class="toggle-expand te-show"
						href="#"
						@click.prevent="toggleExpand"
					>
						JSON
					</a>
					<pre style="tab-size: 30px">{{ mol }}</pre>
				</template>
			</div>

			<!-- Right -->
			<div v-if="!loading" class="col-right">
				<h4>Notes</h4>
				<textarea id="ip-notes"></textarea>
			</div>
		</div>
	</template>

	<!-- <pre>{{ molViewerStore.mol }}</pre> -->
	<!-- <pre>{{ molViewerStore.sdf }}</pre> -->
</template>

<script setup lang="ts">
// Libraries
// import Miew from 'miew'
import Miew from '@/TEMP/miew/dist/miew.module'

// @ts-ignore
import * as $3Dmol from '3dmol/build/3Dmol.js'

// Vue
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

//
//

// Definitions
const props = defineProps<{ identifier?: string }>()
const $container3d = ref<Element | null>(null)
const loading = ref<Boolean>(false)
const loadingError = ref<String | false>(false)
const router = useRouter()
const route = useRoute()
const ipIdentifier = ref<String>('')
const mol = computed((): Mol | null => molViewerStore.mol)
const paramColMinWidth = 250
const synonymColMinWidth = 150

// Title
const molName = computed(() => {
	return mol.value?.identifiers?.name
		? mol.value.identifiers.name
		: loading.value
			? 'Loading'
			: 'Unnamed Molecule'
})

// The molviewer can be loaded directly or via a file path.
const isFile = computed(() => {
	return route.name == 'filebrowser' || route.name == 'headless-filebrowser'
})

// Synonyms
const synonymsHeight = computed(() => {
	const count = mol.value?.synonyms ? mol.value.synonyms.length : 0
	const height = Math.ceil(count / synonymColCount.value) * 22
	return `${height}px`
})
const synonymColCount = computed(() => {
	if (!mainStore.contentWidth) return 4
	return Math.floor(mainStore.contentWidth / synonymColMinWidth) || 1
})
const synonymColWidth = computed(() => {
	return `calc((100% - ${(synonymColCount.value - 1) * 20}px) / ${synonymColCount.value})`
})

// Parameters
const paramColCount = computed(() => {
	if (!mainStore.contentWidth) return 3
	return Math.floor(mainStore.contentWidth / paramColMinWidth) || 1
})
const paramColWidth = computed(() => {
	return `calc((100% - ${(paramColCount.value - 1) * 40}px) / ${paramColCount.value})`
})
const paramsHeight = computed(() => {
	const count = mol.value?.properties ? Object.keys(mol.value.properties).length : 0
	const height = Math.ceil(count / paramColCount.value) * 22
	return `${height}px`
})

//
//

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
		// A molecule file is opened --> fetch viz data.
		if (fileStore.data) {
			try {
				const molData = JSON.parse(fileStore.data)
				molViewerStore.setMolData(molData)
				fetchMolVizData()
				loading.value = false
			} catch (err) {
				console.error(err)
			}
		}
	} else if (props.identifier) {
		// Find mol by identifier --> load mol + viz data.
		fetchMolData()
	}
})

watch(
	() => props.identifier,
	(newVal) => {
		clearMolData()
		if (newVal) {
			fetchMolData(newVal)
		}
	},
)

function clearMolData() {
	if ($container3d.value) $container3d.value.innerHTML = ''
	molViewerStore.clearMol()
}

//
//

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
		inchi: 'InChI=1S/C9H8O4/c1-6(10)13-8-5-3-2-4-7(8)9(11)12/h2-5H,1H3,(H,11,12)',
		smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
		name: 'aspirin',
		inchikey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N',
		pid: '2244',
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

/**
 * Connect to the /enrich API endpoint to fetch
 * additional data about the molecule.
 */
async function fetchMolData(identifier: string | null = null) {
	let success = false
	loading.value = true
	loadingError.value = false
	identifier = identifier || props.identifier || null
	if (!identifier) return

	try {
		const response = await moleculesApi?.getMolData(identifier)
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

async function fetchMolVizData() {
	const inchi = molViewerStore.mol?.identifiers?.inchi
	if (!inchi) return
	try {
		const response = await moleculesApi?.getMolVizData(inchi)
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

async function init3DViewer() {
	if (!$container3d.value || !molViewerStore.sdf) return

	// Using 3DMol library - 3dmol.org
	// render3d_3DMol($container3d.value, molViewerStore.sdf)
	render3d_miew($container3d.value, molViewerStore.sdf)
}

// Using the Miew library - https://lifescience.opensource.epam.com/miew
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

// Using the 3DMol library - https://3dmol.org
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

function toggleExpand(e: Event) {
	;(e.currentTarget as Element).classList.toggle('expand')
}
</script>

<style lang="scss" scoped>
@import 'https://unpkg.com/miew@0.9.0/dist/Miew.min.css';
// @import 'carbon-components/css/carbon-components.css';
// @import 'carbon-components/scss/components/text-input/_text-input.scss';

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
// Carbom fix
#input-form .fields > div:deep(.bx--text-input) {
	height: 48px;
}
#input-form .fields > button {
	flex: 0;
}

/**
 * Toggle
 */
.flip-v {
	display: flex;
	flex-direction: column-reverse;
}
.toggle-expand::before {
	content: 'Show all';
}
.toggle-expand.expand::before {
	content: 'Minimize';
}
.toggle-expand.expand span {
	display: none;
}
.toggle-expand.hide {
	display: none;
}

/**
 * Icons
 */
.icn-star {
	width: 24px;
	height: 24px;
	background: url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.4483%202.40858C12.2649%202.03693%2011.735%202.03693%2011.5516%202.40857L8.7039%208.17905C8.63101%208.32675%208.49006%208.42908%208.32705%208.45264L1.96309%209.3725C1.55286%209.4318%201.38877%209.93582%201.68547%2010.2253L6.29184%2014.719C6.40961%2014.8339%206.46332%2014.9994%206.43547%2015.1615L5.34644%2021.5017C5.27629%2021.9101%205.70488%2022.2216%206.07174%2022.0289L11.7674%2019.0371C11.913%2018.9607%2012.0869%2018.9607%2012.2325%2019.0371L17.9282%2022.0289C18.295%2022.2216%2018.7236%2021.9101%2018.6535%2021.5017L17.5645%2015.1617C17.5366%2014.9995%2017.5904%2014.8339%2017.7084%2014.719L22.3142%2010.232C22.6111%209.94283%2022.4474%209.43877%2022.0373%209.37909L15.6725%208.45285C15.5097%208.42915%2015.369%208.32687%2015.2962%208.17933L12.4483%202.40858Z%22%20fill%3D%22%23D3BF0B%22%2F%3E%3C%2Fsvg%3E)
		center center no-repeat;
}
.icn-mol {
	width: 24px;
	height: 24px;
	background: url(data:image/svg+xml;utf8,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M7.30117%2019.79H16.6986L21.3981%2011.645L16.6986%203.5H7.30117L2.60165%2011.645L7.30117%2019.79ZM0.869873%2011.645L6.43487%2021.29H17.5649L23.1299%2011.645L17.5649%202H6.43487L0.869873%2011.645Z%22%20fill%3D%22%23333333%22%2F%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M5.19983%2011.6461L8.58983%205.75111L9.89015%206.49888L6.50015%2012.3939L5.19983%2011.6461Z%22%20fill%3D%22%23333333%22%2F%3E%3C%2Fsvg%3E)
		center center no-repeat;
}
.icn-mol.loading {
	animation: rotate 3s infinite linear;
}

/**
 * Grid
 */

#content-wrap {
	display: flex;
	gap: 0 40px;
}

#content-wrap .col-left {
	flex: 1 1;
	max-width: calc(100% - 290px);
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
	/* border: solid 1px pink; */
}

// 2D molecule
#mol-render .container-2d {
	background: var(--soft-bg);
}
#mol-render .container-2d:deep() svg rect {
	display: none;
}

// 3D molecule
#mol-render .container-3d {
	background: var(--soft-bg);
}
#mol-render .container-3d canvas {
	/* mix-blend-mode: screen; */
	outline: none;
}

/* Miew styling */
#mol-render .container-3d:deep() .atom-info {
	position: absolute;
	bottom: 0;
	left: 0;
	pointer-events: initial;
	color: var(--black-30);
}
#mol-render .container-3d:deep() .atom-info p {
	font-size: var(--font-size-small);
	margin: 0;
}

/* 3dmol styling */
#mol-render .mol-3d {
	background: var(--black);
}
#mol-render .mol-3d canvas {
	outline: none;
}

/* jmol styling */
.JSmolLoader {
	display: none;
}
/* #jmolApplet1_waitimage {
	display: none;
} */

/**
 * Header
 */
#title-wrap {
	display: flex;
	margin-bottom: 16px;
}
#title-wrap h1.loading {
	opacity: 0.3;
}
#title-wrap h1.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
#title-wrap .icn-mol,
#title-wrap .icn-star {
	width: 40px;
	height: 40px;
}
#title-wrap .icn-star.hide {
	display: none;
}
#title-wrap .icn-mol {
	margin-left: -8px;
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
@keyframes ellipsis {
	0% {
		content: '';
	}
	25% {
		content: '.';
	}
	50% {
		content: '..';
	}
	75% {
		content: '...';
	}
}

/*
 * Synonyms
 */

#synonyms .synonyms-wrap {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 0 20px;
}
#synonyms .synonyms-wrap div {
	height: 22px;
	line-height: 22px;
	box-sizing: border-box;
	// width: 25%; // Set dynamically, see synonymColWidth

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* Toggle */
#synonyms .toggle-expand {
	height: 22px;
	line-height: 22px;
	margin-top: 10px;
}
#synonyms .toggle-expand:not(.expand) + .cloak {
	height: 110px;
	overflow: hidden;
}

/*
 * Parameters
 */

#parameters .param-wrap {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	// margin-right: -40px;
	height: 200px;
	gap: 0 40px;
}
#parameters .param-wrap > div {
	height: 22px;
	line-height: 22px;
	// padding-right: 40px;
	box-sizing: border-box;
	display: flex;
	// width: calc(100% / 3); // Set dynamically, see paramColWidth
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
	// white-space: nowrap;
}

/*
 * Right Column
 */
#ip-notes {
	width: 100%;
	height: 200px;
	padding: 8px;
	box-sizing: border-box;
	border: solid 1px var(--black-10);
	border-radius: 3px;
	background: var(--soft-bg);
}

/* TEMP */

pre {
	/* grid-column-start: 1; */
	/* grid-column-end: 13; */
	/* white-space: pre-wrap; */
	font-family: 'Courier New', Courier, monospace;
	background: #fafafa;
	border: solid 1px rgba(0, 0, 0, 0.1);
	border-radius: 3px;
	padding: 16px;
	overflow-x: auto;
}
.toggle-expand.te-show:not(.expand) + pre {
	display: none;
}
.toggle-expand.te-show::before {
	content: 'Show ';
}
.toggle-expand.te-show.expand::before {
	content: 'Hide ';
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
