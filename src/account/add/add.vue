<template>
    <nut-dialog title="基础弹框" v-model:visible="visible1" @cancel="onCancel" @ok="onOk">
        <template #default>
            <view class="l-account-add">
                <view class="flex-align-center flex-justify-between">
                    <view>3月7日</view>
                    <view>
                        <view v-for="item in types" :key="item.title">
                            {{ item.title }}
                        </view>
                    </view>
                </view>
                <view>
                    <nut-input v-model="formData.age" placeholder="0.00" clearable>
                        <template #left>
                            ￥
                        </template>
                    </nut-input>
                </view>
                <view class="m-t-10">
                    <nut-input v-model="formData.age" placeholder="添加备注" />
                </view>
                <view v-for="item in categories" :key="item.title">
                    {{ item.title }}
                </view>
            </view>
        </template>
    </nut-dialog>
</template>
<script setup>
import { ref } from 'vue'
const formData = ref({
    name: '',
    age: '',
    tel: '',
    type: '',
    info: ''
})
const categories = ref([
    {
        title: "餐饮"
    },
    {
        title: "交通"
    },
    {
        title: "购物"
    },
    {
        title: "娱乐"
    }
])
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
</script>