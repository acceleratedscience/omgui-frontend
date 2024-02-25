<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeMount, computed, watch, onUpdated, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { useApiStore } from '@/stores/ApiStore'
const apiStore = useApiStore()
const fileSystemApi = apiStore.loadApi('fileSystem')
</script>

<template>ABC</template>

<style lang="scss" scoped></style>
