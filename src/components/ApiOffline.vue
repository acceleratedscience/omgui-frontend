<template>
	<div id="api-offline">
		<div class="content-wrap">
			<h3><span class="error">&#10005;</span> API OFFLINE</h3>
			<p v-if="isDevServer" class="dev-notice">
				You are running the frontend development server for the OpenAD GUI. For it to work, you need to have an instance of the OpenAD
				application running, so the GUI can connect to the API.
			</p>
			<p v-else>The OpenAD instance that powers the GUI is shut down.</p>
			<br />
			<div v-if="isDevServer">
				<p><b>If you don't have OpenAD installed yet:</b></p>
				<ol>
					<li>
						Find the
						<a href="https://github.com/acceleratedscience/open-ad-toolkit?tab=readme-ov-file#installation" target="_blank"
							>instructions on GitHub</a
						>.
					</li>
				</ol>
				<br />
				<p><b>If you have OpenAD installed:</b></p>
				<ol>
					<li>Open a terminal window</li>
					<li>
						If you installed OpenAD in a virtual environment, start your virtual environment<br /><span class="code"
							>~/ad-venv/bin/activate</span
						>
					</li>
					<li>Launch OpenAD<br /><span class="code">openad</span></li>
					<li>Launch the GUI server<br /><span class="code">launch gui</span></li>
					<li>
						You can close the window that opens on port 8024. The server is now running in the background and your development server will
						connect to it.
					</li>
				</ol>
			</div>
			<template v-else>
				<h4>Troubleshoot</h4>
				<p><b>If you launched OpenAD in the terminal:</b></p>
				<ol>
					<li>Restart the application if it's stuck</li>
					<li>Run <span class="code">launch gui</span> to activate the GUI server</li>
				</ol>
				<br />
				<p><b>If you launched OpenAD in a Jupyter Notebook:</b></p>
				<ol>
					<li>Restart your Notebook kernel by pressing the reload icon on top of your Notebook</li>
					<li>Run <span class="code">%openad launch gui</span> in any cell to activate the GUI server</li>
				</ol>
			</template>
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
