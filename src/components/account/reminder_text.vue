<template>
    <help ref="helpRef" title="订阅提醒">
        <template #default>
            <view class="font14">
                <view class="text-left m-b-10">
                    记账日报：每天10点推送昨日账单
                </view>
                <view class="text-left m-b-10">
                    每日额度：设置每日花费上限，超支提醒
                </view>
                <view class="text-left m-b-10">
                    每月额度：设置每月花费上限，超支提醒
                </view>
                <view class="text-left m-b-10">
                    每年额度：设置每年花费上限，超支提醒
                </view>
            </view>

        </template>
    </help>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import help from '../common/help.vue'
const helpRef = ref();


const open = () => {
    console.log("3")
    helpRef.value.open();
}
const close = () => {
    helpRef.value.close();
}



defineExpose({
    open,
    close
})
</script>
<style>
.account-add-container {
    --nut-grid-item-content-padding: "0px 0px 0px 0px";
}

.nut-cell-group__wrap {
    box-shadow: 0px !important;
}
</style>