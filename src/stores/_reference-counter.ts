// Keeping this a reference for a different store architecture,
// comes from the sample project from the Vite setup.
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	const doubleCount = computed(() => count.value * 2)
	function increment() {
		count.value++
	}

	return { count, doubleCount, increment }
})
