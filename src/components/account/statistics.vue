<template>
    <view>
        <view class="statistics-container-1 p-a-15 m-b-15">
            <!-- 组件内容 -->
            <view class="statistics-row1 flex-align-center flex-justify-between">
                <view class="font16 blackColor fontWeight">今日账单</view>
                <view class="font14  skinColor flex-align-center" @click="toStatistics()">
                    <view>查看统计</view>
                    <view class="iconfont icon-you font14"></view>
                </view>
            </view>
            <view class="statistics-row2 flex-align-center flex-justify-between m-t-20">
                <view>
                    <view class="font14">总支出</view>
                    <view class="blackColor font24 m-t-5">{{ cur_currency }}{{
                    today.expense }}</view>
                </view>
                <view>
                    <view class="font14">总收入</view>
                    <view class="blackColor font24 m-t-5">{{ cur_currency }}{{
                    today.income }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted } from 'vue';
import date_formatter from '../../common/date_formatter'
import ajax from '../../common/ajax';
import Taro from '@tarojs/taro'
import { useDidShow } from '@tarojs/taro'
const cur_currency = ref("￥");
const today = ref({
    expense: 0,
    income: 0,
    date: date_formatter(new Date().getTime(), "yyyy-mm-dd")
})
useDidShow(() => {
    // debugger;
    cur_currency.value = Taro.getStorageSync("globalData").currency;
    getStatisticsByfl();
    getStatistics();
})
onMounted(() => {


})
const toStatistics = () => {
    Taro.navigateTo({
        url: '/account/statistics/statistics'
    })
}
const getStatisticsByfl = () => {
    ajax.get("/account/getStatisticsByfl", {
        type: "day"
    }).then((res: any) => {
        console.log("getStatisticsByfl", res);
    })
}
const getStatistics = () => {
    ajax.get("/account/getStatistics").then((res: any) => {
        console.log("getStatistics", res);
        if (res.code == 200) {
            res.data.forEach((item) => {
                today.value.expense = item.expense;
                today.value.income = item.income;
                // if (item.type == 0) {
                //     today.value.expense = item.total_amount;
                // } else {
                //     today.value.income = item.total_amount;
                // }
            })
        }
    })
}
defineExpose({
    getStatistics
})
</script>

<style lang="scss">
.statistics-container {
    /* 组件样式 */
    width: 630rpx;
    height: 700rpx;
    background-color: #fff;
    border-radius: 10rpx;
}

.statistics-container-1 {
    width: 630rpx;
    background-color: #fff;
    border-radius: 10rpx;
}
</style>