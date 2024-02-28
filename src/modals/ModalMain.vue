<script setup lang="ts">
// Vue
import { computed, ref } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Emits
const emit = defineEmits(['after-modal-hidden'])

// Definitions
const visible = ref<boolean>(true)
const label = computed(() => modalStore.label)
const title = computed(() => modalStore.title)
const content = computed(() => modalStore.content)
const primaryBtn = computed(() => modalStore.primaryBtn)
const secondaryBtn = computed(() => modalStore.secondaryBtn)
const otherBtn = computed(() => modalStore.otherBtn)

function onBtnClick() {
	alert(2)
}

function onHide() {
	visible.value = false
	emit('after-modal-hidden')
}
</script>

<template>
	<cv-modal
		:visible="visible"
		size="xs"
		@other-btn-click="onBtnClick"
		@primary-click="onBtnClick"
		@secondary-click="onBtnClick"
		@after-modal-hidden="onHide"
	>
		<template v-if="label" v-slot:label>{{ label }}</template>
		<template v-slot:title>{{ title }}</template>
		<template v-if="content" v-slot:content>{{ content }}</template>
		<template v-if="otherBtn" v-slot:other-button>{{ otherBtn }}</template>
		<template v-if="secondaryBtn" v-slot:secondary-button>{{ secondaryBtn }}</template>
		<template v-if="primaryBtn" v-slot:primary-button>{{ primaryBtn }}</template>
	</cv-modal>
</template>

<style lang="css" scoped></style>
