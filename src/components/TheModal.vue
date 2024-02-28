<template>
	AAA
	<div v-if="modalStore.active && dynamicModule">BBB</div>
	<component
		v-if="modalStore.active && dynamicModule"
		:is="dynamicModule"
		@after-modal-hidden="modalStore.clear"
	/>
</template>

<script setup lang="ts">
// Vue
import { defineAsyncComponent, ref, shallowRef, computed } from 'vue'
import type { Component } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Components
// import ModalTest from '@/modals/ModalTest.vue'

// Definitions
const loadError = ref(false as boolean)
const dynamicModule = shallowRef(null as Component | null)

dynamicModule.value = defineAsyncComponent(() =>
	import(`../modals/${modalStore.modalName}.vue`).catch(() => {
		loadError.value = true
	}),
)

// dynamicModule.value = computed(() =>
// 	modalStore.active
// 		? defineAsyncComponent(() =>
// 				import(`../modals/${modalStore.modalName}.vue`).catch(() => {
// 					loadError.value = true
// 				}),
// 			)
// 		: null,
// )
</script>

<style lang="css" scoped></style>
