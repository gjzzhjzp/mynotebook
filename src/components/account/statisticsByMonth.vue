<template>
    <view>
        <view class="statistics-container p-a-15" v-if="!ishome">
            <view class="statistics-row1 flex-align-center flex-justify-between">
                <view class="font16 blackColor fontWeight" @click="showCalender = true">{{ thismonth.date }}</view>
                <nut-popup v-model:visible="showCalender" position="bottom">
                    <nut-date-picker type="year-month" v-model="thismonth.monthdate" :three-dimensional="false"
                        @confirm="chooseDate"></nut-date-picker>
                </nut-popup>
                <view class="font14 tagColor flex-align-center">
                    <view v-for="item in types" :key="item.title" class="m-r-10" @click="checked_type = item.value">
                        <nut-button :type="item.value != checked_type ? 'default' : 'primary'" size="small">{{
            item.title }}</nut-button>
                    </view>
                </view>
            </view>
            <template v-if="pieChartList.length > 0">
                <view class="statistics-row2 flex-align-center flex-justify-between m-t-20">
                    <view v-if="checked_type == 'expense'">
                        <view class="font14">总支出</view>
                        <view class="skinColor font30 m-t-5">{{ Taro.getStorageSync("globalData").currency }}{{
            thismonth.expense }}</view>
                    </view>
                    <view v-else>
                        <view class="font14">总收入</view>
                        <view class="skinColor font30 m-t-5">{{ Taro.getStorageSync("globalData").currency }}{{
            thismonth.income }}</view>
                    </view>
                </view>
                <view class="m-t-20">
                    <pieChart :list="pieChartList"></pieChart>
                </view>
                <view class="m-t-20">
                    <view v-for="item in pieChartList" class="flex-align-center m-b-10">
                        <view>{{ item.name }}</view>
                        <view style="flex:1;" class="m-l-5">
                            <nut-progress :percentage="Number(item.percentage)" status="icon">
                                <template #icon-name>
                                    {{ Taro.getStorageSync("globalData").currency }}{{ item.value }}
                                </template>
                            </nut-progress>
                        </view>
                    </view>
                </view>
            </template>
            <template v-else>
                <emptyData></emptyData>
            </template>
        </view>
        <view v-else>
            <view class="statistics-row1 flex-align-center flex-justify-between">
                <view class="font16 blackColor fontWeight">本月收支</view>
            </view>
            <view class="statistics-row2 flex-align-center flex-justify-between m-t-20 p-0-20">
                <view class="flex-column-center">
                    <view class="font14">总支出</view>
                    <view class="skinColor font24 m-t-5">{{ Taro.getStorageSync("globalData").currency }}{{
            thismonth.expense }}
                    </view>
                </view>
                <view class="flex-column-center">
                    <view class="font14">总收入</view>
                    <view class="skinColor font24 m-t-5">{{ Taro.getStorageSync("globalData").currency }}{{
                        thismonth.income }}
                    </view>
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
import emptyData from "../common/emptyData.vue"
import { useDidShow } from "@tarojs/taro";
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
    date: date_formatter(new Date().getTime(), "yyyy年MM月"),
    monthdate: ref<Date>(new Date())
})
defineProps({
    ishome: {
        type: Boolean,
        default: false
    }
})
const currentMonthFirstDay = ref("");
const nextMonthFirstDay = ref("");
const checked_type = ref("expense");
const showCalender = ref(false);
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
let pieChartList = ref([{ value: 0, name: "", percentage: "0" }])
useDidShow(() => {
    console.log('页面显示');
    getCurrentMonthDates(new Date().getFullYear(), new Date().getMonth() + 1);
    getStatistics();
    getStatisticsByfl();
})
onMounted(() => {

    console.log("globalData", globalData.value);
})
watch(checked_type, () => {
    getpieChartList();
})
// 获取图表数据
const getpieChartList = () => {
    let rows = checked_type.value == "expense" ? thismonth.value.expenseList : thismonth.value.incomeList;
    // 找到最大 total_amount
    const maxAmount = Math.max(...rows.map(item => item.total_amount));
    pieChartList.value = rows.map((item: StatisticsItem) => {
        const percentage = maxAmount > 0 ? (item.total_amount / maxAmount) * 100 : 0;
        return {
            value: item.total_amount,
            name: globalData.value.categories_obj[item.category] as string,
            percentage: percentage.toFixed(2) // 保留两位小数
        }
    });
    console.log("pieChartList", pieChartList.value);
}
const chooseDate = (e: any) => {
    console.log("e", e);
    thismonth.value.date = `${e.selectedValue[0]}年${e.selectedValue[1]}月`;
    getCurrentMonthDates(e.selectedValue[0], e.selectedValue[1]);
    getStatistics();
    getStatisticsByfl();
    showCalender.value = false;
}
const getCurrentMonthDates = (year: number, month: number) => {
    // 使用 UTC 时间避免时区问题
    const currentMonthFirstDay1 = new Date(Date.UTC(year, month - 1, 1));
    const nextMonthFirstDay1 = new Date(Date.UTC(year, month, 1));
    currentMonthFirstDay.value = currentMonthFirstDay1.toISOString().split('T')[0];
    nextMonthFirstDay.value = nextMonthFirstDay1.toISOString().split('T')[0];
};
const getStatisticsByfl = () => {
    ajax.get("/account/getStatisticsByfl", {
        type: "month",
        startDate: currentMonthFirstDay.value,
        endDate: nextMonthFirstDay.value
    }).then((res: any) => {

        if (res.code == 200) {
            let rows = res.data;
            thismonth.value.expenseList = rows.filter((item) => {
                return item.type == 0;
            });
            thismonth.value.incomeList = rows.filter((item) => {
                return item.type == 1;
            });
            getpieChartList();
        }
        // console.log("getStatisticsByfl", thismonth.value.expenseList, thismonth.value.incomeList, pieChartList.value);
    })
}
const getStatistics = () => {
    // console.log("currentMonthFirstDay", currentMonthFirstDay.value, nextMonthFirstDay.value);
    ajax.get("/account/getStatistics", {
        startDate: currentMonthFirstDay.value,
        endDate: nextMonthFirstDay.value
    }).then((res: any) => {
        console.log("getStatistics", res);
        if (res.code == 200) {
            if (res.data && res.data.length > 0) {
                res.data.forEach((item) => {
                    if (item.type == 0) {
                        thismonth.value.expense = item.total_amount;

                    } else {
                        thismonth.value.income = item.total_amount;
                    }
                })
            } else {
                thismonth.value.expense = 0;
                thismonth.value.income = 0;
            }
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