<template>
    <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
        <div class="container">
            <img src="~@/assets/images/logo.png" alt="logo" class="logo">
            <div class="header">
                <div class="main">

                    <span class="title">家庭体检管理系统</span>
                </div>
                <!-- <div class="desc">
                  
                </div> -->
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
// @import '@/assets/styles/image.less';

.logo {
    position: absolute;
    height: 66px;
    width: 164px;
    top: 40px;
    left: 48px;
}

.container {
    background: url(@/assets/images/bg.png);
    background-size: cover
}

#userLayout.user-layout-wrapper {
    height: 100%;

    .container {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding: 130px 0 144px;

        .header {

            text-align: center;

            .main {
                line-height: 80px;
                height: 80px;
            }

            .desc {
                margin: 12px 0 40px;
                color: rgba(0, 0, 0, .45);
                font-size: 14px;
            }



            .title {
                font-size: 33px;
                font-weight: 600;
                color: #4294d1
            }
        }

        .main {
            padding: 12px 28px;
            width: 420px;
            min-width: 260px;
            margin: 0 auto;
            background-color: #dee8eb;
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


