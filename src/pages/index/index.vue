<template>
  <Header title="首页"></Header>
  <view class="demo">
    <view @click="handleClick">
      这里是内容
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/Header.vue';


// 是否允许post请求
onBeforeMount(() => {

})
onMounted(() => {
  ajax.post("/user", {
    username: "123",
    password: "123"
  }).then((res: any) => {
    console.log("res", res);
  })
})
const handleClick = () => {
  ajax.get("/getuser", { username: 1 }).then((res: any) => {
    console.log("res", res);
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