<script setup lang="ts"></script>

<template>
    <div id="main-wrap">
        <header>
            <nav>
                <RouterLink to="/">Browse</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
                <RouterLink to="/a">Module A</RouterLink> &nbsp;&nbsp;|&nbsp;&nbsp;
                <RouterLink to="/b">Module B</RouterLink>
            </nav>
        </header>
        <div id="body">
            <RouterView />
        </div>
    </div>
</template>

<style scoped lang="scss">
#main-wrap {
    display: flex;
    flex-direction: column;
    position: relative;
    // left: 40px;
    // top: 40px;
}
header {
    width: 100%;
    height: 40px;
    border-bottom: solid 1px #eee;
    margin-bottom: 20px;
    // background: yellow;
}
nav {
    height: 40px;
    line-height: 40px;
    position: sticky;
    top: 20px;
    left: 40px;
    display: inline-block;
    border-bottom: solid 1px #eee;
    width: calc(100vw - 80px);
}
#body {
    // background: orange;
}
</style>
