<template>
    <nut-popup v-model:visible="visible" position="bottom" round :style="{ height: '60%' }">
        <template #default>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">

                <view class="l-account-add p-a-20">
                   

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

const formData = ref({
    id:"",
    title:"",
    content: ''
})

const isedit=ref(false);
const emit = defineEmits(['success'])
const onOk = () => {
    const params = {
        id:"",
        title: formData.value.title,
        content: formData.value.content
    }
    console.log("params", params);
    let url='/memos/add';
    if(isedit.value){
        url='/memos/update';
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

onMounted(() => {
    
})
const visible = ref(false)

const open = (item) => {
    console.log("item111111111111", item);
    if (item) {
        isedit.value=true;
        formData.value = {
            id:item.id,
            title: item.title,
            content: item.content
        }
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