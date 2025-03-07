<template>
    <view class="statistics-container p-a-15">
        <!-- 组件内容 -->
        <view class="statistics-row1 flex-align-center flex-justify-between">
            <view class="font18 blackColor fontWeight">本月总览</view>
            <view class="font14 tagColor">2024年1月</view>
        </view>
        <view class="statistics-row2 flex-align-center flex-justify-between m-t-20">
            <view>
                <view class="font14">总支出</view>
                <view class="skinColor font20 m-t-5">￥3280.50</view>
            </view>
            <view>
                <view class="font14">总收入</view>
                <view class="skinColor font20 m-t-5">￥3280.50</view>
            </view>
        </view>
        <view class="m-t-20">
            <pieChart></pieChart>
        </view>
    </view>
</template>

<script setup>
// 引入需要的依赖
import { ref, computed,onMounted } from 'vue';
import pieChart from './pieChart.vue';

</script>

<style lang="scss">
.statistics-container {
    /* 组件样式 */
    width: 630rpx;
    height: 700rpx;
    background-color: #fff;
    border-radius: 10rpx;
}
</style>