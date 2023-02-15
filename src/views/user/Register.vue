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
        <a-form-item>
            <a-input size="large" :placeholder="$t('login.registerCode')">
                <template #prefix>
                    <ie-outlined class="prefixIcon" />
                </template>
            </a-input>
        </a-form-item>
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
        <a-form-item>
            <a-button block type="primary" size="large" style="width:50%">{{ $t('login.register') }}</a-button>
            <router-link :to="{ name: 'login' }" class="forge-password" style="float: right;line-height: 40px;">{{
                $t('login.registerSignIn')
            }}</router-link>
        </a-form-item>
    </a-form>

</template>
<script setup lang="ts">
</script>
<style lang="less" scoped>
.prefixIcon {
    color: var(--ant-primary-color)
}
</style>