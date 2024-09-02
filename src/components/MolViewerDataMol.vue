<template>
	<!-- Identification -->
	<div id="identification">
		<!-- @{{ molViewerStore.enriched }}! -->

		<!-- Small molecule identifiers -->
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
			<span v-if="mol?.identifiers?.canonical_smiles" id="data-canonical-smiles" v-copy-on-click>{{ mol?.identifiers?.canonical_smiles }}</span>
			<span v-else class="blank">-</span>
			<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
		</div>
		<div v-if="molViewerStore.enriched || mol?.identifiers?.isomeric_smiles">
			<b v-copy-on-click :data-copy="`Isomeric SMILES: ${mol?.identifiers?.isomeric_smiles}`">Isomeric SMILES: </b>
			<span v-if="mol?.identifiers?.isomeric_smiles" id="data-isomeric-smiles" v-copy-on-click>{{ mol?.identifiers?.isomeric_smiles }}</span>
			<span v-else class="blank">-</span>
			<BaseFetching v-if="loading" text="" failText="x" :error="!!loadingError" />
		</div>
		<div v-if="molViewerStore.enriched || mol?.identifiers?.molecular_formula">
			<b v-copy-on-click :data-copy="`Formula: ${mol?.identifiers?.molecular_formula}`">Formula: </b>
			<span v-if="mol?.identifiers?.molecular_formula" id="data-isomeric-smiles" v-copy-on-click>{{
				mol?.identifiers?.molecular_formula
			}}</span>
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

		<!-- Macromolecule identifiers -->
		<!-- <div v-if="mol?.identifiers?.fasta">
			<b v-copy-on-click :data-copy="`FASTA: ${mol?.identifiers?.fasta}`">FASTA: </b>
			<span v-if="mol?.identifiers?.fasta" id="data-fasta" v-copy-on-click>{{ mol?.identifiers?.fasta }}</span>
			<span v-else class="blank">-</span>
		</div> -->

		<template v-if="!loading && !loadingError">
			<!-- Enrich button -->
			<TheButtonEnrichMol v-if="!molViewerStore.isMacromol" />

			<!-- Save button -->
			<TheButtonSaveMol />
		</template>
	</div>

	<hr />

	<!-- Fetching status -->
	<BaseFetching v-if="loading && !loadingError" text="Fetching molecule data" :error="!!loadingError" />

	<!-- Fetching error -->
	<!-- To test, see #fetching-error in TheMolFromIdentifier.vue -->
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
						<div v-for="(synonym, i) in mol?.synonyms" :key="i" :title="synonym" :style="{ width: synonymColWidth }" v-copy-on-click>
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

		<hr v-if="showAnalysis" />
		<div v-if="showAnalysis && 'analysis' in molViewerStore.mol" id="analysis">
			<h3>Analysis</h3>
			<div v-for="(item, i) in molViewerStore.mol.analysis" :key="i" class="item">
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

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Type declarations
import type { Mol, TempMol } from '@/types'
import type { ComputedRef } from 'vue'

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMainStore } from '@/stores/MainStore'
const molViewerStore = useMolViewerStore()
const mainStore = useMainStore()

// Components
import BaseFetching from '@/components/BaseFetching.vue'
import BaseSvgServe from '@/components/BaseSvgServe.vue'
import TheButtonSaveMol from '@/components/TheButtonSaveMol.vue'
import TheButtonEnrichMol from '@/components/TheButtonEnrichMol.vue'

// Props
defineProps<{
	loading?: boolean
	loadingError?: string
}>()

// Emits
const emit = defineEmits(['retryLoad'])

// Definitions
const paramColMinWidth: number = 250
const synonymColMinWidth: number = 150

/*
 * Computed
 */

// Molecule data
const mol: ComputedRef<Mol | TempMol> = computed(() => molViewerStore.mol)

// Whether to display the analysis section
const showAnalysis: ComputedRef<boolean> = computed(() => {
	return !!('analysis' in molViewerStore.mol && molViewerStore.mol['analysis'].length)
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

/*
 * Hooks
 */

/*
 * Methods
 */

// Toggle synonym truncation.
function toggleExpand(e: Event) {
	;(e.currentTarget as Element).classList.toggle('expand')
}
</script>

<style lang="scss" scoped>
/**
 * Header
 */

// Enrich & Save buttons
.btn-save,
.btn-enrich {
	margin-top: 16px;
	margin-right: 8px;
}

// Identification
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
</style>
