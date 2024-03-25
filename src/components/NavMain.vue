<template>
	<!-- <header> -->
	<nav>
		<div class="brand">
			<div class="main">% OpenAD</div>
			<div class="title">Workspace</div>
		</div>
		<div class="filler"></div>
		<div class="items">
			<IconButton icon="icn-terminal" iconHover="icn-terminal-full" :sel="sel == 'cli'" @click="goTo('cli')" />
			<IconButton icon="icn-chat" iconHover="icn-chat-full" :sel="sel == 'assistant'" @click="goTo('assistant')" />
			<IconButton icon="icn-file-molset" iconHover="icn-file-molset-full" :sel="sel == 'molset'" @click="goTo('molgrid')" />
			<IconButton icon="icn-file-mol" iconHover="icn-file-mol-full" :sel="sel == 'mol'" @click="goTo('molviewer-input')" />
			<IconButton icon="icn-folder" iconHover="icn-folder-full" :sel="sel == 'dir'" @click="goTo('filebrowser')" />
			<div class="display"></div>
			<!-- {{ route.name }} -->
		</div>
	</nav>
	<!-- </header> -->
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
const fileStore = useFileStore()

// Components
import IconButton from '@/components/IconButton.vue'

// Type declarations
type Sel = 'dir' | 'mol' | 'molset' | 'assistant' | 'cli'

const sel: ComputedRef<Sel | null> = computed(() => {
	if (route.name == 'filebrowser') {
		// return fileStore.fileType as Sel
		return 'dir'
	} else if (route.name == 'molviewer-input') {
		return 'mol'
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
	left: 40px;
	display: flex;
	justify-content: flex-end;
	left: 0;
	right: 0;

	// Bottom
	position: fixed;
	right: 0;
	bottom: 0;
	z-index: 1;
}

// File browser is always full width
#main-wrap.file-browser nav {
	background: white;
	box-shadow: 0 -1px 0 $black-10;
}

// Flex layout
nav .brand {
	display: flex;
	flex-direction: row;
}
nav .items {
	display: flex;
	flex-direction: row-reverse;
}
nav .filler {
	flex: 1;
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
	// pointer-events: none;
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

	// Molecule list
	// nav .icn-file-molset.sel ~ .display::after,
	nav .icn-file-molset:hover ~ .display::after {
		content: 'Molecule list';
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
	nav {
		background: white;
		z-index: 1;
		background: white;
		box-shadow: 0 -1px 0 $black-10;
	}
}
</style>
