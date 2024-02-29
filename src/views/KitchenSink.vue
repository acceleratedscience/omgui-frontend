<script setup lang="ts">
// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Compnents
import SvgServe from '@/components/SvgServe.vue'

/**
 * Functions
 */

function onSubmit() {
	alert('yes')
	modalStore.hide()
}
function onCancel() {
	alert('no')
	modalStore.hide()
}
</script>

<template>
	<hr />
	<h4>:: Modals</h4>
	<button @click="modalStore.alert('Hello world')">simple modal</button>&nbsp;
	<button
		@click="
			modalStore.alert('Hello world', {
				size: 'md',
				primaryBtn: 'One',
				secondaryBtn: 'Two',
				otherBtn: 'Three',
			})
		"
	>
		advanced modal</button
	>&nbsp;
	<button @click="modalStore.confirm('Are you sure?', { onSubmit, onCancel })">
		confirm modal
	</button>
	<br /><br />
	<button @click="modalStore.display('_ModalTemplate')">template</button>&nbsp;
	<button @click="modalStore.display('ModalFileType')">file type</button>&nbsp;
	<button @click="modalStore.display('ModalWorkspaces')">workspaces</button>&nbsp;

	<br /><br /><br /><br />
	<hr />
	<h4>:: Headers</h4>

	<h1>Header 1</h1>
	<h2>Header 2</h2>
	<h3>Header 3</h3>
	<h4>Header 4</h4>
	<h5>Header 5</h5>

	<br /><br />
	<hr />
	<h4>:: Icons</h4>

	<span style="color: red">
		<a href="#"><SvgServe filename="icn-mol" /></a>
		<SvgServe filename="icn-mol" />
		<SvgServe filename="icn-molset" />
		<SvgServe filename="icn-data" />
		<SvgServe filename="icn-text" />
		<SvgServe filename="icn-link" />
		<SvgServe filename="icn-reaction" />
		<SvgServe filename="icn-model" />
		<SvgServe filename="icn-run" />
		<SvgServe filename="icn-json" />
		<SvgServe filename="icn-pdf" />
		<SvgServe filename="icn-svg" />
		<SvgServe filename="icn-md" />
		<SvgServe filename="icn-doc" />
		<SvgServe filename="icn-caret-left" />
		<SvgServe filename="icn-caret-right" />
		<SvgServe filename="icn-caret-up" />
		<SvgServe filename="icn-caret-down" />
	</span>
</template>

<style scoped></style>
