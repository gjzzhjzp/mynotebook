<template>
    <nut-dialog v-model:visible="visible" @cancel="close" @ok="onOk">
        <template #header>
            <view class="flex-center-center">
                <view class="fontWeight font16">设置订阅提醒</view>
                <view class="iconfont icon-yiwen  skinColor font16 m-l-5" @click="openHelp()"></view>
            </view>
        </template>
        <template #default>
            <view class="account-add-container flex-column-left flex-justify-between " style="height: 100%;">
                <nut-form ref="formRef" :model-value="formData" :rules="formRules">
                    <nut-form-item label="记账日报" prop="open_daily">
                        <view>
                            <nut-switch v-model="formData.open_daily"></nut-switch>
                        </view>
                    </nut-form-item>
                    <nut-form-item label="每日额度" prop="daily_limit" body-align="right">
                        <view>
                            <nut-input v-model="formData.daily_limit" placeholder="请输入每日额度" type="number"
                                @blur="validateField('daily_limit')" :rules="[{ required: true, message: '请输入每日额度' }]">
                                <template #left>
                                    ￥
                                </template>
                            </nut-input>
                        </view>
                    </nut-form-item>
                    <nut-form-item label="每月额度" prop="monthly_limit" body-align="right">
                        <view>
                            <nut-input v-model="formData.monthly_limit" placeholder="请输入每月额度" type="number"
                                @blur="validateField('monthly_limit')"
                                :rules="[{ required: true, message: '请输入每月额度' }]">
                                <template #left>
                                    ￥
                                </template>
                            </nut-input>
                        </view>
                    </nut-form-item>
                    <nut-form-item label="每年额度" prop="yearly_limit" body-align="right">
                        <view>
                            <nut-input v-model="formData.yearly_limit" placeholder="请输入每年额度" type="number"
                                @blur="validateField('yearly_limit')" :rules="[{ required: true, message: '请输入每年额度' }]">
                                <template #left>
                                    ￥
                                </template>
                            </nut-input>
                        </view>
                    </nut-form-item>
                </nut-form>
            </view>
            <help ref="helpRef" title="订阅提醒">
                <template #default>
                    <view class="font14">
                        <view class="text-left m-b-10">
                            记账日报：每天10点推送昨日账单
                        </view>
                        <view class="text-left m-b-10">
                            每日额度：设置每日花费上限，超支提醒
                        </view>
                        <view class="text-left m-b-10">
                            每月额度：设置每月花费上限，超支提醒
                        </view>
                        <view class="text-left m-b-10">
                            每年额度：设置每年花费上限，超支提醒
                        </view>
                    </view>

                </template>
            </help>
        </template>
    </nut-dialog>
</template>
<script setup lang="ts">
import ajax from '../../common/ajax'
import { ref, onMounted, defineEmits, inject } from 'vue'
import type { FormInstance } from '@nutui/nutui-taro';
import basedll from '../../common/basedll';
import help from '../common/help.vue'
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
const helpRef = ref();
const emit = defineEmits(['submit'])
const openHelp = () => {
    helpRef.value.open();
}
const validateField = async (prop: string) => {
    try {
        await formRef.value?.validate(prop);
    } catch (error) {
        console.log(`字段 ${prop} 校验失败`, error);
    }
};
const globalData = inject('globalData') as any;
onMounted(() => {
    // console.log("globalData-------------------", globalData.value.tmplIds.overspend);
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

.nut-cell-group__wrap {
    box-shadow: 0px !important;
}
</style>