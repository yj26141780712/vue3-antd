<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue'
interface FormState {
    userName: string;
    password: string;
    mobile: string;
    code: string;
}
const activeKey = ref('tab1')
const formRef = ref<FormInstance>()
const formState = reactive<FormState>({
    userName: '',
    password: '',
    mobile: '',
    code: ''
})
</script>
<template>
    <a-form :model="formState">

    </a-form>
    <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="tab1" tab="账号密码登录">
            <a-form-item label="Password" name="pass">
                <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
            </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录" force-render>

        </a-tab-pane>
    </a-tabs>
</template>