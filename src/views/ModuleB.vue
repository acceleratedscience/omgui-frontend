<script setup lang="ts">
import SubModule from '../components/SubModule.vue'
</script>

<template>
  <main id="module-a">
    I'm module B
    <br /><br />
    <SubModule />
  </main>
</template>

<style lang="css" scoped>
#module-a {
  background: #ddc;
  padding: 24px;
}
</style>
