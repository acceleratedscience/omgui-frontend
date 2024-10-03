<template>
	<template v-if="errorText">
		<div class="error-msg">{{ errorText }}</div>
		<p class="soft">{{ loadingError }}</p>
	</template>
	<div v-else class="error-msg">{{ loadingError }}</div>
	<p v-if="note" class="soft">{{ note }}</p>
	<br />
	<cv-button @click="onBackClick">Back</cv-button>
</template>

<script setup lang="ts">
// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Props
const props = withDefaults(
	defineProps<{
		loadingError: string
		errorText?: string
		backLink?: string
		note?: string
	}>(),
	{
		// errorText: 'Something went wrong.',
	},
)

/*
 * Computed
 */

/*
 * Hooks
 */

/*
 * Methods
 */
function onBackClick() {
	if (props.backLink) {
		router.push(props.backLink)
	} else {
		router.back()
	}
}
</script>

<style lang="scss" scoped></style>
