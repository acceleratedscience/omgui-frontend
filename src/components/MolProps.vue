<template>
	<div id="properties">
		<h4>Identifiers</h4>
		<div class="item-wrap">
			<div
				v-for="(idfr, i) in molGridStore.availIdentifiers"
				:key="i"
				class="item"
				:class="{ sel: molGridStore.showIdentifiers.includes(idfr) }"
				@click="molGridStore.toggleIdentifier(idfr)"
			>
				{{ idfr }}
			</div>
		</div>

		<h4>Properties</h4>
		<div class="item-wrap">
			<div
				v-for="(prop, i) in molGridStore.availProps"
				:key="i"
				class="item"
				:class="{ sel: molGridStore.showProps.includes(prop) }"
				@click="molGridStore.toggleProp(prop)"
			>
				{{ prop }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import {
	ref,
	onMounted,
	onBeforeMount,
	computed,
	watch,
	onUpdated,
	nextTick,
	onBeforeUnmount,
} from 'vue'
import type { ComputedRef } from 'vue'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

/**
 * Computed
 */

const identifiers: ComputedRef<string[]> = computed(() => {
	if (molGridStore.molset) {
		return Object.keys(molGridStore.molset[0].identifiers)
	} else {
		return []
	}
})

const availableProps: ComputedRef<string[]> = computed(() => {
	if (molGridStore.molset) {
		return Object.keys(molGridStore.molset[0].properties)
	} else {
		return []
	}
})

/**
 * Methods
 */
</script>

<style lang="scss" scoped>
#properties {
	background: #e2ead9;
	padding: 20px;
	margin-bottom: 8px;
}
#properties .item-wrap {
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
	margin: 0 -8px;
}
#properties .item-wrap:not(.first-item) {
	margin-bottom: 16px;
}
#properties .item {
	// background: $white-30;
	// background: $black-05;
	padding: 0 7px;
	border-radius: 10px;
	cursor: pointer;
	user-select: none;

	border: solid 1px $black-10;
	height: 20px;
	line-height: 18px;
}
#properties .item.sel {
	// color: white;
	// background: $black;
	background: white;

	border: none;
	line-height: 20px;
	padding: 0 8px;
}

/**
 * Hover
 */

@media (hover: hover) {
	#properties .item:not(.sel):hover {
		// background: $black-05;
		background: $white-30;
		// background: none;
		// border-color: white;
	}
}
</style>
