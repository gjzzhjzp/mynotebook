<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="统计">
            </Header>
        </template>
        <template #body>
            <view class="p-a-15">
                <statisticsByDate></statisticsByDate>
            </view>
        </template>
    </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
// import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import Taro from '@tarojs/taro';
import statisticsByDate from '../../components/account/statisticsByDate.vue';
onBeforeMount(() => {

})
onMounted(() => {

})
const tonext = (type) => {
    let url = "";
    switch (type) {
        case 'account':
            url = "/account/index/index"
            break;
        case 'memo':
            url = "/memo/index/index"
            break;
    }
    Taro.navigateTo({ url })
}

</script>

<style></style>