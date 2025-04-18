<template>
    <web-view :src="url" :style="{ height: '100%', width: '100%' }"></web-view>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
const url = ref("https://www.baidu.com");
onMounted(() => {
    const params = Taro.getCurrentInstance().router?.params;
    console.log('路由参数', params);
    if (params?.url) {
        url.value = params.url;
    }
    console.log("webview mounted");
});
</script>