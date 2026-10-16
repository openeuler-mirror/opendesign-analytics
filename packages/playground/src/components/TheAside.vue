<script setup lang="ts">
import { routes } from '@/router';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const title = '组件';
const currentNav = ref('Home');

watch(
  () => route.name,
  (val) => {
    currentNav.value = val as string;
  }
);

const navList = routes.map((item) => {
  const { path, name, meta } = item;
  return {
    path,
    name,
    label: meta?.title,
  };
});
const navClick = (item: (typeof navList)[0]) => {
  console.log(item.path);
  router.push(item.path);
};
</script>
<template>
  <aside class="the-aside">
    <div class="aside-title">
      {{ title }}
    </div>
    <div class="nav-list">
      <div v-for="item in navList" :key="item.path" class="nav-item" :class="{ active: currentNav === item.name }" @click="navClick(item)">
        {{ item.label }}
      </div>
    </div>
  </aside>
</template>
<style lang="scss" scoped>
.the-aside {
  background-color: var(--o-color-fill2);
  color: var(--o-color-info1);
  overflow: auto;
  height: calc(100vh - 48px);
}
.aside-title {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--o-color-control1-light);
  font-size: var(--o-font_size-h1);
}
.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    color: var(--o-color-info1-inverse);
    background-color: var(--o-color-primary1-light);
  }
  &.active {
    color: var(--o-color-info1-inverse);
    background-color: var(--o-color-primary1);
  }
}
</style>
