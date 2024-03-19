<template>
	<cv-dropdown
		:modelValue="modelValue"
		@update:modelValue="(newValue: string) => emit('update:modelValue', newValue)"
	>
		<cv-dropdown-item value="">&nbsp;</cv-dropdown-item>
		<cv-dropdown-item v-for="(item, i) in items" :key="i" :value="item">
			{{ item }}
		</cv-dropdown-item>
		<cv-dropdown-item v-for="(item, i) in disabledItems" :key="i" :value="item" disabled>{{
			item
		}}</cv-dropdown-item>
	</cv-dropdown>
</template>

<script setup lang="ts">
// Props
const props = withDefaults(
	defineProps<{
		modelValue: string
		items: string[]
		disabledItems: string[]
	}>(),
	{},
)

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
#dd-sort {
	flex: 250px 0 0;
}
#dd-sort:not(.default):deep() #dd-sort-value::before {
	content: 'Sort: ';
}
#dd-sort.default:deep() #dd-sort-value::before {
	content: 'Sort';
}
#dd-sort.default:deep() .cv-dropdown-item:first-child {
	display: none;
}
#dd-sort:not(.default):deep() .cv-dropdown-item:first-child > .bx--dropdown-link::before {
	content: 'Unsort';
}
</style>
