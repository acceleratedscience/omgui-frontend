<template>ABC</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, onBeforeMount, computed, watch, onUpdated, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()

// API
import { fileSystemApi } from '@/api/ApiService'
</script>

<style lang="scss" scoped></style>
