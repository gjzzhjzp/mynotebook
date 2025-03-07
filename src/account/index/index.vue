<template>
    <pageScroll :refresher_enabled="false">
      <template #nav>
        <Header title="记账"></Header>
      </template>
      <template #body>
        <view class="p-a-15">
          <view>
            <statistics></statistics>
          </view>
          <view class="whiteColorB borderRadius10 m-t-20 p-a-15">
            <view class="flex-align-center flex-justify-between">
              <view class="font18 fontWeight blackColor">近期记录</view>
              <view class="font14 skinColor">查看全部</view>
            </view>
            <view class="m-t-20">
              <accountList></accountList>
            </view>
          </view>
        </view>
        <add></add>
      </template>
    </pageScroll>
  </template>
  
  <script setup lang="ts">
  import { onBeforeMount, onMounted } from 'vue';
  import ajax from '../../common/ajax';
  import Header from '../../components/common/Header.vue';
  import pageScroll from '../../components/common/pageScroll.vue';
  import add from '../../components/common/add.vue';
  import statistics from '../../components/account/statistics.vue';
  import accountList from '../../components/account/list.vue';


  onBeforeMount(() => {
  
  })
  onMounted(() => {
    ajax.post("/user", {
      username: "123",
      password: "123"
    }).then((res: any) => {
      console.log("res", res);
    })
  })
  const handleClick = () => {
    ajax.get("/getuser", { username: 1 }).then((res: any) => {
      console.log("res", res);
    })
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