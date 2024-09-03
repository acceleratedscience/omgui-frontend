<template>
	<BaseIconButtonToggle
		ref="toggleBtn"
		:class="{ loading, error: Boolean(loadingError) }"
		icon="icn-bookmark"
		iconHover="icn-bookmark-full"
		iconOn="icn-bookmark-full"
		iconOnHover="icn-bookmark-remove"
		@toggle-on="addToMymols"
		@toggle-off="removeFromMymols"
	/>
</template>

<script setup lang="ts">
// Vue
import { watch, onMounted, ref } from 'vue'

// API
import { apiFetch, moleculesApi } from '@/api/ApiService'

// Components
import BaseIconButtonToggle from '@/components/BaseIconButtonToggle.vue'

// Type declarations
import type { Smol, TempSmol, Macromol } from '@/types'

// Props
const props = defineProps<{
	mol: Smol | TempSmol | Macromol | null
}>()

// Definitions
const toggleBtn = ref<typeof BaseIconButtonToggle | null>(null)
const loading = ref<boolean>(false)
const loadingError = ref<string>('')

/**
 * Hooks
 */

watch(() => props.mol, updateStatus)
onMounted(updateStatus)

/**
 * Methods
 */

// Add
async function addToMymols() {
	if (!props.mol) {
		loadingError.value = 'x'
		return
	}
	apiFetch(moleculesApi.addMolToMyMols(props.mol), {
		onError: () => {
			if (toggleBtn.value) toggleBtn.value.toggle(false, true)
		},
		loading,
		loadingError,
	})
}

// Remove
async function removeFromMymols() {
	if (!props.mol) {
		loadingError.value = 'x'
		return
	}
	apiFetch(moleculesApi.removeMolFromMyMols(props.mol), {
		onError: (data: { status: boolean }) => {
			if (toggleBtn.value) toggleBtn.value.toggle(data.status, true)
		},
		loading,
		loadingError,
	})
}

// Update status
function updateStatus() {
	// Prevent fetching status on page load when props.mol is
	// still of type TempSmol (before mlecule is loaded).
	if (!props.mol || !('properties' in props.mol)) return

	if (props.mol) {
		apiFetch(moleculesApi.checkMolInMyMols(props.mol), {
			onSuccess: (data: { status: boolean }) => {
				if (toggleBtn.value) toggleBtn.value.toggle(data.status, true)
			},
		})
	}
}
</script>

<style lang="scss" scoped>
.icn-btn.error:not(:hover):deep() svg {
	fill: $error;
}
.icn-btn.loading {
	animation: shake-small 0.5s linear both infinite;
}
</style>
