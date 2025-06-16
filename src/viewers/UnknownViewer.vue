<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<BaseIconButton icon="icn-close" btnStyle="soft" mini @click="fileStore.exitViewer" />
	</BreadCrumbs>

	<h3>File type not supported.</h3>
	<p class="error-msg">
		We don't support <i>.{{ fileStore.ext }}</i> files.
	</p>
	<p>This file will open in your system's default application instead.<br />If nothing happens, click the button below.</p>
	<br />

	<cv-button size="default" @click="fileSystemApi.openFileOS(fileStore.pathAbsolute)">Open file</cv-button>
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
