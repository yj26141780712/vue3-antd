<template>
    <a-layout-header v-if="fixedHeader" style="background-color: transparent;"
        :style="{ height: '48px', 'line-height': '48px' }">头部</a-layout-header>
    <a-layout-header :class="{ 'fixed-header': fixedHeader, 'sider-header': siderHeader, light: isLight }" :style="{
        'width': headerWidth, 'z-index': zIndex99 ? 99 : 10, height: '48px', 'line-height': '48px'
    }" style="padding: 0;">
        <div class="header-main">
            <div v-if="showHeaderLogo && !showHeadCollapsedButton" class="header-main-left">
                <img class="eliga-logo" src="@/assets/images/eliga.png" alt="">
                <span>家庭体检系统</span>
            </div>
            <div v-if="showHeadCollapsedButton" class="header-collapsed-button" @click="toggleCollapsed()">
                <icon-font type="icon-menu-fold"></icon-font>
            </div>
            <div class="header-main-center" style="flex: 1 1 0%;">
            </div>
            <div class="header-main-right">
                <a-dropdown class="message-dropmenu">
                    <span class="user-notice-button">
                        <a-badge count="11">
                            <icon-font type="icon-user" class="message-icon" />
                        </a-badge>
                    </span>
                    <template #overlay>

                    </template>
                </a-dropdown>
                <a-dropdown class="user-dropmenu">
                    <span>
                        <a-avatar nzIcon="user" :src="''" :size="32">
                        </a-avatar>
                        <span class="title">{{ info['name'] || '未知' }}</span>
                    </span>
                    <template #overlay>
                        <a-menu style="width: 160px;">
                            <a-menu-item class="user-dropmenu-item">
                                <icon-font type="icon-user"></icon-font>
                                <span>个人设置</span>
                            </a-menu-item>
                            <a-menu-item class="user-dropmenu-item">
                                <icon-font type="icon-password"></icon-font>
                                <span>密码修改</span>
                            </a-menu-item>
                            <a-menu-item class="user-dropmenu-item" @click="showSetting">
                                <icon-font type="icon-setting"></icon-font>
                                <span>主题设置</span>
                            </a-menu-item>
                            <a-divider style="margin:4px 0"></a-divider>
                            <a-menu-item class="user-dropmenu-item" @click="logout">
                                <icon-font type="icon-logout"></icon-font>
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
import { useRouter } from 'vue-router';
const { theme, user } = useStore();
const { isCollapsed, themeSetting, isLessMobileWidth } = storeToRefs(theme);
const { info } = storeToRefs(user);
const router = useRouter();

const visible = ref(false);
const fixedHeader = computed(() => {
    return themeSetting.value.fixedHeader;
});

const headerWidth = computed(() => {
    return (!isLessMobileWidth.value && themeSetting.value.currentNavigationMode === 'sider'
        && fixedHeader.value)
        ? `calc(100% - ${isCollapsed.value ? themeSetting.value.siderWidth : themeSetting.value.collapsedWidth}px)`
        : '100%'
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

const isLight = computed(() => {
    return (themeSetting.value.currentTheme === 'light'
        && themeSetting.value.currentNavigationMode === 'sider') || (
            themeSetting.value.currentTheme === 'dark' &&
            (themeSetting.value.currentNavigationMode === 'sider' ||
                themeSetting.value.currentNavigationMode === 'mixin')
        );
})

const toggleCollapsed = function () {

}
const afterVisibleChange = function () {

}
const showSetting = function () {
    visible.value = true;
}
const logout = function () {
    console.log(123);
    router.push('/user/login');
}
</script>
<style lang="less" scoped>
.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
}

.light {
    background-color: #fff;
}

.header-main {
    display: flex;
    height: 100%;
    padding-left: 12px;
    // background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);

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
                    font-size: 20px;
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

.user-notice-button {
    padding: 0 12px;
    height: 48px;
    line-height: 48px;
    display: inline-block;
}

.user-dropmenu {
    padding: 0 12px;
    line-height: 48px;
    height: 48px;
    display: inline-block;

    &:after {
        content: '';
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .title {
        font-size: 16px;
        margin-left: 4px;
        vertical-align: middle;
    }

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

.message-icon {
    padding: 4px;
    font-size: 16px;
    vertical-align: middle;
}
</style>