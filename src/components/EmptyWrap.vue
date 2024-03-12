<!--
	Usage:
	<component :is="something ? 'span' : EmptyWrap">
		<h1>Hello</h1>
	</component>
-->
<template>
	<slot v-bind="$attrs"></slot>
</template>
