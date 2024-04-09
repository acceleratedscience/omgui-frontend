<template>
	<MolFromIdentifier v-if="identifier" :identifier="identifier" />
	<MolInput v-else />
</template>

<script setup lang="ts">
// Components
import MolFromIdentifier from '@/components/MolFromIdentifier.vue'
import MolInput from '@/components/MolInput.vue'

// Props
defineProps<{
	identifier?: string
}>()
</script>

<style lang="scss" scoped></style>
