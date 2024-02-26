<template>
	<div id="col-scroll-x" ref="colScroll">
		<div id="col-wrap">
			<!-- Filler column left -->
			<div class="column filler-left" :class="{ headless: mainStore.headless }">
				<div class="col-header"></div>
				<div class="col-body"></div>
			</div>

			<!-- Directory columns -->
			<template v-for="(column, level) in levels" :key="level">
				<div class="column" ref="columns">
					<!-- Column header -->
					<div
						class="col-header"
						:class="{ root: level == 0 }"
						:title="column['_meta']['name']"
						@click="resetCol(level)"
					>
						{{ column['_meta']['name'] }}
					</div>

					<div class="col-body">
						<!-- Hidden directories -->
						<div
							v-for="(dir_hidden, key) in column['dirs_hidden']"
							:key="key"
							class="dir hidden"
							:class="{ sel: dir_hidden.sel }"
							:title="dir_hidden.filename"
							@click="
								() =>
									fetchNextLevel(
										dir_hidden.path,
										dir_hidden.filename,
										level + 1,
										true,
									)
							"
						>
							<div>{{ dir_hidden.filename }}</div>
							<SvgServe filename="icn-caret-right" :key="dir_hidden.filename" />
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
							<SvgServe filename="icn-caret-right" :key="dir.filename" />
						</div>

						<!-- Hidden files -->
						<div
							v-for="(file_hidden, key) in column['files_hidden']"
							:key="key"
							class="file hidden"
							:class="{ sel: file_hidden.sel }"
							:data-type="file_hidden._meta.type"
							:data-ext="file_hidden._meta.ext"
							:title="file_hidden.filename"
							@click="() => previewFile(file_hidden, level + 1, true)"
							@dblclick="openFile(file_hidden)"
						>
							<SvgServe
								:filename="'icn-' + file_hidden._meta.type"
								:key="file_hidden._meta.type"
							/>
							<div>{{ file_hidden.filename }}</div>
						</div>

						<!-- Files -->
						<div
							v-for="(file, key) in column['files']"
							:key="key"
							class="file"
							:class="{ sel: file.sel }"
							:data-type="file._meta.type"
							:data-ext="file._meta.ext"
							:title="file.filename"
							@click="() => previewFile(file, level + 1, true)"
							@dblclick="openFile(file)"
						>
							<SvgServe :filename="'icn-' + file._meta.type" :key="file._meta.type" />
							<div>{{ file.filename }}</div>
						</div>

						<!-- Empty directory -->
						<div v-if="column['_meta']['empty']" class="empty">Empty directory</div>
					</div>
				</div>
				<div
					v-if="(levels && level < levels.length - 1) || filePreview"
					class="col-split"
				></div>
			</template>

			<!-- File preview column -->
			<div v-if="filePreview" class="column file-preview">
				<!-- Column header -->
				<div class="col-header" :title="filePreview['_meta']['name']">
					{{ filePreview['_meta']['name'] }}
				</div>

				<!-- File preview -->
				<div id="file-preview">
					<b>{{ filePreview._meta.name }}</b>
					<small>
						<i>{{ filePreview.disp_size }}</i>
						<div class="soft">
							Created: {{ filePreview.disp_time_created }}<br />
							Last edit: {{ filePreview.disp_time_edited }}
						</div>
					</small>
				</div>
			</div>

			<!-- Filler column left -->
			<div class="column filler-right">
				<div class="col-header"></div>
				<div class="col-body"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Stores
import { useMainStore } from '@/stores/MainStore'
// import { usePopStateStore } from '@/stores/PopStateStore--trash' // trash

// API
import { useApiStore } from '@/stores/ApiStore'
import type { FileSystemApi as FileSystemApiType } from '@/api/ApiService'
const apiStore = useApiStore()
const fileSystemApi: FileSystemApiType | null = apiStore.loadApi('fileSystem') as FileSystemApiType | null // prettier-ignore

// Components
import SvgServe from '@/components/SvgServe.vue'

// Utils
import { prettySize, timeAgo } from '@/utils/helpers'

// Types
type Dir = {
	_meta: {
		name: string
		size: number
		time_created: number
		time_edited: number
	}

	filename: string
	path: string
	sel: boolean // Selection state, not from API
}
type File = Dir & {
	_meta: {
		type: string
		ext: string
	}
	disp_size: string
	disp_time_created: string
	disp_time_edited: string
}
type Level = {
	_meta: {
		name: string
		empty: boolean
		empty_hidden: boolean
	}

	dirs: Dir[]
	dirs_hidden: Dir[]
	files: File[]
	files_hidden: File[]
}

// Definitions
const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
// const popStateStore = usePopStateStore() // trash

//
//

const mounted = ref(false)
const levels = ref<Level[] | null>(null)
const filePreview = ref<File | null>(null)
const colScroll = ref<HTMLDivElement | null>(null)
const columns = ref<HTMLDivElement[] | null>(null)

onMounted(async () => {
	mounted.value = true

	// Initialize levels array.
	levels.value = levels.value ? levels.value : []

	// Parse the route and load the appropriate files.
	parseRoute()

	// Update UI when going back/forward in the browser history.
	window.addEventListener('popstate', parseRoute)
})

onBeforeUnmount(() => {
	mounted.value = false

	// Remove event listener.
	window.removeEventListener('popstate', parseRoute)
})

// trash
// watch(
// 	() => route.path,
// 	() => {
// 		console.log('x x x x x')
// 		// parseRoute()
// 	},
// )

//
//

// Parse the route and load the appropriate files.
async function parseRoute() {
	console.log('parseRoute')
	// When going back or forward in the history while
	// leaving the fileBrowser module, the popstate
	// triggers parseRoute before the listener is removed.
	// Hence we need to catch this.

	// Fetch root level
	await fetchNextLevel()

	// Fetch consecutive levels & mark selection state.
	const path = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
	const pathArr = path.split('/').filter((item) => !!item)
	for (const [i, dirName] of pathArr.entries()) {
		const dirPath = pathArr.slice(0, i + 1).join('/')
		await fetchNextLevel(dirPath, dirName, i + 1)
	}

	// Select and preview the file in focus.
	const filename = route.hash.replace(/^#/, '')
	if (levels.value && filename && filename.length > 0) {
		const thisLevel = levels.value[levels.value.length - 1]
		const files = thisLevel.files.concat(thisLevel.files_hidden)
		const file = files.filter((file) => file.filename === filename)[0]
		previewFile(file, levels.value.length)
	}
}

// Preview file information in rightmost column.
async function previewFile(file: File, level: number, fromClick: boolean = false) {
	// Update the URL.
	if (!fromClick) {
		const re = new RegExp('/?' + file.filename + '$')
		const previewPath = file.path.replace(re, '')
		const headless = mainStore.headless ? '/headless' : ''
		router.push(headless + '/~/' + previewPath + '#' + file.filename)
	}

	// Update selection state.
	deselectCol(level - 1) // Remove selection state of clicked column.
	file.sel = true // Set current file as selected.

	// Prepare file object for display.
	file.disp_size = prettySize(file._meta.size)
	file.disp_time_created = timeAgo(file._meta.time_created)
	file.disp_time_edited = timeAgo(file._meta.time_edited)

	// Display preview into rightmost column.
	if (levels.value) levels.value.splice(level) // Remove all levels after this one.
	filePreview.value = file

	// Scroll to the right.
	if (fromClick) scrollRight()
}

// Remove file preview.
function hidePreviewFile() {
	filePreview.value = null
}

function openFile(file: File) {
	router.push('/~/' + file.path)
}

// Load the next level of files and add column.
async function fetchNextLevel(
	path: string = '',
	filename: string = '',
	level: number = 0,
	fromClick: boolean = false,
) {
	// When you go back and forward in the history, going from the
	// filebrowser module to a file viewer module, parseRoute will
	// be be called and it will start fetching files for every level
	// of the path before the component has unmounted. There's no way
	// to prevent this, so all we can do is to abort it as soon as
	// the component is unmounted.
	if (!mounted.value) return

	// Update the URL.
	if (fromClick) {
		router.push('/~/' + path)
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

	// Scroll to the right -- trash
	// const lastColWidth = lastCol.value ? lastCol.value.clientWidth : 0
	// const secondLastColWidth = secondLastCol.value ? secondLastCol.value.clientWidth : 0
	// const maxScroll = colScroll.value ? colScroll.value.scrollWidth - lastColWidth - secondLastColWidth : 0 // prettier-ignore
	// console.log(111, lastColWidth, secondLastColWidth, maxScroll)
	// if (colScroll.value) colScroll.value.scrollLeft = maxScroll

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
		const items =
			type == 'dir'
				? thisLevel.dirs.concat(thisLevel.dirs_hidden)
				: thisLevel.files.concat(thisLevel.files_hidden)
		const item = items.filter((item) => item.filename === filename)[0]
		// console.log(333, items, item)
		// console.log('*', level, type, filename) %%
		if (item) item.sel = true
	}
}

// Focus on a selected column and remove selected state from its children.
async function resetCol(level: number) {
	if (levels.value) levels.value.splice(level + 1) // Remove all levels after this one.
	deselectCol(level)
	hidePreviewFile()
}

// Remove dir/file selection state of a column.
// Accepts negative level to count from the right.
function deselectCol(level: number) {
	if (!levels.value) return
	levels.value[level].dirs.forEach((dir) => (dir.sel = false))
	levels.value[level].dirs_hidden.forEach((dir_hidden) => (dir_hidden.sel = false))
	levels.value[level].files.forEach((file) => (file.sel = false))
	levels.value[level].files_hidden.forEach((file_hidden) => (file_hidden.sel = false))
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
	// margin: 0 -40px;
	// width: 100vw;
	// border: solid 1px red;
}
#col-wrap {
	display: flex;
	flex-direction: row;
	// padding-left: 24px;
	height: 100%;
	// height: 100vh;
	// border: solid 1px green;
}

// Column
#col-wrap .column {
	// padding-right: 8px;
	// margin-right: 8px;
	flex: 200px 0 0;
	height: 100%;
	overflow-y: auto;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	// border: solid 1px blue;
}
#col-wrap .column.file-preview {
	flex-basis: 300px;
}
#col-wrap .column:not(.file-preview) {
	min-width: 0; // This makes sure the last column is also truncated.
	// min-width: 200px;
	margin-right: 0;
	// padding-right: 40px;
	// flex: none;
}

// Column split (tab in between column titles)
#col-wrap .col-split {
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
#col-wrap .col-split::after {
	content: '/';
	width: 10px;
	position: absolute;
	top: 0;
	left: -4px;
	// background: pink;
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
	// background: linear-gradient(rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);

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
// #col-wrap .col-header.root::before {
// 	content: '';
// 	display: block;
// 	position: absolute;
// 	bottom: 0;
// 	width: calc(100% - 16px);
// 	height: 0;
// 	border-bottom: solid 1px #eee;
// }

// Column body (scrolls)
#col-wrap .col-body {
	padding-top: 8px;
	padding-bottom: 40px;
	overflow-y: auto;
	height: 100%;
	// border: solid 1px red;
}

// Column fillers
#col-wrap .column.filler-left {
	flex: 0 0 24px;
	border-right: none;
	// background: pink;
}
#col-wrap .column.filler-left.headless {
	flex-basis: 0;
}
#col-wrap .column.filler-right {
	flex: 1 1 auto;
	border-right: none;
	// background: pink;
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
#col-wrap .dir > div:not(.svg-wrap),
#col-wrap .file > div:not(.svg-wrap),
#col-wrap .empty {
	// Truncate
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

// Icons
#col-wrap .file .svg-wrap,
#col-wrap .dir .svg-wrap {
	width: 16px;
	height: 16px;
	flex: 16px 0 0;
}
#col-wrap .dir > div:not(.svg-wrap) {
	flex: 1;
}
#col-wrap .dir .svg-wrap {
	color: var(--black-30);
}
#col-wrap .dir {
	padding-right: 3px;
}

// Selected state
#col-wrap .dir.sel,
#col-wrap .file.sel {
	color: #fff;
	background: var(--ibm-blue);
}
#col-wrap .dir.sel .svg-wrap {
	color: #fff;
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
	background: #fafafa;
	padding: 16px;
	margin: 8px;
	min-width: 200px;
}
#file-preview b {
	display: block;
}
#file-preview .soft {
	margin-top: 8px;
}

/**
 * Hover states
 */

@media (hover: hover) {
	// Files & folders
	#col-wrap .dir:not(.sel):hover,
	#col-wrap .file:not(.sel):hover {
		background: #eee;
	}

	// Arrow after directory names
	#col-wrap .dir:not(.sel):hover .svg-wrap {
		color: var(--ibm-black);
	}
}
</style>
