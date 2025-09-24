<template>
	<nav :class="{ inverse }">
		<div class="brand">
			<div class="main">omgui</div>
			<!-- <div class="title">Workspace</div> -->
		</div>
		<div class="filler"></div>
		<div class="items">
			<!-- Terminal -->
			<!-- <BaseIconButton
				v-if="commandLineStore.active"
				icon="icn-terminal"
				iconHover="icn-close"
				iconSel="icn-terminal-full"
				:sel="sel == 'cli'"
				@click="commandLineStore.setActive(!commandLineStore.active)"
			/>
			<BaseIconButton
				v-else
				icon="icn-terminal"
				iconHover="icn-terminal-full"
				iconSel="icn-terminal-full"
				:sel="sel == 'cli'"
				@click="commandLineStore.setActive(!commandLineStore.active)"
			/> -->

			<!-- AI Assistant -->
			<!-- <BaseIconButton
				v-if="assistantStore.active"
				icon="icn-chat"
				iconHover="icn-close"
				iconSel="icn-chat-full"
				:sel="sel == 'assistant'"
				@click="assistantStore.setActive(!assistantStore.active)"
			/>
			<BaseIconButton
				v-else
				icon="icn-chat"
				iconHover="icn-chat-full"
				iconSel="icn-chat-full"
				:sel="sel == 'assistant'"
				@click="assistantStore.setActive(!assistantStore.active)"
			/> -->

			<!-- My mols -->
			<router-link :to="{ name: 'mws' }" class="mws">
				<BaseIconButton icon="icn-bookmark" iconHover="icn-bookmark-full" iconSel="icn-bookmark-full" :sel="sel == 'mws'" />
			</router-link>

			<!-- Result -->
			<!-- <router-link :to="{ name: 'result' }" class="result">
				<BaseIconButton icon="icn-result" iconHover="icn-result-full" iconSel="icn-result-full" :sel="sel == 'result'" />
			</router-link> -->

			<!-- Molecule viewer -->
			<router-link :to="{ name: 'mol' }" class="mol-viewer">
				<BaseIconButton icon="icn-file-smol" iconHover="icn-file-smol-full" iconSel="icn-file-smol-full" :sel="sel == 'mol'" />
			</router-link>

			<!-- File browser -->
			<router-link :to="{ name: 'filebrowser' }" class="file-browser">
				<BaseIconButton icon="icn-folder" iconHover="icn-folder-full" iconSel="icn-folder-full" :sel="sel == 'dir'" />
			</router-link>
			<div class="display"></div>
		</div>
		<!-- </div> -->
	</nav>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Router
import { useRoute } from 'vue-router'
const route = useRoute()

// Stores
import { useCommandLineStore } from '@/stores/CommandLineStore'
import { useAssistantStore } from '@/stores/AssistantStore'
const commandLineStore = useCommandLineStore()
const assistantStore = useAssistantStore()

// Components
import BaseIconButton from '@/components/BaseIconButton.vue'

// Type declarations
import type { ComputedRef } from 'vue'
type Sel = 'dir' | 'mol' | 'result' | 'mws' | 'assistant' | 'cli'

/**
 * Computed
 */

const inverse: ComputedRef<boolean> = computed(() => {
	return commandLineStore.active || assistantStore.active
})

const sel: ComputedRef<Sel | null> = computed(() => {
	if (assistantStore.active) {
		return 'assistant'
	} else if (commandLineStore.active) {
		return 'cli'
	} else if (route.name == 'filebrowser') {
		return 'dir'
	} else if (route.name == 'mol') {
		return 'mol'
	} else if (route.name == 'result') {
		return 'result'
	} else if (route.name == 'mws') {
		return 'mws'
	}
	return null
})
</script>

<style lang="scss" scoped>
nav {
	min-height: 40px;
	line-height: 30px;
	display: flex;
	justify-content: flex-end;
	padding: 0 26px 0 15px;
	position: fixed;
	z-index: 40;
	left: 0;
	bottom: 0;

	// Setting the width to the viewport ensures
	// that the icons don't jump whenever the
	// scrollbar appears or disappears.
	width: 100vw;
}

nav .brand {
	display: flex;
	flex-direction: row;
}
nav .items {
	display: flex;
	flex-direction: row-reverse;
}
// nav .items .icn-btn.terminal-sel:not(:hover) {
// 	color: $yellow;
// }
nav .filler {
	flex: 1;
}

// Inverse style
nav.inverse,
nav.inverse .icn-btn {
	color: $white-80;
}
nav.inverse .icn-btn.sel {
	color: $yellow;
}
nav.inverse .title {
	color: $white-50;
}
nav.inverse .brand {
	display: none;
}

// File browser is always full width
#main-wrap.file-browser nav:not(.inverse) {
	background: white;
	box-shadow: 0 -1px 0 $black-10;
}

// Brand left
nav .main,
nav .title {
	font-size: 16px;
	line-height: 40px;
}
nav .main {
	font-weight: 600;
}
nav .title {
	font-weight: 300;
	margin-left: 4px;
	color: $black-60;
}
nav .title::before {
	content: '';
	margin-right: 4px;
}

// Items
nav .icn-btn {
	border-radius: 0;
}
nav .icn-btn.sel {
	color: $blue;
}

// Display
nav .display::after {
	content: '';
	height: 40px;
	line-height: 40px;
	font-size: $font-size-small;
	margin-right: 8px;
}

/**
 * Hover
 */

@media (hover: hover) {
	// General style
	nav .items .icn-btn:hover {
		background: transparent;
	}
	nav .icn-btn:hover ~ .display::after {
		color: $black-60;
	}
	nav.inverse .icn-btn:hover ~ .display::after {
		color: $white-50;
	}

	// File browser
	nav a.file-browser:hover ~ .display::after {
		content: 'File browser';
	}

	// Molecule viewer
	nav a.mol-viewer:hover ~ .display::after {
		content: 'Molecule viewer';
	}

	// Molecule working set
	nav a.mws:hover ~ .display::after {
		content: 'Molecule working set';
	}

	// Result
	nav a.result:hover ~ .display::after {
		content: 'Result';
	}

	// AI Assistant
	nav .icn-chat:not(.sel):hover ~ .display::after {
		content: 'AI Assistant';
	}

	// Command Line
	nav .icn-terminal:not(.sel):hover ~ .display::after {
		content: 'Command line';
	}

	// Exit
	nav .icn-chat.sel:hover ~ .display::after,
	nav .icn-terminal.sel:hover ~ .display::after {
		content: 'Exit';
	}
}

/**
 * Responsive
 */

@media (max-width: $bp-xlarge) {
	nav:not(.inverse) {
		z-index: 1;
		background: white;
		box-shadow: 0 -1px 0 $black-10;
	}
}
</style>
