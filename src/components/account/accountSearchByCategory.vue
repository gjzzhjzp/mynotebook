<template>
    <nut-popup v-model:visible="visible" position="bottom" round :style="{ height: '80%' }">
        <view class="flex-column-center" style="height: 100%;">
            <view class="p-a-15 font16 fontWeight blackColor flex-center-center">请选择类型</view>
            <view class="m-t-10 m-b-30" style="flex: 1;
                width: 100%;
                min-height: 0;
                overflow: auto;">
                <view class="m-l-20"> <nut-button @click="selectedItem()"
                        :type="selectedCategory == 'all' ? 'primary' : 'default'">全部分类</nut-button></view>
                <view class="font14 blackColor m-l-20 m-t-20 fontWeight">支出</view>
                <view class="m-t-20 grid-4">
                    <view v-for="item in categories0"
                        class="borderRadius20 flex-column-center flex-justify-center m-b-20"
                        @click="selectedItem(item)">
                        <view
                            :class="['account_add_item', 'flex-center-center', 'borderRadiusMax', 'p-a-10', item.value == selectedCategory ? 'skinColorB' : 'tagColorB']">
                            <view
                                :class="'iconfont  font24 ' + item.icon + ' ' + (item.value == selectedCategory ? 'whiteColor ' : 'lightColor ')">
                            </view>
                        </view>
                        <view class="m-t-10 font14 blackColor">{{ item.name }}</view>
                    </view>
                </view>
                <view class="font14 blackColor m-l-20 fontWeight">收入</view>
                <view class="m-t-20 grid-4">
                    <view v-for="item in categories1"
                        class="borderRadius20 flex-column-center flex-justify-center m-b-20"
                        @click="selectedItem(item)">
                        <view
                            :class="['account_add_item', 'flex-center-center', 'borderRadiusMax', 'p-a-10', item.value == selectedCategory ? 'skinColorB' : 'tagColorB']">
                            <view
                                :class="'iconfont  font24 ' + item.icon + ' ' + (item.value == selectedCategory ? 'whiteColor ' : 'lightColor ')">
                            </view>
                        </view>
                        <view class="m-t-10 font14 blackColor">{{ item.name }}</view>
                    </view>
                </view>
            </view>
        </view>
    </nut-popup>

</template>
<script setup lang="ts">
import { categoriesData } from "../../interface/category.ts"
import { ref, onMounted, emit } from "vue"
import ajax from '../../common/ajax';
import Taro from '@tarojs/taro';
const categories0 = ref<categoriesData[]>([]);
const categories1 = ref<categoriesData[]>([]);
const selectedCategory = ref("all");
const visible = ref(false)
onMounted(() => {
    getCategory();
})
const open = () => {
    visible.value = true;
}
const close = () => {
    visible.value = false;
}
const emit = defineEmits(['selected'])
const getCategory = async () => {
    // debugger
    await ajax.checkPost();
    const globalData = Taro.getStorageSync("globalData");
    if (globalData.categories) {
        categories0.value = globalData.categories[0];
        categories1.value = globalData.categories[1];
    }
}
const selectedItem = (item?: categoriesData) => {
    console.log("selectedItem", item)
    selectedCategory.value = item ? item.value : "all";
    emit('selected', {
        name: item ? item.name : "全部分类",
        icon: item ? item.icon : "icon-fenlei1",
        value: item ? item.value : ""
    });
    close();

}
defineExpose({
    open,
    close,
    selectedCategory
})
</script>