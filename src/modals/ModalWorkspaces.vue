<template>
	<cv-modal :visible="modalStore.visible" size="xs" @primary-click="onSubmit">
		<template v-slot:title>Switch workspace</template>
		<template v-slot:content>
			<cv-dropdown v-model="currentWorkspace" :items="allWorkspaces"></cv-dropdown>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Switch</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { onMounted, ref } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const modalStore = useModalStore()

// API
import { fileSystemApi } from '@/api'

// Emits
const emit = defineEmits(['mounted'])

// Definitions
const allWorkspaces = ref<string[]>([' '])
const currentWorkspace = ref<string>(' ') // Space to avoid default text to display during load

/**
 * Hooks
 */

onMounted(() => {
	emit('mounted')
	loadWorkspaces()
})

/**
 * Methods
 */

async function onSubmit() {
	if (!fileSystemApi) return
	const { status, statusText } = await fileSystemApi.setWorkspace(currentWorkspace.value)
	if (status !== 200) {
		console.error(statusText)
	} else {
		mainStore.setWorkspace(currentWorkspace.value)
		modalStore.hide()
	}
}

async function loadWorkspaces() {
	const data = await fetchWorkspaces()
	if (data) {
		const { workspaces, current_workspace } = data
		allWorkspaces.value = workspaces || []
		currentWorkspace.value = current_workspace || '-'
	} else {
		console.error('Failed to load workspaces')
	}
}

async function fetchWorkspaces() {
	if (!fileSystemApi) return
	const { status, data, statusText } = await fileSystemApi.getWorkspaces()
	if (status !== 200) {
		console.error(statusText)
	} else {
		return data
	}
}
</script>

<style lang="css" scoped></style>
getWorkspace
