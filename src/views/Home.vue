<template>
    <div class="page-container">
        <div class="page-header">
            <div class="avatar">
                <a-avatar :size="72">
                    <template #icon>
                        <icon-font type="icon-user"></icon-font>
                    </template>
                </a-avatar>
            </div>
            <div class="content">
                <div class="title">
                    早上好，系统管理员
                </div>
                <div>
                    {{ new Date() }}
                </div>
            </div>
        </div>
        <div class="page-content">
            <a-list item-layout="horizontal" :data-source="data">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta :description="item.description">
                            <template #title>
                                <span>{{ item.title }}</span>
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </div>
</template>

<script setup lang="ts">
interface DataItem {
    title: string;
    description: string;
}
const data: DataItem[] = [
    {
        title: '2023-2-17更新日志',
        description: `
        1.更新系统主题，增加多种模式选择`
    },
];
</script>
<style lang="less" scoped>
.page-header {
    padding: 16px 24px;
    display: flex;

    .avatar {
        margin-right: 12px;
    }

    .content {
        color: rgba(0, 0, 0, 0.45);

        .title {
            color: rgba(0, 0, 0, 0.85);
            font-size: 20px;
            margin-bottom: 12px;
        }
    }
}

.page-content {
    padding: 16px 24px;
}
</style>