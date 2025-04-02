<template>
    <view class="memo-list">
        <view v-for="(item, index) in list" :key="item.id" class=" m-t-15" @clicK="itemClick(item, index)">
            <view class="flex-align-center flex-justify-between">
                <view class="flex-align-center">
                   
                    <view class="flex-column-left m-l-5">
                        <view class="font14 fontWeight blackColor">{{ item.title }}</view>
                        <view class="font12 m-t-5">{{ item.created_at }} <text class="m-l-5 m-r-5"
                                v-if="item.content">|</text> {{ item.content }}</view>
                    </view>
                </view>
            </view>
            <nut-divider
                :style="{ color: '#ededf3', borderColor: '#ededf3', paddingLeft: '50px', margin: '10px 0' }"></nut-divider>
        </view>
        <action-sheet ref="actionSheetRef" @update="updatememo" @delete="deletememo" type="memo"></action-sheet>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, computed, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import ajax from '../../common/ajax';
import actionSheet from "../common/actionSheet.vue"
interface MemoItem {
  id: number;
  title: string;
  created_at: string;
  content: string;
}
defineProps({
    // props
    list: {
        type: Array as () => MemoItem[],
        default: () => []
    }
});
const categories_obj = ref({});
const actionSheetRef = ref();
const currentItem = ref();
const emits = defineEmits(['update', 'delete'])
onMounted(() => {
    categories_obj.value = Taro.getStorageSync("globalData").categories_obj;
})
const itemClick = (item:MemoItem, index:number) => {
    actionSheetRef.value.open();
    currentItem.value = item;
}
const deletememo = () => {
    ajax.post("/memos/delete", {
        id: currentItem.value.id
    }).then((res) => {
        // console.log("删除成功", res);
        Taro.showToast({
            title: "删除成功",
            icon: "none"
        })
        emits('delete')

    })
}
const updatememo = () => {
    emits('update',currentItem.value)
}
</script>

<style scoped>
.memo-list {
}
</style>