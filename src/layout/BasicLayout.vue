<template>
    <a-layout class="home-layout">
        <Sider></Sider>
        <a-layout>
            <Header></Header>
            <Tabs></Tabs>
            <a-layout-content>
                <div style="height:1000px;"></div>
                <RouterView />
            </a-layout-content>
            <Footer></Footer>
        </a-layout>
    </a-layout>
    <RouterView />
</template>
<script setup lang="ts">
import useStore from '@/stores';
import { ref } from 'vue';
const { theme } = useStore();
const { setThemeSetting } = theme;

const isCollapsed = ref(false);


const toggleCollapsed = function () {
    isCollapsed.value = !isCollapsed.value;
    setThemeSetting();
}



</script>
<style lang="less" scoped>
.home-layout {
    height: 100%;
}
</style>