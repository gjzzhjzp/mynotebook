<template>
    <view :class="['er-page-scroll', isAbsolute ? 'er-page-scroll-absolute' : '']">
        <view :class="['er-page-scroll-nav', autoHeight ? '' : 'page-no-auto-height']">
            <slot name="nav"></slot>
        </view>
        <scroll-view class="er-page-scroll-view" :scroll-y="scrollY" :refresher-triggered="refreshering"
            :scroll-with-animation="scrollWithAnimation" :refresherEnabled="refresher_enabled"
            @refresherrefresh="refresherrefresh" :lower-threshold="lower_threshold" @refresherabort="refresherabort"
            @scrolltolower="scrolltolower" @refresherpulling="refresherpulling" :enhanced="true"
            :enable-back-to-top="backTop" :scroll-top="scrollTop" @dragging="dragging" @scroll="bindscroll">
            <slot name="body"></slot>
        </scroll-view>
        <view :class="['er-page-scroll-footer', autoHeight ? 'er-page-auto-footer' : '']"
            :style="{ bottom: footBottom + 'px' }">
            <slot name="footer"></slot>
        </view>
        <view :class="['er-page-scroll-back', autoHeight ? '' : 'page-no-auto-height']">
            <view class="er-page-scroll-backicon" v-if="showarrow" @click="goTop"><mp-icon icon="arrow"></mp-icon>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Taro from '@tarojs/taro';
const showarrow = ref(false);
const scrollTop = ref(0);
const props = defineProps({
    scrollY: {
        type: Boolean,
        default: true,
    },
    eroptions: {
        type: Object,
        default: {},
    },
    refresher_enabled: {
        type: Boolean,
        default: true,
    },
    loading_enabled: {
        type: Boolean,
        default: true,
    },
    refreshering: {
        type: Boolean,
        default: false,
    },
    lower_threshold: {
        type: [Number, String],
        default: 50,
    },
    isAbsolute: {
        type: Boolean,
        default: false,
    },
    scrollWithAnimation: {
        type: Boolean,
        default: false,
    },
    openArrow: {
        type: Boolean,
        default: false,
    },
    autoHeight: {
        type: Boolean,
        default: true,
    },
    backTop: {
        type: Boolean,
        default: true,
    },
    footBottom: {
        type: Number,
        default: 0
    }
})
console.log("props", props);
const emit = defineEmits(['refresh', 'lower', 'scroll']);
const scrolltolower = () => {
    console.log("scrolltolower")
    if (!props.loading_enabled) return;
    emit("lower");
}
const refresherpulling = () => {

}
const refresherrefresh = () => {
    console.log("refresherrefresh")
    if (!props.refresher_enabled) return;
    emit("refresh");
}
const refresherabort = () => {
    // console.log("abort")
}
const bindscroll = (e) => {
    emit("scroll", e.detail);
}
const dragging = (e) => {
    if (!props.openArrow) return;
    if (!props.loading_enabled) return;
    const stop = e.detail.scrollTop;
    const query = Taro.createSelectorQuery()
    query.select('.er-page-scroll').boundingClientRect()
    // query.selectViewport().scrollOffset()
    query.exec(function (res) {
        if (stop >= res.height) {
            showarrow.value = true;

        } else {
            showarrow.value = false;

        }
    })

}
const goTop = () => {
    showarrow.value = false;
    scrollTop.value = 0;
}
const setScrollTop = (top) => {
    scrollTop.value = top;
}
defineExpose({
    setScrollTop
})
</script>
<style lang="scss">
.er-page-scroll{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.er-page-scroll, .er-page-scroll-view{
    flex: 1;
    position:relative;
    overflow: hidden;
}
.er-page-scroll-back{
    position:absolute;
    bottom:0;
    right:0;
    margin-right:40rpx;
    margin-bottom:80rpx;
}
.er-page-scroll-backicon{
    background:rgba(255,255,255,0.5);
    box-shadow:-8rpx 0 20rpx rgba(0,0,0,0.16);
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    transform: rotate(-90deg);
    line-height: 76rpx;
    text-align: center;
}

.er-page-scroll-absolute .er-page-scroll-nav{
    position: sticky;
    left:0;
    top:0;
    right:0;
    z-index: 10;
}
.er-page-scroll-footer.er-page-auto-footer{
    position: sticky;
    bottom:0;
    z-index: 99;
}
</style>