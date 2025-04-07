<template>
  <pageScroll :refresher_enabled="false">
    <template #nav>
      <Header title="测试" :showNavBack="true" :showNavBackSlot="true">
        <template #left>
          <!-- <view class="iconfont icon-icon_notice font20 skinColor"></view> -->
        </template>
      </Header>
    </template>
    <template #body>
      <view class="m-t-20">
        <nut-grid :gutter="30" :column-num="2" :border="false">
          <nut-grid-item @click="tonext('account')">
            <view class="borderRadius10 flex-column-center flex-justify-center">
              <view class="iconfont icon-jizhangben font30 skinColor"></view>
              <view class="m-t-10 font16 blackColor">记账</view>
            </view>
          </nut-grid-item>
          <nut-grid-item @click="tonext('memo')">
            <view class="borderRadius10 flex-column-center flex-justify-center">
              <view class="iconfont icon-beiwanglu font30 skinColor"></view>
              <view class="m-t-10 font16 blackColor">备忘录</view>
            </view>
          </nut-grid-item>
        </nut-grid>
      </view>
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
// import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import Taro from '@tarojs/taro';

onBeforeMount(() => {

})
onMounted(() => {

})
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