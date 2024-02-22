<script setup lang="ts">
import { ref } from 'vue'

// APIs
import { useApiStore } from '@/stores/ApiStore'
const apiStore = useApiStore()
const fileSystemApi = apiStore.loadApi('fileSystem')

const command = ref<string>('')
const output = ref<string>('')

async function submitCommand() {
	output.value = ''
	const response = await fileSystemApi?.execCommand(command.value)
	if (response.status != 200) {
		// console.error('Failed to execute command:', response.statusText)
		output.value = response.data
		return
	}
	output.value = response.data
}
</script>

<template>
	<main id="module-a">
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

<style lang="css" scoped>
#module-a {
	background: #eee;
	padding: 24px;
}
</style>
