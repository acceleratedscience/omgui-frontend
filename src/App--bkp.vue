<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
const mainStore = useMainStore()
const fileStore = useFileStore()

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
</script>

<template>
	<!-- Dev only: toggle headless -->
	<template v-if="!isRawPath">
		<input
			type="checkbox"
			@click="mainStore.toggleHeadless(true)"
			style="position: fixed; top: 2px; left: 2px; z-index: 10"
			:checked="!mainStore.headless"
		/>
	</template>

	<!-- Load a raw component (no wrapper or loader) -->
	<template v-if="isRawPath">
		<RouterView v-slot="{ Component }">
			<KeepAlive>
				<component v-if="Component" :is="Component" />
			</KeepAlive>
		</RouterView>
	</template>

	<!-- Load a headless module (wrapper + loader) -->
	<div
		v-else-if="mainStore.headless"
		id="headless-wrap"
		:class="{ 'file-browser': fileStore.isDir }"
	>
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
		<div id="body" :class="{ 'file-browser': fileStore.isDir }">
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
	padding: 40px;
	padding-bottom: 0;
	box-sizing: border-box;
	height: 100%;
	overflow-x: hidden;
	// left: 40px;
	// top: 40px;
}
header {
	width: 100%;
	min-height: 40px;
	// border-bottom: solid 1px #eee;
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
	width: calc(100vw - 80px);
}
#body {
	flex: 1;
	// background: orange;
}
#body.file-browser {
	overflow-x: hidden; // %%
	overflow-y: auto; // %%
	margin: 0 -40px;
}
</style>
