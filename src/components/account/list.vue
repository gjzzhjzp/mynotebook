<template>
    <view class="account-list">
        <view v-for="(item, index) in list" :key="item.id" class=" m-t-15" @clicK="itemClick(item, index)">
            <view class="flex-align-center flex-justify-between">
                <view class="flex-align-center">
                    <view>
                        <view style="width: 80rpx;height: 80rpx;opacity: 0.1;" class="borderRadiusMax skinColorB">
                        </view>
                    </view>
                    <view class="flex-column-left m-l-5">
                        <view class="font14 fontWeight blackColor">{{ categories_obj[item.category] }}</view>
                        <view class="font12 m-t-5">{{ item.created_at }} <text class="m-l-5 m-r-5"
                                v-if="item.description">|</text> {{ item.description }}</view>
                    </view>
                </view>
                <view :class="item.type == 1 ? 'skinColor' : 'blackColor'">{{ item.type == 0 ? '-' : '+' }}￥{{ item.amount
                    }}</view>
            </view>
            <nut-divider
                :style="{ color: '#ededf3', borderColor: '#ededf3', paddingLeft: '50px', margin: '10px 0' }"></nut-divider>
        </view>
        <action-sheet ref="actionSheetRef" @update="updateAccount" @delete="deleteAccount"></action-sheet>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, computed, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import ajax from '../../common/ajax';
import actionSheet from "../common/actionSheet.vue"
defineProps({
    // props
    list: {
        type: Array,
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
const itemClick = (item, index) => {
    actionSheetRef.value.open();
    currentItem.value = item;
}
const deleteAccount = () => {
    ajax.post("/account/delete", {
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
const updateAccount = () => {
    emits('update',currentItem.value)
}
</script>

<style scoped>
.account-list {
    /* 组件样式 */
    /* –-nut-divider-text-color: "transparent"; */
    /* --nut-grid-item-content-padding: "0px 0px 0px 0px"; */
}
</style>