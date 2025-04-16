<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="意见反馈"></Header>
    </template>
    <template #body>
      <view class="">
        <feedback-list :list="feedbacks"></feedback-list>
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
import feedbackList from '../../components/feedback/list.vue';
import { formatDate } from '../../common/date_formatter';
onBeforeMount(() => {

})
onMounted(() => {
  getList();
})
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
let feedbacks = ref([]);

const getList = () => {
  ajax.get("/feedback/get", {
    page: page.value,
    rows: 20
  }).then((res) => {
    if (res.code == 200) {
      total.value = res.total as number;
      refreshering.value = false;
      if (page.value == 1) {
        feedbacks.value = res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        });
      } else {
        feedbacks.value = [...feedbacks.value, ...res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        })] as any;
      }

      console.log(feedbacks.value);
    }
  })
}  // 上拉到最底部加载
const lower = () => {
  if (feedbacks.value.length >= total.value) {
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

</script>