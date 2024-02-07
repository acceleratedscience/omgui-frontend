<template>
    <div v-if="loadError" class="error-msg">
        The requested module '{{ moduleName }}' was not found.
    </div>
    <div v-else-if="dynamicComponent"><component :is="dynamicComponent" /></div>
</template>

<script lang="ts">
import { defineAsyncComponent, ref } from 'vue'

export default {
    props: ['moduleName'],
    setup(props) {
        const loadError = ref(false)
        const dynamicComponent = defineAsyncComponent(() =>
            import(`../views/${props.moduleName}.vue`).catch(() => {
                loadError.value = true
            }),
        )
        return { dynamicComponent, loadError }
    },
}
</script>
