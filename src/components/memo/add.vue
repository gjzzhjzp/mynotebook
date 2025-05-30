<template>
    <nut-popup v-model:visible="visible" position="bottom" round :style="{ height: '80%' }">
        <template #default>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">

                <view class="l-account-add p-a-20">
                    <nut-input v-model="formData.title" />
                    <nut-textarea v-model="formData.content" placeholder=" " :style="{
        '--nut-textarea-font': '40rpx',
        '--nutui-textarea-focus-border-color': '#f00'
    }" />
                </view>
                <view class="m-t-20 p-a-20">
                    <view class="flex-align-center flex-justify-between m-b-20">
                        <view class="flex-align-center" style="width: 200rpx;">
                            <view class="font14 iconfont icon-shijian"></view>
                            <view>提醒时间</view>
                        </view>
                        <view>
                            <view @click="showCalender = true">{{ formData.reminder_time_show || "无提醒" }}</view>
                            <nut-popup v-model:visible="showCalender" position="bottom">
                                <nut-date-picker v-model="formData.reminder_time" type="datetime" :min-date="minDate"
                                    :three-dimensional="false" @confirm="chooseDate"></nut-date-picker>
                            </nut-popup>
                        </view>
                    </view>
                    <view class="flex-align-center flex-justify-between ">
                        <nut-button type="primary" class="m-t-10" @click="onOk" style="width: 300rpx;">
                            确定
                        </nut-button>
                        <nut-button type="default" class="m-t-10" @click="close" style="width: 300rpx;">
                            取消
                        </nut-button>
                    </view>
                </view>
            </view>
        </template>
    </nut-popup>
</template>
<script setup lang="ts">
import ajax from '../../common/ajax'
import basedll from '../../common/basedll';
import date_formatter from '../../common/date_formatter'
import { ref, onMounted, defineEmits, inject } from 'vue'
import Taro from '@tarojs/taro'
interface FormData {
    id?: number | string,
    title: string,
    content: string,
    reminder_time?: string | number | Date,
    reminder_time_show?: string | number | Date
}
const formData = ref<FormData>({
    id: "",
    title: "",
    content: '',
    reminder_time: "",
    reminder_time_show: ""
})
const globalData = ref(Taro.getStorageSync("globalData"));
const showCalender = ref(false);
const minDate = new Date();
const isedit = ref(false);
const emit = defineEmits(['success'])
const chooseDate = (e: any) => {
    console.log("e", e, formData.value.reminder_time);
    // formData.value.reminder_time = e.selectedValue.join("-");
    formData.value.reminder_time_show = date_formatter(formData.value.reminder_time as Date, 'yyyy-MM-dd hh:mm');
    showCalender.value = false;
}
const onOk = async () => {
    if (!formData.value.title) {
        Taro.showToast({
            title: '请输入标题',
            icon: 'error',
            duration: 2000
        });
        return;
    }
    let params = {
        title: formData.value.title,
        content: formData.value.content
    } as FormData
    console.log("params", params);
    if (formData.value.reminder_time) {
        params.reminder_time = date_formatter(formData.value.reminder_time as Date, 'yyyy-MM-dd hh:mm:ss');
        let tmplIds = [globalData.value.tmplIds.memo];
        const r_result = await basedll.requestSubscribeMessage(tmplIds);
        console.log("r_result", r_result);
        if (!r_result) {
            Taro.showToast({
                title: '备忘录提醒开启失败',
                icon: 'error',
                duration: 2000
            });
            return;
        }
    }
    let url = '/memos/add';
    if (isedit.value) {
        url = '/memos/update';
        params.id = formData.value.id;
    } else {
        delete params.id;
    }
    ajax.post(url, params).then(res => {
        console.log("res", res);
        if (res.code == 200) {
            Taro.showToast({
                title: (isedit.value ? '编辑' : '添加') + '成功',
                icon: 'success',
                duration: 2000
            });
        } else {
            Taro.showToast({
                title: res.message as string,
                icon: 'error',
                duration: 2000
            });
        }
        emit('success');
        close();
    })
}

onMounted(() => {

})
const visible = ref(false)

const open = (item) => {
    console.log("item111111111111", item);
    if (item) {
        isedit.value = true;
        formData.value = {
            id: item.id,
            title: item.title,
            content: item.content,
            reminder_time: item.reminder_time,
            reminder_time_show: date_formatter(item.reminder_time, 'yyyy-MM-dd hh:mm')
        }
    } else {
        isedit.value = false;
        formData.value = {
            id: "",
            title: "",
            content: '',
            reminder_time: "",
            reminder_time_show: ""
        }
    }
    visible.value = true;
}
const close = () => {
    // visible.value = false;
    Taro.navigateBack();
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