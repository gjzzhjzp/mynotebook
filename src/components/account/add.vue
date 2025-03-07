<template>
    <nut-dialog title="添加账单" v-model:visible="visible" @cancel="close" @ok="onOk">
        <template #default>
            <view class="l-account-add">
                <view class="flex-align-center flex-justify-between">
                    <view>3月7日</view>
                    <view class="flex-align-center">
                        <view v-for="item in types" :key="item.title" class="m-r-10" @click="checked_type = item.value">
                            <nut-tag color="#FF9F5B" :plain="item.value != checked_type">{{ item.title}}</nut-tag>
                        </view>
                    </view>
                </view>
                <view class="m-t-10">
                    <nut-input v-model="formData.amount" placeholder="0.00" clearable>
                        <template #left>
                            ￥
                        </template>
                    </nut-input>
                </view>
                <view class="m-t-10">
                    <nut-input v-model="formData.description" placeholder="添加备注" />
                </view>
                <view class="flex-align-center m-t-10">
                    <view v-for="item in categories" :key="item.title" class="m-r-10" @click="checked_category = item.value">
                        <nut-tag color="#FF9F5B" :plain="item.value != checked_category">{{ item.title}}</nut-tag>
                    </view>
                </view>

            </view>
        </template>
    </nut-dialog>
</template>
<script setup lang="ts">
import ajax from '../../common/ajax'
import { ref,onMounted } from 'vue'
const formData = ref({
    amount: '',
    description: ''
})
const categories = ref([
    {
        title: "餐饮",
        value: "food"
    },
    {
        title: "交通",
        value: "traffic"
    },
    {
        title: "购物",
        value: "shopping"
    },
    {
        title: "娱乐",
        value: "entertainment"
    }
])
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
const onOk = () => {
    const params = {
        amount: formData.value.amount,
        description: formData.value.description,
        category: checked_category.value,
        type: checked_type.value
    }
    ajax.post('/account/add', params).then(res => {
        console.log("res", res);
    })
}
const getCategory = () => {
    ajax.get('/category/get', {
        type: checked_type.value
    }).then(res => {
        console.log("res", res);
    })
}
onMounted(() => {
    getCategory();
})
const visible = ref(false)
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