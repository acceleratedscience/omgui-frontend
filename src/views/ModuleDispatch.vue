<template>
	<!-- {{ fileStore.moduleName }}& Switch module to:
	<router-link to="?use=JsonViewer" class="dumb">JSON Viewer</router-link> |
	<router-link to="?use=MolViewer" class="dumb">Molecule Viewer</router-link> |
	<router-link to="?use=SdfViewer" class="dumb">SDF Viewer</router-link> |
	<router-link to="?use=TextViewer" class="dumb">Text Viewer</router-link><br /><br /> -->

	<BreadCrumbs v-if="showBreadCrumbs" :path="fileStore.path" />
	<p v-if="fileStore.invalidExt" class="error-msg">
		We don't recognize this file's extension ({{ fileStore.ext }})
	</p>
	<div v-if="loadError" class="error-msg">
		The requested module '{{ fileStore.moduleName }}' was not found.
	</div>
	<template v-else-if="dynamicModule"><component :is="dynamicModule" /></template>
</template>

<script setup lang="ts">
// Vue
import { defineAsyncComponent, ref, shallowRef, watch, onBeforeUnmount, computed } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

// Stores
import { useFileStore } from '@/stores/FileStore'

// API
import { fileSystemApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'

// Type declarations
type RouteType = 'dir' | 'file' | 'error' | null

//
//

// Definitions
const route = useRoute()
const fileStore = useFileStore()

// Open file and load appropriate module.
const loadError = ref(false as boolean)
const dynamicModule = shallowRef(null as Component | null)
parseRoute()

// Show breadcrumbs only for files.
const showBreadCrumbs = computed(() => {
	if (fileStore.isDir) return false
	if (!fileStore.data) return false // During loading
	if (fileStore.moduleName == 'MolViewer') return false // The molecule viewer has its own breadcrumbs.
	return true
})

// Used to prevent a flash by unnecessarily
// re-rendering the component.
let prevRouteType: RouteType = null

// Update file or clear store when route changes.
watch([() => route.path, () => route.query], () => {
	parseRoute()
})

// Clear store when unmounting.
onBeforeUnmount(() => {
	fileStore.clear()
})

//
//

// Display a file or directory with the appropriate module.
async function parseRoute() {
	// console.log('parseRoute')
	const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const file = await fetchFile(filePath)
	if (!file) return
	fileStore.loadItem(file)
	if (file.isDir) {
		// Directory
		if (prevRouteType != 'dir') loadModule('FileBrowser')
		prevRouteType = 'dir'
	} else if (file.errCode) {
		// Error
		if (prevRouteType != 'error') loadModule(null)
		prevRouteType = 'error'
	} else {
		// File
		// We can force the usage of a different module with ?use=OtherModule.
		if (prevRouteType != 'file' || fileStore.forcedModule) loadModule(fileStore.moduleName)
		prevRouteType = 'file'
	}
}

// Load the dynamic module.
function loadModule(moduleName: string | null) {
	loadError.value = false
	if (!moduleName) {
		dynamicModule.value = null
		return
	}
	dynamicModule.value = defineAsyncComponent(() =>
		import(`../modules/${moduleName}.vue`).catch(() => {
			loadError.value = true
		}),
	)
}

// Return file contents from API.
async function fetchFile(path = '') {
	if (!fileSystemApi) return
	const { status, data, statusText } = await fileSystemApi.getFile(path)
	if (status !== 200) {
		console.error(statusText)
		return
	} else {
		return data
	}
}
</script>

<style lang="css" scoped></style>
