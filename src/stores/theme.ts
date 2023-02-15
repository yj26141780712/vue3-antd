import { getDefaultHomeSetting, getDefaultThemeSetting, type HomeSettings, type ThemeSetting, type ThemeStyle } from "@/config/homeSettings";
import { CACHE_THEME, CACHE_THEME_SETTINGS } from "@/enums/cacheEnum";
import { changeThemeColor } from "@/utils/theme";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";

export const useThemeStore = defineStore('theme', () => {
    const _mobileWidth = 768;
    const _siderWidth = 200;
    const _collapsedWidth = 48;
    const isCollapsed = ref(false);
    const isLessMobileWidth = ref(false);
    const homeSetting = reactive(getDefaultHomeSetting());
    let oldTheme: ThemeStyle | undefined;
    const themeSetting = useLocalStorage<ThemeSetting>(CACHE_THEME, getDefaultThemeSetting(), { deep: true });

    const fixedSider = computed(() => {
        return themeSetting.value.fixedSidebar;
    });

    const initTheme = function () {
        changeThemeColor(themeSetting.value.currentThemeColor);
        setThemeSetting();
    }

    const removeUnusedTheme = function (theme: ThemeStyle | undefined): void {
        if (theme) {
            document.documentElement.classList.remove(theme);
            const removedThemeStyle = document.getElementById(theme);
            if (removedThemeStyle) {
                document.head.removeChild(removedThemeStyle);
            }
        }
    }

    const loadCss = function (href: string, id: string): Promise<Event> {
        return new Promise((resolve, reject) => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = href;
            style.id = id;
            style.onload = resolve;
            style.onerror = reject;
            document.head.append(style);
        });
    }

    const loadTheme = function (firstLoad = true): Promise<Event> {
        const theme = themeSetting.value.currentTheme || 'default';
        if (firstLoad) { // 首次加载
            document.documentElement.classList.add(theme);
        }
        return new Promise<Event>((resolve, reject) => {
            loadCss(`${theme}.css?t=${new Date().getTime()}`, theme).then(
                (e) => {
                    if (!firstLoad) {
                        document.documentElement.classList.add(theme);
                        removeUnusedTheme(oldTheme);
                    }
                    resolve(e);
                },
                (e) => reject(e)
            );
        });
    }
    const toggleTheme = function (theme: ThemeStyle = 'light'): Promise<Event> {
        if (theme === themeSetting.value.currentTheme) { // 主题相同
            return Promise.resolve(new Event(''));
        }
        oldTheme = themeSetting.value.currentTheme;
        themeSetting.value.currentTheme = theme;
        return loadTheme(false);
    }

    const getHomeThemeSettings = function (collapsed: boolean = false, windowWidth: number): HomeSettings {
        // 非头部菜单显示 侧边栏
        let showSider = themeSetting.value.currentNavigationMode !== 'top';
        const siderWidth = _siderWidth;
        const collapsedWidth = _collapsedWidth;
        const fixedSider = !!themeSetting.value.fixedSidebar;
        const fixedHeader = !!themeSetting.value.fixedHeader;
        let showHeadCollapsedButton = themeSetting.value.currentNavigationMode === 'sider';
        let headerWidth = themeSetting.value.currentNavigationMode === 'sider'
            && fixedHeader ? `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)` : '100%';
        const siderHeader = themeSetting.value.currentNavigationMode === 'sider';
        const showManyTabs = !!themeSetting.value.showManytabs;
        const fixedManyTabs = !!themeSetting.value.fixedManytabs;
        const showSiderLogo = themeSetting.value.currentNavigationMode === 'sider';
        let manyTabsWidth = (
            themeSetting.value.currentNavigationMode === 'sider'
            || themeSetting.value.currentNavigationMode === 'mixin')
            && fixedManyTabs ? `calc(100% - ${collapsed ? collapsedWidth : siderWidth}px)` : '100%';
        let showHeaderLogo = themeSetting.value.currentNavigationMode !== 'sider';
        let showHeaderMenu = themeSetting.value.currentNavigationMode === 'top';
        const menuTheme = (themeSetting.value.currentTheme === 'light'
            || (themeSetting.value.currentTheme === 'dark' && themeSetting.value.currentNavigationMode === 'mixin')) ? 'light' : 'dark';
        const zIndex99 = themeSetting.value.currentNavigationMode !== 'sider';
        let showDrawerMenu = false;
        if (windowWidth <= _mobileWidth) {
            showSider = false;
            showHeadCollapsedButton = true;
            showDrawerMenu = true;
            showHeaderMenu = false;
            showHeaderLogo = true;
            headerWidth = '100%';
            manyTabsWidth = '100%';
        }
        return {
            menuTheme,
            collapsedWidth,
            siderWidth,
            headerWidth,
            siderHeader,
            showSider,
            fixedHeader,
            showHeadCollapsedButton,
            fixedSider,
            showManyTabs,
            fixedManyTabs,
            showSiderLogo,
            manyTabsWidth,
            showHeaderLogo,
            showHeaderMenu,
            zIndex99,
            showDrawerMenu
        };
    }

    const setThemeSetting = function () {
        const windowWidth = window.innerWidth;
        const obj = getHomeThemeSettings(isCollapsed.value, windowWidth);
        for (const key in homeSetting) {
            homeSetting[key] = obj[key];
        }
    }

    return {
        isCollapsed, isLessMobileWidth,
        initTheme, loadTheme, toggleTheme, homeSetting, themeSetting, setThemeSetting
    };
})