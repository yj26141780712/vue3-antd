<template>
    <a-tabs v-if="showManyTabs" class="home-multi-tabs" :class="{ 'fixed-tabs': fixedManyTabs }"
        :style="{ width: manyTabsWidth }">
        <a-tab-pane key="home" tab="主页">
        </a-tab-pane>
    </a-tabs>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const { theme } = useStore();
const { themeSetting, isCollapsed } = storeToRefs(theme);
const showManyTabs = computed(() => {
    return themeSetting.value.showManytabs;
});
const fixedManyTabs = computed(() => {
    return themeSetting.value.fixedManytabs;
});

const manyTabsWidth = computed(() => {
    return themeSetting.value.currentNavigationMode === 'sider'
        || themeSetting.value.currentNavigationMode === 'mixin'
        && fixedManyTabs ? `calc(100% - ${isCollapsed ? themeSetting.value.siderWidth :
            themeSetting.value.collapsedWidth
        }px)` : '100%';
});

</script>
<style lang="less" scoped>

</style>