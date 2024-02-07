<template>
    <!-- This file relies on svgs being stored as vue components -->
    <img src="@/assets/svg/icn-mol.svg" />
    <div v-if="loadError" class="error-msg">
        <p>Failed to load SVG</p>
    </div>
    <div v-else-if="dynamicComponent"><component :is="dynamicComponent" /></div>
</template>

<script lang="ts">
import { defineAsyncComponent, ref } from 'vue'

export default {
    name: 'ServeSvg',
    props: ['filename'],
    setup(props) {
        const loadError = ref(false)
        const dynamicComponent = defineAsyncComponent(() =>
            import(`@/svg/${props.filename}.vue`).catch(() => {
                loadError.value = true
            }),
        )
        return { dynamicComponent, loadError }
    },
}
</script>

<style scoped lang="scss"></style>
