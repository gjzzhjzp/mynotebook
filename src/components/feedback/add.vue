<template>
    <nut-dialog title="意见反馈" v-model:visible="visible1" @cancel="onCancel" @ok="onOk">
        <nut-textarea v-model="content" placeholder="请留下您的宝贵意见..." />
    </nut-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ajax from '../../common/ajax'
import Taro from '@tarojs/taro';
const visible1 = ref(false);
const content = ref("");

const open = () => {
    visible1.value = true;
};
const close = () => {
    visible1.value = false;
};
const onCancel = () => {
    console.log('event cancel');
};
const onOk = async () => {
    const params = {
        content: content.value
    };
    try {
        const url = "/feedback/add";
        const res = await ajax.post(url, params);
        if (res.code == 200) {
            Taro.showToast({
                title: "已提交",
                icon: 'success',
                duration: 2000
            });
        }
        close();
    } catch (error) {
        Taro.showToast({
            title: error.message || '操作失败',
            icon: 'error',
            duration: 2000
        });
    }

};
defineExpose({
    open,
    close
});
</script>