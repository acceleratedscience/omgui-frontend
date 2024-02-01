const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] // prettier-ignore
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // prettier-ignore

// Return timestamp as "10 days ago"
export function timeAgo(dateParam) {
    if (!dateParam) {
        return null
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam)
    const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
    const today = new Date()
    const yesterday = new Date(today - DAY_IN_MS)
    const seconds = Math.round((today - date) / 1000)
    const minutes = Math.round(seconds / 60)
    const isToday = today.toDateString() === date.toDateString()
    const isYesterday = yesterday.toDateString() === date.toDateString()
    const isThisYear = today.getFullYear() === date.getFullYear()

    if (seconds < 5) {
        return 'now'
    } else if (seconds < 60) {
        return `${seconds} seconds ago`
    } else if (seconds < 90) {
        return 'about a minute ago'
    } else if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (isToday) {
        return prettyDate(date, 'Today') // Today at 10:20
    } else if (isYesterday) {
        return prettyDate(date, 'Yesterday') // Yesterday at 10:20
    } else if (isThisYear) {
        return prettyDate(date, false, true) // Jan 10 at 10:20
    }

    return prettyDate(date) // Jan 10, 2017 at 10:20
}

// Return timestamp as "Jan 10, 2024 at 10:20"
export function prettyDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate()
    const month = MONTHS_SHORT[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours()
    let minutes = date.getMinutes()

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${minutes}`
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${prefomattedDate} at ${hours}:${minutes}`
    }

    if (hideYear) {
        // Jan 10 at 10:20
        return `${month} ${day} at ${hours}:${minutes}`
    }

    // 10. January 2017. at 10:20
    return `${month} ${day}, ${year} at ${hours}:${minutes}`
}

// export function prettyDate(timestamp) {
//     // Python timestamps are in seconds, JavaScript timestamps are in milliseconds.
//     timestamp = timestamp < 9999999999 ? timestamp * 1000 : timestamp

//     const date = timestamp ? new Date(timestamp) : new Date()
//     const formattedDate = `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
//     return formattedDate
// }

export function prettySize(bytes) {
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

    function _round(value, decimals = 2) {
        const multiplier = Math.pow(10, decimals)
        return Number(Math.round(value * multiplier) / multiplier)
    }
}
