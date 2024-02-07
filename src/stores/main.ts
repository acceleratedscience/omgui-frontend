import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

export const useMainStore = defineStore('counter', () => {
    const router = useRouter()
    const route = useRoute()
    const headless = ref(false)
    function setHeadless(updateRoute: boolean = false) {
        console.log('setHeadless', updateRoute)
        headless.value = true
        if (updateRoute) {
            const path = route.path.replace(/^\/headless/, '')
            // history.replaceState({}, '', path)
            router.replace('/headless' + path)
        }
    }
    function unsetHeadless(updateRoute: boolean = false) {
        console.log('unsetHeadless', updateRoute)
        headless.value = false
        if (updateRoute) {
            const path = route.path.replace(/^\/headless/, '')
            // history.replaceState({}, '', path)
            router.replace(path)
        }
    }
    function isHeadless() {
        return headless.value
    }
    return { isHeadless, setHeadless, unsetHeadless }
})
