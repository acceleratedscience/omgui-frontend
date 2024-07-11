<!--
	Just a simple wrapper to put things where otherwise the
	breadcrumbs go, while maintaining the same breadrumb style
-->
<template>
	<div id="not-breadrumbs" :class="{ collapsed }">
		<router-link v-if="backto" :to="backto" class="backto"><BaseSvgServe icon="icn-arrow-left" /> Back</router-link>
		<div class="filler"></div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
// Vue
import type { RouteLocation } from 'vue-router'

// Components
import BaseSvgServe from '@/components/BaseSvgServe.vue'

// Props
defineProps<{
	backto?: RouteLocation | Record<string, string>
	// Fit the not-breadrumbs into the existing page
	// margin, not take up any vertical space.
	collapsed?: boolean
}>()
</script>

<style lang="scss" scoped>
$br-height: 20px;

#not-breadrumbs {
	display: flex;
	color: $black-30;
	align-items: center;
	font-size: $font-size-small;
	line-height: 20px;
	margin-bottom: 8px;
}
#not-breadrumbs.collapsed {
	margin-bottom: 10px;
	margin-top: -30px;
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

/**
 * Responsive
 */

@media (max-width: $bp-small) {
	#not-breadrumbs.collapsed {
		margin-top: -10px;
	}
}
</style>
