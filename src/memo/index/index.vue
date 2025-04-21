<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="备忘录"></Header>
    </template>
    <template #body>
      <!-- p-a-10 m-a-10 whiteColorB borderRadius10 -->
      <view class="">
        <!-- @delete="successmemo" @update="update_memo" -->
        <memo-list :list="memos" @click="openActionSheet"></memo-list>
      </view>
    </template>
    <template #footer>
      <add @add="add_memo()"></add>
      <addmemo ref="addmemoRef" @success="successmemo()"></addmemo>
      <action-sheet ref="actionSheetRef" @update="update_memo" @delete="deletememo" type="memo"></action-sheet>
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';
import add from '../../components/common/add.vue';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import memoList from '../../components/memo/list.vue';
import addmemo from '../../components/memo/add.vue';
import { formatDate } from '../../common/date_formatter';
import actionSheet from "../../components/common/actionSheet.vue";
import Taro from '@tarojs/taro';
import { useDidShow } from "@tarojs/taro";
onBeforeMount(() => {

})
useDidShow(() => {
  getList();
})
onMounted(() => {
  // getList();
})
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
const addmemoRef = ref();
let memos = ref([]);
const actionSheetRef = ref();
const currentItem = ref();
const add_memo = () => {
  // addmemoRef.value.open();
  Taro.navigateTo({ url: "/memo/add/add" })
}
const update_memo = () => {
  console.log("currentItem.value", currentItem.value);
  // addmemoRef.value.open(currentItem.value);
  Taro.navigateTo({ url: "/memo/add/add?id=" + currentItem.value.id })
  actionSheetRef.value.close();
}

const openActionSheet = (item) => {
  actionSheetRef.value.open();
  currentItem.value = item;
}
const getList = () => {
  ajax.get("/memos/list", {
    page: page.value,
    rows: 20
  }).then((res) => {
    if (res.code == 200) {
      total.value = res.total as number;
      refreshering.value = false;
      if (page.value == 1) {
        memos.value = res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        });
      } else {
        memos.value = [...memos.value, ...res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        })] as any;
      }

      console.log(memos.value);
    }
  })
}
const successmemo = () => {
  getList();
}
// 上拉到最底部加载
const lower = () => {
  if (memos.value.length >= total.value) {
    return;
  }
  page.value++;
  getList();
}
const refresh = () => {
  refreshering.value = true;
  page.value = 1;
  getList();
}
const deletememo = () => {
  ajax.post("/memos/delete", {
    id: currentItem.value.id
  }).then(() => {
    // console.log("删除成功", res);
    Taro.showToast({
      title: "删除成功",
      icon: "none"
    })
    actionSheetRef.value.close();
    getList();
  })
}

</script>
