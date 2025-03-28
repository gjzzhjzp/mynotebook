<template>
    <nut-popup v-model:visible="visible" position="bottom" round>
        <template #default>
            <view class="reminder-title font16 fontWeight blackColor p-a-10 text-center">设置订阅提醒</view>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">
                <nut-form ref="formRef" :model-value="formData" :rules="formRules">
                    <nut-form-item label="记账日报">
                        <nut-switch v-model="formData.open_daily"></nut-switch>
                    </nut-form-item>
                    <nut-form-item label="每日额度" prop="daily_limit">
                        <nut-input v-model="formData.daily_limit" placeholder="请输入每日额度" type="number"
                            @blur="validateField('daily_limit')" :rules="[{ required: true, message: '请输入每日额度' }]">
                            <template #left>
                                ￥
                            </template>
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item label="每月额度" prop="monthly_limit">
                        <nut-input v-model="formData.monthly_limit" placeholder="请输入每月额度" type="number"
                            @blur="validateField('monthly_limit')" :rules="[{ required: true, message: '请输入每月额度' }]">
                            <template #left>
                                ￥
                            </template>
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item label="每年额度" prop="yearly_limit">
                        <nut-input v-model="formData.yearly_limit" placeholder="请输入每年额度" type="number"
                            @blur="validateField('yearly_limit')" :rules="[{ required: true, message: '请输入每年额度' }]">
                            <template #left>
                                ￥
                            </template>
                        </nut-input>
                    </nut-form-item>
                </nut-form>
                <view class="flex-align-center flex-justify-between m-t-20 p-a-20">
                    <nut-button type="primary" class="m-t-10" @click="onOk" style="width: 300rpx;">
                        确定
                    </nut-button>
                    <nut-button type="default" class="m-t-10" @click="close" style="width: 300rpx;">
                        取消
                    </nut-button>
                </view>
            </view>
        </template>
    </nut-popup>
</template>
<script setup lang="ts">
import ajax from '../../common/ajax'
import { ref, onMounted, defineEmits, inject } from 'vue'
import type { FormInstance } from '@nutui/nutui-taro';
import basedll from '../../common/basedll';
interface FormData {
    open_daily: boolean;
    daily_limit: string;
    monthly_limit: string;
    yearly_limit: string;
}

const formData = ref<FormData>({
    open_daily: false,
    daily_limit: '',
    monthly_limit: '',
    yearly_limit: ""
});

const formRules = {
    daily_limit: [{ required: true, message: '请输入每日额度' }],
    monthly_limit: [{ required: true, message: '请输入每月额度' }],
    yearly_limit: [{ required: true, message: '请输入每年额度' }]
};
const formRef = ref<FormInstance | null>(null)
const emit = defineEmits(['submit'])
const validateField = async (prop: string) => {
    try {
        await formRef.value?.validate(prop);
    } catch (error) {
        console.log(`字段 ${prop} 校验失败`, error);
    }
};
const globalData = inject('globalData') as any;
onMounted(() => {
    console.log("globalData-------------------", globalData.value.tmplIds.overspend);
    get_userLimit();
})
const visible = ref(false)

const open = () => {
    visible.value = true;
}
const close = () => {
    visible.value = false;
}
const get_userLimit = async () => {
    const res = await ajax.get("/userLimit/get");
    console.log("设置成功", res);
    if (res.code == 200) {
        formData.value = { ...formData.value, ...res.data }
    }
}
const onOk = async () => {
    try {
        const result = await formRef.value?.validate() as any;
        if (result?.valid) {
            let tmplIds = [globalData.value.tmplIds.overspend];
            if (formData.value.open_daily) {
                tmplIds.push(globalData.value.tmplIds.daily);
                basedll.requestSubscribeMessage(tmplIds);

                const res = await ajax.post("/userLimit/addOrUpdate", {
                    open_daily: formData.value.open_daily,
                    daily_limit: parseFloat(formData.value.daily_limit),
                    monthly_limit: parseFloat(formData.value.monthly_limit),
                    yearly_limit: parseFloat(formData.value.yearly_limit)
                });
                console.log("设置成功", res);
                emit('submit');
                close();
            }
        }
    } catch (error) {
        console.error('表单验证或提交失败:', error);
    }
}


defineExpose({
    open,
    close
})
</script>
<style>
.account-add-container {
    --nut-grid-item-content-padding: "0px 0px 0px 0px";
}
</style>