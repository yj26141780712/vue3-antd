<template>
    <!--侧边栏-->
    <div v-if="fixedSider" class="fixed-sider-stuff"
        :style="{ width: isCollapsed ? collapsedWidth : siderWidth + 'px' }">
    </div>
    <a-layout-sider v-if="showSider" :theme="menuTheme" :class="{ 'fixed-sider': fixedSider }" collapsible
        v-model:collapsed="isCollapsed" :trigger="null" :width="siderWidth" :collapsedWidth="collapsedWidth"
        :style="{ paddingTop: showSiderLogo ? 0 : 64 + 'px' }">
        <div v-if="showSiderLogo" class="sider-logo">
            <div class="logo">
                <img class="eliga-logo" src="/pamfacloud/assets/images/eliga.png" alt="">
                <span class="pamfa">.PAMFA</span>
            </div>
            <span v-if="!isCollapsed" class="text">
                系统名称
            </span>
        </div>
        <div style="flex: 1 1 0%;overflow: hidden auto;">

        </div>
        <div class="sider-links" @click="toggleCollapsed">
            <menu-fold-outlined v-if="!isCollapsed" />
            <menu-unfold-outlined v-if="isCollapsed" />
        </div>
    </a-layout-sider>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const { theme } = useStore();
const { themeSetting, isCollapsed, isLessMobileWidth } = storeToRefs(theme);
const collapsedWidth = 48;
const siderWidth = 200;
const fixedSider = computed(() => {
    return themeSetting.value.fixedSidebar;
});
const showSider = computed(() => {
    return !isLessMobileWidth.value && themeSetting.value.currentNavigationMode !== 'top'
});
const menuTheme = computed(() => {
    return themeSetting.value.currentTheme;
})
const showSiderLogo = computed(() => {
    return themeSetting.value.currentNavigationMode === 'sider';
});


const toggleCollapsed = function () {

}
</script>
<style lang="less" scoped>
.fixed-sider-stuff {
    overflow: hidden;
}

.fixed-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    height: 100%;
}
</style>