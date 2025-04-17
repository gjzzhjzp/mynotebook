<template>
    <pageScroll :refresher_enabled="false">
        <template #body>
            <view class="statistics-container p-a-15">
                <view class=" flex-align-center flex-justify-between">
                    <nut-popover v-model:visible="showSearchType" :list="searchlist" location="bottom-start"
                        @choose="chooseSearch" :offset="[0, -70]">
                        <template #reference>
                            <view class="flex-align-center fontWeight blackColor">
                                <view class="font14 ">
                                    {{ searchlist[checkSearchType].name }}
                                </view>
                                <view class="iconfont icon-you font16"></view>
                            </view>
                        </template>
                    </nut-popover>
                    <view class="">
                        <view class="font14 blackColor fontWeight flex-align-center" @click="showCalender = true">
                            <view>{{ [thismonth.yearshow, thismonth.monthShow, thismonth.dayshow][checkSearchType] }}
                            </view>
                            <view class="iconfont icon-you font16"></view>
                        </view>
                        <nut-popup v-model:visible="showCalender" position="bottom">
                            <nut-date-picker v-if="checkSearchType == 0" :max-date="new Date()" type="year"
                                v-model="thismonth.year" :three-dimensional="false"
                                @confirm="chooseDate"></nut-date-picker>
                            <nut-date-picker v-else-if="checkSearchType == 1" :max-date="new Date()" type="year-month"
                                v-model="thismonth.month" :three-dimensional="false"
                                @confirm="chooseDate"></nut-date-picker>
                            <nut-date-picker v-else-if="checkSearchType == 2" :max-date="new Date()" type="date"
                                v-model="thismonth.day" :three-dimensional="false"
                                @confirm="chooseDate"></nut-date-picker>
                        </nut-popup>
                    </view>
                </view>
                <view class="font14 tagColor flex-align-center">
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
    </pageScroll>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted, watch, inject } from 'vue';
import pieChart from './pieChart.vue';
import date_formatter from '../../common/date_formatter'
import pageScroll from '../../components/common/pageScroll.vue';
import ajax from '../../common/ajax';
import emptyData from "../common/emptyData.vue"
import { useDidShow } from "@tarojs/taro";
interface StatisticsItem {
    type: number;
    category: string;
    total_amount: number;
}
const showSearchType = ref(false);
const showCalender = ref(false);
const thismonth = ref({
    expense: 0,
    income: 0,
    expenseList: [] as StatisticsItem[],
    incomeList: [] as StatisticsItem[],
    year: new Date(),
    yearshow: date_formatter(new Date(), 'yyyy年'),
    month: new Date(),
    monthShow: date_formatter(new Date(), 'yyyy年MM月'),
    day: new Date(),
    dayshow: date_formatter(new Date(), 'yyyy年MM月dd日')
})
const searchlist = ref([
    {
        name: '按年查询',
        value: 0
    },
    {
        name: '按月查询',
        value: 1
    },
    {
        name: '按天查询',
        value: 2
    }
])
// 已选中的日期
const selectedDate = ref({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: ""
})
const checkSearchType = ref(1);
const chooseSearch = (item) => {
    console.log("chooseSearch", item);
    checkSearchType.value = item.value;
}
const chooseDate = (e: any) => {
    console.log("e", e);
    selectedDate.value.year = e.selectedValue[0];
    selectedDate.value.month = e.selectedValue[1];
    selectedDate.value.day = e.selectedValue[2];
    thismonth.value.year = new Date(e.selectedValue[0]);
    thismonth.value.yearshow = date_formatter(new Date(e.selectedValue[0]), 'yyyy年');
    thismonth.value.month = new Date(e.selectedValue[0])
    thismonth.value.monthShow = date_formatter(new Date(e.selectedValue[0], e.selectedValue[1] - 1), 'yyyy年MM月');
    thismonth.value.day = new Date(e.selectedValue[0], e.selectedValue[1] - 1, e.selectedValue[2]);
    thismonth.value.dayshow = date_formatter(new Date(e.selectedValue[0], e.selectedValue[1] - 1, e.selectedValue[2]), 'yyyy年MM月dd日');
    showCalender.value = false;
    getStatistics();
    getStatisticsByfl();
}
defineProps({
    ishome: {
        type: Boolean,
        default: false
    }
})
const currentMonthFirstDay = ref("");
const nextMonthFirstDay = ref("");
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
// const chooseDate = (e: any) => {
//     console.log("e", e);
//     thismonth.value.date = `${e.selectedValue[0]}年${e.selectedValue[1]}月`;
//     getCurrentMonthDates(e.selectedValue[0], e.selectedValue[1]);
//     getStatistics();
//     getStatisticsByfl();
//     showCalender.value = false;
// }
// const getCurrentMonthDates = (year: number, month: number) => {
//     // 使用 UTC 时间避免时区问题
//     const currentMonthFirstDay1 = new Date(Date.UTC(year, month - 1, 1));
//     const nextMonthFirstDay1 = new Date(Date.UTC(year, month, 1));
//     currentMonthFirstDay.value = currentMonthFirstDay1.toISOString().split('T')[0];
//     nextMonthFirstDay.value = nextMonthFirstDay1.toISOString().split('T')[0];
// };
const getStatisticsByfl = () => {
    ajax.get("/account/getStatisticsByfl", {
        type: ["year","month","day"][checkSearchType.value],
        year: selectedDate.value.year,
        month: selectedDate.value.month,
        day: selectedDate.value.day
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
        type: ["year","month","day"][checkSearchType.value],
        year: selectedDate.value.year,
        month: selectedDate.value.month,
        day: selectedDate.value.day
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