<script setup lang="ts"></script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Browse</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
            <RouterLink to="/a">Module A</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
            <RouterLink to="/b">Module B</RouterLink>
        </nav>
        <br />
    </header>

    <RouterView />
</template>

<style scoped></style>
