import { fileURLToPath, URL } from 'node:url'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import DefineOptions from 'unplugin-vue-define-options/vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/eliga/',
    plugins: [
      vue(),
      Components({
        dirs: ['src/components'], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })]
      }),
      DefineOptions()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  }
})
