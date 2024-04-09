<!-- 
	The molviewer can be loaded in three different contexts:
	- When opening a molecule file: /~/dopamine.mol.json -> ViewerDispatch.vue
	- Looking up a molecule by identifier: /mol/dopamine -> MolPage.vue -> MolFromIdentifier.vue
	- When opening a molecule from a molset: /mol/~/some_molset.molset.json?index=3 -> MolsetViewer.vue -> MolGrid.vue

	The context of the molviewer is acceible through the context prop.
 -->

<template>
	<!-- 
		When testing, make sure to always test the different context,
		going back and forth between the same and different contexts.
		The following links help with that.
	 -->
	<!-- <div style="display: flex; gap: 20px; margin-bottom: 50px">
		<router-link to="/~/_for_testing/mol_a.mol.json">context: file A</router-link>
		<router-link to="/~/_for_testing/mol_b.mol.json">context: file B</router-link>
		<router-link to="/mol/penguinone">context: identifier A</router-link>
		<router-link to="/mol/serotonin">context: identifier B</router-link>
		<router-link to="/~/_for_testing/molset_a.molset.json?show=1">context: molset A</router-link>
		<router-link to="/~/_for_testing/molset_b.molset.json?show=3">context: molset B</router-link>
	</div> -->

	<!-- Visualization -->
	<div id="mol-render" :class="{ headless: mainStore.headless }">
		<!--
				We could use the MolRender2D component to render the SVG in the frontend,
				the same way we do it in the MolGrid module. However, MolRender2D requires
				a SMILES string as input structure and rdkit-js doesn't let us convert
				InChI to SMILES, so when the identifier string is an InChI, we have to
				wait for the main fetchMolData API call to complete in order to get the
				SMILES, which results in a huge delay. So instead we fetch the SVG from
				the API together with the 3D data in a separate call, which is much faster.
			-->
		<!-- <div class="container-2d">
				<MolRender2D
					v-if="mol.identifiers.canonical_smiles"
					id="mol-svg"
					:structure="mol.identifiers.canonical_smiles.toString()"
					:width="300"
					:height="300"
					svg-mode
				/>
			</div> -->
		<div class="container-2d" v-html="molViewerStore.svg"></div>
		<MolRender3D :sdf="molViewerStore.sdf" :molName="molViewerStore.mol.identifiers?.name ?? ''" />
	</div>

	<!-- Page content -->
	<div id="content-wrap">
		<!-- Left main column -->
		<div class="col-left">
			<BreadCrumbsNot v-if="context == 'identifier'" :backto="{ name: 'mol' }">
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
						:icon="context == 'molset' ? 'icn-file-molset' : 'icn-file-mol'"
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
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="molViewerStore.enriched || mol?.identifiers?.inchikey">
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
					<div v-if="molViewerStore.enriched || mol?.identifiers?.canonical_smiles">
						<b v-copy-on-click :data-copy="`Canonical SMILES: ${mol?.identifiers?.canonical_smiles}`">Canonical SMILES: </b>
						<span v-if="mol?.identifiers?.canonical_smiles" id="data-canonical-smiles" v-copy-on-click>{{
							mol?.identifiers?.canonical_smiles
						}}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="molViewerStore.enriched || mol?.identifiers?.isomeric_smiles">
						<b v-copy-on-click :data-copy="`Isomeric SMILES: ${mol?.identifiers?.isomeric_smiles}`">Isomeric SMILES: </b>
						<span v-if="mol?.identifiers?.isomeric_smiles" id="data-isomeric-smiles" v-copy-on-click>{{
							mol?.identifiers?.isomeric_smiles
						}}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<div v-if="molViewerStore.enriched || mol?.identifiers?.formula">
						<b v-copy-on-click :data-copy="`Formula: ${mol?.identifiers?.formula}`">Formula: </b>
						<span v-if="mol?.identifiers?.formula" id="data-isomeric-smiles" v-copy-on-click>{{ mol?.identifiers?.formula }}</span>
						<span v-else class="blank">-</span>
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
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
						<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
					</div>
					<br />
					<cv-button
						v-if="!loading && !loadingError && !molViewerStore.enriched && !mol.identifiers?.cid"
						size="small"
						kind="secondary"
						@click="molViewerStore.enrichMolecule"
					>
						Enrich
					</cv-button>
				</div>

				<hr />

				<!-- Fetching status -->
				<BaseFetching v-if="loading && !loadingError" text="Fetching molecule data" :error="!!loadingError" />

				<!-- Fetching error -->
				<!-- To test, see #fetching-error below -->
				<div v-else-if="loadingError" id="fetch-fail" class="error-msg">
					<div>
						Something went wrong fetching the molecule data.
						<div class="status-msg" v-if="loadingError">
							{{ loadingError }}
						</div>
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

<script setup lang="ts">
// Vue
import { onBeforeUnmount, computed, watch } from 'vue'
import type { ComputedRef, WritableComputedRef } from 'vue'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const mainStore = useMainStore()
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import IconButton from '@/components/IconButton.vue'
import SvgServe from '@/components/SvgServe.vue'
import BaseFetching from '@/components/BaseFetching.vue'
import BasePagination from '@/components/BasePagination.vue'
import MolRender3D from '@/components/MolRender3D.vue'

// Utils
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { Mol, TempMol } from '@/types'

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
const mol: ComputedRef<Mol | TempMol> = computed(() => molViewerStore.mol)

// Path array for breadcrumbs
const pathArray: ComputedRef<string[]> = computed(() => {
	return props.context == 'molset'
		? fileStore.breadCrumbPathArray.concat(['mol #' + molViewerStore.molFromMolsetIndex?.toString()])
		: fileStore.breadCrumbPathArray
})

// Title
const molName: ComputedRef<string> = computed(() => {
	return mol.value?.identifiers?.name ? mol.value.identifiers.name : props.loading ? 'Loading' : 'Unnamed Molecule'
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

// Note: When opening molecule files, the data is loaded from
// within ViewerDispatch.vue -> molViewerStore.setMolData()

// When viewing molecule as JSON, and then returning to the molviewer,
// we need to reload the data.
if (molViewerStore.isEmpty && fileStore.data) {
	const data: Mol = fileStore.data
	molViewerStore.setMolData(data)
}

// When opening a molecule from a molset, the fetchMolVizData is called from within MolsetViewer.vue.
console.log('INIT')
if (props.context == 'file' || props.context == 'identifier') {
	if (molViewerStore.inchi) {
		// When opening a molecule file.
		molViewerStore.fetchMolVizData(molViewerStore.inchi)
	} else if (molViewerStore.smiles) {
		// When opening a molecule file.
		molViewerStore.fetchMolVizData(molViewerStore.smiles)
	}
}

/**
 * Hooks
 */

// Clear store on exit.
onBeforeUnmount(molViewerStore.clear)

/**
 * Methods
 */

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
