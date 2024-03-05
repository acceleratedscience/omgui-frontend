<template>
	<!-- Dev only: toggle headless -->
	<template v-if="!isRawPath">
		<input
			type="checkbox"
			@click="mainStore.toggleHeadless(true)"
			style="position: fixed; top: 2px; right: 2px; z-index: 10"
			:checked="!mainStore.headless"
		/>
	</template>

	<!-- Modal overlay -->
	<TheModal />

	<!-- Load a raw component (no wrapper or loader) -->
	<template v-if="isRawPath">
		<router-view />
		<!-- <RouterView v-slot="{ Component }">
			<KeepAlive>
				<component v-if="Component" :is="Component" />
			</KeepAlive>
		</RouterView> -->
	</template>

	<!-- Load a headless module (wrapper + loader) -->
	<div
		v-else-if="mainStore.headless"
		ref="$headlessWrap"
		id="headless-wrap"
		:class="{ 'file-browser': fileStore.isDir }"
	>
		<router-view />
		<!-- <RouterView v-slot="{ Component }">
			<KeepAlive>
				<component v-if="Component" :is="Component" />
				<div v-else>Loading module...</div>
			</KeepAlive>
		</RouterView> -->
	</div>

	<!-- Load the full application -->
	<div v-else ref="$mainWrap" id="main-wrap" :class="{ 'file-browser': fileStore.isDir }">
		<header>
			<nav>
				<RouterLink :to="{ name: 'home' }">Home</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'filebrowser' }">File Browser</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'molviewer' }">Molecule Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'molgrid' }">Molecule Grid</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'dataviewer' }">Data Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'jsonviewer' }">JSON Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'textviewer' }">Text Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'commandline' }">Command Line</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'module-a' }">Module A</RouterLink
				>&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'module-b' }">Module B</RouterLink>
			</nav>
		</header>
		<div id="body">
			<router-view />
			<!-- <RouterView v-slot="{ Component }">
				<KeepAlive>
					<component :is="Component" />
				</KeepAlive>
			</RouterView> -->
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted, ref } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const modalStore = useModalStore()
// import { usePopStateStore } from '@/stores/PopStateStore--trash' // trash
// const popStateStore = usePopStateStore() // trash

// API
import { fileSystemApi } from '@/api/ApiService'
import webSocketClient from '@/api/WebSocketClient'
webSocketClient()

// Components
import TheModal from '@/components/TheModal.vue'

// // TRASH: overcomplicated API mgmt
// import { useApiStore } from '@/stores/ApiStore'
// import type { FileSystemApi as FileSystemApiType } from '@/api/FileSystemApi'
// const apiStore = useApiStore()
// const fileSystemApi: FileSystemApiType | null = apiStore.loadApi('FileSystemApi') as FileSystemApiType | null // prettier-ignore

// Internal
import { debounce } from '@/utils/helpers'

// // Enable popstate callbacks // trash
// import usePopState from '@/utils/popstate'
// usePopState(popStateStore.setPopState)

//
//

// Definitions
const $mainWrap = ref<HTMLElement | null>(null)
const $headlessWrap = ref<HTMLElement | null>(null)

// While currently not used in the application, we preserve the
// option to load certain paths as "raw", i.e. without the application
// or headless wrapper. This is currently only applied to SVG paths,
// which are useful for debugging.
// Because the router takes a moment to load, we instead check the URL
// directly to avoid flash-loading the application wrapper.
const isRawPath = computed(() => {
	const basePaths = ['svg'] // First part of the URL that will trigger raw module loading.
	const pathItems = window.location.pathname.split('/')
	const isRaw = basePaths.includes(pathItems[1])
	return isRaw
})

// Store the name of your current workspace.
if (fileSystemApi) {
	fileSystemApi
		.getWorkspace()
		.then((result: { data: string; status: number; statusText: string }) => {
			if (result.status != 200) {
				console.error('Failed to get workspace name:', result.statusText)
				return
			}
			mainStore.setWorkspace(result.data)
		})
}

onMounted(() => {
	storeScreenWidth()
})

//
//

// Update screen width in the store on resize.
function storeScreenWidth() {
	const debouncer = debounce(_resizeHandler, 500)
	window.addEventListener('resize', debouncer)
	_resizeHandler()

	function _resizeHandler() {
		const $wrap: HTMLElement | null = $mainWrap.value || $headlessWrap.value || null
		if (!$wrap) return

		const padding = parseInt(window.getComputedStyle($wrap).paddingLeft)
		const width = $wrap.clientWidth
		const contentWidth = width - padding * 2
		mainStore.setContentWidth(contentWidth)
		mainStore.setScreenWidth(window.innerWidth)
	}
}
</script>

<style scoped lang="scss">
/**
 * Headless
 */
#headless-wrap {
	background: white;
	height: 100%;
}
#headless-wrap:not(.file-browser) {
	padding: 20px;
}
#headless-wrap.file-browser {
	height: 100%;
}

/**
  * Normal
  */
#main-wrap {
	display: flex;
	flex-direction: column;
	position: relative;
	padding-bottom: 0;
	box-sizing: border-box;
	height: 100%;
	overflow-x: hidden;

	// Centered layout
	padding: 80px;
	padding-top: 40px;
	max-width: 1360px;
	background: #fff;
	margin: 0 auto;
	box-shadow: 0 0 300px rgba(0, 0, 0, 0.05);
}
#main-wrap.file-browser {
	padding-bottom: 0;
}
header {
	width: 100%;
	min-height: 40px;
	margin-bottom: 20px;
	flex: 0 0 auto;
	// background: yellow;
}
nav {
	min-height: 40px;
	line-height: 30px;
	padding-bottom: 10px;
	position: sticky;
	top: 20px;
	left: 40px;
	display: inline-block;
	// width: calc(100vw - 80px);
}
#body {
	flex: 1;
	// background: orange;
}
#main-wrap.file-browser #body {
	overflow-x: hidden;
	overflow-y: auto;
	margin: 0 -40px;
}

/**
 * Responsive
 */

@media (max-width: $bp-medium) {
	#main-wrap {
		padding: 40px;
	}
}
@media (max-width: $bp-small) {
	#main-wrap {
		padding: 20px;
	}
}
</style>
