import type { App } from "vue"
import { Button, message, ConfigProvider } from 'ant-design-vue'

export default {
    install: (app: App<Element>, options: any) => {
        app.use(ConfigProvider)
        app.use(Button)
        app.config.globalProperties.$message = message
    }
}