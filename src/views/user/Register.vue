<template>
    <h3>
        注册
    </h3>
    <a-form>
        <a-form-item>
            <a-input size="large" :placeholder="$t('login.mobile')">
                <template #prefix>
                    <mobile-outlined class="prefixIcon" />
                </template>
            </a-input>
        </a-form-item>
    </a-form>
    <a-row :gutter="16">
        <a-col span="16">
            <a-form-item>
                <a-input size="large" :placeholder="$t('login.code')">
                    <template #prefix>
                        <mail-outlined class="prefixIcon" />
                    </template></a-input>
            </a-form-item>
        </a-col>
        <a-col span="8">
            <a-button size="large">{{ $t('login.getCode') }}</a-button>
        </a-col>
    </a-row>
</template>
<script setup lang="ts">
</script>
<style>

</style>