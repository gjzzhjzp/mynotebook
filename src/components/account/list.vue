<template>
    <view class="account-list">
        <template v-if="list.length > 0">
            <view v-for="(item) in list" :key="item.id" class=" m-t-15" @clicK="itemClick(item)">
                <view class="flex-align-center flex-justify-between">
                    <view class="flex-align-center">
                        <view>
                            <view style="" class="borderRadiusMax flex-center-center account-list-leftIcon">
                                <view v-if="item.type == 0" class="iconfont icon-zhichu font35 successColor"></view>
                                <view v-else class="iconfont icon-shouru font35 errorColor"></view>
                            </view>
                        </view>
                        <view class="flex-column-left m-l-5">
                            <view class="font14 fontWeight blackColor">{{ categories_obj[item.category] }}</view>
                            <view class="font12 m-t-5">{{ item.created_at }} <text class="m-l-5 m-r-5"
                                    v-if="item.description">|</text> {{ item.description }}</view>
                        </view>
                    </view>
                    <view :class="item.type == 1 ? 'skinColor' : 'blackColor'">{{ item.type == 0 ? '-' : '+' }}￥{{
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
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import emptyData from "../common/emptyData.vue"

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


const emits = defineEmits(['click'])
onMounted(() => {
    categories_obj.value = Taro.getStorageSync("globalData").categories_obj;
})
const itemClick = (item: AccountItem) => {
    emits('click', item);
}
</script>

<style scoped>
.account-list-leftIcon {
    width: 80rpx;
    height: 80rpx;

}
</style>