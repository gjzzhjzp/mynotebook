<template>
    <nut-popup v-model:visible="visible" position="bottom" round :style="{ height: '60%' }">
        <template #default>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">

                <view class="l-account-add p-a-20">
                    <view class="flex-align-center flex-justify-between">
                        <view @click="showCalender = true">{{ formData.accountDate_show }}</view>
                        <nut-calendar v-model:visible="showCalender" :default-value="formData.accountDate"
                            start-date="2022-01-11" end-date="2022-11-30" @close="showCalender = false"
                            @choose="chooseDate">
                        </nut-calendar>
                        <view class="flex-align-center">
                            <view v-for="item in types" :key="item.title" class="m-r-10"
                                @click="checked_type = item.value">
                                <nut-button :type="item.value != checked_type ? 'default' : 'primary'" size="small">{{
        item.title }}</nut-button>
                            </view>
                        </view>
                    </view>
                    <view class="m-t-10">
                        <nut-input v-model="formData.amount" placeholder="0.00" clearable>
                            <template #left>
                                <view class="fontWeight blackColor">￥</view>
                            </template>
                        </nut-input>
                    </view>
                    <view class="m-t-10">
                        <nut-input v-model="formData.description" placeholder="添加备注" />
                    </view>
                    <view class="flex-align-center flex-wrap m-t-10">
                        <!-- <nut-grid :column-num="5" :gutter="10" :border="false">
                            <nut-grid-item  v-for="item in categories" :key="item.value">
                                <template #default> -->
                        <view v-for="item in categories" class="m-r-10 m-t-10">
                            <nut-button :type="item.value != checked_category ? 'default' : 'primary'" size="small"
                                @click="checked_category = item.value"
                                style="width: 145rpx;">{{ item.title }}</nut-button>
                        </view>

                        <!-- </template>
                            </nut-grid-item>
                        </nut-grid> -->
                    </view>

                </view>
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
import date_formatter from '../../common/date_formatter'
import { ref, onMounted, watch,defineEmits } from 'vue'
import Taro from '@tarojs/taro'
interface categoriesData {
    title: string,
    value: string
}
const formData = ref({
    amount: '',
    description: '',
    accountDate: date_formatter(new Date().getTime(), 'YYYY-MM-DD'),
    accountDate_show: date_formatter(new Date().getTime(), 'MM月DD日')
})
const categories = ref<categoriesData[]>([]);
const checked_category = ref("food");
const checked_type = ref("expense");
const types = ref([
    {
        title: "支出",
        value: "expense"
    },
    {
        title: "收入",
        value: "income"
    }
])
watch(checked_type, () => {
    getCategory();
})
const emit=defineEmits(['success'])
const onOk = () => {
    const params = {
        amount: formData.value.amount,
        description: formData.value.description,
        category: checked_category.value,
        type: checked_type.value == 'expense' ? 0 : 1,
        date: formData.value.accountDate
    }
    console.log("params", params);
    // return;
    // 调用接口
    ajax.post('/account/add', params).then(res => {
        console.log("res", res);
        if (res.code == 200) {
            Taro.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
            });
        }else{
            Taro.showToast({
                title: res.message as string,
                icon:'error',
                duration: 2000
            });
        }
        emit('success');
        close();
    })
}
const getCategory = () => {
    ajax.get('/category/get', {
        type: checked_type.value == 'expense' ? 0 : 1
    }).then(res => {
        console.log("res", res);
        if (res.code == 200) {
            categories.value = res.data.map(item => {
                return {
                    title: item.name,
                    value: item.value
                }
            })
            checked_category.value = categories.value[0].value;
        }
        console.log("categories", categories.value)
    })
}
onMounted(() => {
    getCategory();
})
const visible = ref(false)
const showCalender = ref(false);
// const accountDate = ref(date_formatter(String(new Date()),'MM月DD日'));
const chooseDate = (e: any) => {
    console.log("e", e);
    formData.value.accountDate = e[3];
    formData.value.accountDate_show = date_formatter(new Date(e[3]).getTime(), 'MM月DD日');
}
const open = () => {
    visible.value = true;
}
const close = () => {
    visible.value = false;
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