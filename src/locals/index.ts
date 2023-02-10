import { createI18n } from 'vue-i18n'
import zh from './lang/zh';
import en from './lang/en';
import { CACHE_LANG } from '@/enums/cacheEnum';

const messages = {
    zh,
    en
}
const language = (navigator.language || 'zh').toLocaleLowerCase()
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem(CACHE_LANG) || language.split('-')[0] || 'zh',
    fallbackLocale: 'zh',
    messages,
    globalInjection: true,
})

export default i18n