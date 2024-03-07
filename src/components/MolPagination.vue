<template>
	<div id="pages">
		<div v-for="page in total" :key="page" class="page" :class="{ sel: page == currentPage }">
			{{ page }}
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	total: Number,
	currentPage: {
		type: Number,
		default: 1,
	},
})
</script>

<style lang="scss" scoped>
#pages {
	height: 40px;
	display: flex;
	background: $soft-bg;
}
#pages .page {
	width: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
#pages .page.sel {
	background: $black;
	color: white;
}

/**
 * Hover
 */

@media (hover: hover) {
	#pages .page:hover {
		background: $black-10;
	}
}
</style>
