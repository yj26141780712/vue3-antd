<template>
    <a-layout-header v-if="fixedHeader" style="background-color: transparent;">头部</a-layout-header>
    <a-layout-header :class="{ 'fixed-header': fixedHeader, 'sider-header': siderHeader }" :style="{
        'width': headerWidth, 'z-index': zIndex99 ? 99 : 10
    }" style="padding: 0;">
        <div class="header-main">
            <div v-if="showHeaderLogo && !showHeadCollapsedButton" class="header-main-left">
                <img class="eliga-logo" src="/pamfacloud/assets/images/eliga.png" alt="">
                <span class="pamfa">.PAMFA</span>
                <span>系统名称</span>
            </div>
            <div v-if="showHeadCollapsedButton" class="header-collapsed-button" @click="toggleCollapsed()">
                <menu-fold-outlined v-if="!isCollapsed" />
                <menu-unfold-outlined v-if="isCollapsed" />
            </div>
            <div class="header-main-center" style="flex: 1 1 0%;">
            </div>
            <div class="header-main-right">
                <a-dropdown :trigger="'click'" class="user-dropmenu">
                    <div>
                        <a-avatar nzIcon="user" :src="''" :size="48">
                        </a-avatar>
                        <span>{{ info['name'] || '未知' }}</span>
                    </div>
                    <template #overlay>
                        <a-menu style="width: 160px;">
                            <a-menu-item class="user-dropmenu-item">
                                <user-outlined />
                                <span>个人设置</span>
                            </a-menu-item>
                            <a-menu-item class="user-dropmenu-item">
                                <lock-outlined />
                                <span>密码修改</span>
                            </a-menu-item>
                            <a-menu-item class="user-dropmenu-item" @click="showSetting">
                                <setting-outlined />
                                <span>主题设置</span>

                            </a-menu-item>
                            <a-divider style="margin:4px 0"></a-divider>
                            <a-menu-item class="user-dropmenu-item">
                                <logout-outlined />
                                <span>退出登录</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </a-layout-header>
    <Drawer v-model:visible="visible" @after-visible-change="afterVisibleChange"></Drawer>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
const { theme, user } = useStore();
const { isCollapsed, themeSetting, isLessMobileWidth } = storeToRefs(theme);
const { info } = storeToRefs(user);
const visible = ref(false);


const fixedHeader = computed(() => {
    return themeSetting.value.fixedHeader;
});

const headerWidth = computed(() => {
    return !isLessMobileWidth.value && themeSetting.value.currentNavigationMode === 'sider'
        && fixedHeader.value ? `calc(100% - ${isCollapsed ? 200 : 48}px)` : '100%'
})

const siderHeader = computed(() => { // 手机模式不显示
    return !isLessMobileWidth.value && themeSetting.value.currentNavigationMode === 'sider';
});
const zIndex99 = computed(() => {
    return themeSetting.value.currentNavigationMode !== 'sider';
});

const showHeadCollapsedButton = computed(() => {
    return isLessMobileWidth.value || themeSetting.value.currentNavigationMode === 'sider';
})

const showHeaderLogo = computed(() => {
    return themeSetting.value.currentNavigationMode !== 'sider'
});

const toggleCollapsed = function () {

}
const afterVisibleChange = function () {

}
const showSetting = function () {
    visible.value = true;
}
</script>
<style lang="less" scoped>
.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
}

.header-main {
    display: flex;
    height: 100%;
    padding-left: 12px;


    &-left {
        min-width: 186px;
        display: flex;
        align-items: center;
        overflow: hidden;

        span {
            font-size: 16px;

            &.pamfa {
                font-size: 36px;

                &+span {
                    font-weight: 600;
                    font-size: 34px;
                    margin-left: 28px;
                }
            }
        }

        span[nz-icon] {
            font-size: 72px;
            margin-right: 6px;
        }
    }

    &-logo {
        display: flex;
        align-items: center;
        overflow: hidden;

        span[nz-icon] {
            font-size: 72px;
            margin-right: 6px;
        }

        .pamfa {
            font-size: 32px;
        }
    }

    &-center {
        height: 100%;
        overflow: hidden;

        ul {
            height: 100%;
            white-space: nowrap;
        }
    }

    &-right {
        //min-width: 208px;
        padding-right: 12px;

        .global-dropmenu {
            font-size: 24px;
        }
    }

    .header-collapsed-button {
        margin-left: 16px;
        display: flex;
        align-items: center;
        font-size: 20px;
        cursor: pointer;
    }
}

.user-dropmenu {
    nz-avatar {
        margin: 8px 8px 8px 0;
        vertical-align: top;
    }

    &-item {
        span {
            margin-right: 8px;
        }
    }
}
</style>