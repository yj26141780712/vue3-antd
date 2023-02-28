<template>
    <div v-if="showManyTabs" :style="{ height: fixedManyTabs ? '62px' : '0' }">

    </div>
    <a-tabs v-if="showManyTabs" class="home-multi-tabs" :class="{ 'fixed-tabs': fixedManyTabs }"
        :style="{ width: manyTabsWidth }" :type="'card'" v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane v-for="(tab, index) in tabs" :key="tab.path">
            <template #tab>
                <a-dropdown :trigger="['contextmenu']">
                    <span class="tab">
                        <span>
                            {{ tab.meta.title }}
                        </span>
                        <icon-font v-if="activeKey == tab.path" type="icon-reload" ref="iconRef"
                            @click.stop="refreshPage(tab)"></icon-font>
                        <icon-font v-if="showClose" type="icon-close" @click.stop="closePage(tab, index)"></icon-font>
                    </span>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="closeOther">关闭其他</a-menu-item>
                            <a-menu-item key="closeLeft">关闭到左侧</a-menu-item>
                            <a-menu-item key="closeRight">关闭到右侧</a-menu-item>
                            <a-menu-item key="reloadPage">刷新当前页</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
        </a-tab-pane>
        <template #rightExtra>
            <a-dropdown class="tab-extra-dropmenu">
                <icon-font type="icon-ellipsis"></icon-font>
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <span>关闭其他</span>
                        </a-menu-item>
                        <a-menu-item>
                            <span>刷新当前页</span>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>
    </a-tabs>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { useRouter, type RouteLocationNormalized } from 'vue-router';
import gsap from 'gsap';
const { theme, staticRouter } = useStore();
const { themeSetting, isCollapsed } = storeToRefs(theme);
const { selectedRouterList: tabs, activePath: activeKey, refreshing, keepNames } = storeToRefs(staticRouter);
const router = useRouter();
const iconRef = ref(null);

const showManyTabs = computed(() => {
    return themeSetting.value.showManytabs;
});

const fixedManyTabs = computed(() => {
    return themeSetting.value.fixedManytabs;
});

const manyTabsWidth = computed(() => {
    if (!themeSetting.value.fixedManytabs) {
        return '100%';
    }
    return (themeSetting.value.currentNavigationMode === 'sider'
        || themeSetting.value.currentNavigationMode === 'mixin') ? `calc(100% - ${!isCollapsed.value ? themeSetting.value.siderWidth :
            themeSetting.value.collapsedWidth
        }px)` : '100%';
});

const showClose = computed(() => {
    return tabs.value.length > 1;
})

const tabChange = () => {
    router.push(activeKey.value);
}

const refreshPage = (tab: RouteLocationNormalized) => {
    keepNames.value = [...keepNames.value.filter(x => x !== tab.name)];
    refreshing.value = true;
    gsap.fromTo(iconRef.value[0], { rotate: 0 }, { duration: 1, rotate: 360 })
    nextTick(() => {
        keepNames.value.push(tab.name as string);
        refreshing.value = false;
        console.log(keepNames.value)
    });
}

const closePage = (tab: RouteLocationNormalized, index: number) => {
    keepNames.value = [...keepNames.value.filter(x => x !== tab.name)];
    const deleteTab = tabs.value.splice(index, 1);
    if (deleteTab[0].path === activeKey.value) {
        const activeIndex = index === 0 ? 0 : index - 1;
        activeKey.value = tabs.value[activeIndex].path;
        router.push(activeKey.value);
    }
}

</script>
<style lang="less" scoped>
.home-multi-tabs {
    background-color: #fff;
    height: 62px;
    padding-left: 16px;
    padding-top: 6px;

    .tab {
        padding: 8px 16px;
    }

    &:deep(.ant-tabs-nav .ant-tabs-tab, > div > .ant-tabs-nav .ant-tabs-tab) {
        padding: 0;
    }

    &:deep(.ant-tabs-tab .anticon) {
        margin-right: 0;
        margin-left: 8px;
        font-size: 12px;
        color: rgba(0, 0, 0, .45);
    }
}



.fixed-tabs {
    position: fixed;
    top: 64px;
    right: 0;
    z-index: 10;
    height: 62px;
    transition: width .2s;
}

.tab-extra-dropmenu {
    transform: rotate(90deg);
    cursor: pointer;
    font-size: 16px;
    padding: 12px;
    margin-left: 8px;
}
</style>