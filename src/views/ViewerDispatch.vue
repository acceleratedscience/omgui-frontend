<!-- 
	This is an in-between layer loaded by the filebrowser route, responsible
	for either loading the filebrowser for directory paths, or the appropriate
	viewer module based on the file's extension.
 -->

<template>
	<BreadCrumbs v-if="showBreadCrumbs" />
	<p v-if="fileStore.invalidExt" class="error-msg">
		We don't recognize this file's extension ({{ fileStore.ext }})
	</p>
	<div v-if="loadError" class="error-msg">
		The requested module '{{ fileStore.moduleName }}' was not found.
	</div>
	<BaseFetching
		v-else-if="loading && !fileStore.isDir"
		text="Fetching file"
		failText="Failed to fetch file"
	/>
	<component v-else-if="dynamicModule" :is="dynamicModule" />
	<template v-else>
		<!-- To do: show breadcrumbs when file is not found, requires some refactoring -->
		<!-- <BreadCrumbs v-if="!showBreadCrumbs" :path="fileStore.path" /> -->
		File not found
	</template>
</template>

<script setup lang="ts">
// Vue
import { defineAsyncComponent, ref, shallowRef, watch, onBeforeUnmount, computed } from 'vue'
import type { Component } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()
const molGridStore = useMolGridStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BaseFetching from '@/components/BaseFetching.vue'

// Type declarations
import type { File, Molset, MolsetApi, Mol } from '@/types'
type RouteType = 'dir' | 'file' | 'error' | null

// Definitions
let prevRouteType: RouteType = null // Used to prevent a flash by unnecessarily re-rendering the component.
const loading = ref<boolean>(false)
const loadError = ref<boolean>(false)
const dynamicModule = shallowRef<Component | null>(null)

/**
 * Computed
 */

// Show breadcrumbs only for files.
const showBreadCrumbs = computed(() => {
	if (fileStore.isDir) return false
	if (!fileStore.data) return false // During loading
	if (fileStore.moduleName == 'MolViewer') return false // The molecule viewer has its own breadcrumbs.
	if (fileStore.moduleName == 'MolGrid') return false // The molecule viewer has its own breadcrumbs.
	return true
})

/**
 * Logic
 */

// Parse file path and open file using appropriate module.
parseRoute()

/**
 * Hooks
 */

// Update file or clear store when route changes.
// watch([() => route.path, () => route.query], () => {
watch([() => route.path], () => {
	parseRoute()
	// console.log(222, route.name)
	// if (route.name != 'molgrid') {
	// 	parseRoute()
	// } else {
	// 	console.log('NOPE')
	// }
})

watch(
	() => fileStore.fileTypeOverride,
	() => loadModule(fileStore.moduleName),
)

// Clear store when unmounting.
onBeforeUnmount(fileStore.clear)

/**
 * Methods
 */

// Display a file or directory with the appropriate module.
async function parseRoute() {
	console.log('parseRoute')
	const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const file: File = await fetchFile(filePath)
	if (!file) return

	fileStore.loadItem(file)

	if (fileStore.__meta.fileType == 'dir') {
		// Directory
		if (prevRouteType != 'dir') loadModule('FileBrowser')
		prevRouteType = 'dir'
	} else if (fileStore.__meta.errCode) {
		// Error
		if (prevRouteType != 'error') loadModule(null)
		prevRouteType = 'error'
	} else {
		// File
		if (fileStore.__meta.fileType == 'molset') {
			const data: MolsetApi = file.data
			molGridStore.setMolset(data)
		} else if (fileStore.__meta.fileType == 'mol') {
			const data: Mol = file.data
			molViewerStore.setMolData(data)
		}

		// We can force the usage of a different module with ?use=OtherModule.
		if (prevRouteType != 'file') loadModule(fileStore.moduleName)
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
	loading.value = true
	const { status, data, statusText } = await fileSystemApi.getFile(path)
	loading.value = false
	if (status !== 200) {
		console.error(statusText)
		return
	} else {
		return data
	}
}
</script>

<style lang="css" scoped></style>
