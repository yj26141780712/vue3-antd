<template>
    <a-drawer class="custom-class" placement="right" :width="300">
        <div class="setting-drawer-content">
            <div>
                <h3 class="ant-pro-setting-drawer-title">整体风格设置</h3>
                <div class="ant-pro-setting-drawer-block-checbox">
                    <a-tooltip v-for="style of themeStyles" :title="style">
                        <div class="ant-pro-checkbox-item" :class="['ant-pro-checkbox-item-' + theme]"
                            @click="selectTheme(style)">
                            <check-outlined v-if="themeSetting.currentTheme == style" />
                        </div>
                    </a-tooltip>
                </div>
            </div>
            <div>
                <h3 class="ant-pro-setting-drawer-title">主题色</h3>
                <div class="theme-color-content">
                    <a-tooltip v-for="color of colors" :title="color.name">
                        <div :style="{ 'background-color': color.value }" class="theme-color-item"
                            @click="changeColor(color)">
                            <check-outlined v-if="color.name == color.name" />
                        </div>
                    </a-tooltip>
                </div>
            </div>
            <a-divider></a-divider>
            <div>
                <h3 class="ant-pro-setting-drawer-title">导航模式</h3>
                <div class="ant-pro-setting-drawer-block-checbox" style="margin-bottom: 24px;">
                    <a-tooltip v-for="mode of navigationModes" :title="mode">
                        <div class="ant-pro-checkbox-item" :class="['ant-pro-checkbox-item-' + mode + '-menu']"
                            a-tooltip @click="selectMode(mode)">
                            <check-outlined v-if="themeSetting.currentNavigationMode == mode" />
                        </div>

                    </a-tooltip>
                </div>
                <a-list :split="false">
                    <a-list-item>
                        固定头部
                        <template #actions>
                            <a-switch size="small" a-tooltip v-model:checked="themeSetting.fixedHeader">
                            </a-switch>
                        </template>
                    </a-list-item>
                    <a-list-item>
                        固定侧边栏
                        <template #actions>
                            <a-switch size="small" v-model:checked="themeSetting.fixedSidebar">
                            </a-switch>
                        </template>
                    </a-list-item>
                </a-list>
            </div>
            <a-divider></a-divider>
            <div>
                <h3>其他设置</h3>
                <a-list>
                    <a-list-item>
                        多标签
                        <template #actions>
                            <a-switch size="small" v-model:checked="themeSetting.showManytabs">
                            </a-switch>
                        </template>
                    </a-list-item>
                    <a-list-item>
                        固定多标签
                        <template #actions>
                            <a-switch size="small" :disabled="!themeSetting.fixedHeader || !themeSetting.showManytabs"
                                v-model:checked="themeSetting.fixedManytabs">
                            </a-switch>
                        </template>
                    </a-list-item>
                </a-list>
            </div>
        </div>
        <!-- <a-select v-model:value="color">
            <a-select-option v-for="(item, index) in colors" :value="item" :label="item" :key="index"></a-select-option>
        </a-select>
        <span>{{ color }}</span>
        <a-button @click="test" type="primary">切换</a-button> -->
    </a-drawer>
</template>

<script setup lang="ts">
import type { ColorType, NavigationMode, ThemeStyle } from '@/config/homeSettings';
import { changeThemeColor, getThemeColors } from '@/utils/theme';
import { reactive } from 'vue';
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
const { theme } = useStore();
const { themeSetting } = storeToRefs(theme);

const themeStyles = reactive(['light', 'dark'] as ThemeStyle[]);
const navigationModes = reactive(['sider', 'top', 'mixin'] as NavigationMode[]);
const colors = reactive([...getThemeColors()]);

const selectTheme = function (style: ThemeStyle) {
    themeSetting.value.currentTheme = style;
}

const selectMode = function (mode: NavigationMode) {
    themeSetting.value.currentNavigationMode = mode
}

const changeColor = function (color: ColorType) {
    changeThemeColor(color.name);
    themeSetting.value.currentThemeColor = color.name;
}

</script>
<style lang="less" scoped>
.ant-pro-setting-drawer-block-checbox {
    display: flex;
}

.ant-pro-checkbox-item {
    position: relative;
    margin-right: 16px;
    width: 44px;
    height: 36px;
    background-color: #f0f2f5;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
    overflow: hidden;
    border-radius: 4px;
    cursor: pointer;

    &::before {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        content: '';
        width: 33%;
        height: 100%;
        background-color: #ffffff;
    }

    &::after {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 25%;
        content: '';
        display: block;
        background-color: #ffffff;
    }

    span {
        position: absolute;
        right: 6px;
        bottom: 4px;
        color: var(--ant-primary-color);
    }

    &-dark {
        &::before {
            background-color: #001529;

        }

        &::after {
            background-color: #fff;
            z-index: 1;
        }
    }

    &-red {
        background-color: #fff;

        &::before {
            background-color: #6e6e6e;
        }

        &::after {
            background-color: #a33434;
        }
    }

    &-sider-menu {
        &::before {
            z-index: 1;
            background-color: #001529
        }

        &::after {
            background-color: #fff;
            ;
        }
    }

    &-top-menu {
        &::before {
            background-color: transparent;
        }

        &::after {
            background-color: #001529;
        }
    }

    &-mixin-menu {
        &::before {
            background-color: #fff;
        }

        &::after {
            background-color: #001529;
        }
    }
}

.theme-color-content {
    display: flex;
    flex-wrap: wrap;

    .theme-color-item {
        height: 20px;
        width: 20px;
        margin-right: 8px;
        margin-top: 8px;
        border-radius: 2px;
        line-height: 20px;
        text-align: center;

        span {
            color: #fff;
        }
    }
}
</style>
