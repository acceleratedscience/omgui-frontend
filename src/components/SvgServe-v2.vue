<!-- This file will import svgs as images, but currentColor won't work like that -->
<template>
    <img v-if="!loadError" :src="source" :alt="filename" />
</template>

<script>
export default {
    props: ['filename'],
    data() {
        return {
            source: '',
            loadError: false,
        }
    },
    async created() {
        try {
            const module = await import(`@/assets/svg/${this.filename}.svg`)
            this.source = module.default
        } catch (error) {
            this.loadError = true
        }
    },
}
</script>
