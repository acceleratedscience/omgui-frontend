/**
 * This file holds a varietry pack of general helper functions.
 */

// Router
import router from '@/router'

// Type declarations
import type { LocationQueryValue } from 'vue-router'

// const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] // prettier-ignore
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // prettier-ignore

// Return timestamp as "10 days ago" or as full date.
export function timeAgo(dateParam: Date | string | number | null): string {
	if (!dateParam) return ''

	const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
	const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
	const today = new Date()
	const yesterday = new Date(today.getTime() - DAY_IN_MS)
	const seconds = Math.round((today.getTime() - date.getTime()) / 1000)
	const minutes = Math.round(seconds / 60)
	const isToday = today.toDateString() === date.toDateString()
	const isYesterday = yesterday.toDateString() === date.toDateString()
	const isThisYear = today.getFullYear() === date.getFullYear()

	if (seconds < 5) {
		return 'now'
	} else if (seconds < 60) {
		return `less than a min ago`
	} else if (seconds < 90) {
		return 'about a minute ago'
	} else if (minutes < 60) {
		return `${minutes} min ago`
	} else if (isToday) {
		return _prettyDate(date, 'today') // Today at 10:20
	} else if (isYesterday) {
		return _prettyDate(date, 'yesterday') // Yesterday at 10:20
	} else if (isThisYear) {
		return _prettyDate(date, null, true) // Jan 10 at 10:20
	}

	return _prettyDate(date) // Jan 10, 2017 at 10:20
}

// Return timestamp as "Jan 10, 2024 at 10:20"
export function _prettyDate(date: Date, prefomattedDate: string | null = null, hideYear: boolean = false): string {
	const day = date.getDate()
	const month = MONTHS_SHORT[date.getMonth()]
	const year = date.getFullYear()
	const hours = date.getHours()
	const minutes = date.getMinutes()
	let minutes_str = minutes.toString()

	if (minutes < 10) {
		// Adding leading zero to minutes
		minutes_str = `0${minutes}`
	}

	if (prefomattedDate) {
		// Today at 10:20
		// Yesterday at 10:20
		return `${prefomattedDate} at ${hours}:${minutes_str}`
	}

	if (hideYear) {
		// Jan 10 at 10:20
		return `${month} ${day} at ${hours}:${minutes_str}`
	}

	// 10. January 2017. at 10:20
	return `${month} ${day}, ${year} at ${hours}:${minutes_str}`
}

// Return a human-readable file size.
export function prettySize(bytes: number | null) {
	if (!bytes) return ''
	if (bytes < 500) {
		// 0 - 99 Bytes
		return bytes + ' Bytes'
	} else if (_round(bytes / 1000) < 1000) {
		// 1 - 999 KB
		return _round(bytes / 1000, 0) + ' KB'
	} else if (_round(bytes / 1000000) < 1000) {
		// 1 - 999 MB
		return _round(bytes / 1000000) + ' MB'
	} else if (_round(bytes / 1000000000) < 1000) {
		// 1 - 999 GB
		return _round(bytes / 1000000000) + ' GB'
	} else {
		// 1 - infinite TB
		return _round(bytes / 1000000000000) + ' TB'
	}

	function _round(bytes: number, decimals = 2) {
		const multiplier = Math.pow(10, decimals)
		return Number(Math.round(bytes * multiplier) / multiplier)
	}
}

// Add commas to large numbers
export function prettyNr(nr: number, imperial: boolean = true) {
	if (!nr && nr !== 0) return

	if (imperial) {
		return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	} else {
		const output = nr.toString().replace(/,(\d{1,2})$/, '.$1')
		return output.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	}
}

// Truncate large numbers.
export function largeNr(nr: number) {
	if (nr >= 1000000000) {
		// Billions as 1B / 1.5B / 1.5B+
		const reduced = Math.round(nr / 100000000) / 10
		const plus = reduced * 1000000000 < nr ? '+' : ''
		return `${reduced}B${plus}`
	} else if (nr >= 1000000) {
		// Millions as 1M / 1.5M / 1.5M+
		const reduced = Math.round(nr / 100000) / 10
		const plus = reduced * 1000000 < nr ? '+' : ''
		return `${reduced}M${plus}`
	} else if (nr >= 1000) {
		// Thousans as 1k / 1.5k / 1.5k+
		const reduced = Math.round(nr / 100) / 10
		const plus = reduced * 1000 < nr ? '+' : ''
		return `${reduced}k${plus}`
	}
	return nr
}

// Capitalize the first letter of a string.
export function capitalize(str: string) {
	if (!str) return ''
	return str.charAt(0).toUpperCase() + str.slice(1)
}

// Debounce
// - - -
// Limit rate of rapid-fire event, executing only when time limit expires.
// Usefull for window resize events, etc.
// Source: https://blog.webdevsimplified.com/2022-03/debounce-vs-throttle/
// - - -
// import { debounce } from '@/utils/helpers'
// const debouncer = debounce(this.resizeHandler, 500)
// window.addEventListener('resize', debouncer)
export function debounce(func: Function, delay: number = 300) {
	let timeout: ReturnType<typeof setTimeout> | null = null
	return (...args: any[]) => {
		clearTimeout(timeout as ReturnType<typeof setTimeout>)
		timeout = setTimeout(() => {
			func(...args)
		}, delay)
	}
}

// Throttle
// - - -
// Limit rate of rapid-fire event, executing only once per time limit
// Useful for scroll handlers, etc.
// Source: https://blog.webdevsimplified.com/2022-03/debounce-vs-throttle/
// - - -
// import { throttle } from '@/utils/helpers'
// const throttler = throttle(this.scrollHandler, 500)
// window.addEventListener('scroll', throttler)
export function throttle(func: Function, delay: number = 3000) {
	let wait = false
	let waitArgs: any[] | null
	const timeoutFunc = () => {
		if (waitArgs == null) {
			wait = false
		} else {
			func(...waitArgs)
			waitArgs = null
			setTimeout(timeoutFunc, delay)
		}
	}

	return (...args: any[]) => {
		if (wait) {
			waitArgs = args
			return
		}
		func(...args)
		wait = true
		setTimeout(timeoutFunc, delay)
	}
}

// This locks the page in its current scroll position
// and hides the scroll bar. Used when overlaying the
// carousel or search.
export function lockScroll(state: boolean) {
	if (state) {
		return _lock()
	} else {
		_unlock()
	}

	//
	//

	function _lock() {
		const scrollbarWidth = window.innerWidth - document.body.clientWidth
		document.body.style.marginRight = scrollbarWidth + 'px'
		document.body.style.overflow = 'hidden'
		return scrollbarWidth
	}
	function _unlock() {
		document.body.removeAttribute('style')
	}
}

// Take a query object and return a query URL string.
export function query2UrlQuery(query: Record<string, string | number | boolean | LocationQueryValue | LocationQueryValue[]>) {
	let urlQuery = Object.keys(query)
		.map((key) => `${key}=${query[key]}`)
		.join('&')
	urlQuery = urlQuery.length ? `?${urlQuery}` : ''
	return urlQuery
}

// Make molecules properties and identifiers display-friendly on the fly.
export function cleanKeys(str: string) {
	// prettier-ignore
	// Note: a single regex function is a lot faster than multiple regexes.
	return str.replace(/\b(_|smiles|inchikey|inchi[^k]|splash|h bond|iupac|xlogp|logp| bonded|logd|omim|nmr|mona|pdbe|dili|fda|ghs|ms|id|ph|logie)\b/gi, (match) => {
		switch (match.toLowerCase()) {
			case '_': return ' ';
			case 'smiles': return 'SMILES';
			case 'inchikey': return 'InChIKey';
			case 'inchi': return 'InChI';
			case 'splash': return 'SPLASH';
			case 'h bond': return 'H-bond';
			case 'iupac': return 'IUPAC';
			case 'xlogp': return 'XLogP';
			case 'logp': return 'logP';
			case ' bonded': return '-bonded';
			case 'logd': return 'logD';
			case 'omim': return 'OMIM';
			case 'nmr': return 'NMR';
			case 'mona': return 'MoNA';
			case 'pdbe': return 'PDBe';
			case 'dili': return 'DILI ';
			case 'fda': return 'FDA';
			case 'ghs': return 'GHS';
			case 'ms': return 'MS';
			case 'id': return 'ID';
			case 'ph': return 'pH';
			case 'logie': return 'logIE';
			default: return match;
		}
	});
}

// Take a file's path and return the path of the
// parent folder with the file in focus. For example:
// Input: /foo/bar/baz.json
// Output: /foo/bar#baz.json
export function path2FileBrowserPath(path: string) {
	const pathArr = path.split('/')
	const filename = pathArr.pop()
	const filebrowserPath = pathArr.join('/') + '#' + filename
	return filebrowserPath
}

// Remove capitals and replaces spaces with dashes.
export function slugify(str: string) {
	return str.toLowerCase().replace(/\s+/g, '-')
}

// Check if a value is an object.
export function isObject(value: any) {
	return value && typeof value === 'object' && !Array.isArray(value)
}
