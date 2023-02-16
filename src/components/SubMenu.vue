<template>
    <a-sub-menu :key="menuInfo.key">
        <template v-if="menuInfo.icon" #icon>
            <icon-font :type="menuInfo.icon" />
        </template>
        <template #title>{{ menuInfo.title }}</template>
        <template v-for="item in menuInfo.children" :key="item.key">
            <template v-if="!item.children">
                <a-menu-item :key="item.key" :url="item.url">
                    <!-- <template #icon>
                        <PieChartOutlined />
                    </template> -->
                    {{ item.title }}
                </a-menu-item>
            </template>
            <template v-else>
                <SubMenu :menu-info="item" :key="item.key" />
            </template>
        </template>
    </a-sub-menu>
</template>

<script setup lang="ts">
defineProps({
    menuInfo: {
        type: Object,
        default: () => ({})
    }
})
</script>
<style lang="less" scoped>

</style>