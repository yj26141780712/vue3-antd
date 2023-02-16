import { getDefaultThemeSetting, type ThemeSetting, type ThemeStyle } from "@/config/homeSettings";
import { CACHE_THEME, CACHE_THEME_SETTINGS } from "@/enums/cacheEnum";
import { changeThemeColor } from "@/utils/theme";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";

export const useThemeStore = defineStore('theme', () => {
    const isCollapsed = ref(false);
    const isLessMobileWidth = ref(false);
    let oldTheme: ThemeStyle | undefined;
    const themeSetting = useLocalStorage<ThemeSetting>(CACHE_THEME, getDefaultThemeSetting(), { deep: true });

    const initTheme = function () {
        changeThemeColor(themeSetting.value.currentThemeColor);
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


    return {
        isCollapsed, isLessMobileWidth, themeSetting,
        initTheme, loadTheme, toggleTheme
    };
})