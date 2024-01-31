<script setup lang="ts">
import SubModule from '../components/SubModule.vue'
</script>

<template>
  <main id="module-a">
    I'm module A
    <br /><br />
    <SubModule />
  </main>
</template>

<style lang="css" scoped>
#module-a {
  background: #dcd;
  padding: 24px;
}
</style>
