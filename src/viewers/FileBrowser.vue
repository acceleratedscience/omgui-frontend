<template>
	<div id="col-scroll-x" ref="colScroll">
		<div id="col-wrap" :class="{ modal: isModal }">
			<!-- Filler column left -->
			<div class="column filler-left" :class="{ headless: tight }">
				<div v-if="!isModal" class="col-header"></div>
				<div class="col-body"></div>
			</div>

			<!-- Directory columns -->
			<template v-for="(column, level) in levels" :key="level">
				<div class="column" ref="columns">
					<!-- Column header -->
					<div v-if="!isModal" class="col-header" :class="{ root: level == 0 }" :title="column.dirname" @click="(e) => resetCol(e, level)">
						<button class="btn-workspace" v-if="level == 0" @click="modalStore.display('ModalWorkspaces')">
							{{ column.dirname }}
						</button>
						<template v-else>
							{{ column.dirname }}
						</template>
					</div>

					<div class="col-body">
						<!-- Hidden directories -->
						<div
							v-for="(dir_hidden, key) in column['dirsHidden']"
							:key="key"
							class="dir hidden"
							:class="{ sel: dir_hidden.sel }"
							:title="dir_hidden.filename"
							@click="() => fetchNextLevel(dir_hidden.path, dir_hidden.filename, level + 1, true)"
						>
							<div>{{ dir_hidden.filename }}</div>
							<BaseSvgServe icon="icn-caret-right" :key="dir_hidden.filename" />
						</div>

						<!-- Directories -->
						<div
							v-for="(dir, key) in column['dirs']"
							:key="key"
							class="dir"
							:class="{ sel: dir.sel }"
							:title="dir.filename"
							@click="() => fetchNextLevel(dir.path, dir.filename, level + 1, true)"
						>
							<div>{{ dir.filename }}</div>
							<BaseSvgServe icon="icn-caret-right" :key="dir.filename" />
						</div>

						<!-- Hidden files -->
						<div
							v-for="(file_hidden, key) in column['filesHidden']"
							:key="key"
							class="file hidden"
							:class="{ sel: file_hidden.sel }"
							:data-type="file_hidden._meta.fileType"
							:data-ext="file_hidden._meta.ext"
							:title="file_hidden.filename"
							@click="() => previewFile(file_hidden, level + 1, true)"
							@dblclick="openFile(file_hidden)"
						>
							<BaseSvgServe :icon="'icn-file-' + file_hidden._meta.fileType" :key="String(file_hidden._meta.fileType)" />
							<div>{{ file_hidden.filename }}</div>
						</div>

						<!-- Files -->
						<div
							v-for="(file, key) in column['files']"
							:key="key"
							class="file"
							:class="{ sel: file.sel }"
							:data-type="file._meta.fileType"
							:data-ext="file._meta.ext"
							:title="file.filename"
							@click="() => previewFile(file, level + 1, true)"
							@dblclick="openFile(file)"
							:x="'icn-file-' + file._meta.fileType"
						>
							<BaseSvgServe :icon="'icn-file-' + file._meta.fileType" :key="String(file._meta.fileType)" />
							<div>{{ file.filename }}</div>
						</div>

						<!-- Empty directory -->
						<div v-if="column['_meta']['empty']" class="empty">Empty directory</div>
					</div>
				</div>
				<div v-if="(levels && level < levels.length - 1) || filePreview" class="col-split"></div>
			</template>

			<!-- File preview column -->
			<div v-if="filePreview && !isModal" class="column file-preview">
				<!-- Column header -->
				<div class="col-header" :title="filePreview.filename">
					{{ filePreview.filename }}
				</div>

				<!-- File preview -->
				<div id="file-preview">
					<b>{{ filePreview.filename }}</b>
					<small>
						<i>{{ filePreview.dispSize }}</i>
						<div class="soft">
							Created: {{ filePreview.dispTimeCreated }}<br />
							Last edit: {{ filePreview.dispTimeEdited }}
						</div>
						<cv-button size="small" kind="secondary" @click="openFile(filePreview)">open</cv-button>
					</small>
				</div>
			</div>

			<!-- Filler column left -->
			<div class="column filler-right">
				<div v-if="!isModal" class="col-header"></div>
				<div class="col-body"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useModalStore } from '@/stores/ModalStore'
import { useFileStore } from '@/stores/FileStore'
const mainStore = useMainStore()
const modalStore = useModalStore()
const fileStore = useFileStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Components
import BaseSvgServe from '@/components/BaseSvgServe.vue'

// Utils
import { prettySize, timeAgo } from '@/utils/helpers'

// Type declarations
import type { Level, File } from '@/types'

// Definitions
const router = useRouter()
const route = useRoute()
const mounted = ref(false)
const levels = ref<Level[] | null>(null)
const filePreview = ref<File | null>(null)
const colScroll = ref<HTMLDivElement | null>(null)
const columns = ref<HTMLDivElement[] | null>(null)

// Emits
const emit = defineEmits(['update:modelValue'])

// Props
const props = defineProps<{
	// When the filebrowser is loaded inside the save-file modal.
	isModal?: boolean
	// This lets us v-model a path in the save-file modal.
	modelValue?: string
}>()

/*
 * Computed
 */

const tight = computed<boolean>(() => {
	return props.isModal ?? mainStore.headless
})

/**
 * Hooks
 */

onMounted(async () => {
	mounted.value = true

	// Initialize levels array.
	levels.value = levels.value ? levels.value : []

	// Parse the route and load the appropriate files.
	parseRoute()

	// Update UI when going back/forward in the browser history.
	if (!props.isModal) window.addEventListener('popstate', parseRoute)
})

onBeforeUnmount(() => {
	mounted.value = false

	// Remove event listener.
	if (!props.isModal) window.removeEventListener('popstate', parseRoute)
})

// When the workspace is switched using the
// workspace modal, we need to reload the files.
watch(
	() => mainStore.workspace,
	(newVal, oldVal) => {
		if (newVal && oldVal) fetchNextLevel()
	},
)

/**
 * Methods
 */

// Parse the route and load the appropriate files.
async function parseRoute() {
	// console.log('fb parseRoute')

	// Fetch root level
	await fetchNextLevel()

	// Fetch consecutive levels & mark selection state.
	const path = props.isModal && props.modelValue != undefined ? props.modelValue : route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const pathArr = path.split('/').filter((item) => !!item)
	for (const [i, dirName] of pathArr.entries()) {
		const dirPath = pathArr.slice(0, i + 1).join('/')
		await fetchNextLevel(dirPath, dirName, i + 1)
	}

	// Select and preview the file in focus.
	const filename = route.hash.replace(/^#/, '')
	if (levels.value && filename && filename.length > 0) {
		const thisLevel = levels.value[levels.value.length - 1]
		const files = thisLevel.files.concat(thisLevel.filesHidden)
		const file = files.filter((file) => file.filename === filename)[0]
		if (file) {
			previewFile(file, levels.value.length)
		} else {
			// Remove the hash from the route
			if (!props.isModal) router.push({ path: route.path, query: route.query })
		}
	}
}

// Preview file information in rightmost column.
async function previewFile(file: File, level: number, fromClick: boolean = false) {
	// Update the URL.
	// if (!fromClick) {
	const re = new RegExp('/?' + file.filename + '$')
	const previewPath = file.path.replace(re, '')
	const headlessPath = tight.value ? '/headless' : ''
	if (!props.isModal) router.push(headlessPath + '/~/' + previewPath + '#' + file.filename)
	// }

	// Update selection state.
	deselectCol(level - 1) // Remove selection state of clicked column.
	file.sel = true // Set current file as selected.

	// Prepare file object for display.
	file.dispSize = prettySize(file._meta.size)
	file.dispTimeCreated = timeAgo(file._meta.timeCreated)
	file.dispTimeEdited = timeAgo(file._meta.timeEdited)

	// Display preview into rightmost column.
	if (levels.value) levels.value.splice(level) // Remove all levels after this one.
	filePreview.value = file

	// Scroll to the right.
	// if (fromClick)
	scrollRight()
}

// Remove file preview.
function hidePreviewFile() {
	filePreview.value = null
}

function openFile(file: File) {
	// You can't open files in the ModalSaveFile modal.
	if (props.isModal) return

	const fileSize = file._meta.size
	const over3MB = fileSize && fileSize > 3000000
	const over10MB = fileSize && fileSize > 10000000
	const over20MB = fileSize && fileSize > 20000000

	// Show warning when a file is over 3MB.
	if (over3MB) {
		const displaySize = over20MB ? '20 MB' : over10MB ? '10 MB' : '3 MB'
		let message = over20MB
			? 'It may take up to several minutes to load.'
			: over10MB
				? 'It may take a minute to load.'
				: 'It may take a few seconds to load.'
		message += ' Are you sure you want to continue?'

		modalStore.confirm(message, {
			title: `This file is over ${displaySize}`,
			primaryBtn: 'Open',
			onSubmit: () => {
				fileStore.setForcedLoading(true)
				router.push('/~/' + file.path)
			},
		})
	} else {
		router.push('/~/' + file.path)
	}
}

// Load the next level of files and add column.
async function fetchNextLevel(path: string = '', filename: string = '', level: number = 0, fromClick: boolean = false) {
	// When you go back and forward in the history, going from the
	// filebrowser module to a file viewer module, parseRoute will
	// be be called and it will start fetching files for every level
	// of the path before the component has unmounted. There's no way
	// to prevent this, so all we can do is to abort it as soon as
	// the component is unmounted.
	if (!mounted.value) return

	// Update the URL.
	if (fromClick) {
		if (props.isModal) {
			emit('update:modelValue', path)
		} else {
			router.push('/~/' + path)
		}
	}

	// Update selection state.
	if (level > 0) {
		markSelected(level - 1, 'dir', filename)
	}

	// Load next level.
	const files = await fetchWorkspaceFiles(path)
	if (files) {
		hidePreviewFile() // Remove file preview.
		if (levels.value) {
			levels.value.splice(level) // Remove all levels after this one.
			levels.value[level] = files // Add new level.
		}
	}

	// Scroll to the right.
	if (fromClick) scrollRight()
}

async function scrollRight() {
	await nextTick()
	if (colScroll.value) colScroll.value.scrollLeft = 9999999999999
}

// Set selection state of clicked file or directory.
function markSelected(level: number, type: 'dir' | 'file', filename: string) {
	// Remove selection state from all items in this column.
	deselectCol(level)

	// Set selection state for the clicked item.
	if (levels.value) {
		const thisLevel = levels.value[level]
		const items = type == 'dir' ? thisLevel.dirs.concat(thisLevel.dirsHidden) : thisLevel.files.concat(thisLevel.filesHidden)
		const item = items.filter((item) => item.filename === filename)[0]
		if (item) item.sel = true
	}
}

// Focus on a selected column and remove selected state from its children.
async function resetCol(e: MouseEvent, level: number) {
	// When clicking the workspace button, we don't want to reset the column.
	if ((e.target as HTMLElement)?.tagName === 'BUTTON') return

	if (levels.value) levels.value.splice(level + 1) // Remove all levels after this one.
	deselectCol(level)
	hidePreviewFile()
}

// Remove dir/file selection state of a column.
// Accepts negative level to count from the right.
function deselectCol(level: number) {
	if (!levels.value) return
	levels.value[level].dirs.forEach((dir) => (dir.sel = false))
	levels.value[level].dirsHidden.forEach((dir_hidden) => (dir_hidden.sel = false))
	levels.value[level].files.forEach((file) => (file.sel = false))
	levels.value[level].filesHidden.forEach((file_hidden) => (file_hidden.sel = false))
}

// Return structured content of a directory.
async function fetchWorkspaceFiles(path = '') {
	if (!fileSystemApi) return
	const { status, data, statusText } = await fileSystemApi.getWorkspaceFiles(path)
	if (status !== 200) {
		console.error(statusText)
		return
	} else {
		return data
	}
}
</script>

<style scoped lang="scss">
/**
 * Columns
 */

// Horizontal scroll
#col-scroll-x {
	overflow-x: auto;
	scroll-behavior: smooth;
	height: 100%;
}
#col-wrap {
	display: flex;
	flex-direction: row;
	height: 100%;
}

// Column
#col-wrap .column {
	flex: 200px 0 0;
	height: 100%;
	overflow-y: auto;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}
#col-wrap .column.file-preview {
	flex-basis: 300px;
}
#col-wrap .column:not(.file-preview) {
	min-width: 0; // This makes sure the last column is also truncated.
	margin-right: 0;
}

// Column split (tab in between column titles)
#col-wrap:not(.modal) .col-split {
	height: 32px;
	line-height: 32px;
	position: relative;
	z-index: 2;
	text-align: center;
	width: 1px;
	margin-left: -1px;
	background: #fff;
	border-bottom: solid 1px #eee;
	box-sizing: border-box;
}
#col-wrap:not(.modal) .col-split::after {
	content: '/';
	width: 10px;
	position: absolute;
	top: 0;
	left: -4px;
}

// Column header
#col-wrap .col-header {
	height: 32px;
	line-height: 32px;
	font-size: 12px;
	font-weight: 600;
	padding: 0 16px;
	font-style: italic;
	background: #fff;
	border-bottom: solid 1px #eee;
	cursor: pointer;
	box-sizing: border-box;
	flex: 0 0 auto;

	// Truncate
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
#col-wrap .col-header.root::after {
	content: 'Workspace';
	opacity: 0.5;
	font-weight: 400;
	padding-left: 5px;
}
#col-wrap .btn-workspace {
	color: $black;
	background: $black-10;
	border: none;
	padding: 0 6px;
	height: 20px;
	line-height: 20px;
	border-radius: 2px;
	font-weight: 600;
	cursor: pointer;
}

// Column body (scrolls)
#col-wrap .col-body {
	padding-top: 8px;
	padding-bottom: 40px;
	overflow-y: auto;
	height: 100%;
}

// Column fillers
#col-wrap .column.filler-left {
	flex: 0 0 24px;
	border-right: none;
}
#col-wrap .column.filler-left.headless {
	flex-basis: 0;
}
#col-wrap .column.filler-right {
	flex: 1 1 auto;
	border-right: none;
}
#col-wrap .column.filler-left .col-header,
#col-wrap .column.filler-right .col-header {
	padding: 0;
}
#col-wrap .column:not(.filler-left):not(.filler-right) .col-body {
	border-right: solid 1px #eee;
}

// Tiny hack to make sure scrollbar border is not
// displaying as a double line next to the column border.
// #col-wrap .column:not(:last-child) {
// 	overflow-x: hidden;
// }
// #col-wrap .column:not(:last-child) .col-header,
// #col-wrap .column:not(:last-child) .col-body {
// 	margin-right: -1px;
// }

/**
 * Files
 */

// File and directory names
#col-wrap .dir,
#col-wrap .file,
#col-wrap .empty {
	height: 16px;
	line-height: 16px;
	padding: 6px 8px;
	margin: 0 8px;
	border-radius: 2px;
	cursor: pointer;
	position: relative;
	display: flex;
	gap: 8px;
	user-select: none;
	box-sizing: content-box;
}
#col-wrap .dir > div,
#col-wrap .file > div,
#col-wrap .empty {
	// Truncate
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

// Icons
#col-wrap .file svg,
#col-wrap .dir svg {
	flex: 0 0 16px;
}
#col-wrap .dir > div {
	flex: 1;
}
#col-wrap .dir svg {
	color: $black-30;
}
#col-wrap .dir {
	padding-right: 3px;
}

// Selected state
#col-wrap .dir.sel,
#col-wrap .file.sel {
	color: #fff;
	background: $blue;
}
#col-wrap .dir.sel svg {
	color: #fff;
}

// Disable file selecting in modal mode.
#col-wrap.modal .file {
	pointer-events: none;
	cursor: default;
}

// Hidden files
#col-wrap .hidden {
	color: rgba(0, 0, 0, 0.3);
}

// Empty files
#col-wrap .empty {
	opacity: 0.3;
	font-style: italic;
	cursor: default;
}

/**
 * File Preview
 */

#file-preview {
	background: $extra-soft-bg;
	padding: 16px;
	margin: 8px;
	min-width: 200px;
}
#file-preview b {
	display: block;
	margin-bottom: 4px;
}
#file-preview .soft {
	margin-top: 8px;
	margin-bottom: 8px;
}

/**
 * Hover
 */

@media (hover: hover) {
	// Workspace button
	#col-wrap .btn-workspace:hover {
		color: #fff;
		background: $black;
	}

	// Files & folders
	#col-wrap .dir:not(.sel):hover,
	#col-wrap .file:not(.sel):hover {
		background: #eee;
	}

	// Arrow after directory names
	#col-wrap .dir:not(.sel):hover svg {
		color: $black;
	}
}
</style>
