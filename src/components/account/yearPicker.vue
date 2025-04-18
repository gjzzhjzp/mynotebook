<template>
     <nut-picker :columns="columns" title="" v-model="localVal" @confirm="confirm" />
</template>
<script setup lang="ts">
import { onMounted, ref,watch } from 'vue'
const props=defineProps({
  val: {
    type: Array,
    default: [2025]
  }
})
const localVal = ref(props.val)

// 监听父组件值变化
watch(() => props.val, (newVal) => {
  localVal.value = newVal
})
// 添加默认值初始化
onMounted(() => {
  if (!localVal.value.length) {
    localVal.value = [columns.value[0].value]
  }
})
// 生成最近10年数组
const generateYears = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => ({
    text: `${currentYear - i}年`,
    value: currentYear - i
  }));
  console.log(years)
  return years
}
const columns = ref(generateYears())
const emit = defineEmits(['confirm'])
const confirm = ({ selectedValue, selectedOptions }) => {
    console.log('选中年份:', selectedValue[0]);
    localVal.value = selectedValue; // 更新本地值
    emit("confirm",selectedValue[0]);
}
</script>