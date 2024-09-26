<template>
	<!-- Default viewer -->
	<div class="container-3d">
		<BaseIconButton
			icon="icn-full-screen-large"
			iconHover="icn-full-screen-large-hover"
			icnSize="large"
			btnStyle="soft"
			@click="toggleFullScreen(true)"
		/>
		<div class="viewer" ref="$container3d"></div>
	</div>

	<!-- Fullscreen viewer -->
	<div id="container-3d-fs" class="container-3d" :class="{ show: fullscreen }">
		<BaseIconButton icon="icn-close" btnStyle="soft" icnSize="large" @click="toggleFullScreen(false)" />
		<div class="info">
			<h4 v-if="molName">{{ capitalize(molName) }}</h4>
		</div>
		<div class="viewer" ref="$container3dFs"></div>
	</div>
</template>

<script setup lang="ts">
// Libraries
import Miew from 'miew'

// Vue
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue'

// Components
import BaseIconButton from '@/components/BaseIconButton.vue'

// Utils
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { Format3D } from '@/types'

// Props
const props = defineProps<{
	data3D: string | null
	data3DFormat: Format3D
	molName: string | null
}>()

// Definitions
const $container3d = ref<Element | null>(null)
const $container3dFs = ref<Element | null>(null)
const fullscreen = ref<boolean>(false)
let miewViewer: any = null
let miewViewerFs: any = null

/**
 * Computed
 */

const hasData = computed(() => !!props.data3D)
const isSmol = computed(() => props.data3DFormat == 'sdf')

/**
 * Hooks
 */

// When you look at molecule-by-identifier as JSON (?use=json), then return to the molecule,
// the watcher won't trigger because ?use=JSON is handled in MolViewer.vue (see #json-only)
// and molViewerStore.mdl remains unchanged.
// When looking at molecule via filebrowser, the ?use=json is handler by ViewerDispatch.vue,
// which resets molViewerStore.mdl, triggering the watcher.
onMounted(() => {
	if (hasData.value) init3DViewer()
})

// As soon as the 3D data is loaded into the store, render the 3D molecule.
watch(() => hasData.value, init3DViewer)

onBeforeUnmount(() => {
	if (miewViewer) {
		miewViewer.term()
		miewViewer = null
	}
})

/**
 * Methods
 */

// Render 3D molecule.
function init3DViewer() {
	// console.log('init3DViewer')
	if (!$container3d.value) return

	// Triggered whenever we clear the molViewerStore.
	if (!hasData.value) {
		miewViewer.term()
		miewViewer = null
		$container3d.value.innerHTML = ''
		return
	}

	// console.log('init3DViewer >>> OK')
	render3d_miew()
}

async function toggleFullScreen(state: boolean) {
	fullscreen.value = state
	if (state) {
		await nextTick()
		render3d_miew(true)
	}
}

// Render 3D mol using the Miew library - https://lifescience.opensource.epam.com/miew/index.html
// Miew is not well documented, but it's the best 3D viewer we've found so far.
// Uses WebGL and has a few nice features like displaying atom info on click, and setting the rotation center on doubleclick.
function render3d_miew(doFullscreen: boolean = false) {
	// This re-initializes the viewer when the molecule is changed.
	// Not clear from the documentation, leave this here for reference.
	// (No longer used because we use a separate container for the fullscreen mode)
	// 	miewViewer.term()
	// 	miewViewer = null

	let mv

	if ((doFullscreen && !miewViewerFs) || (!doFullscreen && !miewViewer)) {
		// Select the correct container
		const container = doFullscreen ? $container3dFs.value : $container3d.value

		// Create viewer
		mv = new Miew({
			container: container as HTMLDivElement,
			// https://github.com/epam/miew/blob/25fea24038de937cd142049ec77b27bc1866001a/packages/lib/src/settings.js`
			settings: {
				axes: false,
				fps: false,
				camDistance: isSmol.value ? 3 : 2,
				resolution: 'high',
				zooming: !!doFullscreen,
				bg: { color: 0xf4f4f4 }, // Equivalent of $soft-bg.

				// Settings we don't want:
				// bg: { color: 0xffffff, transparent: true }, // Transparent background creates ugly edges
				// autoRotation: -0.03, // This disables the smooth easing out when you release after rotating
				// shadow: { // Cool but generates weird artifacts and slows down a lot
				// 	on: true,
				// 	type: 'random',
				// 	radius: 1,
				// },
			},
		})

		// Initialize viewer
		if (mv.init()) {
			// @ts-ignore
			mv.enableHotKeys(doFullscreen) // Prevent Miew hotkeys to interfere with our app
			mv.run()
		}

		// Load the 3D data
		if (props.data3DFormat == 'sdf') {
			mv.load(props.data3D!, { sourceType: 'immediate', fileType: 'sdf' })
		} else if (props.data3DFormat == 'pdb') {
			mv.load(props.data3D!, { sourceType: 'immediate', fileType: 'pdb' })
		} else if (props.data3DFormat == 'cif') {
			mv.load(props.data3D!, { sourceType: 'immediate', fileType: 'cif' })
		}

		// Assign viewer to a variable so we can check if it has been initialized later.
		if (doFullscreen) {
			miewViewerFs = mv
		} else {
			miewViewer = mv
		}
	}
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
	margin: 10px;
}
.container-3d:deep() .atom-info p {
	font-size: $font-size-small;
	margin: 0;
}

/**
 * Fullscreen mode
 */
#container-3d-fs {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	// display: none;
	opacity: 0;
	pointer-events: none;
}
#container-3d-fs.show {
	display: block;
	opacity: 1;
	pointer-events: all;
}
#container-3d-fs::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(transparent, $black-10);
	pointer-events: none;
}
#container-3d-fs .info {
	margin: 20px;
	font-size: $font-size-small;
	line-height: $line-height-small;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
}
#container-3d-fs .info h4 {
	margin-bottom: 4px;
}
#container-3d-fs:deep() .atom-info {
	position: absolute;
	top: 25px;
	left: 0;
	pointer-events: initial;
	margin: 20px;
	color: $black-60;
}
</style>
