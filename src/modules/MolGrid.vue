<template>
	<MolProps />
	<MolActions />
	<div id="resp-container">
		<div id="mol-grid" ref="$molGrid">
			<div
				v-for="(mol, i) in molGridStore.molsetPage"
				:key="i"
				class="mol"
				:class="{ focus: i == molGridStore.focus, sel: molGridStore.sel.includes(i) }"
				@click="(e) => onMolClick(e, i)"
			>
				<cv-checkbox
					:label="`${i}`"
					:value="`${i}`"
					:checked="molGridStore.sel.includes(i)"
				/>
				<MolRender
					:id="mol.identifiers.inchi"
					:structure="mol.identifiers.isomeric_smiles.toString()"
					:width="200"
					:height="200"
					svg-mode
				/>

				<!-- prettier-ignore -->
				<template v-if="1">
					<!-- Identifiers -->
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('name') && mol?.identifiers?.name" class="idfr name">{{ mol.identifiers.name }}</div>
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('inchi') && mol?.identifiers?.inchi" class="idfr">{{ mol.identifiers.inchi }}</div>
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('inchikey') && mol?.identifiers?.inchikey" class="idfr">{{ mol.identifiers.inchikey }}</div>
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('canonical_smiles') && mol?.identifiers?.canonical_smiles" class="idfr">{{ mol.identifiers.canonical_smiles }}</div>
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('isomeric_smiles') && mol?.identifiers?.isomeric_smiles" class="idfr">{{ mol.identifiers.isomeric_smiles }}</div>
					<div v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('formula') && mol?.identifiers?.formula" class="idfr formula">{{ mol.identifiers.formula }}</div>
					<a v-copy-on-click="nothingSelected" v-if="molGridStore.showIdentifiers.includes('cid') && mol?.identifiers?.cid" :href="`https://pubchem.ncbi.nlm.nih.gov/compound/${mol.identifiers.cid}`" target="_blank" class="idfr">{{ mol.identifiers.cid }}</a>
				</template>

				<!-- prettier-ignore -->
				<div v-if="molGridStore.showProps.length" class="props-wrap">
					<template v-for="(key, i) in molGridStore.showProps" :key="i">
						<!-- Properties -->
						<div class="prop" :title="`${key}:\n${mol.properties[key] || mol.properties[key] === 0 ? mol.properties[key] : '-'}`">
							<div class="key">{{ key }}</div>
							<div v-copy-on-click="nothingSelected" class="value" :class="{ empty: !mol.properties[key] && mol.properties[key] !== 0 }">
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
import {
	ref,
	onMounted,
	onBeforeMount,
	computed,
	watch,
	onUpdated,
	nextTick,
	onBeforeUnmount,
} from 'vue'
import type { ComputedRef } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Components
import MolPagination from '@/components/MolPagination.vue'
import MolProps from '@/components/MolProps.vue'
import MolRender from '@/components/MolRender.vue'
import MolActions from '@/components/MolActions.vue'

// Type declarations
type KeyHandlers = {
	[key: string]: () => void
}

// Definitions
const $molGrid = ref<HTMLElement | null>(null)
const loading = ref<Boolean>(false)
const loadingError = ref<String | false>(false)

/**
 * Computed
 */

// Detect how the molecule viewer was opened:
// - Viewing a file: /~/dopamine.mol.json
// - Directly: /molviewer/dopamine
const isFile: ComputedRef<boolean> = computed(() => {
	return route.name == 'filebrowser' || route.name == 'headless-filebrowser'
})

const columns: ComputedRef<number | null> = computed(() => {
	const $mol = $molGrid.value?.querySelector('.mol')
	if (!$molGrid.value || !$mol) return null
	return Math.round($molGrid.value.clientWidth / $mol.clientWidth)
})

// const propertyValues: ComputedRef<string[]> = computed(() => {
// 	const values = []
// 	for (const mol in molGridStore.molset) {
// 		{}
// 		if (mol.properties[key] || mol.properties[key] === 0) {
// 			values Object.keys(molGridStore.molset[0].properties)
// 		} else {
// 			return []
// 		}
// 	}
// })

// const molset = computed(() => {
// 	return molGridStore.molset
// })

/**
 * Hooks
 */

onMounted(async () => {
	// Add keyboard shortcuts
	document.addEventListener('keydown', onKeyDown)

	// Add blur listener
	mainStore.SetOnBlurFn(_maybeBlur)
})

onBeforeMount(async () => {
	if (isFile.value) {
		// A molecule file is opened --> only fetch viz data.
		if (fileStore.data) {
			try {
				const molsetData = JSON.parse(fileStore.data)
				molGridStore.setMolset(molsetData)
				loading.value = false
			} catch (err) {
				console.error(err)
			}
		}
	} else {
		// May create a standalone version where you can add molecules,
		// or a version that displays the in-memory list of molecules.
	}
})

onBeforeUnmount(() => {
	// Remove key handlers.
	document.removeEventListener('keydown', onKeyDown)

	// Clear store
	molGridStore.clear()
})

/**
 * Logic
 */

/**
 * Methods
 */

let lastSelectedRowIndex = ref<number | null>(null)
let lastSelectedRowSelState = ref<boolean | null>(null)

function onMolClick(e: MouseEvent, i: number) {
	// Abort molecule selection when the target is a click-to-copy element.
	const click2CopyTarget =
		(e.target as HTMLElement).classList.contains('idfr') ||
		(e.target as HTMLElement).classList.contains('value')
	if (!molGridStore.sel.length && click2CopyTarget) return

	molGridStore.toggleSel(i)
	molGridStore.setFocus(i)

	const currentRowIndex = i

	// Batch select with shift
	if (e.shiftKey && lastSelectedRowSelState.value != null) {
		if (molGridStore.sel.length && lastSelectedRowIndex.value !== null) {
			let lowIndex = Math.min(lastSelectedRowIndex.value, currentRowIndex)
			let highIndex = Math.max(lastSelectedRowIndex.value, currentRowIndex)

			// When you select from bottom to top, we gotta include the highIndex
			// When you select from top to bottom, we gotta include the lowIndex
			if (lowIndex != lastSelectedRowIndex.value) {
				lowIndex -= 1
				highIndex -= 1
			}

			// Create array with selected range indices.
			const range = []
			for (let i = lowIndex; i <= highIndex; i++) {
				range.push(i)
			}

			if (lastSelectedRowSelState.value) {
				molGridStore.addSel(range)
			} else {
				molGridStore.removeSel(range)
			}
		}
	} else {
		lastSelectedRowSelState.value = molGridStore.sel.includes(i)
	}

	lastSelectedRowIndex.value = currentRowIndex
}

// Validator that disables the click-to-copy feature when items are selected.
function nothingSelected() {
	return !molGridStore.hasSel
}

// Registrer blur event when clicked outside of the molecule grid.
function _maybeBlur(e: MouseEvent) {
	if ((e.target as HTMLElement).closest('.mol')) return
	molGridStore.unsetFocus()
}

function onKeyDown(e: KeyboardEvent) {
	// Check if there's any input in focus
	if (document.activeElement?.tagName == 'INPUT') return
	if (e.key in keyHandlers) {
		keyHandlers[e.key]()
		e.preventDefault()
	}
}

const keyHandlers: KeyHandlers = {
	ArrowLeft: () => {
		let i = molGridStore.focus
		// console.log('A', i)
		if (i === null) return
		i = i - 1 < 0 ? i : i - 1
		// console.log('B', i)
		molGridStore.setFocus(i)
	},
	ArrowRight: () => {
		let i = molGridStore.focus
		if (i === null || !molGridStore.molset) return
		i = i + 1 > molGridStore.molset.length - 1 ? i : i + 1
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
		if (i === null || !columns.value || !molGridStore.molset) return
		i = i + columns.value > molGridStore.molset.length - 1 ? i : i + columns.value
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
			molGridStore.deselectAll()
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

#mol-grid .mol .cv-checkbox {
	position: absolute;
	top: 3px;
	left: 3px;
	pointer-events: none;
}
// #mol-grid .mol .image {
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	font-size: 0;
// 	line-height: 0;
// 	// height: 150px;
// 	// background: pink;
// }
// #mol-grid .mol .image:deep() svg {
// 	max-height: 100%;
// 	max-width: 100%;
// 	height: auto;
// }
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

	// Truncate
	word-wrap: normal;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
#mol-grid .mol .prop .value {
	font-weight: 500;
}
#mol-grid .mol .prop .value.empty {
	color: $black-30;
}

/**
 * Hover states
 */

@media (hover: hover) {
	#mol-grid .mol:hover::after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: $highlight-soft;
		mix-blend-mode: multiply;
		pointer-events: none;
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
