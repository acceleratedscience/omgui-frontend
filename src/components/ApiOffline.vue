<template>
	<div id="api-offline">
		<div class="content-wrap">
			<h3><span class="error">&#10005;</span> API OFFLINE</h3>
			<p v-if="isDevServer" class="dev-notice">
				You are running the development server for the OMGUI frontend. You need an instance of the OMGUI server running, so the GUI can
				connect to the API.
			</p>
			<p v-else>The OMGUI server is not reachable.<br />Try restarting the server.</p>
			<br />
			<div v-if="isDevServer">
				<p><b>Install OMGUI:</b></p>
				<span class="code">pip install omgui</span>
				<br /><br />
				<p><b>Launching the OMGUI server:</b></p>
				<span class="code">import omgui<br />omgui.launch()</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Type declarations
import type { ComputedRef } from 'vue'

/*
 * Computed
 */

const isDevServer: ComputedRef<boolean> = computed(() => {
	return import.meta.env.DEV
})
</script>

<style lang="scss" scoped>
#api-offline {
	width: 100%;
	height: 100%;
	background: rgba(40, 40, 40, 1);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 20%;
}
#api-offline .content-wrap {
	max-width: 400px;
	margin: 40px;
}
#api-offline .error {
	color: $error;
	margin-right: 10px;
}
#api-offline .dev-notice {
	border: solid 1px $error;
	background: $error;
	padding: 16px;
}
#api-offline a {
	color: white;
	text-decoration: underline;
}

span.code {
	display: inline-block;
	background: rgba(255, 255, 255, 0.1);
	margin-top: 4px;
}
</style>
