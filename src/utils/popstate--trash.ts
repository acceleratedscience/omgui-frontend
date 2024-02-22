// trash

import { onUnmounted, onBeforeMount } from 'vue'

export default function usePopState(setPopState: (event: PopStateEvent) => void) {
	onBeforeMount(() => {
		window.addEventListener('popstate', setPopState)
	})

	onUnmounted(() => {
		window.removeEventListener('popstate', setPopState)
	})
}
