<template>
    <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
        <div class="container">
            <div class="header">
                <div class="main">
                    <img src="~@/assets/logo.svg" alt="logo" class="logo">
                    <span class="title">Admin Pro</span>
                </div>
                <div class="desc">
                    Ant Design 是西湖区最具影响力的 Web 设计规范
                </div>
            </div>
            <div class="main">
                <RouterView />
            </div>
            <div class="footer">
                <div class="links">
                    <a href="https://beian.miit.gov.cn/" target="_blank">
                        浙ICP备 20005303号-2
                    </a>
                </div>
                <div class="copyright">
                    Copyright © 2023 宁波易力加运动科技有限公司
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import userStore from '@/stores/index';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
const { app } = userStore()
const { isMobile } = storeToRefs(app);

onMounted(() => {

})

</script>
<style lang="less" scoped>
#userLayout.user-layout-wrapper {
    height: 100%;

    .container {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding: 110px 0 144px;

        .header {

            text-align: center;

            .main {
                line-height: 44px;
                height: 44px;
            }

            .desc {
                margin: 12px 0 40px;
                color: rgba(0, 0, 0, .45);
                font-size: 14px;
            }

            .logo {
                height: 44px;
                vertical-align: top;
            }

            .title {
                font-size: 33px;
                font-weight: 600;
            }
        }

        .main {
            width: 368px;
            min-width: 260px;
            margin: 0 auto;
        }

        .footer {
            position: absolute;
            bottom: 0;
            margin: 48px 0 24px;
            text-align: center;
            width: 100%;
        }
    }

    /**深度样式修改 */
    :deep(.ant-tabs .ant-tabs-nav:before) {
        border-bottom: none;
    }

}
</style>


