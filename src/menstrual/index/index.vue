<template>
    <pageScroll :refresher_enabled="false" >
      <template #nav>
        <Header title="经期记录"></Header>
      </template>
      <template #body>
        <view class="">
        </view>
      </template>
      <template #footer>
      </template>
    </pageScroll>
  </template>
  
  <script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import ajax from '../../common/ajax';
  import Header from '../../components/common/Header.vue';
  import pageScroll from '../../components/common/pageScroll.vue';
  onBeforeMount(() => {
  
  })
  onMounted(() => {
    getList();
  })
  let page = ref<number>(1);
  let total = ref<number>(0);
  
  const getList = () => {
    ajax.get("/feedback/get", {
      page: page.value,
      rows: 20
    }).then((res) => {
      if (res.code == 200) {
       
    })
  }  
  
  </script>