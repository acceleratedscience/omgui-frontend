<template>
	<nav :class="{ inverse: commandLineStore.active, 'hide-brand': commandLineStore.active }">
		<!-- <div class="align-left"> -->
		<div class="brand">
			<div class="main">% OpenAD</div>
			<!-- <div class="title">Workspace</div> -->
		</div>
		<div class="filler"></div>
		<!-- prettier-ignore -->
		<div class="items">
			<IconButton v-if="commandLineStore.active" class="terminal-sel" icon="icn-terminal-full" iconHover="icn-close" @click="commandLineStore.setActive(false)" />
			<IconButton v-else icon="icn-terminal" iconHover="icn-terminal-full" :sel="sel == 'cli'" @click="commandLineStore.setActive(true)" />
			<IconButton icon="icn-chat" iconHover="icn-chat-full" :sel="sel == 'assistant'" @click="commandLineStore.setActive(false)" />
			<router-link :to="{ name: 'my-mols' }"><IconButton icon="icn-file-molset" iconHover="icn-file-molset-full" :sel="sel == 'molset'" /></router-link>
			<router-link :to="{ name: 'mol' }"><IconButton icon="icn-file-mol" iconHover="icn-file-mol-full" :sel="sel == 'mol'" /></router-link>
			<router-link :to="{ name: 'filebrowser' }"><IconButton icon="icn-folder" iconHover="icn-folder-full" :sel="sel == 'dir'" /></router-link>
			<div class="display"></div>
		</div>
		<!-- </div> -->
	</nav>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

// Router
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useCommandLineStore } from '@/stores/CommandLineStore'
const fileStore = useFileStore()
const commandLineStore = useCommandLineStore()

// Components
import IconButton from '@/components/IconButton.vue'

// Type declarations
type Sel = 'dir' | 'mol' | 'molset' | 'assistant' | 'cli'

const sel: ComputedRef<Sel | null> = computed(() => {
	if (commandLineStore.active) {
		return 'cli'
	} else if (route.name == 'filebrowser') {
		// return fileStore.fileType as Sel
		return 'dir'
	} else if (route.name == 'mol') {
		return 'mol'
	} else if (route.name == 'my-mols') {
		return 'molset'
	}
	return null
})

function goTo(name: string) {
	router.push({ name: name })
}
</script>

<style lang="scss" scoped>
nav {
	min-height: 40px;
	line-height: 30px;
	display: flex;
	justify-content: flex-end;
	padding-right: 20px;
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
nav .items .icn-btn.terminal-sel:not(:hover) {
	color: $yellow;
}
nav .filler {
	flex: 1;
}

// Inverse style
nav.inverse,
nav.inverse .icn-btn {
	color: $white-80;
}
nav.inverse .icn-btn.sel {
	color: $blue-light;
}
nav.inverse .title {
	color: $white-50;
}

// Hide branding
nav.hide-brand .brand {
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
	margin-left: 16px;
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
	// nav .icn-folder.sel ~ .display::after,
	nav .icn-folder:hover ~ .display::after {
		content: 'File browser';
	}

	// Molecule viewer
	// nav .icn-file-mol.sel ~ .display::after,
	nav .icn-file-mol:hover ~ .display::after {
		content: 'Molecule viewer';
	}

	// My Molecules
	// nav .icn-file-molset.sel ~ .display::after,
	nav .icn-file-molset:hover ~ .display::after {
		content: 'My Molecules';
	}

	// AI Assistant
	nav .icn-chat:hover ~ .display::after {
		content: 'AI Assistant';
	}

	// Command Line
	nav .icn-terminal:hover ~ .display::after {
		content: 'Command line';
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
