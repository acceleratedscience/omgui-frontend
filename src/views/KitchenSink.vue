<script setup lang="ts">
import SvgServe from '@/components/SvgServe.vue'

function test() {
	alert('test')
}
</script>

<template>
	<h1>Header 1</h1>
	<h2>Header 2</h2>
	<h3>Header 3</h3>
	<h4>Header 4</h4>
	<h5>Header 5</h5>
	<br /><br />
	<button @dblclick="test">TEST</button>
	<span style="color: red">
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

	<br /><br />
	<a href="#"><SvgServe filename="icn-mol" /></a>
	<span style="color: red"><SvgServe filename="icn-mol" /></span>
</template>

<style scoped></style>
