<template>
    <router-view v-slot="{ Component, route }">
        <keep-alive :include="keepNames">
            <component v-if="!refreshing" :is="Component" :key="route.name" />
        </keep-alive>
    </router-view>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
const { staticRouter } = useStore();
const { keepNames, refreshing } = storeToRefs(staticRouter);
</script>
<style lang="less" scoped></style>