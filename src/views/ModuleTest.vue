<script setup lang="ts">
import { defineProps, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const moduleName = computed(() => route.params.moduleName)
const module = computed(() => {
    return defineAsyncComponent(() => import(`../views/${moduleName.value}.vue`))
})

const props = defineProps({
    title: {
        type: String,
        default: 'Default Title',
    },
    // count: {
    //   type: Number,
    //   default: 0,
    //   validator: (value) => value >= 0
    // }
})
console.log(props)
</script>

<template>
    I'm module A {{ title }} - {{ moduleName }}
    <component :is="module" />
</template>

<style lang="css" scoped></style>
