<template>
	<!-- Visualization -->
	<div id="mol-render" :class="{ headless: mainStore.headless }">
		<MolRender3D :pdb="mmolViewerStore.pdb" :molName="mmolViewerStore.id" />
	</div>

	<!-- Page content -->
	<div id="content-wrap">
		<!-- Left main column -->
		<div class="col-left">
			<BreadCrumbsNot v-if="context == 'identifier'" :backto="{ name: 'mol' }">
				<BaseIconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
			</BreadCrumbsNot>
			<BreadCrumbs v-else :pathArray="pathArray">
				<BaseIconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
			</BreadCrumbs>

			<!-- Title -->
			<div id="title-wrap">
				<div class="v-align">
					<BaseSvgServe class="icn-file-pdb" :class="{ loading: loading }" :icon="'icn-file-pdb'" size="large" />
				</div>
				<h2 id="data-id" data-val="{{ molId }}" :class="{ loading: loading }">
					{{ molId }}
				</h2>
				<div class="filler"></div>
				<BaseBookmark v-if="mmolViewerStore.mmol" :mol="mmolViewerStore.mmol" />
				<OverflowMenuMol :disabled="Boolean(loading)" />
				<BasePagination v-if="context == 'molset'" v-model="modelPagination" :total="molGridStore.total" />
				<BaseIconButton
					v-if="context == 'molset'"
					icon="icn-close"
					icnSize="small"
					btnStyle="carbon"
					@click="mmolViewerStore.setMmolFromMmolsetIndex(null)"
				/>
				<BaseIconButton
					v-else
					icon="icn-close"
					icnSize="small"
					btnStyle="default"
					@click="context == 'file' ? fileStore.exitViewer() : context == 'identifier' ? router.push({ name: 'mol' }) : null"
					:style="{ 'margin-right': '-8px' }"
				/>
			</div>

			<template v-if="mol">
				<!-- Header -->
				<div id="header">
					<!-- @{{ molViewerStore.enriched }}! -->

					<!-- Small molecule identifiers -->
					<div v-if="mmolViewerStore.enriched || mol?.identifiers?.inchi">
						<b v-copy-on-click :data-copy="`InChI: ${mol?.identifiers?.inchi}`">InChI: </b>
						<span v-if="mol?.identifiers?.inchi" id="data-inchi" v-copy-on-click>{{ mol?.identifiers?.inchi }}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mmolViewerStore.enriched || mol?.identifiers?.inchikey">
						<b v-copy-on-click :data-copy="`InChIKey: ${mol?.identifiers?.inchikey}`">InChIKey: </b>
						<span v-if="mol?.identifiers?.inchikey" id="data-inchikey" v-copy-on-click>{{ mol?.identifiers?.inchikey }}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mol?.identifiers?.smiles && (!mol?.identifiers?.canonical_smiles || mol?.identifiers?.isomeric_smiles)">
						<b v-copy-on-click :data-copy="`SMILES: ${mol?.identifiers?.smiles}`">SMILES: </b>
						<span id="data-smiles" v-copy-on-click>{{ mol?.identifiers?.smiles }}</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mmolViewerStore.enriched || mol?.identifiers?.canonical_smiles">
						<b v-copy-on-click :data-copy="`Canonical SMILES: ${mol?.identifiers?.canonical_smiles}`">Canonical SMILES: </b>
						<span v-if="mol?.identifiers?.canonical_smiles" id="data-canonical-smiles" v-copy-on-click>{{
							mol?.identifiers?.canonical_smiles
						}}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mmolViewerStore.enriched || mol?.identifiers?.isomeric_smiles">
						<b v-copy-on-click :data-copy="`Isomeric SMILES: ${mol?.identifiers?.isomeric_smiles}`">Isomeric SMILES: </b>
						<span v-if="mol?.identifiers?.isomeric_smiles" id="data-isomeric-smiles" v-copy-on-click>{{
							mol?.identifiers?.isomeric_smiles
						}}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mmolViewerStore.enriched || mol?.identifiers?.molecular_formula">
						<b v-copy-on-click :data-copy="`Formula: ${mol?.identifiers?.molecular_formula}`">Formula: </b>
						<span v-if="mol?.identifiers?.molecular_formula" id="data-isomeric-smiles" v-copy-on-click>{{
							mol?.identifiers?.molecular_formula
						}}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="mmolViewerStore.enriched || mol.identifiers?.cid">
						<b v-copy-on-click :data-copy="`PubChem CID: ${mol.identifiers.cid}`">PubChem CID: </b>
						<a
							v-if="mol?.identifiers?.cid"
							id="data-cid"
							:href="`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.identifiers?.cid}`"
							target="_blank"
							>{{ mol.identifiers.cid }}</a
						>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>

					<!-- Macromolecule identifiers -->
					<div v-if="mol?.identifiers?.fasta">
						<b v-copy-on-click :data-copy="`FASTA: ${mol?.identifiers?.fasta}`">FASTA: </b>
						<span v-if="mol?.identifiers?.fasta" id="data-fasta" v-copy-on-click>{{ mol?.identifiers?.fasta }}</span>
						<span v-else class="blank">-</span>
					</div>

					<template v-if="!loading && !loadingError">
						<!-- Enrich button -->
						<TheButtonEnrichMol v-if="!mmolViewerStore.isMacromol" />

						<!-- Save button -->
						<TheButtonSaveMol />
					</template>
				</div>

				<hr />

				<!-- Fetching status -->
				<BaseFetching v-if="loading && !loadingError" text="Fetching molecule data" :error="!!loadingError" />

				<!-- Fetching error -->
				<!-- To test, see #fetching-error below -->
				<div v-else-if="loadingError" id="fetch-fail">
					<div class="error-msg">Something went wrong fetching the molecule data.</div>
					<div class="status-msg" v-if="loadingError">
						{{ loadingError }}
					</div>
					<div>
						<cv-button kind="danger" size="field" @click="emit('retryLoad')">Retry</cv-button>
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
							<BaseFetching v-else-if="loading" :error="!!loadingError" />
							<template v-else>No synonyms available</template>
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
								:title="mmolViewerStore.propertiesString[key]"
								:class="{ empty: !val && val !== 0 }"
								:style="{ width: propColWidth }"
							>
								<div v-copy-on-click :data-copy="`${key}: ${val}`" class="key">{{ key }}:</div>
								<div class="filler"></div>
								<div v-copy-on-click class="val">{{ val || val === 0 ? val : '-' }}</div>
							</div>
						</div>
					</div>

					<hr v-if="showAnalysis" />
					<div v-if="showAnalysis && 'analysis' in mmolViewerStore.mmol" id="analysis">
						<h3>Analysis</h3>
						<div v-for="(item, i) in mmolViewerStore.mmol.analysis" :key="i" class="item">
							<details>
								<summary>
									<BaseSvgServe class="icn-closed" icon="icn-caret-right" />
									<BaseSvgServe class="icn-open" icon="icn-caret-down" />
									<b>{{ item.toolkit }}</b> / {{ item.function }}
								</summary>
								<!-- <b>Function:</b> {{ item.function }}<br /> -->
								<!-- <b>Plugin:</b> {{ item.toolkit }}<br /> -->
								<!-- <b>Input SMILES:</b> {{ item.smiles }}<br /> -->
								<!-- <b>Parameters:</b> {{ item.parameters }}<br /> -->
								<!-- <b>Results:</b><br /> -->
								<div v-for="(result, j) in item.results" :key="j" class="result">
									<div v-for="(val, key) in result" :key="key">
										<b v-copy-on-click :data-copy="`${key}: ${val}`">{{ key }}:</b> <span v-copy-on-click>{{ val }}</span>
										<br />
									</div>
								</div>
								<!-- {{ item }} -->
							</details>
						</div>
						<!-- <pre>{{ molViewerStore.mol.analysis }}</pre> -->
					</div>
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

<script setup lang="ts">
// Vue
import { onBeforeUnmount, computed } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMmolViewerStore } from '@/stores/MmolViewerStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const mmolViewerStore = useMmolViewerStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()
const modalStore = useModalStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import BaseBookmark from '@/components/BaseBookmark.vue'
import BaseSvgServe from '@/components/BaseSvgServe.vue'
import BaseFetching from '@/components/BaseFetching.vue'
import BasePagination from '@/components/BasePagination.vue'
import MolRender3D from '@/components/MolRender3D.vue'
import OverflowMenuMol from '@/components/OverflowMenuMol.vue'
import TheButtonSaveMol from '@/components/TheButtonSaveMol.vue'
import TheButtonEnrichMol from '@/components/TheButtonEnrichMol.vue'

// Type declarations
import type { Macromol } from '@/types'
import type { ComputedRef, WritableComputedRef } from 'vue'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// Props
const props = withDefaults(
	defineProps<{
		context?: 'file' | 'identifier' | 'molset' // See note on top of the file.
		loading?: boolean
		loadingError?: string
	}>(),
	{
		context: 'file',
	},
)

const emit = defineEmits(['retryLoad'])

// Definitions
const paramColMinWidth: number = 250
const synonymColMinWidth: number = 150

/**
 * Computed
 */

// Molecule data
const mol: ComputedRef<Macromol | TempMol> = computed(() => mmolViewerStore.mmol)

// Path array for breadcrumbs
const pathArray: ComputedRef<string[]> = computed(() => {
	return props.context == 'molset'
		? fileStore.breadCrumbPathArray.concat(['mol #' + mmolViewerStore.molFromMolsetIndex?.toString()])
		: fileStore.breadCrumbPathArray
})

// Title
const molId: ComputedRef<string> = computed(() => {
	if (props.loading) return 'Loading'
	return mmolViewerStore.id
})

// Pagination model
const modelPagination: WritableComputedRef<number> = computed({
	get: () => mmolViewerStore.mmolFromMmolsetIndex || 1,
	set: mmolViewerStore.setMmolFromMmolsetIndex,
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

// Whether to display the analysis section
const showAnalysis: ComputedRef<boolean> = computed(() => {
	return !!('analysis' in mmolViewerStore.mmol && mmolViewerStore.mmol['analysis'].length)
})

/**
 * Logic
 */

// Note: When opening molecule files, the data is loaded from
// within ViewerDispatch.vue -> molViewerStore.setMmolData()

// When viewing molecule as JSON, and then returning to the molviewer,
// we need to reload the data.
if (mmolViewerStore.isEmpty && fileStore.data && fileStore.moduleName == 'MolViewer') {
	const data: Macromol = fileStore.data
	mmolViewerStore.setMmolData(data)
}

// When opening a molecule from a molset, the fetchMolVizData is called from within MolsetViewer.vue.
if (props.context == 'file' || props.context == 'identifier') {
	if (mmolViewerStore.inchi) {
		// When opening a molecule file.
		mmolViewerStore.fetchMolVizData(mmolViewerStore.inchi)
	} else if (mmolViewerStore.smiles) {
		// When opening a molecule file.
		mmolViewerStore.fetchMolVizData(mmolViewerStore.smiles)
	}
}

/**
 * Hooks
 */

// Clear store on exit.
onBeforeUnmount(mmolViewerStore.clear)

// Block any exit attempt when there are unsaved changes.
window.onbeforeunload = function () {
	if (molGridStore.hasChanges) return true
	molGridStore.clear()
}
onBeforeRouteLeave(onBeforeExit)
onBeforeRouteUpdate(onBeforeExit)

/**
 * Methods
 */

// Toggle synonym truncation.
function toggleExpand(e: Event) {
	;(e.currentTarget as Element).classList.toggle('expand')
}

// Block route change when there are unsaved changes.
async function onBeforeExit(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
	// console.log('onBeforeExit MOL', molViewerStore.hasChanges)
	if (mmolViewerStore.molFromMolset) {
		// When we're looking at a molecule from a molset, we don't
		// do anything because MolSetViewer has its own onBeforeExit.
		// When you enrich or edit a molecule, saving it will update
		// the molset (either json or my-mols) which is all controlled
		// from TheButtonSaveMol.vue.
		next()
	} else if (mmolViewerStore.hasChanges) {
		await modalStore.alert('If you leave, all changes to this molecule will be lost.', {
			title: 'Unsaved molecule changes',
			primaryBtn: 'Stay',
			secondaryBtn: 'Discard',
			onCancel: () => {
				// We check for fullPath to include page changes.
				if (to.fullPath != from.fullPath) mmolViewerStore.clear()
				next()
			},
			onSubmit: () => next(false),
		})
	} else {
		// We check for path to exclude page changes.
		// Otherwise there's an ungly flicker when changing pages.
		if (to.path != from.path) mmolViewerStore.clear()
		next()
	}
}
</script>

<style lang="scss" scoped>
/**
 * Layout
 */

#content-wrap {
	display: flex;
	gap: 0 40px;
	margin-bottom: 64px;
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
	// width: 50%;
	flex: 1;
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
#title-wrap .icn-file-pdb {
	margin-left: -4px;
}
#title-wrap .icn-file-pdb.loading {
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

// Enrich & Save buttons
.btn-save,
.btn-enrich {
	margin-top: 16px;
	margin-right: 8px;
}

// Filler
#title-wrap .filler {
	flex: 1;
}

// Pagination
#title-wrap .pagination {
	margin-left: 8px;
}

#header div {
	margin-bottom: 4px;
}
#header .blank {
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

/**
 * Analysis
 */

// Item
#analysis .item {
	border-top: solid 1px $black-10;
	// white-space: pre;
	// border: solid 1px red;
}
#analysis .item:last-child {
	border-bottom: solid 1px $black-10;
}

// Summary
#analysis .item summary {
	min-height: 40px;
	list-style: none;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
}
#analysis .item details {
	margin: 8px 0;
}
#analysis .item details[open] summary {
	margin: 0 -24px;
}
#analysis .item details:not([open]) summary .icn-open,
#analysis .item details[open] summary .icn-closed {
	display: none;
}
#analysis .item details:not([open]) summary:hover,
#analysis .item details[open] {
	background: $black-03;
}

// Details
#analysis .item details[open] {
	padding: 24px;
	padding-top: 0;
}

#analysis .item .result {
	padding: 8px;
	border: solid 1px $black-10;
	// background: white;
}
#analysis .item .result:not(:last-child) {
	border-bottom: 0;
}
#analysis .item .result > div {
	// Truncate
	word-wrap: normal;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

/**
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
