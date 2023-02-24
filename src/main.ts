import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.less'
import i18n from './locals'
import { createFromIconfontCN } from '@ant-design/icons-vue';
import "dayjs/locale/zh-cn"; //日期组件部分不显示中文
const app = createApp(App)


const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3227979_p7el7jtcuro.js',
});

app.component('IconFont', IconFont)

app.use(createPinia())
app.use(router)
app.use(i18n);

app.mount('#app')

