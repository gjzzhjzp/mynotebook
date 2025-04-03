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

onBeforeMount(() => {

})
onMounted(() => {
  getList();
})
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