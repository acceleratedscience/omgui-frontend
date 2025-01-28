/**
 * Attach the "sticky" class to an element when it becomes sticky.
 */

import { onMounted, onUnmounted } from 'vue'

export default function useStickyObserver(selector: string) {
	let observer: IntersectionObserver

	onMounted(() => {
		const stickyElm: HTMLElement | null = document.querySelector(selector)
		if (!stickyElm) return
		const computedStyle = getComputedStyle(stickyElm)
		const top = computedStyle.top == 'auto' ? 0 : parseInt(computedStyle.top)
		observer = new IntersectionObserver(([e]) => e.target.classList.toggle('sticky', e.intersectionRatio < 1), {
			rootMargin: `-${top + 1}px`,
			threshold: [1],
		})
		observer.observe(stickyElm)
	})

	onUnmounted(() => {
		const stickyElm: HTMLElement | null = document.querySelector(selector)
		if (stickyElm) observer.unobserve(stickyElm)
	})
}
