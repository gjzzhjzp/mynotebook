<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="休闲娱乐"></Header>
    </template>
    <template #body>
      <view class="">
        <view class="whiteColorB borderRadius10 m-t-20 p-a-15">
          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">快捷功能</view>
            <!-- <view class="font14 skinColor">查看全部</view> -->
          </view>
          <view class="m-t-20 grid-4">
            <view v-for="item in entertainments" @click="tonextPath(item)"
              class="borderRadius20 flex-column-center flex-justify-center m-b-20">
              <view class="entertainments_item flex-center-center">
               <image :src="item.image_url"></image>
              </view>
              <view class="m-t-10 font16 blackColor">{{ item.cn_name }}</view>
            </view>
          </view>
        </view>
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
  // getList();
})
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
let entertainments = ref([]);
const tonextPath = (item) => {
  if (item.path) {
    Taro.navigateTo({ 
      url: "entertainment/webview/webview?url=" + item.path
      })
  } else {
  }
}
const getList = () => {
  ajax.get("/entertainment/get", {
    page: page.value,
    rows: 20
  }).then((res) => {
    if (res.code == 200) {
      total.value = res.total as number;
      refreshering.value = false;
      if (page.value == 1) {
        entertainments.value = res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        });
      } else {
        entertainments.value = [...entertainments.value, ...res.data.map((item: any) => {
          return {
            ...item,
            created_at: formatDate(new Date(item.created_at).getTime())
          }
        })] as any;
      }

      console.log(entertainments.value);
    }
  })
}  // 上拉到最底部加载
const lower = () => {
  if (entertainments.value.length >= total.value) {
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