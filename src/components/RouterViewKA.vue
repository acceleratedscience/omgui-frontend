<template>
	<RouterView v-slot="{ Component }">
		<KeepAlive>
			<component v-if="Component" :is="Component" />
			<div v-else>Loading module...</div>
		</KeepAlive>
	</RouterView>
</template>
