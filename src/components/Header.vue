<template>
    <a-layout-header v-if="fixedHeader" style="background-color: transparent;">头部</a-layout-header>
    <a-layout-header :class="{ 'fixed-header': fixedHeader, 'sider-header': siderHeader, light: isLight }" :style="{
        'width': headerWidth, 'z-index': zIndex99 ? 99 : 10
    }" style="padding: 0;">
        <div class="header-main">
            <div v-if="showHeaderLogo && !showHeadCollapsedButton" class="header-main-left">
                <img class="logo" src="~@/assets/images/logo.png" alt="logo">
                <span class="title">家庭体检管理系统</span>
            </div>
            <div v-if="showHeadCollapsedButton" class="header-collapsed-button">
                <icon-font type="icon-menu-fold" :class="{ 'reverse': isCollapsed }" @click="toggleCollapsed"></icon-font>
            </div>
            <div class="header-main-center" style="flex: 1 1 0%;">
            </div>
            <div class="header-main-right">
                <!-- <a-dropdown class="message-dropmenu" :trigger="'click'">
                    <span class="user-notice-button">
                        <a-badge count="11">
                            <icon-font type="icon-user" class="message-icon" />
                        </a-badge>
                    </span>
                    <template #overlay>

                    </template>
                </a-dropdown> -->
                <a-dropdown class="user-dropmenu" :trigger="'click'">
                    <span>
                        <a-avatar :src="''" :size="48">
                            <template #icon>
                                <icon-font type="icon-user"></icon-font>
                            </template>
                        </a-avatar>
                        <span class="title">{{ userName }}</span>
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
                <!-- <a-dropdown class="global-dropmenu" :trigger="'click'">
                    <span>
                        <icon-font type="icon-global"></icon-font>
                    </span>
                    <template #overlay>
                        <a-menu style="width: 120px;">
                            <a-menu-item class="user-dropmenu-item">
                                <span class="text-icon">CN</span>
                                <span>简体中文</span>
                            </a-menu-item>
                            <a-menu-item class="user-dropmenu-item">
                                <span class="text-icon">US</span>
                                <span>English</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown> -->
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
const { userInfo } = storeToRefs(user);
const { logout: userLogout } = user;
const router = useRouter();
const visible = ref(false);

const userName = computed(() => {
    console.log(userInfo.value);
    return userInfo.value && (userInfo.value.name || userInfo.value.account);
})

const fixedHeader = computed(() => {
    return themeSetting.value.fixedHeader;
});

const headerWidth = computed(() => {
    console.log(isCollapsed.value);
    return (!isLessMobileWidth.value && themeSetting.value.currentNavigationMode === 'sider'
        && fixedHeader.value)
        ? `calc(100% - ${isCollapsed.value ? themeSetting.value.collapsedWidth : themeSetting.value.siderWidth}px)`
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
    return themeSetting.value.currentTheme === 'light'
        || (themeSetting.value.currentTheme === 'dark' &&
            themeSetting.value.currentNavigationMode === 'sider');
})

const toggleCollapsed = function () {
    isCollapsed.value = !isCollapsed.value;
}
const afterVisibleChange = function () {

}
const showSetting = function () {
    visible.value = true;
}
const logout = function () {
    router.push('/user/login');
    userLogout();
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
    background-color: #dee8eb;
    color: #4294d1;
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

        .logo {
            height: 42px;
        }

        .title {
            margin-left: 12px;
            font-size: 30px;
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
            color: #fff;
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
    height: 64px;
    line-height: 64px;
    display: inline-block;
    vertical-align: top;
}

.user-dropmenu {
    padding: 0 12px;
    line-height: 64px;
    height: 64px;
    display: inline-block;
    vertical-align: top;

    &:after {
        content: '';
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .title {
        font-size: 16px;
        margin-left: 8px;
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

.global-dropmenu {
    height: 64px;
    line-height: 64px;
    vertical-align: top;
    display: inline-block;
}

.message-icon {
    padding: 4px;
    font-size: 16px;
    vertical-align: middle;
}

.reverse {
    transform: rotate(180deg);
}
</style>