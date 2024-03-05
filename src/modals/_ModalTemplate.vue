<template>
	<cv-modal :visible="modalStore.visible" size="xs" @primary-click="onSubmit">
		<template v-slot:title>Title</template>
		<template v-slot:content>
			<p>Content</p>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Submit</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { onMounted } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Definitions
const emit = defineEmits(['mounted']) // <--

/*
 * Computed
 */

/*
 * Hooks
 */

onMounted(() => emit('mounted'))

/*
 * Functions
 */

async function onSubmit() {
	alert('submit')
	modalStore.hide() // <--
}
</script>

<style lang="css" scoped></style>
