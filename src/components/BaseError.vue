<template>
	<div class="error-msg">{{ errorText }}</div>
	<p class="soft">{{ loadingError }}</p>
	<br />
	<cv-button @click="onBackClick">Back</cv-button>
</template>

<script setup lang="ts">
// Vue
import { onMounted, watch } from 'vue'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Props
const props = withDefaults(
	defineProps<{
		loadingError: string
		errorText?: string
		backLink?: string
	}>(),
	{
		errorText: 'Something went wrong.',
	},
)

/*
 * Computed
 */

/*
 * Hooks
 */

/*
 * Methods
 */
function onBackClick() {
	if (props.backLink) {
		router.push(props.backLink)
	} else {
		router.back()
	}
}
</script>

<style lang="scss" scoped></style>
