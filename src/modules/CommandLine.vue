<template>
	<main>
		<p>
			This module is meant as a proof-of-concept to preview how we can run commands from the
			GUI.
		</p>
		<p>The returned data is not formatted for web, we'll need to refactor the API for that.</p>
		<p>To try it out, try `list files` or `?` or `intro`</p>
		<form @submit.prevent="submitCommand">
			<input type="text" placeholder="Type command..." v-model="command" /><br /><br />
			<button type="submit">Submit</button>
		</form>

		<br /><br /><b>Output</b>
		<pre>{{ output }}</pre>
	</main>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'

// API
import { mainApi } from '@/api/ApiService'

// Definitions
const command = ref<string>('')
const output = ref<string>('')

/**
 * Methods
 */

async function submitCommand() {
	output.value = ''
	const response = await mainApi?.execCommand(command.value)
	if (response.status != 200) {
		// console.error('Failed to execute command:', response.statusText)
		output.value = response.data
		return
	}
	output.value = response.data
	command.value = ''
}
</script>

<style lang="css" scoped>
main {
	background: #eee;
	padding: 24px;
}
</style>
