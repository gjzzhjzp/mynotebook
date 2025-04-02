<template>
    <nut-popup v-model:visible="visible" position="bottom" round :style="{ height: '60%' }">
        <template #default>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">

                <view class="l-account-add p-a-20">
                    <view class="flex-align-center flex-justify-between">
                        <view @click="showCalender = true">{{ formData.accountDate_show }}</view>
                        <nut-popup v-model:visible="showCalender" position="bottom">
                            <nut-date-picker v-model="accountDate_date" :three-dimensional="false"
                                @confirm="chooseDate"></nut-date-picker>
                        </nut-popup>
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
                                @click="checked_category = item.value" style="width: 145rpx;">{{ item.name
                                }}</nut-button>
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
import { ref, onMounted, watch, defineEmits } from 'vue'
import Taro from '@tarojs/taro'
interface categoriesData {
    name: string,
    value: string
}
const formData = ref({
    id:"",
    amount: '',
    description: '',
    accountDate: "",
    accountDate_show: date_formatter(new Date().getTime(), 'MM月DD日')
})
const categories = ref<categoriesData[]>([]);
const checked_category = ref("food");
const checked_type = ref("expense");
const accountDate_date = ref<Date>(new Date());
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
const isedit=ref(false);
watch(checked_type, () => {
    getCategory();
})
const emit = defineEmits(['success'])
const onOk = () => {
    const params = {
        amount: formData.value.amount,
        description: formData.value.description,
        category: checked_category.value,
        type: checked_type.value == 'expense' ? 0 : 1,
        date: formData.value.accountDate
    }
    console.log("params", params);
    let url='/account/add';
    if(isedit.value){
        url='/account/update';
        params.id=formData.value.id;
    }
    ajax.post(url, params).then(res => {
        console.log("res", res);
        if (res.code == 200) {
            Taro.showToast({
                title: (isedit.value?'编辑':'添加')+'成功',
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
const getCategory = () => {
    const globalData = Taro.getStorageSync("globalData");
    categories.value = globalData.categories[checked_type.value == 'expense' ? 0 : 1]
    checked_category.value = categories.value[0].value;
}
onMounted(() => {
    getCategory();
    formData.value.accountDate = date_formatter(new Date().getTime(), 'YYYY-MM-DD');
    console.log("formData", formData.value.accountDate);
})
const visible = ref(false)
const showCalender = ref(false);
// const accountDate = ref(date_formatter(String(new Date()),'MM月DD日'));
const chooseDate = (e: any) => {
    console.log("e", e);
    formData.value.accountDate = e.selectedValue.join("-");
    formData.value.accountDate_show = date_formatter(new Date(formData.value.accountDate).getTime(), 'MM月DD日');
    showCalender.value = false;
}
const open = (item) => {
    console.log("item111111111111", item);
    if (item) {
        isedit.value=true;
        formData.value = {
            id:item.id,
            amount: item.amount,
            description: item.description,
            accountDate: item.date,
            accountDate_show: date_formatter(new Date(item.date).getTime(), 'MM月DD日')
        }
        accountDate_date.value = new Date(item.date);
        checked_category.value = item.category;
        checked_type.value = item.type == 0? 'expense' : 'income';
    }
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