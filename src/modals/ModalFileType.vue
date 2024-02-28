<template>
	<cv-modal :visible="visible" size="xs" @primary-click="onSubmit" @after-modal-hidden="onHide">
		<template v-slot:title>File Type</template>
		<template v-slot:content>
			<cv-dropdown v-model="selectedWorkspace">
				<cv-dropdown-item
					v-for="workspace in allWorkspaces"
					:key="workspace"
					:value="workspace"
					:hidden="workspace == selectedWorkspace"
					>{{ workspace }}</cv-dropdown-item
				>
			</cv-dropdown>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Switch</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { onMounted, ref, computed } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Emits
const emit = defineEmits(['after-modal-hidden'])

// Definitions
const visible = ref<boolean>(true)
const allWorkspaces = ref<string[]>([' '])
const selectedWorkspace = ref<string>(' ') // Space to avoid default text to display during load

// All minus the active, to avoid repitition in dropdown
const availableWorkspaces = computed(() => {
	if (!allWorkspaces.value) return ' '
	return allWorkspaces.value.filter((wsp) => wsp != selectedWorkspace.value)
})

//
//

onMounted(() => {
	loadWorkspaces()
})

async function onSubmit() {
	if (!fileSystemApi) return
	const { status, statusText } = await fileSystemApi.setWorkspace(selectedWorkspace.value)
	if (status !== 200) {
		console.error(statusText)
	} else {
		mainStore.setWorkspace(selectedWorkspace.value)
		visible.value = false
	}
}

//
//

async function loadWorkspaces() {
	const data = await fetchWorkspaces()
	if (data) {
		const { all, active } = data
		if (all) allWorkspaces.value = all
		if (active) selectedWorkspace.value = active
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

function onHide() {
	visible.value = false
	emit('after-modal-hidden')
}
</script>

<style lang="css">
/* Non-scoped style to override the modal css */
.bx--modal-content {
	overflow: visible;
}
.bx--modal-content:focus {
	outline: none;
}
</style>

<style lang="css" scoped></style>
getWorkspace
