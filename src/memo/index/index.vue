<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="备忘录"></Header>
    </template>
    <template #body>
      <!-- p-a-10 m-a-10 whiteColorB borderRadius10 -->
      <view class="">
        <memo-list :list="memos" @delete="successmemo" @update="update_memo"></memo-list>
      </view>
     
      <addmemo ref="addmemoRef" @success="successmemo()"></addmemo>
    </template>
    <template #footer>
      <add @add="add_memo()"></add>
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted,ref } from 'vue';
import ajax from '../../common/ajax';
import add from '../../components/common/add.vue';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import memoList from '../../components/memo/list.vue';
import addmemo from '../../components/memo/add.vue';
import { formatDate } from '../../common/date_formatter'

onBeforeMount(() => {

})
onMounted(() => {
  getList();
})
let page=ref<number>(1);
let total=ref<number>(0);
let refreshering=ref<boolean>(false);
const addmemoRef = ref();
const add_memo = () => {
  addmemoRef.value.open();
}
const update_memo = (item) => {
  addmemoRef.value.open(item);
}
let memos = ref([]);

const getList=()=>{
  ajax.get("/memos/list", {
   page:page.value,
   rows:20
  }).then((res) => {
    if (res.code == 200) {
      total.value = res.total as number;
      refreshering.value=false;
      if(page.value==1){
        memos.value = res.data.map((item: any) => {
        return {
          ...item,
          created_at: formatDate(new Date(item.created_at).getTime())
        }
      });
      }else{
        memos.value = [...memos.value,...res.data.map((item: any) => {
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
const successmemo=()=>{
  getList();
}
// 上拉到最底部加载
const lower=()=>{
  if(memos.value.length>=total.value){
    return;
  }
  page.value++;
  getList();
}
const refresh=()=>{
  refreshering.value=true;
  page.value=1;
  getList();
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