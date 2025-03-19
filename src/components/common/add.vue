<template>
    <div class="add-container skinColorB whiteColor flex-center-center" @click="clickAdd">
      添加
    </div>
  </template>
  
  <script setup>
  // 引入需要的依赖
  import { ref, computed } from 'vue';
    const emit=defineEmits(['add'])
  function clickAdd(){
    emit('add')
  }
  </script>
  
  <style>
  .add-container{
   width: 112rpx;
   height: 112rpx;
   position: fixed;
   bottom: 80rpx;
   right: 20rpx;
   border-radius: 50%;
  }
  </style>