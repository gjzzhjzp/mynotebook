<template>
    <view class="feedback-list">
        <template v-if="list.length > 0">
            <view v-for="(item, index) in list" :key="item.id" class="feedback-item" @clicK="itemClick(item)">
                <view class="feedback-header">
                    <view class="feedback-title fontWeight text-line-2">{{ item.content }}</view>
                    <view class="feedback-date m-l-10">{{ item.created_at }}</view>
                </view>
                <!-- <view class="feedback-content">{{ item.content }}</view> -->
            </view>
        </template>
        <template v-else>
            <emptyData></emptyData>
        </template>
        <nut-dialog :content="currentContent" v-model:visible="visible2" :no-footer="true" />
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref } from 'vue';
import emptyData from "../common/emptyData.vue"
interface feedbackItem {
    id: number;
    title?: string;
    created_at: string;
    content: string;
}
defineProps({
    // props
    list: {
        type: Array as () => feedbackItem[],
        default: () => []
    }
});
const currentContent = ref("");
const visible2 = ref(false);

const itemClick = (item: feedbackItem) => {
    currentContent.value = item.content;
    visible2.value = true;
}

</script>

<style>
.feedback-list {
    padding: 20rpx;
}

.feedback-item {
    padding: 30rpx;
    margin-bottom: 30rpx;
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.feedback-title {
    font-size: 28rpx;
    color: #333;
}

.feedback-date {
    font-size: 24rpx;
    color: #999;
}

.feedback-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
}

.nut-divider {
    margin: 20rpx 0;
    background-color: #f5f5f5;
}
</style>