<template>
    <nut-dialog custom-class="addFeedBackDialog" title="意见反馈" v-model:visible="visible1" @cancel="onCancel" @ok="onOk">
        <nut-textarea v-model="content" placeholder="请留下您的宝贵意见..." />
        <!-- <template #footer>
            <view class="flex-align-center flex-justify-between m-t-20 p-a-20">
                <nut-button type="default" class="m-t-10" @click="onCancel" style="width: 300rpx;">
                    取消
                </nut-button>
                <nut-button type="primary" class="m-t-10" @click="onOk" style="width: 300rpx;">
                    确定
                </nut-button>
            </view>
        </template> -->
    </nut-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ajax from '../../common/ajax'
import Taro from '@tarojs/taro';
const visible1 = ref(false);
const content = ref("");
const operation = ref("");
const open = () => {
    visible1.value = true;
};
const close = () => {
    content.value = "";
    visible1.value = false;
};
const onCancel = () => {
    operation.value = "cancel";
    console.log('event cancel');
};

const onOk = async () => {
    console.log('event ok');
    operation.value = "ok";
    if (!content.value) {
        Taro.showToast({
            title: "请输入反馈内容",
            icon: 'error',
            duration: 2000
        });
        return;
    }
    console.log("1111111111111111111111111");
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
<style>
.addFeedBackDialog .nut-textarea {
    padding: 0px !important;
}
</style>