<template>
	<BreadCrumbs :pathArray="fileStore.breadCrumbPathArray">
		<BaseIconButton icon="icn-close" btnStyle="soft" mini @click="fileStore.exitViewer" />
	</BreadCrumbs>
	<TextBox v-if="textData" :textData="textData" />
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import TextBox from '@/components/TextBox.vue'

/**
 * Computed
 */

// Original text data
const textData = computed<string>(() => fileStore.data)
</script>

<style lang="scss" scoped></style>
