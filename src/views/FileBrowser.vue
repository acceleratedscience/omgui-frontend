<template>
    <div id="col-scroll" ref="colScroll">
        <div id="col-wrap">
            <template v-for="(files, level) in levels" :key="level">
                <div class="column" ref="columns">
                    <!-- <div class="column" :ref="level == levels.length - 1 ? 'lastCol' : null"> -->
                    <div class="col-name" :class="{ root: level == 0 }" @click="resetCol(level)">
                        {{ /*(level == 0 ? '' : '/') + */ files['_info']['title'] }}
                    </div>

                    <!-- Hidden directories -->
                    <div
                        v-for="(dir_hidden, key) in files['dirs_hidden']"
                        :key="key"
                        class="dir hidden"
                        :title="dir_hidden.filename"
                        @click="(e) => fetchNextLevel(e, dir_hidden.path, level + 1)"
                    >
                        {{ dir_hidden.filename }}
                    </div>

                    <!-- Directories -->
                    <div
                        v-for="(dir, key) in files['dirs']"
                        :key="key"
                        class="dir"
                        :title="dir.filename"
                        @click="(e) => fetchNextLevel(e, dir.path, level + 1)"
                    >
                        {{ dir.filename }}
                    </div>

                    <!-- Hidden files -->
                    <div
                        v-for="(file_hidden, key) in files['files_hidden']"
                        :key="key"
                        class="file hidden"
                        :title="file_hidden.filename"
                    >
                        &#9737;&nbsp; {{ file_hidden.filename }}
                    </div>

                    <!-- Files -->
                    <div
                        v-for="(file, key) in files['files']"
                        :key="key"
                        class="file"
                        :title="file.filename"
                    >
                        &#9737;&nbsp; {{ file.filename }}
                    </div>

                    <!-- Empty -->
                    <div v-if="files['_info']['empty']" class="empty">Empty directory</div>
                </div>
                <div v-if="level < levels.length - 1" class="col-split"></div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'

// Api
import { FileSystemApi } from '@/api/ApiService'
const pinia = {}
const router = {}
const fileSystemApi = new FileSystemApi(pinia, router)

let levels = ref(null)
const colScroll = ref(null)
const columns = ref(null)
const lastCol = computed(() => columns.value[columns.value.length - 1])
const secondLastCol = computed(() => columns.value[columns.value.length - 2])
console.log(columns, lastCol)

onMounted(async () => {
    // Initialize levels array.
    levels.value = levels.value ? levels.value : []

    // Load root level
    fetchNextLevel()
})

//
//

// Load the next level of files and add column.
async function fetchNextLevel(e = null, path = '', level = 0) {
    const files = await fetchWorkspaceFiles(path)
    console.log(22, files)
    if (files) {
        levels.value.splice(level) // Remove all levels after this one.
        levels.value[level] = files // Add new level.
    }

    // When triggered from tapping a dir name, highlight the dir.
    if (e) {
        // Remove selection state of clicked column
        const dirs = e.target.parentElement.querySelectorAll('.dir')
        dirs.forEach((dir) => dir.classList.remove('sel'))
        e.target.classList.add('sel')

        await nextTick()

        // In case you clicked on the parent folder.
        deselectLastCol()

        // Scroll to the right
        const lastColWidth = lastCol.value.clientWidth
        const secondLastColWidth = secondLastCol.value ? secondLastCol.value.clientWidth : 0
        const maxScroll = colScroll.value.scrollWidth - lastColWidth - secondLastColWidth
        colScroll.value.scrollLeft = maxScroll
    }
}

// Focus on a selected column and remove selected state from its children.
async function resetCol(level) {
    console.log('resetCol', columns, lastCol)
    levels.value.splice(level + 1) // Remove all levels after this one.

    await nextTick()

    deselectLastCol()
    // colScroll.value.scrollLeft = colScroll.value.scrollWidth - lastCol.value.clientWidth
}

// Remove selection state of the last column.
function deselectLastCol() {
    lastCol.value.querySelectorAll('.dir').forEach((dir) => dir.classList.remove('sel'))
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
#col-wrap .col-name {
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
    // background: linear-gradient(rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
}
#col-wrap .col-name.root {
    border: none;
}
#col-wrap .col-name.root::after {
    content: 'Workspace';
    opacity: 0.5;
    font-weight: 400;
    padding-left: 5px;
}
#col-wrap .col-name.root::before {
    content: '';
    display: block;
    position: absolute;
    bottom: -1px;
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

    // Truncate
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
#col-wrap .dir:hover,
#col-wrap .file:hover {
    background: #eee;
}
#col-wrap .dir.sel,
#col-wrap .file.sel {
    color: #fff;
    background: var(--ibm-blue);
}
#col-wrap .hidden {
    opacity: 0.3;
}
#col-wrap .empty {
    opacity: 0.3;
    font-style: italic;
    cursor: default;
}
</style>
