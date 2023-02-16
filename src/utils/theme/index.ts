import type { ColorType, ThemeColor } from "@/config/homeSettings";


const themeColors: ColorType[] = [
    { name: 'blue', value: '#1890ff', title: '' },
    { name: 'geekblue', value: '#2f54eb', title: '' },
    { name: 'gold', value: '#faad14', title: '' },
    { name: 'green', value: '#52c41a', title: '' },
    { name: 'lime', value: '#a0d911', title: '' },
    { name: 'magenta', value: '#eb2f96', title: '' },
    { name: 'orange', value: '#fa8c16', title: '' },
    { name: 'pink', value: '#eb2f96', title: '' },
    { name: 'purple', value: '#722ed1', title: '' },
    { name: 'red', value: '#f5222d', title: '' },
    { name: 'volcano', value: '#fa541c', title: '' },
    { name: 'yellow', value: '#fadb14', title: '' }
]

export const getThemeColors = () => {
    return [...themeColors];
}

export const changeColorStyle = (style: string) => {
    const head = document.head;
    document.getElementById("theme")?.remove();
    const styleDom = document.createElement("style");
    styleDom.id = "theme";
    styleDom.innerHTML = style.replace('html', ':root');
    head.appendChild(styleDom);
};

export const changeThemeColor = async (theme: ThemeColor = 'blue') => {
    changeColorStyle((await import(`../../assets/styles/colors/${theme}.less?inline`)).default)
};


