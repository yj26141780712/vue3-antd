<template>
    <!--侧边栏-->
    <div v-if="fixedSider" class="fixed-sider-stuff"
        :style="{ width: isCollapsed ? themeSetting.collapsedWidth : themeSetting.siderWidth + 'px' }">
    </div>
    <a-layout-sider v-if="showSider" :theme="menuTheme" :class="{ 'fixed-sider': fixedSider }" collapsible
        v-model:collapsed="isCollapsed" :trigger="null" :width="themeSetting.siderWidth"
        :collapsedWidth="themeSetting.collapsedWidth" :style="{ paddingTop: showSiderLogo ? 0 : 48 + 'px' }">
        <div v-if="showSiderLogo" class="sider-logo">
            <div class="logo">
                <img class="eliga-logo" src="@/assets/images/eliga.png" alt="">
                <span class="pamfa">.PAMFA</span>
            </div>
            <span v-if="!isCollapsed" class="text">
                系统名称
            </span>
        </div>
        <div style="flex: 1 1 0%;overflow: hidden auto;">
            <a-menu mode="inline" :theme="menuTheme" :inline-collapsed="isCollapsed" v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys" @select="select">
                <template v-for="item in list" :key="item.key">
                    <template v-if="!item.children">
                        <a-menu-item :key="item.key">
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
        <div class="sider-links" @click="toggleCollapsed">
            <icon-font type="icon-menu-fold"></icon-font>
        </div>
    </a-layout-sider>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/api/user/model/menuModel';
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const { theme } = useStore();
const { themeSetting, isCollapsed, isLessMobileWidth } = storeToRefs(theme);
const router = useRouter();

const openKeys = ref([]);
const selectedKeys = ref([]);

const list: MenuItem[] = [
    {
        id: 0, key: '0', title: '主页', icon: 'icon-user',
    },
    {
        id: 1, key: '1', title: '销售管理', icon: 'icon-user',
        children: [
            {
                id: 11, key: '11', title: '设备管理', url: '',
                children: [
                    { id: 111, key: '111', title: '测试' }
                ]
            },
            { id: 12, key: '12', title: '设备管理', url: '' },
            { id: 13, key: '13', title: '设备管理', url: '' },
        ]
    },
    {
        id: 2, key: '2', title: '医生诊断', icon: 'icon-user',
    },
    {
        id: 3, key: '3', title: '销售管理', icon: 'icon-user',
    },
    {
        id: 4, key: '4', title: '系统管理', icon: 'icon-user',
        children: [
            { id: 41, key: '41', title: '公司管理', url: '/system/company' },
            { id: 42, key: '42', title: '菜单管理', url: '/system/menu' },
            { id: 43, key: '43', title: '角色管理', url: '/system/role' },
            { id: 44, key: '44', title: '账户管理', url: '/system/user' },
        ]
    }
];
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
</style>