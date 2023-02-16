<template>
    <div class="test">
        <!-- <transition>
            <keep-alive>
                <RouterView />
            </keep-alive>
        </transition> -->
        <router-view v-slot="{ Component, route }">
            <div>{{ route.fullPath }} {{ route.name }}</div>
            <keep-alive :include="['systemCompany', 'company']">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script setup lang="ts">
</script>
<style lang="less" scoped>

</style>