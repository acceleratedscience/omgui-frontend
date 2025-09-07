<template>
	<!-- <hr /> -->
	<h4>:: Modals</h4>
	<button @click="modalStore.alert('Hello world')">simple alert</button>
	&nbsp;
	<button
		@click="
			modalStore.alert('Hello <span style=\'color: red\'>world</span>', {
				html: true,
				size: 'md',
				primaryBtn: 'One',
				secondaryBtn: 'Two',
				otherBtn: 'Three',
				title: 'Here\'s a title',
				onSubmit,
				onCancel,
				onOther,
			})
		"
	>
		advanced alert
	</button>
	&nbsp;
	<button @click="alertPromise">alert promise</button>
	&nbsp;
	<button @click="confirmPromise">confirm promise</button>
	&nbsp;
	<button @click="modalStore.confirm('Are you sure?', { onSubmit, onCancel })">confirm modal</button>
	<br /><br />
	<button @click="modalStore.display('_ModalTemplate')">template</button>&nbsp;
	<button @click="modalStore.display('ModalViewer')">file type</button>&nbsp;
	<button @click="modalStore.display('ModalWorkspaces')">workspaces</button>&nbsp;
	<button @click="modalStore.display('ModalSaveFile', { path: 'my_dir/sub_dir/subsub_dir', filename: 'Foobar', ext: 'json', ext2: 'molset' })">
		Save file
	</button>
	&nbsp;
	<button @click="modalStore.display('ModalSaveFile', { path: 'my_dir/sub_dir/subsub_dir', filename: 'Foobar', dataType: 'molset' })">
		Save molset as
	</button>
	&nbsp;
	<button
		@click="
			modalStore.display(
				'ModalSaveFile',
				{ path: 'my_dir/sub_dir/subsub_dir', filename: 'Foobar', dataType: 'smol' },
				{
					onSubmit: () => {
						console.log('submitted')
					},
					onCancel: () => {
						console.log('cancelled')
					},
				},
			)
		"
	>
		Save mol as
	</button>
	&nbsp;

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

	<!-- Icon implementation -->
	<span style="color: red">
		<a href="#"><BaseIcon icon="icn-fire" /></a>
		<BaseIcon icon="icn-fire" />
		<BaseIcon icon="icn-fire" size="large" />

		<!-- Native icons -->
		<CloseIcon />
		<ChevronRight />
	</span>

	<br><br><br>

	<!-- Icon overview -->
	<div id="icn-card-wrap">
		<div v-for="(iconName, i) in iconNames" :key="i" class="icn-card">
			<BaseIcon :icon="iconName" />
			<div class="icon-name">{{ iconName }}</div>
		</div>
	</div>

	<br /><br />
	<hr />
	<h4>:: Icons</h4>
	<div class="icons-wrap">
		<div style="background: #ffd">
			Default
			<BaseIconButton icon="icn-star-full" />
		</div>
		<div>
			Soft
			<BaseIconButton icon="icn-star-full" btnStyle="soft" />
		</div>
		<div>
			Carbon
			<BaseIconButton icon="icn-star-full" btnStyle="carbon" />
		</div>
		<div>
			Custom colors
			<BaseIconButton icon="icn-star-full" color="green" colorHover="red" />
		</div>
		<div>
			Toggle
			<BaseIconButton icon="icn-star-full" :toggle="true" />
		</div>
		<div>
			Toggle with custom color
			<BaseIconButton icon="icn-star-full" :toggle="true" colorToggle="#d3bf0b" />
		</div>
		<div>
			Mini
			<BaseIconButton icon="icn-star-full" :mini="true" />
		</div>
	</div>
	<br />
	<div class="icons-in-field">
		Examples
		<div class="icons-wrap">
			<BaseIconButton icon="icn-full-screen-large" iconHover="icn-full-screen-large-hover" btnStyle="soft" icnSize="large" />
			<BaseIconButton
				icon="icn-star-full-large"
				iconHover="icn-star-full"
				iconSel="icn-star-full"
				colorToggle="#d3bf0b"
				:toggle="true"
				icnSize="large"
			/>
		</div>
	</div>
	<span> </span>

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

	<br /><br />
	<hr />
	<h4>:: Components</h4>
	
	<BaseFetchingFile />
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Compnents
import BaseIcon from '@/components/BaseIcon.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import BaseFetchingFile from '@/components/BaseFetchingFile.vue'
// @ts-ignore
import CloseIcon from '@carbon/icons-vue/es/close/16'
// @ts-ignore
import ChevronRight from '@carbon/icons-vue/es/chevron--right/16'

// Load all icon files
const svgs = import.meta.glob('@/assets/icons/*.svg')
const iconNames = ref<string[]>([])
onMounted(async () => {
	for (const path in svgs) {
		const name = (path.split('/').pop() || '').replace('.svg', '')
		if (name != '_template') iconNames.value.push(name)
	}
})

/**
 * Methods
 */

async function alertPromise() {
	const result = await modalStore.alert('Hello world', {
		title: 'I block the thread',
		secondaryBtn: true,
		onSubmit,
		onCancel,
	})

	if (result) {
		console.log('Continue after SUBMIT')
	} else {
		console.log('Continue after CANCEL')
	}
}

async function confirmPromise() {
	const result = await modalStore.confirm('Are you sure?', { onSubmit, onCancel })

	if (result) {
		console.log('Continue after SUBMIT')
	} else {
		console.log('Continue after CANCEL')
	}
}

function onSubmit() {
	alert('yes')
	modalStore.hide()
}
function onCancel() {
	alert('no')
	modalStore.hide()
}
function onOther() {
	alert('Other button')
	modalStore.hide()
}
</script>

<style scoped lang="scss">
/**
 * Icons
 */
#icn-card-wrap {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 0.5rem;
	height: 1000px;
}
#icn-card-wrap > .icn-card {
	display: flex;
	gap: 0.25rem;
	width: 200px;
}

.icons-wrap {
	display: flex;
	gap: 20px;
	font-size: $font-size-small;
}
.icons-in-field {
	font-size: $font-size-small;
}

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
