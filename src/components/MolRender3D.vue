<template>
	<div class="container-3d" :class="{ fullscreen }">
		<div class="info" v-if="fullscreen">
			<h4>{{ capitalize(mol.identifiers.name) }}</h4>
			<!-- <div>{{ mol.identifiers.inchi }}</div> -->
			<!-- <div>{{ mol.identifiers.canonical_smiles }}</div> -->
		</div>
		<IconButton v-if="fullscreen" icon="icn-close" btnStyle="soft" icnSize="large" @click="toggleFullScreen(false)" />
		<IconButton
			v-else
			icon="icn-full-screen-large"
			iconHover="icn-full-screen-large-hover"
			icnSize="large"
			btnStyle="soft"
			@click="toggleFullScreen(true)"
		/>
		<div class="viewer" ref="$container3d"></div>
	</div>
</template>

<script setup lang="ts">
// Libraries
// import Miew from 'miew' // Waiting for fix, self-hosting until then - see https://github.com/epam/miew/issues/524
// @ts-ignore
import Miew from '@/TEMP/miew/dist/miew.module'
import '@/TEMP/miew/dist/miew.min.css'

// Vue
import { ref, watch, nextTick, onMounted } from 'vue'

// Components
import IconButton from '@/components/IconButton.vue'

// Utils
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { Mol, TempMol } from '@/types'

// Props
const props = defineProps<{ sdf: string | null; mol: Mol | TempMol }>()

// Definitions
const $container3d = ref<Element | null>(null)
const fullscreen = ref<boolean>(false)
let miewViewer: any = null

/**
 * Hooks
 */

// When you look at molecule-by-identifier as JSON (?use=json), then return to the molecule,
// the watcher won't trigger because ?use=JSON is handled in MolViewer.vue (see #json-only)
// and molviewerStore.sdf remains unchanged.
// When looking at molecule via filebrowser, the ?use=json is handler by ViewerDispatch.vue,
// which resets molViewerStore.sdf, triggering the watcher.
onMounted(() => {
	if (props.sdf) init3DViewer()
})

// As soon as the SDF data is loaded into the store, render the 3D molecule.
watch(() => props.sdf, init3DViewer)

/**
 * Methods
 */

// Render 3D molecule.
function init3DViewer() {
	console.log('3D INIT')
	if (!$container3d.value) return

	// Triggered whenever we clear the molViewerStore.
	if (props.sdf == null) {
		miewViewer.term()
		miewViewer = null
		$container3d.value.innerHTML = ''
		return
	}

	console.log('3D INIT!!!')
	render3d_miew()
}

// Render 3D mol using the Miew library - https://lifescience.opensource.epam.com/miew/index.html
// Miew is not well documented, but it's the best 3D viewer we've found so far.
// Uses WebGL and has a few nice features like displaying atom info on click, and setting the rotation center on doubleclick.
function render3d_miew(forceReInit = false) {
	if (forceReInit) {
		miewViewer.term()
		miewViewer = null
	}
	if (!miewViewer) {
		miewViewer = new Miew({
			container: $container3d.value as HTMLDivElement,
			// https://github.com/epam/miew/blob/25fea24038de937cd142049ec77b27bc1866001a/packages/lib/src/settings.js`
			settings: {
				axes: false,
				fps: false,
				camDistance: 3, // Default 2.5 tends to crop some of the molecule, depending on the shape. Eg. with penguinone.
				resolution: 'high',
				zooming: false,
				bg: { color: 0xf4f4f4 }, // Equivalent of $soft-bg.
				// bg: { color: 0xffffff, transparent: true }, // Transparent background creates ugly edges
				// autoRotation: -0.03, // This disables the smooth easing out when you release after rotating
				// shadow: { // Cool but generates weird artifacts and slows down a lot
				// 	on: true,
				// 	type: 'random',
				// 	radius: 1,
				// },
			},
		})
		if (miewViewer.init()) {
			miewViewer.enableHotKeys(false) // Prevent Miew hotkeys to interfere with our app
			miewViewer.run()
		}
	}
	miewViewer.load(props.sdf, { sourceType: 'immediate', fileType: 'sdf' })
}

async function toggleFullScreen(state: boolean) {
	fullscreen.value = state
	await nextTick()
	render3d_miew(true)
}
</script>

<style lang="scss" scoped>
.container-3d {
	background: $soft-bg;
	position: relative;
}
.container-3d .icn-btn {
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1;
	width: 60px;
	height: 60px;
}
.container-3d .viewer {
	width: 100%;
	height: 100%;
}
.container-3d canvas {
	max-width: 100%;
	outline: none;
}

/**
 * Miew styling
 */

.container-3d:deep() .miew-canvas {
	// A little hack to make the molecule edges extra smooth.
	width: 200%;
	height: 200%;
	transform: scale(0.5);
	transform-origin: 0 0;
}

.container-3d:deep() .atom-info {
	position: absolute;
	bottom: 0;
	left: 0;
	pointer-events: initial;
	color: $black-30;
}
.container-3d:deep() .atom-info p {
	font-size: $font-size-small;
	margin: 0;
}

/**
 * Fullscreen mode
 */
.container-3d.fullscreen {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
}
.container-3d.fullscreen::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(transparent, $black-10);
	pointer-events: none;
}
.container-3d .info {
	margin: 20px;
	font-size: $font-size-small;
	line-height: $line-height-small;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
}
.container-3d .info h4 {
	margin-bottom: 4px;
}
.container-3d.fullscreen:deep() .atom-info {
	position: absolute;
	top: 25px;
	left: 0;
	pointer-events: initial;
	color: $black-30;
	margin: 20px;
	color: $black-60;
}
</style>
