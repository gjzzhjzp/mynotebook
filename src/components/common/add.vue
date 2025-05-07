<template>
  <div class="add-container skinColorB whiteColor flex-center-center" @click="clickAdd">
    <!-- 添加 -->
    <slot>
      <view class="iconfont icon-tianjia font30 "></view>
    </slot>

  </div>
</template>

<script setup>
// 引入需要的依赖
import { ref, computed } from 'vue';
const emit = defineEmits(['add'])
function clickAdd() {
  emit('add')
}
</script>

<style>
.add-container {
  width: 112rpx;
  height: 112rpx;
  position: fixed;
  bottom: 100rpx;
  right: 50rpx;
  border-radius: 50%;
}
</style>