<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()

// When requesting a "raw" module, we want to show it without the
// application wrapper. Because the router takes a moment before
// it can tell us if we are on a module path, we instead check the
// URL directly to avoid flash-loading the application wrapper.
const isRawModule = computed(() => {
	const basePaths = ['svg'] // First part of the URL that will trigger raw module loading.
	const pathItems = window.location.pathname.split('/')
	const isModulePath = basePaths.includes(pathItems[1])
	return isModulePath
})
</script>

<template>
	<!-- Dev only: toggle headless -->
	<template v-if="!isRawModule">
		<input
			type="checkbox"
			@click="mainStore.toggleHeadless(true)"
			style="position: fixed; top: 2px; left: 2px; z-index: 10"
			:checked="!mainStore.isHeadless"
		/>
	</template>

	<!-- When loading SVG -->
	<template v-if="isRawModule">
		<RouterView v-slot="{ Component }">
			<KeepAlive>
				<component v-if="Component" :is="Component" />
			</KeepAlive>
		</RouterView>
	</template>

	<!-- Load a raw module -->
	<div v-else-if="mainStore.isHeadless" id="headless-wrap">
		<RouterView v-slot="{ Component }">
			<KeepAlive>
				<component v-if="Component" :is="Component" />
				<div v-else>Loading module...</div>
			</KeepAlive>
		</RouterView>
	</div>

	<!-- Load the full application -->
	<div v-else id="main-wrap">
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
				<RouterLink :to="{ name: 'module-a' }">Module A</RouterLink
				>&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'module-b' }">Module B</RouterLink>
			</nav>
		</header>
		<div id="body">
			<RouterView v-slot="{ Component }">
				<KeepAlive>
					<component :is="Component" />
				</KeepAlive>
			</RouterView>
		</div>
	</div>
</template>

<style scoped lang="scss">
/**
 * Headless
 */
#headless-wrap {
	padding: 20px;
}

/**
  * Normal
  */
#main-wrap {
	display: flex;
	flex-direction: column;
	position: relative;
	margin: 40px;
	// left: 40px;
	// top: 40px;
}
header {
	width: 100%;
	min-height: 40px;
	border-bottom: solid 1px #eee;
	margin-bottom: 20px;
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
	width: calc(100vw - 80px);
}
// #body {
//     // background: orange;
// }
</style>
