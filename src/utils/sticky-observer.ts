/**
 * Attach the "sticky" class to an element when it becomes sticky.
 */

import { onMounted, onUnmounted } from 'vue'

export default function useStickyObserver(selector: string) {
	let observer: IntersectionObserver

	onMounted(() => {
		const stickyElm: HTMLElement | null = document.querySelector(selector)
		if (!stickyElm) return
		observer = new IntersectionObserver(
			([e]) => e.target.classList.toggle('sticky', e.intersectionRatio < 1),
			{ rootMargin: '-1px 0px 0px 0px', threshold: [1] },
		)
		observer.observe(stickyElm)
	})

	onUnmounted(() => {
		const stickyElm: HTMLElement | null = document.querySelector(selector)
		if (stickyElm) observer.unobserve(stickyElm)
	})
}
