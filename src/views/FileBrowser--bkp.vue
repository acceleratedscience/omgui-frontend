<template>
    <div id="col-scroll" ref="colScroll">
        <div id="col-wrap">
            <div
                v-for="(files, level) in levels"
                :key="level"
                class="column"
                :ref="level == levels.length - 1 ? 'lastCol' : null"
            >
                <div class="col-name" :class="{ root: level == 0 }">
                    {{ /*(level == 0 ? '' : '/') + */ files['level_name'] }}
                </div>

                <!-- Hidden directories -->
                <div
                    v-for="(dir_hidden, key) in files['dirs_hidden']"
                    :key="key"
                    class="dir hidden"
                    :title="dir_hidden.filename"
                    @click="(e) => fetchNextLevel(e, dir.path, level + 1)"
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
            </div>
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
const lastCol = ref(null)

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

        // Remove selection state of the right column.
        // Needed when you click on parent folder.
        const columns = colScroll.value.querySelectorAll('.column')
        const lastCol = columns[columns.length - 1]
        console.log(44, lastCol)
        lastCol.querySelectorAll('.dir').forEach((dir) => dir.classList.remove('sel'))

        // Scroll to the right
        colScroll.value.scrollLeft = colScroll.value.scrollWidth
    }
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

#col-scroll {
    // overflow-x: auto;
    margin: 0 -40px;
    // scroll-behavior: smooth;
    // border: solid 1px red;
    // overflow: visible;
}
#col-wrap {
    display: flex;
    flex-direction: row;
    // max-width: 100vw;
    padding-left: 40px;
}
#col-wrap .column {
    padding-right: 16px;
    margin-right: 16px;
    flex: 200px 0 1;
}
#col-wrap .column:not(:last-child) {
    // max-width: 200px;
    border-right: solid 1px #eee;
}
#col-wrap .column:last-child {
    min-width: 0; // This makes sure the last column is also truncated.
    margin-right: 0;
    padding-right: 40px;
    flex: none;
}

/**
 * Files
 */

// Column name
.col-name {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    font-weight: 600;
    padding: 0 8px;
    margin: 0 -8px;
    margin-bottom: 12px;
    font-style: italic;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
    // border-bottom: solid 1px #eee;
    // background: linear-gradient(rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
}
.col-name::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    width: calc(100% - 16px);
    height: 1px;
    border-bottom: solid 1px #eee;
}
.col-name.root::after {
    content: 'Workspace';
    opacity: 0.5;
    font-weight: 400;
    padding-left: 5px;
}

// File and directory names
.dir,
.file {
    height: 16px;
    line-height: 16px;
    padding: 6px 8px;
    margin: 0 -8px;
    border-radius: 2px;
    cursor: pointer;

    // Truncate
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.dir:hover,
.file:hover {
    background: #eee;
}
.dir.sel,
.file.sel {
    color: #fff;
    background: #333;
}
.hidden {
    opacity: 0.3;
}
</style>
