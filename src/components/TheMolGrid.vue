<!-- 
	Note: never import this MolGrid component directly, always
	import MolViewer instead, which handles the opening of molecules.
 -->
<template>
	<TheMolProps />
	<TheMolGridActions />
	<div id="resp-container">
		<div id="mol-grid" ref="$molGrid" :class="{ 'sel-mode': molGridStore.hasSel }">
			<div
				v-for="(mol, i) in molGridStore.mols"
				:key="i"
				class="mol"
				:class="{
					focus: mol.index! == molGridStore.focus,
					sel: molGridStore.sel?.includes(mol.index!),
				}"
				@click="(e) => onMolClick(e, mol.index!)"
			>
				<cv-checkbox :label="`${mol.index!}`" :value="`${mol.index!}`" :checked="molGridStore.sel.includes(mol.index!)" />
				<MolRender2D
					:id="`mol-svg-${mol.index!}`"
					:structure="molGridStore.molSmiles[i] || ''"
					:sub-structure="molGridStore.highlight || ''"
					:width="190"
					:height="140"
					svg-mode
				/>
				<template v-if="molGridStore.molSmiles[i]">
					<BaseBookmark :mol="mol" />
					<BaseIconButton icon="icn-smell" btnStyle="soft" @click="nothingSelected() ? previewMolecule(i) : null" />
					<BaseIconButton
						icon="icn-taste"
						btnStyle="soft"
						@click="nothingSelected() ? molViewerStore.setMolFromMolsetIndex(mol.index!) : null"
					/>
				</template>
				<div class="filler"></div>

				<!-- prettier-ignore -->
				<template v-if="1">
					<!-- Identifiers -->
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('name') && mol?.identifiers?.name" class="idfr name" title="name">{{ mol.identifiers.name }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('inchi') && mol?.identifiers?.inchi" class="idfr" title="InChI">{{ mol.identifiers.inchi }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('inchikey') && mol?.identifiers?.inchikey" class="idfr" title="InChIKey">{{ mol.identifiers.inchikey }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('isomeric_smiles') && mol?.identifiers?.isomeric_smiles" class="idfr" title="isomeric SMILES">{{ mol.identifiers.isomeric_smiles }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('canonical_smiles') && mol?.identifiers?.canonical_smiles" class="idfr" title="canonical SMILES">{{ mol.identifiers.canonical_smiles }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('smiles') && mol?.identifiers?.smiles" class="idfr" title="SMILES">{{ mol.identifiers.smiles }}</div>
					<div v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('molecular_formula') && mol?.identifiers?.molecular_formula" class="idfr formula" title="formula">{{ mol.identifiers.molecular_formula }}</div>
					<a v-click-to-copy="nothingSelected" v-if="molGridStore.showIdentifiers.includes('cid') && mol?.identifiers?.cid" :href="`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.identifiers.cid}`" target="_blank" class="idfr" title="PubChem CID">{{ mol.identifiers.cid }}</a>
				</template>

				<!-- prettier-ignore -->
				<div v-if="molGridStore.showProps.length" class="props-wrap">
					<!-- Properties -->
					<template v-for="(key, i) in molGridStore.showProps" :key="i">
						<div class="prop" :title="`${key}:\n${mol.properties[key] || mol.properties[key] === 0 ? mol.properties[key] : '-'}`">
							<div class="key" @click="molGridStore.setSort(key)">{{ cleanKeys(key) }}</div>
							<div v-click-to-copy="nothingSelected" class="value" :class="{ empty: !mol.properties[key] && mol.properties[key] !== 0 }">
								{{ mol.properties[key] || mol.properties[key] === 0 ? mol.properties[key] : '-' }}
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import type { ComputedRef } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const molGridStore = useMolGridStore()
const molViewerStore = useMolViewerStore()
const modalStore = useModalStore()

// Components
import TheMolProps from '@/components/TheMolProps.vue'
import MolRender2D from '@/components/MolRender2D.vue'
import TheMolGridActions from '@/components/TheMolGridActions.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import BaseBookmark from '@/components/BaseBookmark.vue'

// Utils
import { cleanKeys } from '@/utils/helpers'
import { isValidMolString } from '@/utils/rdkit-helpers'

// Type declarations
type KeyHandlers = {
	[key: string]: () => void
}

// Definitions
const $molGrid = ref<HTMLElement | null>(null)

// Props
const props = defineProps<{
	// Cache is always cleared when leaving the molgrid,
	// either when opening molset files or when checking my-mols.
	// However when a molset is opened by its cacheId (/molset/1234),
	// then the cache is retained when opening a molecule in the molset.
	retainCache?: boolean
}>()

/**
 * Computed
 */

const columns: ComputedRef<number | null> = computed(() => {
	const $mol = $molGrid.value?.querySelector('.mol')
	if (!$molGrid.value || !$mol) return null
	return Math.round($molGrid.value.clientWidth / $mol.clientWidth)
})

/**
 * Logic
 * - - -
 * Note: Data is loaded into the store via ViewerDispatch.vue
 */

/**
 * Hooks
 */

onMounted(async () => {
	// Add keyboard shortcuts.
	document.addEventListener('keydown', onKeyDown)

	// Add blur listener.
	mainStore.setOnClickAnywhere(maybeBlur)

	// If we're sorting by a non-default property,
	// we need to activate it in the store.
	if (route.query.sort && !['index', '-index'].includes(route.query.sort as string)) {
		molGridStore.enableProp(route.query.sort.toString())
	}
})

onBeforeUnmount(() => {
	// Remove key handlers.
	document.removeEventListener('keydown', onKeyDown)

	// Remove blur listener.
	mainStore.unsetOnClickAnywhere()
})

/**
 * Methods
 */

let lastSelectedRowIndex = ref<number | null>(null)
let lastSelectedItemSelState = ref<boolean | null>(null)

function onMolClick(e: MouseEvent, i: number) {
	// Abort molecule selection when the target has its own click handler.
	const ignoreTarget =
		(e.target as HTMLElement).classList.contains('idfr') ||
		(e.target as HTMLElement).classList.contains('key') ||
		(e.target as HTMLElement).classList.contains('value') ||
		(e.target as HTMLElement).classList.contains('icn-btn')

	// console.log(2222, ignoreTarget)
	if (!molGridStore.hasSel && ignoreTarget) return

	// Select and focus clicked molecule.
	molGridStore.toggleSel(i)
	molGridStore.setFocus(i)

	// Convert absolute index to display index.
	const displayIndex = molGridStore.getDisplayIndex(i)
	if (displayIndex === null) return

	// Store the current display index.
	const currentItemIndex = displayIndex

	// Batch select with shift
	if (e.shiftKey && lastSelectedItemSelState.value != null) {
		if (molGridStore.hasSel && lastSelectedRowIndex.value !== null) {
			let lowIndex = Math.min(lastSelectedRowIndex.value, currentItemIndex)
			let highIndex = Math.max(lastSelectedRowIndex.value, currentItemIndex)

			// Create array with selected range indices.
			const range = []
			for (let i = lowIndex; i < highIndex; i++) {
				range.push(molGridStore.matchingIndices[i])
			}

			if (lastSelectedItemSelState.value) {
				molGridStore.addSel(range)
			} else {
				molGridStore.removeSel(range)
			}
		}
	} else {
		lastSelectedItemSelState.value = molGridStore.sel.includes(i)
	}

	lastSelectedRowIndex.value = currentItemIndex
}

// Validator that disables the click-to-copy feature when items are selected.
function nothingSelected() {
	return !molGridStore.hasSel
}

// Registrer blur event when clicked outside of the molecule grid.
function maybeBlur(e: MouseEvent) {
	if ((e.target as HTMLElement).closest('.mol')) return
	molGridStore.unsetFocus()
}

// Display dialog with molecule properties.
function previewMolecule(i: number) {
	const mol = molGridStore.mols ? molGridStore.mols[i] : null
	if (mol) {
		modalStore.display('ModalMolPreview', mol)
	}
}

/**
 * Keyboard functions
 */

function onKeyDown(e: KeyboardEvent) {
	// Check if there's any input in focus
	if (document.activeElement?.tagName == 'INPUT') return
	if (document.activeElement?.tagName == 'TEXTAREA') return

	// Listen
	if (e.key in keyHandlers) {
		keyHandlers[e.key]()
		e.preventDefault()
	}
}

const keyHandlers: KeyHandlers = {
	ArrowLeft: () => {
		let i = molGridStore.focus
		if (i === null) return
		i = i - 1 < 0 ? i : i - 1
		molGridStore.setFocus(i)
	},
	ArrowRight: () => {
		let i = molGridStore.focus
		if (i === null || !molGridStore.mols) return
		i = i + 1 > molGridStore.mols.length - 1 ? i : i + 1
		molGridStore.setFocus(i)
	},
	ArrowUp: () => {
		let i = molGridStore.focus
		if (i === null || !columns.value) return
		i = i - columns.value < 0 ? i : i - columns.value
		molGridStore.setFocus(i)
	},
	ArrowDown: () => {
		let i = molGridStore.focus
		if (i === null || !columns.value || !molGridStore.mols) return
		i = i + columns.value > molGridStore.mols.length - 1 ? i : i + columns.value
		molGridStore.setFocus(i)
	},
	Enter: () => {
		let i = molGridStore.focus
		if (i === null) return
		molGridStore.toggleSel(i)
	},
	Escape: () => {
		if (molGridStore.focus) {
			molGridStore.unsetFocus()
		} else {
			molGridStore.deselectAll(true)
		}
	},
}
</script>

<style lang="scss" scoped>
// Wrapper
#mol-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: -1px;
}

/**
 * Molecule cell
 */

#mol-grid .mol {
	flex: 0 0 calc(100% / 6);
	border: solid 1px $black-10;
	padding: 8px;
	padding-top: 24px; // Avoid overlap with SVG
	margin-right: -1px;
	margin-bottom: -1px;
	background: #fff;
	overflow: hidden; // <-- Curveball: required for text inside to be truncated.
	position: relative;
	cursor: pointer;
	user-select: none;
	display: flex;
	flex-direction: column;
}
#mol-grid .mol .filler {
	flex: 1;
}

// Selection state
#mol-grid .mol.sel {
	border: solid 1px $blue;
	z-index: 1;
	background: $blue-10;
}

// Focus state
#mol-grid .mol.focus {
	border: solid 1px $black-60;
	box-shadow:
		inset 0 0 0 1px $black-60,
		0 0 0 1px $black-60;
	z-index: 2;
}
#mol-grid .mol.sel.focus {
	border-color: $blue;
	box-shadow:
		inset 0 0 0 1px $blue,
		0 0 0 1px $blue;
}

// Checkbox
#mol-grid .mol .cv-checkbox {
	position: absolute;
	top: 3px;
	left: 3px;
	pointer-events: none;
}

// Icons
#mol-grid .mol .icn-btn {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1;
	// background: pink;
}
#mol-grid .mol .icn-bookmark {
	top: 0;
}
#mol-grid .mol .icn-smell {
	top: 40px;
}
#mol-grid .mol .icn-taste {
	top: 80px;
}
#mol-grid .mol .icn-btn::after {
	content: '';
	display: block;
	position: absolute;
	z-index: -1;
	top: -5px;
	left: -5px;
	right: -5px;
	bottom: -5px;
	background: white;
	// background: red;
	border-radius: 20px;
	filter: blur(10px);
	transition: filter 0.2s;
}
#mol-grid .mol.sel .icn-btn::after {
	background: $blue-10;
}

// Image
#mol-grid .mol .svg-wrap,
#mol-grid .mol .placeholder {
	margin: 0 auto;
	max-width: 100%;
}

// Identifiers
#mol-grid .mol .idfr {
	// Truncate
	word-wrap: normal;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
#mol-grid .mol .idfr.name {
	font-weight: bold;
	margin-bottom: 4px;
	text-transform: capitalize;
}
#mol-grid .mol .idfr.formula {
	font-weight: 500;
	font-size: $font-size-small;
	font-style: italic;
	text-transform: capitalize;
	color: $black-60;
}

// Properties
#mol-grid .mol .props-wrap {
	background: $soft-bg;
	mix-blend-mode: multiply;
	margin: 0 -4px -4px -4px;
	padding: 8px;
	border-radius: 2px;
	margin-top: 8px;
}
#mol-grid .mol .prop:not(:last-child) {
	margin-bottom: 6px;
}
#mol-grid .mol .prop .key {
	font-size: $font-size-small;
	line-height: $line-height-small;
}
#mol-grid .mol .prop .value {
	font-weight: 500;
	// line-break: anywhere; // <-- Instead of truncating values we may want to break them over multiple lines? TBD
}
#mol-grid .mol .prop .key,
#mol-grid .mol .prop .value {
	// Truncate
	word-wrap: normal;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
#mol-grid .mol .prop .value.empty {
	color: $black-30;
}

/**
 * Hover
 */

@media (hover: hover) {
	// Molecule cell highlight
	#mol-grid .mol:hover::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		background: $highlight-soft;
		mix-blend-mode: multiply;
		pointer-events: none;
	}

	// Disable click-to-copy hover style whil selecting
	#mol-grid.sel-mode .click-copy:hover {
		text-decoration: none;
	}

	// Icons
	#mol-grid.sel-mode .mol .icn-btn,
	#mol-grid .mol:not(:hover) .icn-btn:not(.icn-bookmark.toggle-on) {
		display: none;
	}
	#mol-grid .mol .icn-btn:hover::after {
		filter: blur(6px);
	}
	#mol-grid .mol .icn-btn:hover:deep() svg {
		pointer-events: none; // To avoid this as e.target
	}
}

/**
 * Responsive
 * - - -
 * Molecules are always loaded in a multiple of 12, which
 * allows us to render a clean grid with 1, 2, 3, 4, 6, 8
 * or 12 columns. Because we use a negative margin to avoid
 * double strokes, we also have to adjust the parent
 * container's right margin.
 * - - -
 * Note: container queries won't work in older browsers,
 * but this is purely aesthetical behavior so that's ok.
 * https://caniuse.com/css-container-queries
 */

// Minimum width of one molecule cell.
// Unfortunately there's no way of setting this dynamically.
$base-width: 200px;

// This sets the responsive container as our container reference.
#resp-container {
	container-type: inline-size;
}

// Sinle column
@container (max-width: #{$base-width * 2}) {
	#mol-grid .mol {
		// background: #fee;
		flex-basis: 100%;
	}
}

// Two columns
@container (min-width: #{$base-width * 2}) and (max-width: #{$base-width * 3}) {
	#mol-grid {
		margin-right: -1px;
	}
	#mol-grid .mol {
		// background: #efe;
		flex-basis: calc(100% / 2);
	}
}

// Three columns
@container (min-width: #{$base-width * 3}) and (max-width: #{$base-width * 4}) {
	#mol-grid {
		margin-right: -2px;
	}
	#mol-grid .mol {
		// background: #eef;
		flex-basis: calc(100% / 3);
	}
}

// Four columns
@container (min-width: #{$base-width * 4}) and (max-width: #{$base-width * 6}) {
	#mol-grid {
		margin-right: -3px;
	}
	#mol-grid .mol {
		// background: #ffe;
		flex-basis: calc(100% / 4);
	}
}

// Six columns
@container (min-width: #{$base-width * 6}) and (max-width: #{$base-width * 8}) {
	#mol-grid {
		margin-right: -5px;
	}
	#mol-grid .mol {
		// background: #eff;
		flex-basis: calc(100% / 6);
	}
}

// Eight columns
@container (min-width: #{$base-width * 8}) and (max-width: #{$base-width * 12}) {
	#mol-grid {
		margin-right: -7px;
	}
	#mol-grid .mol {
		// background: #fef;
		flex-basis: calc(100% / 8);
	}
}

// Twelve columns
@container (min-width: #{$base-width * 12}) {
	#mol-grid {
		margin-right: -11px;
	}
	#mol-grid .mol {
		// background: #fff;
		flex-basis: calc(100% / 12);
	}
}
</style>
