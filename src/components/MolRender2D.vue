<!--
	This template is forked from vue.js examples:
	https://github.com/rdkit/rdkit-js/blob/master/examples/vue/src/components/MoleculeStructure.vue
-->

<template>
	<div v-if="!rdkitLoaded" class="placeholder" :style="dimensions">Loading renderer</div>
	<div v-else-if="rdkitError" class="placeholder error-msg" :style="dimensions">RDKit<br />Error</div>
	<div v-else-if="!isValidMolString(structure)" :title="`Cannot render structure: ${structure}`" class="placeholder error-msg" :style="dimensions">
		Invalid<br />identifier
	</div>

	<div v-else-if="svgMode" :class="`svg-wrap ${className}`" :style="dimensions" v-html="svg"></div>

	<div v-else :class="`molecule-canvas-container ${className}`">
		<canvas :title="structure" :id="id" :width="width" :height="height"></canvas>
	</div>
</template>

<script setup lang="ts">
// Vue
import { nextTick, onMounted, onUpdated, reactive, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'

// Utils
import initRDKit from '@/utils/rdkit/initRDKit'
import { isValidMolString, isValid } from '@/utils/rdkit-helpers'

// Type declarations
import type { JSMol } from '@/utils/rdkit/tsTypes'
type Props = {
	id: string
	className: string
	svgMode: boolean
	width: number
	height: number
	structure: string
	subStructure: string
	extraDetails: Record<string, unknown>
	drawingDelay: number | undefined
}

// Props
const props = defineProps({
	// Generic props
	id: {
		type: String as PropType<Props['id']>,
		required: true,
	},
	className: {
		type: String as PropType<Props['className']>,
		default: '',
	},
	svgMode: {
		type: Boolean as PropType<Props['svgMode']>,
		default: false,
	},
	width: {
		type: Number as PropType<Props['width']>,
		default: 250,
	},
	height: {
		type: Number as PropType<Props['height']>,
		default: 200,
	},

	// RDKit-specific props
	structure: {
		type: String as PropType<Props['structure']>,
		required: true,
	},
	subStructure: {
		type: String as PropType<Props['subStructure']>,
		default: '',
	},
	extraDetails: {
		type: Object as PropType<Props['extraDetails']>,
		default: () => {},
	},
	drawingDelay: {
		type: Number as PropType<Props['drawingDelay']>,
		default: undefined,
	},
})

// Definitions
// - RDKit state reporting values
let rdkitLoaded = ref(false)
let rdkitError = ref(false)
// - Molecule state values
let wasCalled = ref(false)
let molDetails = reactive({
	width: props.width,
	height: props.height,
	bondLineWidth: 2,
	addStereoAnnotation: true,
	// With explicitMethyl activated, molecule will be rendered with a CH3 (or Me)
	// at the end of the empty lines. Without it, they are assumed, creating less
	// noisy graphics. The field is divided as what is the best visualization.
	// https://www.thoughtco.com/definition-of-methyl-605887
	// explicitMethyl: true,
	...props.extraDetails,
})
let svg = ref('')

/**
 * Computed
 */

const dimensions = computed(() => {
	const dims: { width?: string; height?: string } = {}
	if (props.width) dims['width'] = props.width + 'px'
	if (props.height) dims['height'] = props.height + 'px'
	return dims
})

/**
 * Hooks
 */

// Load molecule on component mount
onMounted(() => {
	initRDKit()
		.then(() => {
			rdkitLoaded.value = true
			try {
				draw()
			} catch (err) {
				console.error(err)
			}
		})
		.catch((err) => {
			console.error(err)
			rdkitError.value = true
		})
})

// Redraw molecule on component update, or props changes
onUpdated(() => {
	if (!rdkitError.value && rdkitLoaded.value && !props.svgMode) {
		drawOnce()
	}
})

watch(props, () => draw())

/**
 * Methods
 */

// Get highlight details for molecule
function getMolDetails(mol: JSMol | null, qmol: JSMol | null) {
	if (isValid(mol) && isValid(qmol)) {
		// Get substructure highlight details
		const details = JSON.parse(mol?.get_substruct_matches(qmol as JSMol) || '')
		// Reduce the list of objects to a single list object with all atoms and bonds
		const detailsMerged: { atoms: number[]; bonds: number[] } =
			details && typeof details[0] === 'object'
				? details.reduce(
						(acc: { atoms: number[]; bonds: number[] }, { atoms, bonds }: { atoms: number[]; bonds: number[] }) => ({
							atoms: [...acc.atoms, ...atoms],
							bonds: [...acc.bonds, ...bonds],
						}),
						{ atoms: [], bonds: [] },
					)
				: details

		return JSON.stringify({
			...molDetails,
			...(props.extraDetails || {}),
			...detailsMerged,
		})
	} else {
		// If one of the molecules are not valid, return no highlight details
		return JSON.stringify({
			...molDetails,
			...(props.extraDetails || {}),
		})
	}
}

// Draw the molecule to the canvas, or return set the SVG variable
async function drawSVGorCanvas() {
	const mol = window.RDKit.get_mol(props.structure || 'invalid')
	const qmol = window.RDKit.get_qmol(props.subStructure || 'invalid')
	const isValidMol = isValid(mol)

	if (props.svgMode && isValidMol) {
		const svgGenerated = (mol as JSMol).get_svg_with_highlights(getMolDetails(mol, qmol))
		svg.value = svgGenerated
	} else if (isValidMol) {
		await nextTick() // function needs to wait until canvas is rendered
		const canvas = document.getElementById(props.id) as HTMLCanvasElement
		;(mol as JSMol).draw_to_canvas_with_highlights(canvas, getMolDetails(mol, qmol))
	}

	// Delete C++ mol objects manually
	// https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management
	mol?.delete()
	qmol?.delete()
}

// Call the main drawing logic, either with a delay or without
function draw() {
	if (props.drawingDelay) {
		setTimeout(() => drawSVGorCanvas(), props.drawingDelay)
	} else {
		drawSVGorCanvas()
	}
}

// Ensure draw() is only called once
function drawOnce() {
	return () => {
		if (wasCalled.value === false) {
			wasCalled.value = true
			draw()
		}
	}
}
</script>

<style lang="scss">
.svg-wrap,
.placeholder {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.svg-wrap {
	font-size: 0;
	line-height: 0;
}
.placeholder {
	text-align: center;
}
.placeholder:not(.error-msg) {
	color: $black-30;
}

// Remove white background
.svg-wrap svg rect:first-of-type {
	display: none;
}
</style>
