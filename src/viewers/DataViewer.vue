<template>
	<!-- <router-link to="/~/sample.csv">sample</router-link> |
	<router-link to="/~/foo.csv">foo</router-link> -->
	<main id="module">TO BE IMPLEMENTED: Data viewer</main>
	<TextBox v-if="fileStore.data" :textData="fileStore.data" />
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Components
import TextBox from '@/components/TextBox.vue'
</script>

<style lang="css" scoped>
#module {
	background: lightblue;
	padding: 4px;
	margin-bottom: 20px;
}
</style>
