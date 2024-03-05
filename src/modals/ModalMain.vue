<template>
	<cv-modal
		:visible="modalStore.visible"
		:size="modalStore.size"
		@primary-click="onSubmit"
		@secondary-click="onCancel"
		@other-btn-click="onOther"
	>
		<template v-if="label" v-slot:label>{{ label }}</template>
		<template v-slot:title>{{ title || 'Alert' }}</template>
		<template v-if="content" v-slot:content>{{ content }}</template>
		<template v-if="otherBtn" v-slot:other-button>{{ otherBtn }}</template>
		<template v-if="secondaryBtn" v-slot:secondary-button>{{ secondaryBtn }}</template>
		<template v-if="primaryBtn" v-slot:primary-button>{{ primaryBtn }}</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Definitions
const emit = defineEmits(['mounted'])

/**
 * Computed
 */

const label = computed(() => modalStore.label)
const title = computed(() => modalStore.title)
const content = computed(() => modalStore.content)
const primaryBtn = computed(() => modalStore.primaryBtn)
const secondaryBtn = computed(() => modalStore.secondaryBtn)
const otherBtn = computed(() => modalStore.otherBtn)
const onSubmit = computed(() => modalStore.onSubmit)
const onCancel = computed(() => modalStore.onCancel)
const onOther = computed(() => modalStore.onOther)

/**
 * Hooks
 */

onMounted(() => emit('mounted'))
</script>

<style lang="css" scoped></style>
