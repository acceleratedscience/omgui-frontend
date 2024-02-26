<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeMount, computed, watch, onUpdated, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { useApiStore } from '@/stores/ApiStore'
import type { FileSystemApi as FileSystemApiType } from '@/api/ApiService'
const apiStore = useApiStore()
const fileSystemApi: FileSystemApiType | null = apiStore.loadApi('fileSystem') as FileSystemApiType | null // prettier-ignore
</script>

<template>ABC</template>

<style lang="scss" scoped></style>
