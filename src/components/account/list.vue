<template>
    <view class="account-list">
        <view v-for="(item, index) in list" class="flex-align-center flex-justify-between">
            <view class="flex-align-center">
                <view>
                   <view style="width: 80rpx;height: 80rpx;opacity: 0.1;" class="borderRadiusMax skinColorB"></view>
                </view>
                <view class="flex-column-center m-l-5">
                    <view class="font14 fontWeight blackColor">{{ item.title }}</view>
                    <view class="font12">{{ item.time }}</view>
                </view>
            </view>
            <view class="skinColor">￥{{ item.money }}</view>
        </view>
    </view>
</template>

<script setup>
// 引入需要的依赖
import { ref, computed } from 'vue';
const list = ref([{
    title: "午餐",
    icon: "",
    time: "12:00",
    money: "100.00",
}]);
// 定义响应式数据
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
function increment() {
    count.value++;
}
</script>

<style scoped>
.account-list {
    /* 组件样式 */
}
</style>