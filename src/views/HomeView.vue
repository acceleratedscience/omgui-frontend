<script setup lang="ts">
// Stores
import { useMainStore } from '@/stores/main'
const mainStore = useMainStore()
</script>

<template>
    <main>
        <img src="@/assets/svg/icn-mol.svg" />
        <template v-if="mainStore.isHeadless()">
            <h1>You're in Headless Mode</h1>
            <a href="#" @click.prevent="mainStore.unsetHeadless(true)">Exit headless mode</a>
            <br /><br />
        </template>
        <p>Welcome to the peristent GUI prototype.</p>
        <p>
            Every route can be loaded in headless mode, which hides the application wrapper with the
            navigation.
        </p>
        <p>
            This makes it easy to import individual modules into a Jupyter Notebook or your own
            application.
        </p>
        <p>
            When you're in headless mode, all links you click will automatically be forwarded to
            their headless counterpart.
        </p>

        Try it out:<br />
        <ul>
            <li>
                <a href="#" @click.prevent="mainStore.setHeadless(true)">Headless home</a>
            </li>
            <li>
                <router-link :to="{ name: 'headless-filebrowser' }"
                    >Headless file browser</router-link
                >
            </li>
            <li>
                <router-link :to="{ name: 'headless-molviewer' }"
                    >Headless Molecule Viewer</router-link
                >
            </li>
            <li>
                <router-link :to="{ name: 'headless-module-a' }">Headless Module A</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'headless-module-b' }">Headless Module B</router-link>
            </li>
        </ul>
    </main>
</template>

<style lang="css" scoped></style>
