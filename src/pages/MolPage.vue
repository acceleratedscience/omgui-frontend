<template>
	<TheMolFromIdentifier v-if="identifier" :identifier="identifier" />
	<TheMolInput v-else />
</template>

<script setup lang="ts">
// Components
import TheMolFromIdentifier from '@/components/TheMolFromIdentifier.vue'
import TheMolInput from '@/components/TheMolInput.vue'

// Props
defineProps<{
	identifier?: string
}>()
</script>

<style lang="scss" scoped></style>
