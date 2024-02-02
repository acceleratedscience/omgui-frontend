<template>
    <div id="col-scroll" ref="colScroll">
        <div id="col-wrap">
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

                    <!-- Hidden directories -->
                    <div
                        v-for="(dir_hidden, key) in column['dirs_hidden']"
                        :key="key"
                        class="dir hidden"
                        :title="dir_hidden.filename"
                        @click="(e) => fetchNextLevel(e, dir_hidden.path, level + 1)"
                    >
                        {{ dir_hidden.filename }}
                    </div>

                    <!-- Directories -->
                    <div
                        v-for="(dir, key) in column['dirs']"
                        :key="key"
                        class="dir"
                        :title="dir.filename"
                        @click="(e) => fetchNextLevel(e, dir.path, level + 1)"
                    >
                        {{ dir.filename }}
                    </div>

                    <!-- Hidden files -->
                    <div
                        v-for="(file_hidden, key) in column['files_hidden']"
                        :key="key"
                        class="file hidden"
                        :title="file_hidden.filename"
                        @click="(e) => previewFile(e, file_hidden, level + 1)"
                    >
                        &#9737;&nbsp; {{ file_hidden.filename }}
                    </div>

                    <!-- Files -->
                    <div
                        v-for="(file, key) in column['files']"
                        :key="key"
                        class="file"
                        :title="file.filename"
                        @click="(e) => previewFile(e, file, level + 1)"
                    >
                        &#9737;&nbsp; {{ file.filename }}
                    </div>

                    <!-- Empty directory -->
                    <div v-if="column['_meta']['empty']" class="empty">Empty directory</div>
                </div>
                <div v-if="levels && level < levels.length - 1" class="col-split"></div>
            </template>

            <!-- File preview column -->
            <div v-if="filePreview" class="column">
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

            <!-- <div class="column filler">
                <div class="col-header"></div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import type { ComputedRef } from 'vue'
import { prettySize, timeAgo } from '@/utils/helpers'

// Api
import { FileSystemApi } from '@/api/ApiService'
const fileSystemApi = new FileSystemApi()

type Dir = {
    _meta: {
        name: string
        size: number
        time_created: number
        time_edited: number
    }

    filename: string
    path: string
}
type File = Dir & {
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

const levels = ref<Level[] | null>(null)
const filePreview = ref<File | null>(null)
const colScroll = ref<HTMLDivElement | null>(null)
const columns = ref<HTMLDivElement[] | null>(null)
const lastCol: ComputedRef<HTMLDivElement | undefined> = computed(() =>
    columns.value ? columns.value[columns.value.length - 1] : undefined,
)
const secondLastCol: ComputedRef<HTMLDivElement | undefined> = computed(() =>
    columns.value ? columns.value[columns.value.length - 2] : undefined,
)

onMounted(async () => {
    // Initialize levels array.
    levels.value = levels.value ? levels.value : []

    // Load root level
    fetchNextLevel()
})

//
//

// Preview file information in rightmost column.
async function previewFile(e: MouseEvent | undefined = undefined, file: File, level: number) {
    // Remove selection state of clicked column.
    deselectCol(level - 1)
    if (e) (e.target as Element).classList.add('sel')

    // Prepare file object for display.
    file.disp_size = prettySize(file._meta.size)
    file.disp_time_created = timeAgo(file._meta.time_created)
    file.disp_time_edited = timeAgo(file._meta.time_edited)

    // Display preview into rightmost column.
    // levels.value.splice(level) // Remove all levels after this one.
    // levels.value[level] = file
    console.log(44, file)
    filePreview.value = file
}

// Remove file preview.
function hidePreviewFile() {
    filePreview.value = null
}

// Load the next level of files and add column.
async function fetchNextLevel(
    e: MouseEvent | undefined = undefined,
    path: string = '',
    level: number = 0,
) {
    const files = await fetchWorkspaceFiles(path)
    console.log(22, files)
    if (files) {
        hidePreviewFile() // Remove file preview.
        if (levels.value) {
            levels.value.splice(level) // Remove all levels after this one.
            levels.value[level] = files // Add new level.
        }
    }

    // When triggered from tapping a dir name, highlight the dir.
    if (e) {
        // Remove selection state of clicked column.
        deselectCol(level - 1)
        ;(e.target as Element).classList.add('sel')

        await nextTick()

        // In case you clicked on the parent folder.
        deselectCol(-1)

        // Scroll to the right
        const lastColWidth = lastCol.value ? lastCol.value.clientWidth : 0
        const secondLastColWidth = secondLastCol.value ? secondLastCol.value.clientWidth : 0
        const maxScroll = colScroll.value ? colScroll.value.scrollWidth - lastColWidth - secondLastColWidth : 0 // prettier-ignore
        if (colScroll.value) colScroll.value.scrollLeft = maxScroll
    }
}

// Focus on a selected column and remove selected state from its children.
async function resetCol(level: number) {
    console.log('resetCol', columns, lastCol)
    if (levels.value) levels.value.splice(level + 1) // Remove all levels after this one.

    await nextTick()
    deselectCol(-1)
}

// Remove dir/file selection state of a column.
// Accepts negative level to count from the right.
function deselectCol(level: number) {
    if (!columns.value) return
    level = (level + columns.value.length) % columns.value.length
    columns.value[level]
        .querySelectorAll('.dir, .file')
        .forEach((elm) => elm.classList.remove('sel'))
}

// Return structured content of a directory.
async function fetchWorkspaceFiles(path = '') {
    const { status, data, statusText } = await fileSystemApi.workspace(path)
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
#col-scroll {
    overflow-x: auto;
    margin: 0 -40px;
    scroll-behavior: smooth;
    width: 100vw;
    // border: solid 1px red;
}
#col-wrap {
    display: flex;
    flex-direction: row;
    padding-left: 24px;
    height: 100vh;
    // border: solid 1px green;
}

// Column
#col-wrap .column {
    // padding-right: 8px;
    // margin-right: 8px;
    flex: 200px 0 0;
    height: 100%;
    overflow-y: auto;
    // border: solid 1px blue;
}
#col-wrap .column:not(:last-child) {
    // max-width: 200px;
    border-right: solid 1px #eee;
}
#col-wrap .column:last-child {
    // min-width: 0; // This makes sure the last column is also truncated.
    min-width: 200px;
    margin-right: 0;
    padding-right: 40px;
    flex: none;
}
// #col-wrap .column.filler {
//     min-width: 0;
//     flex: 0px 0 1;
// }

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
}
#col-wrap .col-split::after {
    content: '/';
    width: 10px;
    position: absolute;
    top: 0;
    left: -4px;
    // background: pink;
}

// Column name
#col-wrap .col-header {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    font-weight: 600;
    padding: 0 16px;
    margin-bottom: 8px;
    font-style: italic;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
    border-bottom: solid 1px #eee;
    cursor: pointer;
    box-sizing: border-box;
    // background: linear-gradient(rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);

    // Truncate
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
#col-wrap .col-header.root {
    border: none;
}
#col-wrap .col-header.root::after {
    content: 'Workspace';
    opacity: 0.5;
    font-weight: 400;
    padding-left: 5px;
}
#col-wrap .col-header.root::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    width: calc(100% - 16px);
    height: 0;
    border-bottom: solid 1px #eee;
}

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

    // Truncate
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
#col-wrap .dir:hover,
#col-wrap .file:hover {
    background: #eee;
}
#col-wrap .dir:hover::after,
#col-wrap .dir.sel::after {
    content: '\25B6';
    color: var(--ibm-black);
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    padding: 0;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 8px;
    // background: red;
}
#col-wrap .dir.sel,
#col-wrap .file.sel {
    color: #fff;
    background: var(--ibm-blue);
    padding-right: 23px;
}
#col-wrap .dir.sel::after,
#col-wrap .file.sel::after {
    color: #fff;
}
#col-wrap .hidden {
    color: rgba(0, 0, 0, 0.3);
}
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
    margin: 0 8px;
}
#file-preview b {
    display: block;
}
#file-preview .soft {
    margin-top: 8px;
}
</style>
@/util/general
