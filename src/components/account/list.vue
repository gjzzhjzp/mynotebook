<template>
    <view class="account-list">
        <view v-for="(item, index) in list" class="flex-align-center flex-justify-between m-t-15">
            <view class="flex-align-center">
                <view>
                    <view style="width: 80rpx;height: 80rpx;opacity: 0.1;" class="borderRadiusMax skinColorB"></view>
                </view>
                <view class="flex-column-left m-l-5">
                    <view class="font14 fontWeight blackColor">{{ item.description||categories_obj[item.category] }}</view>
                    <view class="font12 m-t-5">{{ item.created_at }}</view>
                </view>
            </view>
            <view class="skinColor">{{ item.type == 0 ? '-' : '+' }}￥{{ item.amount }}</view>
        </view>
    </view>
</template>

<script setup>
// 引入需要的依赖
import { ref, computed,onMounted } from 'vue';
import Taro from '@tarojs/taro';
defineProps({
    // props
    list: {
        type: Array,
        default: () => []
    }
});
const categories_obj=ref({});
onMounted(()=>{
    categories_obj.value=Taro.getStorageSync("globalData").categories_obj;
})
</script>

<style scoped>
.account-list {
    /* 组件样式 */
}
</style>