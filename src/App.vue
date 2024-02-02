<script setup lang="ts">
import { computed } from 'vue'

// When requesting a "raw" module, we want to show it without the
// application wrapper. Because the router takes a moment before
// it can tell us if we are on a module path, we instead check the
// URL directly to avoid flash-loading the application wrapper.
const isRawModule = computed(() => {
    const pathItems = window.location.href.split('/').reverse()
    if (pathItems[0] == '') {
        pathItems.shift()
    }
    const isModulePath = pathItems[1] == 'module'
    return isModulePath
})
</script>

<template>
    <!-- Load a raw module -->
    <template v-if="isRawModule">
        <RouterView v-slot="{ Component }">
            <component v-if="Component" :is="Component" />
            <div v-else>Loading module...</div>
        </RouterView>
    </template>

    <!-- Load the full application -->
    <div v-else id="main-wrap">
        <header>
            <nav>
                <RouterLink to="/">Browse</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
                <RouterLink to="/a">Module A</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
                <RouterLink to="/b">Module B</RouterLink>
            </nav>
        </header>
        <div id="body">
            <RouterView />
        </div>
    </div>
</template>

<style scoped lang="scss">
#main-wrap {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 40px;
    // left: 40px;
    // top: 40px;
}
header {
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #eee;
    margin-bottom: 20px;
    // background: yellow;
}
nav {
    height: 40px;
    line-height: 40px;
    position: sticky;
    top: 20px;
    left: 40px;
    display: inline-block;
    border-bottom: solid 1px #eee;
    width: calc(100vw - 80px);
}
// #body {
//     // background: orange;
// }
</style>
