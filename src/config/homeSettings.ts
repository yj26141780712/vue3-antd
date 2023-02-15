

export interface HomeSettings {
    menuTheme: 'light' | 'dark';
    collapsedWidth: number;
    siderWidth: number;
    headerWidth: string;
    siderHeader: boolean;
    showSider: boolean;
    fixedSider: boolean;
    fixedHeader: boolean;
    showHeadCollapsedButton: boolean;
    showManyTabs: boolean;
    fixedManyTabs: boolean;
    manyTabsWidth: string;
    showSiderLogo: boolean;
    showHeaderLogo: boolean;
    showHeaderMenu: boolean;
    zIndex99: boolean;
    showDrawerMenu: boolean;
}

export declare type ThemeStyle = 'light' | 'dark';
export declare type NavigationMode = 'sider' | 'top' | 'mixin'

export interface ColorType {
    name: ThemeColor;
    value: string;
    title: string;
}

export declare type ThemeColor = 'blue' | 'cyan' | 'geekblue'
    | 'gold' | 'green' | 'lime' | 'magenta' | 'orange' | 'pink' | 'purple'
    | 'red' | 'volcano' | 'yellow';


export interface ThemeSetting {
    currentTheme?: ThemeStyle;
    currentNavigationMode?: NavigationMode;
    currentThemeColor: ThemeColor
    fixedHeader?: boolean;
    fixedSidebar?: boolean;
    showManytabs?: boolean;
    fixedManytabs?: boolean;
}



export const getDefaultHomeSetting = function (): HomeSettings {
    return {
        menuTheme: 'light',
        collapsedWidth: 48,
        siderWidth: 200,
        headerWidth: '100%',
        siderHeader: true,
        showSider: true,
        fixedSider: true,
        showHeadCollapsedButton: false,
        fixedHeader: true,
        showManyTabs: false,
        fixedManyTabs: false,
        showSiderLogo: true,
        manyTabsWidth: '100%',
        showHeaderLogo: true,
        showHeaderMenu: false,
        zIndex99: false,
        showDrawerMenu: false
    }
}

export const getDefaultThemeSetting = function (): ThemeSetting {
    return {
        currentTheme: 'light',
        currentNavigationMode: 'mixin',
        currentThemeColor: 'blue',
        fixedHeader: true,
        fixedSidebar: true,
        showManytabs: true,
        fixedManytabs: true
    }
}