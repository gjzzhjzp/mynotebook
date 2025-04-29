<template>
    <nut-picker :columns="columns" title="选择币种" :default-value="localVal" v-model="localVal" @confirm="confirm" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';
import ajax from '../../common/ajax'
// const props = defineProps({
//     val: {
//         type: Array,
//         default: ["￥"]
//     }
// })
const localVal = ref<string[]>(["€"]);
    const columns = ref()
// 监听父组件值变化
// watch(() => props.val, (newVal) => {
//     localVal.value = newVal
// })
// 添加默认值初始化
onMounted(async () => {
    await ajax.checkPost();
    getData().then(()=>{
        const currency = Taro.getStorageSync("globalData").currency;
    if (currency) {
        localVal.value = [currency]; // 确保 localVal 的值格式与 columns 的 value 一致
    }
        console.log("localVal.value",localVal.value);
    })
})
// 常用币种列表
const getData = () => {
   return new Promise((resolve) => {
    ajax.get("/currencies/list", {
       page:1,
       rows:100
    }).then((res)=>{
        console.log("res1111111",res);
        if(res.code == 200){
            columns.value = res.data.map((item) => {
                return {
                    text: item.name+"（"+item.symbol+"）",
                    value: item.symbol
                }
            })
            resolve(true);
        }
    })
   });
    
    // let data = [
    //     { "code": "CNY", "name": "人民币", "symbol": "¥" },
    //     { "code": "USD", "name": "美元", "symbol": "$" },
    //     { "code": "EUR", "name": "欧元", "symbol": "€" },
    //     { "code": "GBP", "name": "英镑", "symbol": "£" },
    //     { "code": "JPY", "name": "日元", "symbol": "¥" },
    //     { "code": "HKD", "name": "港币", "symbol": "HK$" },
    //     { "code": "KRW", "name": "韩元", "symbol": "₩" },
    //     { "code": "AUD", "name": "澳元", "symbol": "A$" },
    //     { "code": "CAD", "name": "加元", "symbol": "C$" },
    //     { "code": "SGD", "name": "新加坡元", "symbol": "S$" },
    //     { "code": "CHF", "name": "瑞士法郎", "symbol": "CHF" },
    //     { "code": "INR", "name": "印度卢比", "symbol": "₹" },
    //     { "code": "RUB", "name": "俄罗斯卢布", "symbol": "₽" },
    //     { "code": "THB", "name": "泰铢", "symbol": "฿" },
    //     { "code": "MYR", "name": "马来西亚林吉特", "symbol": "RM" }
    // ]
    // return data.map((item) => {
    //     return {
    //         text: item.name,
    //         value: item.symbol
    //     }
    // })
}

const emit = defineEmits(['confirm'])
const confirm = async ({ selectedValue }) => {
    console.log('选中币种:', selectedValue[0]);
    localVal.value = selectedValue; // 更新本地值
    const res = await ajax.post("/userLimit/addOrUpdate", {
        currency: selectedValue[0]
    });
    console.log("设置成功", res);
    emit("confirm", selectedValue[0]);
}
</script>