<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header ref="HeaderRef" title="备忘录" :showNavBack="true" :showNavBackSlot="true">
        <template #left>
          <view class="flex-align-center">
            <view class=" flex-align-center" @click="bindback">
              <view class="iconfont icon-icon_arrow_left font24"></view>
            </view>
            <view class=" flex-align-center" @click="tomanage()">
              <view class="iconfont icon-guanli font24"></view>
              <view v-if="isedit">退出</view>
            </view>
          </view>
        </template>
      </Header>
    </template>
    <template #body>
      <!-- p-a-10 m-a-10 whiteColorB borderRadius10 -->
      <view class="">
        <!-- @delete="successmemo" @update="update_memo" -->
        <memo-list ref="memoListRef" :isedit="isedit" :list="memos" @click="openActionSheet"></memo-list>
      </view>
    </template>
    <template #footer>
      <add @add="add_memo()"></add>
      <addmemo ref="addmemoRef" @success="successmemo()"></addmemo>
      <nut-popup :overlay="false" v-model:visible="isedit" position="bottom" :style="{ height: '10%' }">
        <view class="flex-align-center flex-justify-between font14 fontWeight p-a-20">
          <view class="skinColor" @click="complate_memo()">设为已办</view>
          <view class="blackColor" @click="deletememo()">批量删除</view>
        </view>
      </nut-popup>
      <action-sheet ref="actionSheetRef" text="备忘录" @update="update_memo" @complate="complate_memo" @delete="deletememo"
        type="memo"></action-sheet>
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
import { MemoItem } from '../../interface/memo.ts'
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
const HeaderRef = ref();
let isedit = ref(false);
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
const memoListRef = ref();
const addmemoRef = ref();
let memos = ref<MemoItem[]>([]);
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
const bindback = () => {
  HeaderRef.value.bindback();
}
const tomanage = () => {
  isedit.value = !isedit.value;
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
  Taro.showModal({
    title: '提示',
    content: '确认删除？',
    success: function (res) {
      if (res.confirm) {
        let id = "";
        if (!isedit.value) {
          id = currentItem.value.id;
        } else {
          id = memos.value.filter(item => item.checkbox).map(item => item.id).join(",");
        }
        console.log("id", id);
        // return;
        ajax.post("/memos/delete", {
          id: id
        }).then(() => {
          // console.log("删除成功", res);
          Taro.showToast({
            title: "删除成功",
            icon: "none"
          })
          isedit.value = false;
          actionSheetRef.value.close();
          getList();
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

}
const complate_memo = () => {
  let id = "";
  if (!isedit.value) {
    id = currentItem.value.id;
  } else {
    id = memos.value.filter(item => item.checkbox).map(item => item.id).join(",");
  }
  console.log("id", id);
  ajax.post("/memos/update", {
    id: id,
    is_done: 1
  }).then(res => {
    console.log("res", res);
    if (res.code == 200) {
      Taro.showToast({
        title: "设置成功",
        icon: 'success',
        duration: 2000
      });
      page.value = 1;
      isedit.value = false;
      actionSheetRef.value.close();
      getList();
    } else {
      Taro.showToast({
        title: res.message as string,
        icon: 'error',
        duration: 2000
      });
    }
  })
}
</script>
