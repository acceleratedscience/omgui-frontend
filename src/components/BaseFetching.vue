<!-- 
	The word "Fetching..." with animated dots.
 -->

<template>
	<span v-if="props.error" class="fetching-err">{{ failText }}</span>
	<span v-else class="fetching">{{ text }}</span>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		text?: string
		failText?: string
		error?: boolean
	}>(),
	{
		text: 'Fetching',
		failText: 'Failed to fetch',
		error: false,
	},
)
</script>

<style lang="css" scoped>
.fetching {
	color: #999;
	font-style: italic;
}
.fetching-err {
	color: #d00;
}
.fetching::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
</style>
