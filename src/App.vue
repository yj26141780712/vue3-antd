<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { onMounted } from 'vue';
import useStore from './stores';
const { theme } = useStore();
const { initTheme } = theme;
const locale = zhCN;
onMounted(() => {
  initTheme()
})

</script>

<template>

  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>

</template>

<style >

</style>
