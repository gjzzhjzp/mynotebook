<template>
    <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
        <template #nav>
            <Header title="全部账单"></Header>
        </template>
        <template #body>
            <view class="p-a-15">
                <account-search @search="searchValue"></account-search>
            </view>
            <view class="p-a-15">
                <template v-if="accountsByDay.length > 0">
                    <view v-for="(item) in accountsByDay" :key="item.date"
                        class="whiteColorB borderRadius10 p-a-15 m-b-15">
                        <view class="flex-align-center flex-justify-between">
                            <view class="font16 fontWeight blackColor">{{ item.date }}</view>
                        </view>
                        <view class="m-t-20">
                            <accountList :list="item.items" @click="openActionSheet"></accountList>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <emptyData></emptyData>
                </template>
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
import emptyData from "../../components/common/emptyData.vue"
import accountSearch from "../../components/account/accountSearch.vue"
interface accountsByDayItem {
    date: string;
    items: any[];
}
const reminderRef = ref();
const actionSheetRef = ref();
const currentItem = ref();
const showSearchType = ref(false);
const showCalender = ref(false);
const selectedDate = ref({
    year: new Date().getFullYear() || 0,
    month: new Date().getMonth() + 1 || 0,
    day: 0
})
const checkSearchType = ref(1);
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
const searchValue = (value: any) => {
    console.log("searchValue", value);
    selectedDate.value = value.selectedDate;
    checkSearchType.value = value.checkSearchType;
    getAccountList();
}
const getAccountList = () => {
    ajax.get("/account/getStatisticsByflList", {
        page: page.value,
        rows: 20,
        type: ["year", "month", "day"][checkSearchType.value],
        year: selectedDate.value.year || "",
        month: selectedDate.value.month || "",
        day: selectedDate.value.day || ""
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
            }, {})

            // 转换为数组格式
            const result = Object.keys(groupedAccounts).map(date => ({
                date,
                items: groupedAccounts[date].reverse()
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