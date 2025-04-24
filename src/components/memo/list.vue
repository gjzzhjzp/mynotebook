<template>
    <view class="memo-list">
        <template v-if="list.length > 0">
            <view v-for="(item, index) in list" :key="item.id" class="memo-item flex-align-center"
                @clicK="itemClick(item, index)">
                <nut-checkbox v-if="isedit" v-model="item.checkbox"></nut-checkbox>
                <view>
                    <view class="memo-header flex-align-center flex-justify-between">
                        <view class="memo-title fontWeight text-line-1 flex1" style="flex: 1;">{{ item.title }}</view>
                        <view class="memo-date" style="width: 200rpx;">{{ item.created_at }}</view>
                    </view>
                    <view class="memo-content text-line-2">{{ item.content }}</view>
                </view>
            </view>
        </template>
        <template v-else>
            <emptyData></emptyData>
        </template>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import emptyData from "../common/emptyData.vue"
interface MemoItem {
    id: number;
    title: string;
    created_at: string;
    content: string;
    checkbox?: boolean;
}
defineProps({
    // props
    list: {
        type: Array as () => MemoItem[],
        default: () => []
    },
    isedit: {
        type: Boolean,
        default: false
    }
});
const categories_obj = ref({});


// const emits = defineEmits(['update', 'delete'])
const emits = defineEmits(['click'])
onMounted(() => {
    categories_obj.value = Taro.getStorageSync("globalData").categories_obj;
})
const itemClick = (item: MemoItem, index: number) => {


    emits('click', item, index);
}

</script>

<style>
.memo-list {
    padding: 20rpx;
}

.memo-item {
    padding: 30rpx;
    margin-bottom: 30rpx;
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.memo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.memo-title {
    font-size: 28rpx;
    color: #333;
}

.memo-date {
    font-size: 24rpx;
    color: #999;
    text-align: right;
}

.memo-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
}

.nut-divider {
    margin: 20rpx 0;
    background-color: #f5f5f5;
}
</style>