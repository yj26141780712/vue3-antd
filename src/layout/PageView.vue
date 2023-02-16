<template>
    <div class="test">
        <router-view v-slot="{ Component, route }">
            <keep-alive v-if="!refreshing" :include="keepNames">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
const { staticRouter } = useStore();
const { keepNames,refreshing } = storeToRefs(staticRouter);
</script>
<style lang="less" scoped>

</style>