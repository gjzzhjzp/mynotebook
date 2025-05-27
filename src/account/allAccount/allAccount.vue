<template>
    <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
        <template #nav>
            <Header title="全部账单"></Header>
        </template>
        <template #body>
            <view class="p-a-15">
                <account-search @search="searchValue"></account-search>
            </view>
            <view class="flex-align-center flex-justify-between p-l-15 p-r-15">
                <view>
                    <nut-button size="small" plain type="primary" @click="openAllFl()">
                        <view class="flex-align-center">
                            <text :class="'iconfont  font14 m-r-05 ' + selectedCategory.icon"></text>{{
        selectedCategory.name }}
                        </view>
                    </nut-button>
                </view>
                <view><nut-button class="flex-align-center" size="small" type="primary" @click="exportExcel()">
                        <view class="flex-align-center">
                            导出账单<text class="iconfont icon-daochu font14 m-l-05"></text>
                        </view>
                    </nut-button></view>
            </view>
            <view class="p-a-15">
                <template v-if="accountsByDay.length > 0">
                    <view v-for="(item) in accountsByDay" :key="item.date"
                        class="whiteColorB borderRadius10 p-a-15 m-b-15">
                        <view class="flex-align-center flex-justify-between">
                            <view class="font16 fontWeight blackColor">{{ item.date }}</view>
                            <view :class="item.balance > 0 ? 'skinColor' : ''">结余：{{ item.balance }}</view>
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
            <!-- <add @add="exportExcel()">
                导出账单
            </add> -->
            <accountSearchByCategory ref="accountSearchByCategoryRef" @selected="selectedCategoryHandle">
            </accountSearchByCategory>
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
// import add from '../../components/common/add.vue';
import actionSheet from "../../components/common/actionSheet.vue"
import emptyData from "../../components/common/emptyData.vue"
import accountSearch from "../../components/account/accountSearch.vue"
import accountSearchByCategory from "../../components/account/accountSearchByCategory.vue"
interface accountsByDayItem {
    date: string;
    totalIncome: number; // 当日总收入
    totalExpense: number; // 当日总支出
    balance: any; // 新增结余字段
    items: any[];
}
// const reminderRef = ref();
const actionSheetRef = ref();
const currentItem = ref();
// const showSearchType = ref(false);
// const showCalender = ref(false);
const selectedDate = ref({
    year: new Date().getFullYear() || 0,
    month: new Date().getMonth() + 1 || 0,
    day: 0
})
const checkSearchType = ref(1);
const accountSearchByCategoryRef = ref();
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
let selectedCategory = ref({
    name: "全部分类",
    value: "",
    icon: "icon-fenlei1"
});
onBeforeMount(() => {

})
useDidShow(() => {
    getAccountList();
})
onMounted(() => {
    // getAccountList();
})
// 展开所有分类
const openAllFl = () => {
    accountSearchByCategoryRef.value.open();
}
const exportExcel = () => {
    Taro.showModal({
        title: '提示',
        content: '仅支持按年导出账单，确认导出？',
        success: function (res) {
            if (res.confirm) {
                Taro.showLoading({ title: '生成中...' });
                ajax.get("/account/exportYearly", {
                    year: selectedDate.value.year || ""
                }).then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        // 下载临时文件
                        const globalData = Taro.getStorageSync("globalData");
                        Taro.downloadFile({
                            url: globalData.goapi_server + res.data.url,
                            success: (res) => {
                                console.log("res.tempFilePath", res.tempFilePath);
                                Taro.openDocument({
                                    filePath: res.tempFilePath,
                                    fileType: 'xlsx',
                                    showMenu: true, // 显示分享菜单
                                    success: () => {
                                        console.log('打开文档成功');
                                    },
                                    fail: () => {
                                        Taro.showToast({
                                            title: '文件打开失败',
                                            icon: 'none'
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
        }
    })


}
const searchValue = (value: any) => {
    console.log("searchValue", value);
    selectedDate.value = value.selectedDate;
    checkSearchType.value = value.checkSearchType;
    getAccountList();
}
const selectedCategoryHandle = (selected) => {
    console.log("selectedCategory", selected);
    selectedCategory.value = selected;
    getAccountList(selected.value);
    return;
}
const getAccountList = (category?: string) => {
    ajax.get("/account/getStatisticsByflList", {
        page: page.value,
        rows: 20,
        category: category || "",
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
                    acc[date] = {
                        items: [],
                        totalIncome: 0, // 新增：当日总收入
                        totalExpense: 0 // 新增：当日总支出
                    };
                }

                // 统计收支（假设 item.type 0=支出，1=收入）
                if (item.type === 1) {
                    acc[date].totalIncome += parseFloat(item.amount);
                } else {
                    acc[date].totalExpense += parseFloat(item.amount);
                }

                acc[date].items.push({
                    ...item,
                    created_at: formatDate(new Date(item.created_at).getTime())
                });
                return acc;
            }, {});

            // 转换为数组格式时保留统计值
            const result = Object.keys(groupedAccounts).map(date => ({
                date,
                items: groupedAccounts[date].items.reverse(),
                totalIncome: groupedAccounts[date].totalIncome,
                totalExpense: groupedAccounts[date].totalExpense,
                balance: parseInt((groupedAccounts[date].totalIncome - groupedAccounts[date].totalExpense) * 100) / 100 // 计算结余
            }));
            console.log("------", result)
            if (page.value == 1) {
                accountsByDay.value = result as any;
            } else {
                // 创建日期映射表
                const dateMap = new Map();

                // 合并旧数据
                accountsByDay.value.forEach(group => {
                    dateMap.set(group.date, {
                        items: [...group.items],
                        totalIncome: group.totalIncome,
                        totalExpense: group.totalExpense
                    });
                });

                // 合并新数据
                result.forEach(newGroup => {
                    const existing = dateMap.get(newGroup.date);
                    if (existing) {
                        existing.items.push(...newGroup.items);
                        existing.totalIncome += newGroup.totalIncome;
                        existing.totalExpense += newGroup.totalExpense;
                    } else {
                        dateMap.set(newGroup.date, {
                            items: [...newGroup.items],
                            totalIncome: newGroup.totalIncome,
                            totalExpense: newGroup.totalExpense
                        });
                    }
                });

                // 转换回数组格式
                accountsByDay.value = Array.from(dateMap).map(([date, data]) => ({
                    date,
                    ...data,
                    balance: parseInt((data.totalIncome - data.totalExpense) * 100) / 100 // 保持结余字段同步
                }));
            }
            console.log("1111111111111", accountsByDay.value);
        }
    })
}
// const successAccount = () => {
//     getAccountList();

// }
// // 打开订阅消息
// const openReminder = () => {
//     reminderRef.value.open();
// }
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