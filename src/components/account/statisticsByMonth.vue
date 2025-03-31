<template>
    <view>
        <view class="statistics-container p-a-15">
            <view class="statistics-row1 flex-align-center flex-justify-between">
                <view class="font16 blackColor fontWeight">{{ thismonth.date }}</view>
                <view class="font14 tagColor flex-align-center">
                    <view v-for="item in types" :key="item.title" class="m-r-10" @click="checked_type = item.value">
                        <nut-button :type="item.value != checked_type ? 'default' : 'primary'" size="small">{{
                    item.title }}</nut-button>
                    </view>
                </view>
            </view>
            <view class="statistics-row2 flex-align-center flex-justify-between m-t-20">
                <view v-if="checked_type == 'expense'">
                    <view class="font14">总支出</view>
                    <view class="skinColor font20 m-t-5">￥{{ thismonth.expense }}</view>
                </view>
                <view v-else>
                    <view class="font14">总收入</view>
                    <view class="skinColor font20 m-t-5">￥{{ thismonth.income }}</view>
                </view>
            </view>
            <view class="m-t-20">
                <pieChart :list="pieChartList"></pieChart>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted, watch, inject } from 'vue';
import pieChart from './pieChart.vue';
import date_formatter from '../../common/date_formatter'
import ajax from '../../common/ajax';
import Taro from '@tarojs/taro'
interface StatisticsItem {
    type: number;
    category: string;
    total_amount: number;
}
const thismonth = ref({
    expense: 0,
    income: 0,
    expenseList: [] as StatisticsItem[],
    incomeList: [] as StatisticsItem[],
    date: date_formatter(new Date().getTime(), "yyyy年MM月")
})
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
const globalData = inject('globalData') as any;
let pieChartList = ref([{ value: 0, name: "" }])
onMounted(() => {
    getStatistics();
    getStatisticsByfl();
    console.log("globalData", globalData.value);
})
watch(checked_type, () => {
    let rows = checked_type.value == "expense" ? thismonth.value.expenseList : thismonth.value.incomeList;
    pieChartList.value = rows.map((item: StatisticsItem) => {
        return {
            value: item.total_amount,
            name: globalData.value.categories_obj[item.category] as string,
        }
    });
})
const getStatisticsByfl = () => {
    ajax.get("/account/getStatisticsByfl", {
        type: "month",
        startDate: "2025-03-01",
        endDate: "2025-04-01",
    }).then((res: any) => {

        if (res.code == 200) {
            let rows = res.data;
            thismonth.value.expenseList = rows.filter((item) => {
                return item.type == 0;
            });
            thismonth.value.incomeList = rows.filter((item) => {
                return item.type == 1;
            });
            pieChartList.value = thismonth.value.expenseList.map((item: StatisticsItem) => {
                return {
                    value: item.total_amount,
                    name: globalData.value.categories_obj[item.category] as string,
                }
            });
        }
        console.log("getStatisticsByfl", thismonth.value.expenseList, thismonth.value.incomeList, pieChartList.value);
    })
}
const getStatistics = () => {
    ajax.get("/account/getStatistics", {
        startDate: "2025-03-01",
        endDate: "2025-04-01"
    }).then((res: any) => {
        console.log("getStatistics", res);
        if (res.code == 200) {
            res.data.forEach((item) => {
                if (item.type == 0) {
                    thismonth.value.expense = item.total_amount;

                } else {
                    thismonth.value.income = item.total_amount;
                }
            })
        }
    })
}
defineExpose({
    getStatisticsByfl
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
    // width: 630rpx;
    background-color: #fff;
    border-radius: 10rpx;
}
</style>