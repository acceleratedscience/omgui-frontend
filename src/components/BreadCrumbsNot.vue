<!--
	Just a simple wrapper to put things where otherwise the
	breadcrumbs go, while maintaining the same breadrumb style
-->
<template>
	<div id="not-breadrumbs">
		<router-link v-if="backto" :to="backto" class="backto"><SvgServe icon="icn-arrow-left" /> Back</router-link>
		<div class="filler"></div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
// Vue
import type { RouteLocation } from 'vue-router'

// Components
import SvgServe from '@/components/SvgServe.vue'

// Props
defineProps<{
	backto: RouteLocation | Record<string, string>
}>()
</script>

<style lang="scss" scoped>
#not-breadrumbs {
	display: flex;
	margin-bottom: 16px;
	color: $black-30;
	align-items: center;
	font-size: $font-size-small;
}
#not-breadrumbs a.backto {
	display: flex;
	gap: 5px;
}
#not-breadrumbs a {
	color: $black-30;
	text-decoration: none;
}
#not-breadrumbs .filler {
	flex: 1;
}

/**
 * Hover
 */
@media (hover: hover) {
	#not-breadrumbs a:hover {
		color: $black-60;
	}
}
</style>
