<!-- 
	This is an in-between layer loaded by the filebrowser route, responsible
	for either loading the filebrowser for directory paths, or the appropriate
	viewer module based on the file's extension.
 -->

<template>
	<div v-if="loadError" class="error-msg">The requested module '{{ fileStore.moduleName }}' was not found.</div>
	<BaseFetchingFile v-else-if="fileStore.forcedLoading || (loading && !fileStore.isDir)" text="Fetching file" failText="Failed to fetch file" />
	<component v-else-if="dynamicModule" :is="dynamicModule" /><!-- :data="fileStore.data" -->
	<template v-else>
		<!-- To do: show breadcrumbs when file is not found, requires some refactoring -->
		<BreadCrumbs v-if="!showBreadCrumbs" :pathArray="fileStore.breadCrumbPathArray" />
		<p>File not found</p>
		<cv-button size="small" @click="router.push(parentLink)">Exit</cv-button>
	</template>
</template>

<script setup lang="ts">
// Vue
import { defineAsyncComponent, ref, shallowRef, watch, onBeforeUnmount, computed } from 'vue'
import type { Component } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()
const molGridStore = useMolGridStore()

// API
import { apiFetch, fileSystemApi } from '@/api/ApiService'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BaseFetchingFile from '@/components/BaseFetchingFile.vue'

// Type declarations
import type { File, MolsetApi, Smol, Mmol } from '@/types'
import type { LocationQuery } from 'vue-router'
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

// File not found exit link
const parentLink = computed(() => {
	const pathArray = fileStore.breadCrumbPathArray.slice(1)
	const parentPath = '/~/' + pathArray.slice(0, -1).join('/')
	return parentPath
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
watch(
	() => route.path,
	() => {
		parseRoute()
	},
)

watch(
	() => fileStore.fileType,
	() => {
		// When you open a molecule from a molset, the route doesn't change,
		// so we monitor the fileType. We need to check if the oldValue is not
		// null to avoid triggering this on intial load.
		loadModule(fileStore.moduleName)
	},
)

// Clear store when unmounting.
onBeforeUnmount(fileStore.clear)

/**
 * Methods
 */

// Display a file or directory with the appropriate module.
// This gets triggered on initial pageload / reload.
async function parseRoute() {
	const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const urlQuery: LocationQuery = route.query

	// fileStore.unsetFileType()
	console.log('parseRoute', filePath, urlQuery, router)

	apiFetch(fileSystemApi.getFile(filePath, urlQuery), {
		loading: loading,
		onError: (err) => {
			fileStore.setForcedLoading(false)
			console.log('Error in getFile()', err)
		},
		onSuccess: (file: File) => {
			fileStore.setForcedLoading(false)
			fileStore.loadItem(file)

			if (fileStore.errCode) {
				// Error
				if (prevRouteType != 'error') loadModule(null)
				prevRouteType = 'error'
				return
			}

			// File
			if (['molset', 'sdf', 'smi'].includes(fileStore.fileType || '')) {
				const data: MolsetApi = file.data
				molGridStore.setMolset(data)
				if (fileStore.ext == 'json') {
					molGridStore.setContext('json')
				} else if (fileStore.ext == 'sdf') {
					molGridStore.setContext('sdf-file')
				} else if (fileStore.ext == 'smi') {
					molGridStore.setContext('smi-file')
				}
			} else if (fileStore.fileType == 'smol') {
				molViewerStore.setMolData(file.data as Smol, 'smol')
			} else if (fileStore.fileType && ['mmol', 'pdb', 'cif'].includes(fileStore.fileType)) {
				molViewerStore.setMolData(file.data as Mmol, 'mmol')
			}

			// We can force the usage of a different module with ?use=OtherModule.
			if (prevRouteType != 'file') loadModule(fileStore.moduleName)
			prevRouteType = 'file'
		},
	})
}

// Load the dynamic module.
function loadModule(moduleName: string | null) {
	// console.log('loadModule', moduleName)
	loadError.value = false
	if (!moduleName) {
		dynamicModule.value = null
		return
	}
	dynamicModule.value = defineAsyncComponent(() =>
		import(`../viewers/${moduleName}.vue`).catch(() => {
			loadError.value = true
		}),
	)
}
</script>

<style lang="css" scoped></style>
