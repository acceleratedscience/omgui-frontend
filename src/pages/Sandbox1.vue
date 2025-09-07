<template>
	<button @click="modalStore.display('ModalSaveFile', { path: 'my_dir/sub_dir/subsub_dir', filename: 'Foobar', ext: 'sdf' })">Save file</button
	>&nbsp;
</template>

<script setup lang="ts">
// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()
</script>

<style lang="css" scoped></style>
