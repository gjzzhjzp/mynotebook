<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="记账"></Header>
    </template>
    <template #body>
      <!-- <nut-noticebar text="设置订阅提醒" background="#FFF7ED" color="#EA580C" :left-icon="true" /> -->
      <view class="account-index-tips flex-align-center flex-justify-between p-a-15" @click="openReminder()">
        <view class="flex-align-center">
          <view class="iconfont icon-icon_notice font16 "></view>
          <view class="m-l-5">设置订阅提醒</view>
        </view>
        <view>
          <view class="iconfont icon-you font20"></view>
        </view>
      </view>
      <view class="p-a-15">

        <!-- <view class=" font14 blackColor text-right m-b-15 flex-align-center flex-justify-end" @click="openReminder()">
          <view class="iconfont icon-icon_notice font16 skinColor"></view>
          <view class="skinColor">设置订阅提醒</view>
        </view> -->
        <view>
          <statistics ref="statisticsRef"></statistics>
        </view>
        <view class="whiteColorB borderRadius10 m-t-20 p-a-15">


          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">近期记录</view>
            <view class="font14 skinColor flex-align-center" @click="toAllAccount()">
              <view>全部账单</view>
              <view class="iconfont icon-you font14"></view>
            </view>
          </view>
          <view class="m-t-20">
            <accountList :list="accounts" @click="openActionSheet"></accountList>
          </view>
        </view>
      </view>
    </template>
    <template #footer>
      <add @add="add_account()"></add>
      <addAccount ref="addAccountRef" @success="successAccount()"></addAccount>
      <reminder ref="reminderRef"></reminder>
      <action-sheet ref="actionSheetRef" @update="update_account" @delete="deleteAccount"></action-sheet>
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';

import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import add from '../../components/common/add.vue';
import statistics from '../../components/account/statistics.vue';
import accountList from '../../components/account/list.vue';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import addAccount from '../../components/account/add.vue';
import reminder from '../../components/account/reminder.vue';
import { formatDate } from '../../common/date_formatter'
import actionSheet from "../../components/common/actionSheet.vue"
interface StatisticsComponent {
  getStatistics: () => void;
}
const addAccountRef = ref();
// const globalData = inject('globalData');
const reminderRef = ref();
const actionSheetRef = ref();
const currentItem = ref();
const add_account = () => {
  Taro.navigateTo({
    url: "/account/add/add"
  })
  // addAccountRef.value.open();
}
const update_account = () => {
  // addAccountRef.value.open(currentItem.value);
  Taro.navigateTo({
    url: `/account/add/add?id=${currentItem.value?.id}`
  })
  actionSheetRef.value.close();
}
const toAllAccount = () => {
  Taro.navigateTo({
    url: "/account/allAccount/allAccount"
  })
}
const openActionSheet = (item) => {
  actionSheetRef.value.open();
  currentItem.value = item;
}
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
let accounts = ref([]);
let statisticsRef = ref<StatisticsComponent | null>(null)

onBeforeMount(() => {

})
useDidShow(() => {
  successAccount();
})
onMounted(() => {
  // getAccountList();
})

const getAccountList = () => {
  ajax.get("/account/get", {
    page: page.value,
    rows: 10
  }).then((res: any) => {
    console.log("getAccountList", res);

    if (res.code == 200) {
      total.value = res.total as number;
      refreshering.value = false;
      if (page.value == 1) {
        accounts.value = res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        });
      } else {
        accounts.value = [...accounts.value, ...res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        })] as any;
      }
      console.log(accounts.value);
    }
  })
}
const successAccount = () => {
  getAccountList();
  statisticsRef.value?.getStatistics();

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