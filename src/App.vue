<template>
	<ApiOffline v-if="mainStore.apiOffline" />

	<!-- Dev only: toggle headless -->
	<template v-if="!isRawPath">
		<input
			type="checkbox"
			@click="mainStore.toggleHeadless(true)"
			style="position: fixed; top: 2px; right: 2px; z-index: 10; opacity: 0"
			:checked="!mainStore.headless"
		/>
	</template>

	<!-- Command line overlay -->
	<CommandLine v-if="commandLineStore.active" />

	<!-- Assistant overlay -->
	<AIAssistant v-else-if="assistantStore.active" />

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
	<div v-else-if="mainStore.headless" ref="$headlessWrap" id="headless-wrap" :class="{ 'file-browser': fileStore.isDir }">
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
		<TheNav />
		<div id="body">
			<router-view />
			<!-- <RouterView v-slot="{ Component }">
				<KeepAlive>
					<component :is="Component" />
				</KeepAlive>
			</RouterView> -->
		</div>
	</div>

	<ScrollToTop />
</template>

<script setup lang="ts">
// Vue
import { computed, onBeforeMount, onMounted, ref } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useCommandLineStore } from '@/stores/CommandLineStore'
import { useAssistantStore } from '@/stores/AssistantStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const commandLineStore = useCommandLineStore()
const assistantStore = useAssistantStore()

// API
import { fileSystemApi } from '@/api/ApiService'
// import webSocketClient from '@/api/WebSocketClient'// Experimental
// webSocketClient()

// Components
import ApiOffline from '@/components/ApiOffline.vue'
import TheModal from '@/components/TheModal.vue'
import TheNav from '@/components/TheNav.vue'
import CommandLine from '@/pages/CommandLine.vue'
import AIAssistant from '@/pages/AIAssistant.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

// Utils
import { debounce } from '@/utils/helpers'

// Definitions
const $mainWrap = ref<HTMLElement | null>(null)
const $headlessWrap = ref<HTMLElement | null>(null)

/**
 * Computed
 */

// While currently not really used in the application, we preserve the
// option to load certain paths as "raw", i.e. without the main-wrap
// or headless-wrap. This is currently only in use for /svg/<svg_filename>,
// which is useful for previewing svg content during development.
// - - -
// Because the router takes a moment to load, we instead check the URL
// directly to avoid flash-loading the application wrapper.
const isRawPath = computed(() => {
	const basePaths = ['svg'] // First part of the URL that will trigger raw module loading.
	const pathItems = window.location.pathname.split('/')
	const isRaw = basePaths.includes(pathItems[1])
	return isRaw
})

/**
 * Logic
 */

// Store the name of your current workspace.
if (fileSystemApi) {
	fileSystemApi.getWorkspace().then((result: { data: string; status: number; statusText: string }) => {
		if (result.status != 200) {
			console.error('Failed to get workspace name:', result.statusText)
			return
		}
		mainStore.setWorkspace(result.data)
	})
}

/**
 * Hooks
 */

onMounted(() => {
	storeScreenWidth()

	// Add blur handler
	document.body.removeEventListener('click', mainStore.onClickAnywhere)
	document.body.addEventListener('click', (e) => {
		mainStore.onClickAnywhere(e)
	})
})

onBeforeMount(() => {
	// Remove blur handler
	document.body.removeEventListener('click', mainStore.onClickAnywhere)
})

/**
 * Methods
 */

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
header {
	width: 100%;
	flex: 0 0 auto;
	background: pink;
}

/**
 * Headless
 */

#headless-wrap {
	background: white;
	height: min-content; // Required for bottom patting to show
	min-height: 100vh; // To avoid bottom shadow when content is short.
}
#headless-wrap:not(.file-browser) {
	padding: 20px;
}
#headless-wrap.file-browser {
	height: 100%; // Required for file-browser to stretch to the bottom.
}

/**
 * Normal
 */

#main-wrap {
	display: flex;
	flex-direction: column;
	// position: relative;
	padding-bottom: 0;
	box-sizing: border-box;
	height: min-content; // Required for bottom patting to show
	min-height: 100vh; // To avoid bottom shadow when content is short.
	// overflow-x: hidden;

	// Centered layout
	padding: var(--page-margin);
	padding-top: 40px;
	max-width: 1360px;
	background: #fff;
	margin: 0 auto;
	box-shadow: 0 0 300px rgba(0, 0, 0, 0.05);
}
#main-wrap.file-browser {
	padding-bottom: 0;
	height: 100%; // Required for file-browser to stretch to the bottom.
	max-width: none;
	padding: 0 40px;
}

#body {
	flex: 1;
}
#main-wrap.file-browser #body {
	overflow-x: hidden;
	overflow-y: auto;
	margin: 0 -40px;
}

/**
 * Responsive
 */

// Max-width doesn't kick in right away,
// so we avoid side margins that are too small.
@media (max-width: $bp-xlarge) {
	#main-wrap {
		max-width: none;
	}
}

// The default top-padding is not synced with --page-margin
@media (max-width: $bp-small) {
	#main-wrap {
		padding-top: 20px;
	}
}

/**
 * UNCOMMENT TO TEST
 * RESPONSIVE BREAKPOINTS
 */

// #main-wrap {
// 	background: rgba(255, 0, 0);
// }
// #main-wrap::after {
// 	content: 'unrestricted';
// 	position: fixed;
// 	top: 0;
// 	left: 0;
// 	padding: 4px;
// 	background: white;
// 	text-transform: uppercase;
// }
// @media (max-width: $bp-xlarge) {
// 	#main-wrap {
// 		background: rgba(200, 50, 0);
// 	}
// 	#main-wrap::after {
// 		content: 'xlarge';
// 	}
// }
// @media (max-width: $bp-large) {
// 	#main-wrap {
// 		background: rgba(150, 100, 0);
// 	}
// 	#main-wrap::after {
// 		content: 'large';
// 	}
// }
// @media (max-width: $bp-medium) {
// 	#main-wrap {
// 		background: rgba(100, 150, 0);
// 	}
// 	#main-wrap::after {
// 		content: 'medium';
// 	}
// }
// @media (max-width: $bp-small) {
// 	#main-wrap {
// 		background: rgba(50, 200, 0);
// 	}
// 	#main-wrap::after {
// 		content: 'small';
// 	}
// }
// @media (max-width: $bp-xsmall) {
// 	#main-wrap {
// 		background: rgba(0, 255, 0);
// 	}
// 	#main-wrap::after {
// 		content: 'xsmall';
// 	}
// }
</style>
