<template>
    <div v-if="fixedSider" class="fixed-sider-stuff"
        :style="{ width: isCollapsed ? themeSetting.collapsedWidth : themeSetting.siderWidth + 'px' }">
    </div>
    <a-layout-sider v-if="showSider" :theme="menuTheme" :class="{ 'fixed-sider': fixedSider }" collapsible
        v-model:collapsed="isCollapsed" :trigger="null" :width="themeSetting.siderWidth"
        :collapsedWidth="themeSetting.collapsedWidth" :style="{ paddingTop: showSiderLogo ? 0 : 64 + 'px' }">
        <div v-if="showSiderLogo" class="sider-logo">
            <div class="logo">
                <img src="~@/assets/images/logo.png" alt="logo">
            </div>
        </div>
        <div style="flex: 1 1 0%;overflow: hidden auto;">
            <a-menu mode="inline" :theme="menuTheme" :inline-collapsed="isCollapsed" v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys" @select="select">
                <template v-for="item in siderMenus" :key="item.key">
                    <template v-if="!item.children">
                        <a-menu-item :key="item.key" :url="item.url">
                            <template v-if="item.icon" #icon>
                                <icon-font :type="item.icon" />
                            </template>
                            {{ item.title }}
                        </a-menu-item>
                    </template>
                    <template v-else>
                        <SubMenu :key="item.key" :menu-info="item" />
                    </template>
                </template>
            </a-menu>
        </div>
        <div class="sider-links">
            <icon-font type="icon-menu-fold" :class="{ 'reverse': isCollapsed }" @click="toggleCollapsed"></icon-font>
        </div>
    </a-layout-sider>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const { theme, user } = useStore();
const { themeSetting, isCollapsed, isLessMobileWidth } = storeToRefs(theme);
const { siderMenus } = storeToRefs(user);
const router = useRouter();
const openKeys = ref([]);
const selectedKeys = ref([]);

const fixedSider = computed(() => {
    return themeSetting.value.fixedSidebar;
});
const showSider = computed(() => {
    return !isLessMobileWidth.value && themeSetting.value.currentNavigationMode !== 'top'
});
const menuTheme = computed(() => {
    return themeSetting.value.currentTheme === 'light' ? 'light' : (
        themeSetting.value.currentNavigationMode === 'mixin' ? 'light' : 'dark'
    );
})
const showSiderLogo = computed(() => {
    return themeSetting.value.currentNavigationMode === 'sider';
});
const select = function ({ item, key, selectedKeys }) {
    router.push(item.url)
}
const toggleCollapsed = function () {
    isCollapsed.value = !isCollapsed.value;
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

.sider-logo {
    height: 64px;
    overflow: hidden;

    .logo {
        padding-top: 12px;
        text-align: center;

        img {
            height: 48px;
        }
    }
}

.sider-links {
    padding-left: 14px;
    height: 40px;
    line-height: 40px;
    margin: 4px 0;
    cursor: pointer;
    font-size: 20px;
    color: var(--ant-primary-color);

    .reverse {
        transform: rotate(180deg);
    }
}
</style>