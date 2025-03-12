<template>
    <view class="account-list">
        <view v-for="(item, index) in list" class="flex-align-center flex-justify-between">
            <view class="flex-align-center">
                <view>
                   <view style="width: 80rpx;height: 80rpx;opacity: 0.1;" class="borderRadiusMax skinColorB"></view>
                </view>
                <view class="flex-column-center m-l-5">
                    <view class="font14 fontWeight blackColor">{{ item.description }}</view>
                    <view class="font12">{{ item.created_at }}</view>
                </view>
            </view>
            <view class="skinColor">￥{{ item.amount }}</view>
        </view>
    </view>
</template>

<script setup>
// 引入需要的依赖
import { ref, computed } from 'vue';
defineProps({
    // props
    list:{
        type: Array,
        default: () => []
    }
});
</script>

<style scoped>
.account-list {
    /* 组件样式 */
}
</style>