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
              <accountList :list="accounts"></accountList>
            </view>
          </view>
        </view>
        <add @add="add_account()" ></add>
        <addAccount ref="addAccountRef" @success="getAccountList()"></addAccount>
      </template>
    </pageScroll>
  </template>
  
  <script setup lang="ts">
  import { onBeforeMount, onMounted,ref } from 'vue';
  import ajax from '../../common/ajax';
  import Header from '../../components/common/Header.vue';
  import pageScroll from '../../components/common/pageScroll.vue';
  import add from '../../components/common/add.vue';
  import statistics from '../../components/account/statistics.vue';
  import accountList from '../../components/account/list.vue';
  // import Taro from '@tarojs/taro';
  import addAccount from '../../components/account/add.vue';
  const addAccountRef=ref();
  const add_account = () => {
    addAccountRef.value.open();
  }
  let accounts=ref([]);

  onBeforeMount(() => {
  
  })
  onMounted(() => {
    getAccountList();
  })
  const getAccountList = () => {
    ajax.get("/account/get", {
      page: 1,
      rows: 10
    }).then((res:any) => {
      console.log(res);
      if(res.code == 200){
        accounts.value=res.data;
        console.log(accounts.value);
      }
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