<script setup lang="ts">
const list = ["display1", "display2", "display3", "display4", "h1", "h2", "h3", "text1", "text2", "tip1", "tip2"];
const title = "Text";
</script>
<template>
  <div class="page-demo">
    <h1>{{ title }}</h1>
    <div v-for="t in list" :key="t" :class="[`o-txt-${t}`]">{{ t }}</div>
  </div>
</template>
<style lang="scss"></style>
