<template>
	<div id="properties" :class="{ expand }">
		<div class="header" @click="toggleExpand">
			<div>Identifiers & properties</div>
			<SvgServe v-show="expand" filename="icn-chevron-up" />
			<SvgServe v-show="!expand" filename="icn-chevron-down" />
		</div>
		<div class="content">
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
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Compnents
import SvgServe from '@/components/SvgServe.vue'

// Definitions
const expand = ref(false)

/**
 * Methods
 */

function toggleExpand() {
	expand.value = !expand.value
}
</script>

<style lang="scss" scoped>
// Container
#properties {
	background: $aux-green;
	user-select: none;
}

// Expandable header
#properties .header {
	display: flex;
	padding: 8px;
	padding-left: 8px;
	cursor: pointer;
}
#properties.expand .header {
	border-bottom: solid 1px $black-10;
}
#properties .header > div {
	flex: 1;
}
#properties .header > svg {
	flex: 0 0 24px;
}

// Content
#properties .content {
	padding: 24px;
}
#properties:not(.expand) .content {
	display: none;
}

// Items
#properties .item-wrap {
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
	margin: 0 -8px;
}
#properties .item-wrap:not(:last-child) {
	margin-bottom: 16px;
}
#properties .item {
	// padding: 0 7px;
	border-radius: 10px;
	cursor: pointer;
	// border: solid 1px $black-10;
	height: 20px;
	// line-height: 18px;
	line-height: 20px;
	padding: 0 8px;
	box-shadow: 0 0 0 1px $black-10;
}
#properties .item.sel {
	background: white;
	box-shadow: 0 0 0 1px $black-05;

	border: none;
	line-height: 20px;
	padding: 0 8px;
}

/**
 * Hover
 */

@media (hover: hover) {
	#properties .header:hover {
		background: $aux-green-hover;
	}
	#properties .item:not(.sel):hover {
		// background: $black-05;
		background: $white-30;
		// background: none;
		// border-color: white;
	}
}
</style>
