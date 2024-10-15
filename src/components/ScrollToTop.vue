<template>
	<div id="scroll-to-top" :class="{ show, headless: mainStore.headless }" @click="scrollToTop">
		<BaseIcon icon="icn-arrow-up" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()

// Components
import BaseIcon from '@/components/BaseIcon.vue'

// Utils
import { throttle } from '@/utils/helpers'

// Definitions
const show = ref(false)
const throttler = throttle(_onScroll, 500)

/*
 * Computed
 */

/*
 * Hooks
 */
onMounted(() => {
	window.addEventListener('scroll', throttler)
	_onScroll()
})
onBeforeUnmount(() => {
	window.removeEventListener('scroll', throttler)
})

/*
 * Methods
 */

function _onScroll() {
	mainStore.setScrollY(window.scrollY)
	if (mainStore.scrollY > window.innerHeight) {
		show.value = true
	} else {
		show.value = false
	}
}

function scrollToTop() {
	window.scrollTo({
		top: 0,
		// behavior: 'smooth',
	})
}
</script>

<style lang="scss" scoped>
#scroll-to-top {
	display: flex;
	width: 5rem;
	height: 5rem;
	position: fixed;
	left: calc(100vw - 5rem);
	bottom: 2.5rem;
	z-index: 100;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	opacity: 0;
	pointer-events: none;
	transition: opacity 300ms;
}
#scroll-to-top.show {
	opacity: 1;
	pointer-events: all;
}
#scroll-to-top::after {
	content: '';
	width: 2rem;
	height: 2rem;
	position: absolute;
	right: 50%;
	top: 50%;
	margin-right: -1rem;
	margin-top: -1rem;
	border-radius: 50%;
	background: white;
	z-index: -1;
	filter: blur(10px);
}
#scroll-to-top.headless {
	bottom: 0;
}

@media (hover: hover) {
	#scroll-to-top:hover svg {
		fill: $blue;
		fill: white;
	}
	#scroll-to-top:hover::after {
		background: $blue;
		filter: none;
	}
}
</style>
