<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<BaseIconButton icon="icn-close" btnStyle="soft" mini @click="fileStore.exitViewer" />
	</BreadCrumbs>

	<h3>PDF files are not yet supported.</h3>
	<p>This file should have opened in your default PDF viewer instead.<br />If nothing happens, click the button below.</p>
	<br />

	<cv-button size="default" @click="fileSystemApi.openFileOS(fileStore.pathAbsolute)">Open PDF</cv-button>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeMount, computed, watch, onUpdated, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { fileSystemApi } from '@/api'

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'

// Definitions

/**
 * Computed
 */

/**
 * Hooks
 */

fileSystemApi.openFileOS(fileStore.pathAbsolute)
</script>

<style lang="scss" scoped></style>
