<template>
    <div v-if="fixedManyTabs" class="" style="height:62px">

    </div>
    <a-tabs v-if="showManyTabs" class="home-multi-tabs" :class="{ 'fixed-tabs': fixedManyTabs }"
        :style="{ width: manyTabsWidth }" :type="'card'" v-model:activeKey="activeKey" @change="tabChange">
        <a-tab-pane v-for="tab in tabs" :key="tab.path">
            <template #tab>
                <a-dropdown :trigger="['contextmenu']">
                    <span class="tab">
                        <span>
                            {{ tab.meta.title }}
                        </span>
                        <icon-font v-if="activeKey==tab.path" type="icon-reload" ref="iconRef" @click="refresh(tab)"></icon-font>
                        <icon-font type="icon-close"></icon-font>
                    </span>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="1">1st menu item</a-menu-item>
                            <a-menu-item key="2">2nd menu item</a-menu-item>
                            <a-menu-item key="3">3rd menu item</a-menu-item>
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
const { selectedRouterList: tabs, activePath: activeKey,refreshing,keepNames } = storeToRefs(staticRouter);
const router = useRouter();
const iconRef = ref(null);

const showManyTabs = computed(() => {
    return themeSetting.value.showManytabs;
});

const fixedManyTabs = computed(() => {
    return themeSetting.value.fixedManytabs;
});

const manyTabsWidth = computed(() => {
    return (themeSetting.value.currentNavigationMode === 'sider'
        || themeSetting.value.currentNavigationMode === 'mixin') ? `calc(100% - ${isCollapsed ? themeSetting.value.siderWidth :
            themeSetting.value.collapsedWidth
        }px)` : '100%';
});

const tabChange = () => {
    router.push(activeKey.value);
}

const refresh = (tab:RouteLocationNormalized)=>{
    console.log(tab);
    console.log(iconRef.value);
    keepNames.value = [...keepNames.value.filter(x=>x!==tab.name)];
    refreshing.value = true;
    gsap.fromTo(iconRef.value[0],{rotate:0},{duration:1, rotate:360 })
    nextTick(()=>{
        keepNames.value.push(tab.name as string);
        refreshing.value = false;    
    });
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
    top: 48px;
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

.icon-refreshing {
    animation: circle 1.5s ;
    transform: rotate(0);
}
@keyframes circle {
    0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(360deg);
    }   
}
</style>