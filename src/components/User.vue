<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { invoke } from "@tauri-apps/api/tauri";

const username = ref("");

async function greet(): Promise<string> {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  return await invoke("get_user");
}

onBeforeMount(
  async () => {
    username.value = await greet();
    console.log(username.value);
  }
)

</script>

<template>
  <p>Username: {{ username }}</p>
</template>
