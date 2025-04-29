<template>
    <view class="account-list">
        <template v-if="list.length > 0">
            <view v-for="(item) in list" :key="item.id" class=" m-t-15" @clicK="itemClick(item)"
                @longpress="itemClick(item)">
                <view class="flex-align-center flex-justify-between">
                    <view class="flex-align-center">
                        <view>
                            <view style="" class="borderRadiusMax flex-center-center account-list-leftIcon">
                                <view v-if="item.type == 0"
                                    :class="'iconfont  font20 skinColor ' + categories_icon[item.category]"></view>
                                <view v-else :class="'iconfont font20 errorColor ' + categories_icon[item.category]">
                                </view>
                            </view>
                        </view>
                        <view class="flex-column-left m-l-10">
                            <view class="font14 fontWeight blackColor">{{ categories_obj[item.category] }}</view>
                            <view class="font12 m-t-5">{{ item.created_at }} <text class="m-l-5 m-r-5"
                                    v-if="item.description">|</text> {{ item.description }}</view>
                        </view>
                    </view>
                    <view :class="item.type == 1 ? 'skinColor' : 'errorColor'">{{ item.type == 0 ? '-' : '+' }}{{
            Taro.getStorageSync("globalData").currency }}{{
            item.amount
        }}</view>
                </view>
                <nut-divider
                    :style="{ color: '#ededf3', borderColor: '#ededf3', paddingLeft: '50px', margin: '10px 0' }"></nut-divider>
            </view>
        </template>
        <template v-else>
            <emptyData></emptyData>
        </template>
    </view>
</template>

<script setup lang="ts">
// 引入需要的依赖
import { ref, onMounted, inject } from 'vue';
import Taro from '@tarojs/taro';
import emptyData from "../common/emptyData.vue"
import ajax from "../../common/ajax";

interface AccountItem {
    id: string;
    category: string;
    created_at: string;
    description: string;
    type: number;
    amount: string;
}

interface CategoriesObj {
    [key: string]: string;
}
defineProps({
    // props
    list: {
        type: Array as () => AccountItem[],
        default: () => []
    }
});
const categories_obj = ref<CategoriesObj>({});
const categories_icon = ref<CategoriesObj>({});

const emits = defineEmits(['click'])
onMounted(async () => {
    await ajax.checkPost();
    const globalData = Taro.getStorageSync("globalData");
    categories_obj.value = globalData.categories_obj;
    categories_icon.value = globalData.categories_icon;
})
const itemClick = (item: AccountItem) => {
    emits('click', item);
}
</script>

<style>
.account-list-leftIcon {
    width: 80rpx;
    height: 80rpx;
    background-color: #FFF0E6;

}
</style>