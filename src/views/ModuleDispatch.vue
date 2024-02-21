<script setup lang="ts">
// Vue
import { defineAsyncComponent, ref, shallowRef, watch, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

// Stores
import { useApiStore } from '@/stores/ApiStore'
import { useFileStore } from '@/stores/FileStore'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'

// Type declarations
type RouteType = 'dir' | 'file' | 'error' | null

// Definitions
const route = useRoute()
const fileStore = useFileStore()
const apiStore = useApiStore()
const fileSystemApi = apiStore.loadApi('fileSystem')

//
//

// Open file and load appropriate module.
const loadError = ref(false as boolean)
const dynamicModule = shallowRef(null as Component | null)
parseRoute()

// const prevRouteName = ref(null as string | null)
let prevRouteType: RouteType = null

// Update file or clear store when route changes.
watch(() => route.path, parseRoute)

// Clear store when unmounting.
onBeforeUnmount(() => {
	fileStore.clear()
})

//
//

// Display a file or directory with the appropriate module.
async function parseRoute() {
	const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const file = await fetchFile(filePath)
	fileStore.loadItem(file)
	if (file.isDir) {
		// Directory
		if (prevRouteType != 'dir') loadModule('FileBrowser') // Condition is to prevent flash while unnecessarily re-rendering the component.
		prevRouteType = 'dir'
	} else if (file.errCode) {
		// Error
		if (prevRouteType != 'error') loadModule(null)
		prevRouteType = 'error'
	} else {
		// File
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
	const { status, data, statusText } = await fileSystemApi.get_file(path)
	if (status !== 200) {
		console.error(statusText)
		return
	} else {
		return data
	}
}
</script>

<template>
	<BreadCrumbs v-if="!fileStore.isDir" :path="fileStore.path" />
	<p v-if="fileStore.invalidExt" class="error-msg">
		We don't recognize this file's extension ({{ fileStore.ext }})
	</p>
	<div v-if="loadError" class="error-msg">
		The requested module '{{ fileStore.moduleName }}' was not found.
	</div>
	<template v-else-if="dynamicModule"><component :is="dynamicModule" /></template>
</template>

<style lang="css" scoped></style>
