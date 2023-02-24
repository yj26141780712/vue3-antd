<template>
    <div style="position: relative;">
        <a-layout class="home-layout">
            <Sider></Sider>
            <a-layout>
                <Header></Header>
                <Tabs></Tabs>
                <a-layout-content class="basiclayout-content">
                    <RouterView />
                </a-layout-content>
                <Footer></Footer>
            </a-layout>
        </a-layout>
    </div>
</template>
<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { theme, user } = useStore();
const { getUserMenus, getUserInfo } = user;

onMounted(() => {
    // getUserMenus();
    // getUserInfo();
})


</script>
<style lang="less" scoped>
.home-layout {
    min-height: 100vh;
    width: 100%;
}
</style>