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
const { theme } = useStore();
const { isCollapsed } = storeToRefs(theme);


const toggleCollapsed = function () {
    isCollapsed.value = !isCollapsed.value;
}



</script>
<style lang="less" scoped>
.home-layout {
    min-height: 100vh;
    width: 100%;
}
</style>