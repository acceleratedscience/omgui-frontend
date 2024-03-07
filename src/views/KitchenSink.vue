<template>
	<!-- <hr />
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
	</span> -->

	<br /><br />
	<hr />
	<h4>:: Colors</h4>

	<div class="swatch-wrap">
		<div class="swatch black">$black</div>
		<div class="swatch black-60">$black-60</div>
		<div class="swatch black-30">$black-30</div>
		<div class="swatch black-20">$black-20</div>
		<div class="swatch black-10">$black-10</div>
		<div class="swatch soft-bg">$soft-bg</div>
	</div>
	<div class="swatch-wrap">
		<div class="swatch blue">$blue</div>
		<div class="swatch blue-hover">$blue-hover</div>
		<div class="swatch blue-30">$blue-30</div>
		<div class="swatch blue-20">$blue-20</div>
		<div class="swatch blue-10">$blue-10</div>
		<div class="swatch blue-05">$blue-05</div>
	</div>
	<div class="swatch-wrap">
		<div class="swatch success">$success</div>
		<div class="swatch warning">$warning</div>
		<div class="swatch caution">$caution</div>
		<div class="swatch error">$error</div>
	</div>
</template>

<script setup lang="ts">
// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Compnents
import SvgServe from '@/components/SvgServe.vue'

/**
 * Methods
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

<style scoped lang="scss">
/**
 * Swatches
 */

.swatch-wrap {
	display: flex;
	gap: 4px;
	flex-wrap: wrap;
	// border: solid 1px red;
	margin-bottom: 16px;
}
.swatch {
	flex: 0 0 100px;
	width: 100px;
	height: 50px;
	border-radius: 2px;
	padding: 10px;
}

// Blacks
.swatch.black {
	background-color: $black;
	color: #fff;
}
.swatch.black-60 {
	background-color: $black-60;
	color: #fff;
}
.swatch.black-30 {
	background-color: $black-30;
}
.swatch.black-20 {
	background-color: $black-20;
}
.swatch.black-10 {
	background-color: $black-10;
}
.swatch.soft-bg {
	background-color: $soft-bg;
}

// Blues
.swatch.blue {
	background-color: $blue;
	color: #fff;
}
.swatch.blue-hover {
	background-color: $blue-hover;
	color: #fff;
}
.swatch.blue-30 {
	background-color: $blue-30;
}
.swatch.blue-20 {
	background-color: $blue-20;
}
.swatch.blue-10 {
	background-color: $blue-10;
}
.swatch.blue-05 {
	background-color: $blue-05;
}

// Other
.swatch.success {
	background-color: $success;
	color: #fff;
}
.swatch.warning {
	background-color: $warning;
}
.swatch.caution {
	background-color: $caution;
}
.swatch.error {
	background-color: $error;
	color: #fff;
}
</style>
