import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.less'
import i18n from './locals'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n);

app.mount('#app')
