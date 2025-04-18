<template>
    <view class="statistics-container p-a-15">
        <account-search @search="searchValue"></account-search>
        <view class="font14 tagColor flex-align-center m-t-20 text-right">
            <view v-for="item in types" :key="item.title" class="m-r-10" @click="checked_type = item.value">
                <nut-button :type="item.value != checked_type ? 'default' : 'primary'" size="small">{{
                item.title }}</nut-button>
            </view>
        </view>
        <template v-if="pieChartList.length > 0">
            <view class="statistics-row2 flex-align-center flex-justify-between m-t-20">
                <view v-if="checked_type == 'expense'">
                    <view class="font14">总支出</view>
                    <view class="skinColor font30 m-t-5">￥{{ thismonth.expense }}</view>
                </view>
                <view v-else>
                    <view class="font14">总收入</view>
                    <view class="skinColor font30 m-t-5">￥{{ thismonth.income }}</view>
                </view>
            </view>
            <view class="m-t-20">
                <pieChart :list="pieChartList"></pieChart>
            </view>
            <view class="m-t-20">
                <view v-for="item in pieChartList" class="flex-align-center m-b-10">
                    <view>{{ item.name }}</view>
                    <view style="flex:1;" class="m-l-10">
                        <nut-progress :percentage="Number(item.percentage)" status="icon">
                            <template #icon-name>
                                ￥{{ item.value }}
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
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted, watch, inject } from 'vue';
import pieChart from './pieChart.vue';
import ajax from '../../common/ajax';
import emptyData from "../common/emptyData.vue"
import { useDidShow } from "@tarojs/taro";
import accountSearch from "./accountSearch.vue";
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
})
const selectedDate = ref({
    year: new Date().getFullYear() || 0,
    month: new Date().getMonth() + 1 || 0,
    day: 0
})
const checkSearchType = ref(1);
defineProps({
    ishome: {
        type: Boolean,
        default: false
    }
})
// const currentMonthFirstDay = ref("");
// const nextMonthFirstDay = ref("");
const checked_type = ref("expense");
// const showCalender = ref(false);
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
    // getCurrentMonthDates(new Date().getFullYear(), new Date().getMonth() + 1);
    getStatistics();
    getStatisticsByfl();
})
onMounted(() => {

    console.log("globalData", globalData.value);
})
watch(checked_type, () => {
    getpieChartList();
})
const searchValue = (value: any) => {
    console.log("searchValue", value);
    selectedDate.value = value.selectedDate;
    checkSearchType.value = value.checkSearchType;
    getStatistics();
    getStatisticsByfl();
}
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
const getStatisticsByfl = () => {
    ajax.get("/account/getStatisticsByfl", {
        type: ["year", "month", "day"][checkSearchType.value],
        year: selectedDate.value.year || "",
        month: selectedDate.value.month || "",
        day: selectedDate.value.day || ""
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
    })
}
const getStatistics = () => {
    ajax.get("/account/getStatistics", {
        type: ["year", "month", "day"][checkSearchType.value],
        year: selectedDate.value.year || "",
        month: selectedDate.value.month || "",
        day: selectedDate.value.day || ""
    }).then((res: any) => {
        console.log("getStatistics", res);
        if (res.code == 200) {
            if (res.data && res.data.length > 0) {
                res.data.forEach((item) => {
                    thismonth.value.expense = item.expense;
                    thismonth.value.income = item.income;
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
    height: 750rpx;
    background-color: #fff;
    border-radius: 10rpx;
}

.statistics-container-1 {
    // width: 630rpx;
    background-color: #fff;
    border-radius: 10rpx;
}
</style>