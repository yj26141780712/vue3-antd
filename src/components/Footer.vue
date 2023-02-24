<template>
    <a-layout-footer v-if="themeSetting.showFooter" class="footer">
        Copyright © 2023 宁波易力加运动科技有限公司
    </a-layout-footer>
</template>

<script setup lang="ts">
import useStore from '@/stores';
import { storeToRefs } from 'pinia';
const { theme } = useStore();
const { themeSetting } = storeToRefs(theme);
</script>
<style lang="less" scoped>
.footer {
    color: rgba(0, 0, 0, 0.451);
    text-align: center;
}
</style>