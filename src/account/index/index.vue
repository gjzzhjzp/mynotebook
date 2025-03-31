<template>
  <pageScroll :refresher_enabled="false">
    <template #nav>
      <Header title="记账"></Header>
    </template>
    <template #body>
      <view class="p-a-15">
        <view class=" font14 blackColor text-right m-b-15" @click="openReminder()">
          设置订阅提醒
        </view>
        <view>
          <statistics ref="statisticsRef"></statistics>
        </view>
        <view class="whiteColorB borderRadius10 m-t-20 p-a-15">
          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">近期记录</view>
            <!-- <view class="font14 skinColor">查看全部</view> -->
          </view>
          <view class="m-t-20">
            <accountList :list="accounts"></accountList>
          </view>
        </view>
      </view>
      <add @add="add_account()"></add>
      <addAccount ref="addAccountRef" @success="successAccount()"></addAccount>
      <reminder ref="reminderRef"></reminder>
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
import Taro from '@tarojs/taro';
import addAccount from '../../components/account/add.vue';
import reminder from '../../components/account/reminder.vue';
import { formatDate } from '../../common/date_formatter'
interface StatisticsComponent {
  getStatistics: () => void;
}
const addAccountRef = ref();
// const globalData = inject('globalData');
const reminderRef = ref();
const add_account = () => {
  addAccountRef.value.open();
}
let accounts = ref([]);
let statisticsRef = ref<StatisticsComponent | null>(null)

onBeforeMount(() => {

})
onMounted(() => {
  // globalData.value = Taro.getStorageSync("globalData");
  // console.log(globalData);
  // console.log("....____________________",inject('globalData'));
  getAccountList();


})
const getAccountList = () => {
  ajax.get("/account/get", {
    page: 1,
    rows: 10
  }).then((res: any) => {
    console.log("getAccountList", res);
    if (res.code == 200) {
      accounts.value = res.data.map((item: any) => {
        return {
          ...item,
          created_at: formatDate(new Date(item.created_at).getTime())
        }
      });
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
  // basedll.requestSubscribeMessage([globalData.value.tmplIds.overspend,globalData.value.tmplIds.daily]);

  // // 测试新增限额
  // ajax.post("/userLimit/addOrUpdate", {
  //   "daily_limit": 1000.00,
  //   "monthly_limit": 30000.00,
  //   "yearly_limit": 360000.00
  // }).then((res: any) => {
  //   console.log("测试新增限额", res);
  // })
}
</script>
<style>
.demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>