<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="休闲娱乐"></Header>
    </template>
    <template #body>
      <view class="p-a-15">
        <view v-for="item in entertainments" :key="item.type" class="whiteColorB borderRadius10 m-t-20 p-a-15">
          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">{{ item.type }}</view>
            <!-- <view class="font14 skinColor">查看全部</view> -->
          </view>
          <view class="m-t-20 grid-3">
            <view v-for="item1 in item.items" @click="tonextPath(item1)"
              class="borderRadius20 flex-column-center flex-justify-center m-b-20">
              <view class="entertainments_item flex-center-center">
                <image mode="aspectFill" :src="item1.image_url" class="borderRadiusMax"
                  style="width: 100%;height: 100%;"></image>
              </view>
              <view class="m-t-10 font16 blackColor">{{ item1.cn_name }}</view>
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
import { formatDate } from '../../common/date_formatter';
import Taro from '@tarojs/taro';
interface entertainmentsItem {
  name: string;
  cn_name: string;
  image_url: string;
  type: string;
  items?: entertainmentsItem[];
}
onBeforeMount(() => {

})
onMounted(() => {
  getList();
})
let page = ref<number>(1);
let total = ref<number>(0);
let refreshering = ref<boolean>(false);
let entertainments = ref<entertainmentsItem[]>([]);
const tonextPath = (item) => {
  if (item.link) {
    const globalData = Taro.getStorageSync("globalData");
    let url = globalData.game_server + item.link;
    console.log("url", url);
    Taro.navigateTo({
      url: "/entertainment/webview/webview?url=" + url
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
      // 使用 reduce 按 type 分组
      const groupedData = res.data.reduce((acc: Record<string, entertainmentsItem[]>, item: any) => {
        const type = item.type || '未分类'; // 如果没有 type，默认归类为 '未分类'
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push({
          ...item,
          created_at: formatDate(new Date(item.created_at).getTime())
        });
        return acc;
      }, {});

      // 将分组后的数据转换为数组
      entertainments.value = Object.entries(groupedData).map(([type, items]) => ({
        type,
        items
      })) as any;


      console.log("--------------", entertainments.value);
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
<style>
.entertainments_item {
  width: 120rpx;
  height: 120rpx;
}
</style>