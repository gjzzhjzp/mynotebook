<template>
  <pageScroll :refresher_enabled="false">
    <template #nav>
      <Header title="备忘录"></Header>
    </template>
    <template #body>
      这是备忘录
    </template>
  </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';


// 是否允许post请求
onBeforeMount(() => {

})
onMounted(() => {
  // debugger;
  // addMemos();
  getList();
  // deleteMemos();
  updateMemos();
})
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
    console.log("查询成功", res);
  })
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