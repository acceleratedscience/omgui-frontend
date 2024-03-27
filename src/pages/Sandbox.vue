<template>
	<Test v-model="myVal" />
</template>

<script setup lang="ts">
import Test from '@/components/Test.vue'
import { ref } from 'vue'

const myVal = ref('Hello world!')
</script>

<style lang="css" scoped></style>
