<template>
     <nut-picker :columns="columns" title="" @confirm="confirm" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 生成最近10年数组
const generateYears = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => ({
    text: `${currentYear - i}年`,
    value: currentYear - i
  })).reverse() // 倒序排列，最近年份在前
}
const columns = ref(generateYears())
onMounted(() => {
  console.log(columns.value)
})
const confirm = ({ selectedValue, selectedOptions }) => {
    console.log('选中年份:', selectedValue[0]);
}
</script>