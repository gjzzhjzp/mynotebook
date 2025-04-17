<template>
    <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
        <template #nav>
            <Header title="全部账单"></Header>
        </template>
        <template #body>
            <view class="p-a-15 flex-align-center flex-justify-between">
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
                        <view>{{ [thismonth.yearshow,thismonth.monthShow,thismonth.dayshow][checkSearchType] }}</view>
                        <view class="iconfont icon-you font16"></view>
                    </view>
                    <nut-popup v-model:visible="showCalender" position="bottom">
                        <nut-date-picker v-if="checkSearchType==0" :max-date="new Date()" type="year" v-model="thismonth.year" :three-dimensional="false"
                            @confirm="chooseDate"></nut-date-picker>
                        <nut-date-picker v-else-if="checkSearchType==1" :max-date="new Date()" type="year-month" v-model="thismonth.month" :three-dimensional="false"
                            @confirm="chooseDate"></nut-date-picker>
                            <nut-date-picker v-else-if="checkSearchType==2" :max-date="new Date()" type="date" v-model="thismonth.day" :three-dimensional="false"
                            @confirm="chooseDate"></nut-date-picker>
                    </nut-popup>
                </view>
            </view>
            <view class="p-a-15">
                <view v-for="(item) in accountsByDay" :key="item.date" class="whiteColorB borderRadius10 p-a-15 m-b-15">
                    <view class="flex-align-center flex-justify-between">
                        <view class="font16 fontWeight blackColor">{{ item.date }}</view>
                    </view>
                    <view class="m-t-20">
                        <accountList :list="item.items" @click="openActionSheet"></accountList>
                    </view>
                </view>
            </view>
        </template>
        <template #footer>
            <action-sheet ref="actionSheetRef" @update="update_account" @delete="deleteAccount"></action-sheet>
        </template>
    </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import accountList from '../../components/account/list.vue';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { formatDate } from '../../common/date_formatter'
import actionSheet from "../../components/common/actionSheet.vue"
import date_formatter from '../../common/date_formatter'
interface accountsByDayItem {
    date: string;
    items: any[];
}
const reminderRef = ref();
const actionSheetRef = ref();
const currentItem = ref();
const showSearchType = ref(false);
const showCalender = ref(false);
const thismonth = ref({
    year:new Date(),
    yearshow:date_formatter(new Date(),'yyyy年'),
    month: new Date(),
    monthShow: date_formatter(new Date(),'yyyy年MM月'),
    day: new Date(),
    dayshow: date_formatter(new Date(),'yyyy年MM月dd日')
})
// 已选中的日期
const selectedDate=ref({
    year:new Date().getFullYear(),
    month:new Date().getMonth() + 1,
    day:""
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
    thismonth.value.yearshow = date_formatter(new Date(e.selectedValue[0]),'yyyy年');
    thismonth.value.month = new Date(e.selectedValue[0])
    thismonth.value.monthShow = date_formatter(new Date(e.selectedValue[0],e.selectedValue[1]-1),'yyyy年MM月');
    thismonth.value.day = new Date(e.selectedValue[0],e.selectedValue[1]-1,e.selectedValue[2]);
    thismonth.value.dayshow = date_formatter(new Date(e.selectedValue[0],e.selectedValue[1]-1,e.selectedValue[2]),'yyyy年MM月dd日');
    showCalender.value = false;
    getAccountList();
}
const update_account = () => {
    Taro.navigateTo({
        url: `/account/add/add?id=${currentItem.value?.id}`
    })
    actionSheetRef.value.close();
}
const openActionSheet = (item) => {
    actionSheetRef.value.open();
    currentItem.value = item;
}
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
let accounts = ref([]);
let accountsByDay = ref<accountsByDayItem[]>([]);
onBeforeMount(() => {

})
useDidShow(() => {
    getAccountList();
})
onMounted(() => {
    // getAccountList();
})

const getAccountList = () => {
    ajax.get("/account/getStatisticsByflList", {
        page: page.value,
        rows: 20,
        type: ["year","month","day"][checkSearchType.value],
        year: selectedDate.value.year,
        month: selectedDate.value.month,
        day: selectedDate.value.day
    }).then((res: any) => {
        console.log("getStatisticsByflList", res);
        if (res.code == 200) {
            total.value = res.total as number;
            refreshering.value = false;

            // 按日期分组处理
            const groupedAccounts = res.data.reduce((acc, item) => {
                const date = item.date;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push({
                    ...item,
                    created_at: formatDate(new Date(item.created_at).getTime())
                });
                return acc;
            }, {});

            // 转换为数组格式
            const result = Object.keys(groupedAccounts).map(date => ({
                date,
                items: groupedAccounts[date]
            }));

            if (page.value == 1) {
                accountsByDay.value = result as any;
            } else {
                // accountsByDay.value = [...accountsByDay.value, ...result] as any;
                // 合并已有数据和新数据
                const mergedAccounts = accountsByDay.value.reduce((acc, group) => {
                    acc[group.date] = group.items;
                    return acc;
                }, {});

                // 合并新数据
                Object.keys(groupedAccounts).forEach(date => {
                    if (mergedAccounts[date]) {
                        mergedAccounts[date].push(...groupedAccounts[date]);
                    } else {
                        mergedAccounts[date] = groupedAccounts[date];
                    }
                });

                // 转换为数组格式
                accountsByDay.value = Object.keys(mergedAccounts).map(date => ({
                    date,
                    items: mergedAccounts[date]
                }));
            }
            console.log(accounts.value);
        }
    })
}
const successAccount = () => {
    getAccountList();

}
// 打开订阅消息
const openReminder = () => {
    reminderRef.value.open();
}
// 上拉到最底部加载
const lower = () => {
    if (accounts.value.length >= total.value) {
        return;
    }
    page.value++;
    getAccountList();
}
const refresh = () => {
    refreshering.value = true;
    page.value = 1;
    getAccountList();
}
const deleteAccount = () => {
    ajax.post("/account/delete", {
        id: currentItem.value?.id
    }).then(() => {
        // console.log("删除成功", res);
        Taro.showToast({
            title: "删除成功",
            icon: "none"
        })
        getAccountList();
        actionSheetRef.value.close();

    })
}
</script>
<style>
.account-index-tips {
    background-color: #FFF7ED;
    color: #EA580C;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.05);
}
</style>