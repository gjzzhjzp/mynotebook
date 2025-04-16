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
      <reminder ref="reminderRef"></reminder>
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
// import statisticsByMonth from "../../components/account/statisticsByMonth.vue"
import Taro from '@tarojs/taro';
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
onBeforeMount(() => {

})
onMounted(() => {
  getKjTabs();
})
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
      kjtabs.value = res.data;
      // kjtabs.value = res.data.filter((item) => {
      //   return item.status == 1;
      // });
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
</script>

<style>
.demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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