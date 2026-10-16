<script setup lang="ts">
import TheAside from './components/TheAside.vue';
</script>

<template>
  <TheAside class="app-aside" />
  <div class="app-body">
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  --app-header-height: 0;
  --app-aside-width: 240px;
  font-family: 'Helvetica', 'Arial', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  @media (max-width: 840px) {
    --app-aside-width: 0;
  }
}
.app-aside {
  position: fixed;
  top: var(--app-header-height);
  left: 0;
  bottom: 0;
  width: var(--app-aside-width);
  z-index: 9;
  @media (max-width: 840px) {
    display: none;
  }
}
.app-body {
  margin-top: var(--app-header-height);
  margin-left: var(--app-aside-width);
  min-height: calc(100vh - 48px);
  background-color: var(--o-color-fill1);
}
</style>
