<template>
    <view :class="'wxc-nav' + (isOpacity ? 'wxc-nav-opactiy' : '')" @touchmove='touchmove' :style="wxc_nav_style">
        <view class="wxc-nav-left">
            <block v-if="showNavBack">
                <view v-if="showNavBackSlot" class="wxc-nav-left-back">
                    <slot name="left"></slot>
                </view>
                <view v-else class="wxc-nav-left-back flex-align-center" @click="bindback">
                    <view class="iconfont icon-icon_arrow_left font24 "></view>
                </view>
            </block>
            <view v-if="showTitleSlot" class="wxc-nav-center">
                <slot name="title"></slot>
            </view>
            <view v-else class="wxc-nav-center"><text class="wxc-title-text">{{ title }}</text></view>
        </view>
        <view class="wxc-nav-right"></view>
    </view>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, ref, computed,getCurrentInstance } from 'vue';
import { useReady, useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro'
// const app = Taro.getApp();
interface Props {
    title: string;
    titleAlign?: string;
    showNavBack?: boolean;
    showNavBackSlot?: boolean;
    showTitleSlot?: boolean;
    leftAlign?: string;
    backgroundColor?: string;
    isOpacity?: boolean;
    closeAutoBack?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    title: "",
    showNavBack: true,
    showNavBackSlot: false,
    showTitleSlot: false,
    titleAlign: 'center',
    leftAlign: "left",
    backgroundColor: "",
    isOpacity: false,
    closeAutoBack: false
});
// console.log("props", props);
const icon = ref('left')
const c_style = ref({
    '--navPadding': '',
    '--btnHeight': '',
    '--btnWidth': '',
    '--navTitleAlign': 'center',
    '--navLeftAlign': 'left'
})
const wxc_nav_style = computed(() => {
    return {
        '--navPadding': c_style.value['--navPadding'],
        '--btnHeight': c_style.value['--btnHeight'],
        '--btnWidth': c_style.value['--btnWidth'],
        '--navTitleAlign': c_style.value['--navTitleAlign'],
        '--navLeftAlign': c_style.value['--navLeftAlign']
    }
})
// const image_dns = computed(() => app.globalData.image_dns)
const emit = defineEmits(['rect', 'back'])
const bindback = () => {
    if (props.closeAutoBack) {
        emit('back')
        return;
    }
    if (icon.value == 'back') {
        Taro.navigateBack({
            delta: 1,
        });
    } else {
        Taro.redirectTo({
            url: "/pages/index/index"
        });
    }
}
const touchmove = () => {
    return false;
}

useReady(() => {
    const menuButtonObj = Taro.getMenuButtonBoundingClientRect();
    const windowInfo = Taro.getWindowInfo();
    const padding = [
        menuButtonObj.top,
        windowInfo.screenWidth - menuButtonObj.right,
        menuButtonObj.top - windowInfo.statusBarHeight,
        windowInfo.screenWidth - menuButtonObj.right,
    ];
    c_style.value = {
        '--navPadding': `${padding[0]}px ${padding[1]}px ${padding[2]}px 30rpx`,
        '--btnHeight': menuButtonObj.height + 'px',
        '--btnWidth': menuButtonObj.width + 'px',
        '--navTitleAlign': props.titleAlign,
        '--navLeftAlign': props.leftAlign
    }
    // console.log("c_style",c_style.value);
     // 使用 getCurrentInstance() 获取当前组件实例
     const instance = getCurrentInstance();
     if (!instance) {
        console.warn('Component instance is null');
        return;
    }
    const query = Taro.createSelectorQuery().in(instance); // 自定义组件需要绑定this;
    query.select('.wxc-nav').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function (res) {
        emit('rect', {
            res
        })
    })
})
useDidShow(() => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
        icon.value = 'back';
    } else {
        icon.value = 'home';
    }
})
</script>

<style>
.wxc-nav {
    --navPadding: 0 0 0 0;
    --navHeight: 0;
    --btnWidth: 0;
    --navTitleAlign: center;
    --navLeftAlign: flex-start;
    width: 100%;
    padding: var(--navPadding);
    box-sizing: border-box;
    /* background: var(--navBackGround); */
    display: grid;
    grid-template-columns: 1fr var(--btnWidth);
    grid-template-rows: var(--btnHeight);
    gap: 10px;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    overflow: hidden;
}

.wxc-nav-left {
    display: flex;
    align-items: center;
    justify-content: var(--navLeftAlign);
    min-width: 0;
}

.wxc-nav-left-back {
    width: var(--btnWidth);
    flex-shrink: 0;
}

.wxc-nav-center {
    display: flex;
    align-items: center;
    justify-content: var(--navTitleAlign);
    flex: 1;
}

.wxc-title-text {
    font-size: 36rpx;
    font-weight: 700;
    color: #171717
}

.topView image {
    height: 50rpx;
    width: 50rpx;
    margin-right: 10rpx;
}

.topView {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    margin: 20rpx;
    margin-right: 60rpx;
}

.topText {
    line-height: 1;
    font-size: var(--font4);
    font-family: "宋体";
    font-weight: 700;
}

.wxc-nav-opactiy {
    background: none
}
</style>