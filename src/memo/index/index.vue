<template>
  <pageScroll :refresher_enabled="false">
    <template #nav>
      <Header title="备忘录"></Header>
    </template>
    <template #body>
      <memo-list :list="memos" @delete="successmemo" @update="update_memo"></memo-list>
      <add @add="add_memo()"></add>
      <addmemo ref="addmemoRef" @success="successmemo()"></addmemo>
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
// 是否允许post请求
onBeforeMount(() => {

})
onMounted(() => {
  // debugger;
  // addMemos();
  getList();
  // deleteMemos();
  // updateMemos();
})
const add_memo = () => {
  addmemoRef.value.open();
}
const update_memo = (item) => {
  addmemoRef.value.open(item);
}
let memos = ref([]);
const addMemos=()=>{
  ajax.post("/memos/add", {
  title:"这是标题",
  content:"这是内容"
  }).then((res) => {
    console.log("添加成功", res);
  })
}
const getList=()=>{
  ajax.get("/memos/list", {
   page:1,
   rows:20
  }).then((res) => {
    if (res.code == 200) {
      memos.value = res.data.map((item: any) => {
        return {
          ...item,
          created_at: formatDate(new Date(item.created_at).getTime())
        }
      });
      console.log(memos.value);
    }
  })
}
const successmemo=()=>{
  getList();
}
const deleteMemos=()=>{
  ajax.post("/memos/delete", {
  id:1
  }).then((res) => {
    console.log("删除成功", res);
  })
}
const updateMemos=()=>{
  ajax.post("/memos/update", {
  id:2,
  title:"这是标题22222",
  content:"这是内容22222"
  }).then((res) => {
    console.log("删除成功", res);
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