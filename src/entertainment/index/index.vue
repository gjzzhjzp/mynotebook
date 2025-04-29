<template>
  <pageScroll :refresher_enabled="true" @lower="lower" @refresh="refresh" @refreshering="refreshering">
    <template #nav>
      <Header title="休闲娱乐"></Header>
    </template>
    <template #body>
      <view class="p-a-15">
        <ad-custom unit-id="adunit-74079774285d4eb3"></ad-custom>
        <view v-for="item in entertainments" :key="item.type" class="whiteColorB borderRadius10 m-t-20 p-a-10">
          <view class="flex-align-center flex-justify-between">
            <view class="font16 fontWeight blackColor">{{ item.type }}</view>
            <!-- <view class="font14 skinColor">查看全部</view> -->
          </view>
          <view class="m-t-10 grid-3">
            <view v-for="item1 in item.items" @click="tonextPath(item1)"
              class="borderRadius20 flex-column-center flex-justify-center m-b-10">
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
declare module '@tarojs/taro' {
  interface TaroStatic {
    base64Encode(input: string): string;
  }
}
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
const generateRandomString = (length = 13, includeLetters = true) => {
  let chars = '0123456789';
  if (includeLetters) {
    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
const tonextPath = (item) => {
  if (item.link) {
    const globalData = Taro.getStorageSync("globalData");
    let url = globalData.game_server + item.link;
    if (item.name == "juyuwang") {
      const data = generateRandomString() + "__" + globalData.userinfo.username + "__" + new Date().getTime() + generateRandomString();
      // const encryptedData = Taro.base64Encode(data)// 使用 Base64 加密

      url = url + "?une=" + data;
    }
    console.log("url", url);
    Taro.showModal({
      title: '打开外部链接',
      content: `1. 点击"复制链接"按钮\n2. 打开手机浏览器\n3. 在地址栏粘贴链接并访问`, // 使用模板字符串
      confirmText: '复制链接',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.setClipboardData({
            data: url,
            success: () => {
              Taro.showToast({
                title: '链接已复制，请到浏览器中粘贴打开',
                icon: 'none',
                duration: 3000
              });
            }
          });
        }
      }
    });
  } else {
  }
}
const getList = () => {
  ajax.get("/entertainment/get", {
    page: page.value,
    rows: 20,
    status: 1
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
  // if (entertainments.value.length >= total.value) {
  //   return;
  // }
  // page.value++;
  // getList();
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