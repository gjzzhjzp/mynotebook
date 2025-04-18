<template>
  <pageScroll :refresher_enabled="false">
    <template #nav>
      <Header title="橘好记" :showNavBack="true" :showNavBackSlot="true">
        <template #left>
          <!-- <view class="iconfont icon-icon_notice font20 skinColor"></view> -->
        </template>
      </Header>
    </template>
    <template #body>
      <view class="m-a-15">
        <view class="m-t-20 mynotebook_body flex-align-center gap15 ">
          <view class="mynotebook_body_wrap" @click="tonext('account')">
            <view class=" borderRadius20 flex-column-center flex-justify-center">
              <view class="mynotebook_body_item flex-center-center">
                <view class="iconfont icon-jizhangben font45 skinColor"></view>
              </view>
              <view class="m-t-10 font16 blackColor">记账</view>
              <view class="m-t-5 font14 tagColor">轻松管理收支</view>
            </view>
          </view>
          <view class="mynotebook_body_wrap" @click="tonext('memo')">
            <view class=" borderRadius20 flex-column-center flex-justify-center">
              <view class="mynotebook_body_item flex-center-center">
                <view class="iconfont icon-beiwanglu font45 skinColor"></view>
              </view>
              <view class="m-t-10 font16 blackColor">备忘录</view>
              <view class="m-t-5 font14 tagColor">记录生活点滴</view>
            </view>
          </view>
        </view>
        <view class="whiteColorB borderRadius10 m-t-20 p-a-15">
          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">快捷功能</view>
            <!-- <view class="font14 skinColor">查看全部</view> -->
          </view>
          <view class="m-t-20 grid-4">
            <view v-for="item in kjtabs" @click="tonextPath(item)"
              class="borderRadius20 flex-column-center flex-justify-center m-b-20">
              <view class="mynotebook_body_item flex-center-center">
                <view :class="'iconfont font45 skinColor ' + item.icon"></view>
              </view>
              <view class="m-t-10 font16 blackColor">{{ item.cn_name }}</view>
            </view>
          </view>
        </view>
        <!--  <view class="whiteColorB borderRadius10 m-t-20 p-a-15">

         <statisticsByMonth ref="statisticsByMonth" :ishome="true"></statisticsByMonth>
        </view> -->
      </view>
      <addfeedback ref="addfeedbackRef"></addfeedback>
      <reminder ref="reminderRef" @open_help="openHelp"></reminder>
      <reminder_text ref="reminder_textRef"></reminder_text>
      <view class="back_icon skinColor iconfont icon-tubiaozhizuomoban- font40"></view>
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import addfeedback from "../../components/feedback/add.vue"
import reminder from "../../components/account/reminder.vue"
import reminder_text from "../../components/account/reminder_text.vue"
// import statisticsByMonth from "../../components/account/statisticsByMonth.vue"
import Taro from '@tarojs/taro';
import { useShareAppMessage } from "@tarojs/taro"
interface KjTabs {
  name: string;
  icon: string;
  path: string;
  cn_name?: string;
  status?: number;
  sort_order?: number;
}
const addfeedbackRef = ref();
const reminderRef = ref();
const reminder_textRef = ref();
onBeforeMount(() => {

})
onMounted(() => {
  getKjTabs();
})
const openHelp = () => {
  console.log("2")
  reminder_textRef.value.open();
}
const kjtabs = ref<KjTabs[]>([]);
const tonext = (type) => {
  let url = "";
  switch (type) {
    case 'account':
      url = "/account/index/index"
      break;
    case 'memo':
      url = "/memo/index/index"
      break;
  }
  Taro.navigateTo({ url })
}
const getKjTabs = () => {
  ajax.get('/quick_actions/get', {}).then(res => {
    if (res.code == 200) {
      console.log(res.data);
      const globalData = Taro.getStorageSync("globalData");
      if (globalData.userinfo.openid == "o5DNf7Kcd5UqkNq_5pj7lb1Hc7Mw") {
        kjtabs.value = res.data;
      } else {
        kjtabs.value = res.data.filter((item) => {
          return item.status == 1;
        });
      }
    }
  })
}
const tonextPath = (item) => {
  if (item.path) {
    Taro.navigateTo({ url: item.path })
  } else {
    if (item.name == "feedback") {   // 意见反馈
      addfeedbackRef.value.open();
    } else if (item.name == "budgetSetting") {   // 预算设置
      reminderRef.value.open();
    }
  }
}
useShareAppMessage(() => {
  debugger;
  return {
    title: '橘好记1 - 简单好用的记账备忘录', // 分享标题
    path: '/pages/index/index', // 分享路径
  }
})
// 自定义分享功能
Taro.useShareAppMessage(() => {
  debugger;
  return {
    title: '橘好记2 - 简单好用的记账备忘录', // 分享标题
    path: '/pages/index/index', // 分享路径
  }
})

</script>

<style>
.back_icon {
  /* z-index: -1; */
  opacity: 0.15;
  font-size: 400rpx;
  margin-top: -200rpx;
  margin-left: 520rpx;
  display: inline-block;
  position: absolute;
}

.mynotebook_body_item {
  width: 96rpx;
  height: 96rpx;
  background: var(--tagBg2);
  border-radius: 50%;


}


.mynotebook_body_wrap {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #FFFFFF;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.05);
  padding: 40rpx 0;
}

.mynotebook_body_item .iconfont {
  font-size: 36rpx;
}
</style>