<template>ABC</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeMount, computed, watch, onUpdated, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

// Ruuter
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Definitions

/**
 * Computed
 */

/**
 * Hooks
 */
</script>

<style lang="scss" scoped></style>
