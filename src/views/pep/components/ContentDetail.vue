<template>
    <BaseForm :visible="formVisible" :title="props.title" :formLoading="false" @cancel="handleCancel"
        @afterClose="afterClose" :showFooter="false">
        <a-list size="small" bordered :data-source="props.item.content">
            <template #renderItem="{ item }">
                <a-list-item>{{ item.value }}</a-list-item>
            </template>
            <template #header>
                <div>{{ props.item.name }}</div>
            </template>
            <template #footer>
                <div>价格：{{ `￥ ${props.item.price}` }}</div>
            </template>
        </a-list>
    </BaseForm>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
    item: Object,
    title: String,

})
const emits = defineEmits(['close'])

const formVisible = ref(false);

const handleCancel = () => {
    formVisible.value = false;
}

const afterClose = () => {
    emits('close', '');
}

onMounted(() => {
    formVisible.value = true;
})
</script>
<style lang="less" scoped></style>