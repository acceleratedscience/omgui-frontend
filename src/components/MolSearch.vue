<template>
	<div id="search-wrap">
		<cv-search
			:modelValue="molGridStore.searchValue"
			@update:modelValue="molGridStore.setSearchValue"
			label="TextSmarts"
			size="lg"
			type="text"
			:placeholder="'Search ' + molGridStore.searchMode"
			:hide-label="true"
		></cv-search>
		<div class="toggle">
			<div class="close" :class="{ show: molGridStore.searchValue.length > 0 }">
				<CloseIcon />
			</div>
			<div
				class="option op-text"
				:class="{ sel: molGridStore.searchMode == 'text' }"
				@click="molGridStore.setSearchMode('text')"
			></div>
			<div
				class="option op-smarts"
				:class="{ sel: molGridStore.searchMode == 'smarts' }"
				@click="molGridStore.setSearchMode('smarts')"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { watch } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// API
import { fetch, moleculesApi } from '@/api/ApiService'

// Components
// @ts-ignore
import CloseIcon from '@carbon/icons-vue/es/close/16'

// Internal
import { debounce, throttle } from '@/utils/helpers'

/**
 * Watchers
 */

watch(
	() => molGridStore.searchValue,
	throttle((newVal: string) => {
		// (newVal: string) => {
		const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')

		fetch(moleculesApi.filterMolset(filePath, newVal), {
			onSuccess: (data) => {
				console.log(typeof data.mols, data.mols.length)
				molGridStore.setMolset(JSON.parse(data.mols))
			},
		})
		// },
	}, 500),
)
</script>

<style lang="scss" scoped>
#search-wrap {
	flex: 1 0;
	position: relative;
}
#search-wrap:deep() .bx--search-input {
	padding-right: 141px;
}
#search-wrap:deep() .bx--search-close {
	display: none;
}
#search-wrap .toggle {
	position: absolute;
	top: 4px;
	right: 4px;
	height: 32px;
	line-height: 32px;
	display: flex;
}
#search-wrap .toggle > .option {
	padding: 0 8px;
	background: white;
	cursor: pointer;
}
#search-wrap .toggle > .option.sel {
	background: $black;
	color: white;
}
#search-wrap .toggle > .option.op-text::after {
	content: 'Text';
}
#search-wrap .toggle > .option.op-smarts::after {
	content: 'Smart';
}
#search-wrap .toggle > .close {
	width: 36px;
	padding-left: 4px;
	margin: -4px;
	margin-right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	position: relative;
}
#search-wrap .toggle > .close:not(.show) {
	display: none;
}

/**
 * Hover
 */
@media (hover: hover) {
	#search-wrap .toggle > .close:hover::after {
		content: '';
		display: block;
		position: absolute;
		top: 4px;
		right: 0;
		width: calc(100% - 4px);
		height: calc(100% - 8px);
		background: #eee; // Multiplied equivalent of #e5e5e5 in component
		mix-blend-mode: multiply;
	}
}
</style>
