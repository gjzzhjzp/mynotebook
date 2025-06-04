<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="经期设置"></Header>
        </template>
        <template #body>
            <nut-form>
                <nut-form-item label="月经持续天数" body-align="right">
                    <view class="flex-align-center flex-justify-end blackColor fontWeight">
                        {{ formData.period_length }}天<text class="iconfont icon-you- font14"></text>
                    </view>
                </nut-form-item>
                <nut-form-item label="月经周期" body-align="right">
                    <view class="flex-align-center flex-justify-end blackColor fontWeight">
                        {{ formData.cycle_length }}天<text class="iconfont icon-you- font14"></text>
                    </view>
                </nut-form-item>
                <nut-form-item label="启用提醒" body-align="right">
                    <view class="flex-align-center flex-justify-end blackColor fontWeight">
                        <nut-switch v-model="formData.is_reminder_active" @change="changeSwitch"></nut-switch>
                    </view>
                </nut-form-item>
                <nut-form-item label="经期开始前提醒天数" label-width="200px" body-align="right" v-if="formData.is_reminder_active">
                    <view class="flex-align-center flex-justify-end blackColor fontWeight">
                        {{ formData.remind_before_period }}天<text class="iconfont icon-you- font14"></text>
                    </view>
                </nut-form-item>
            </nut-form>
            <nut-button type="primary" class="m-t-20 m-l-30" @click="onOk" style="width: 690rpx;">
                        保存
                    </nut-button>
        </template>
        <template #footer>
        </template>
    </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, h } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import date_formatter from '../../common/date_formatter'
onBeforeMount(() => {

})
onMounted(() => {
    getByDate();
})
let formData = ref({
    cycle_length: 28,///周期
    period_length: 5,///经期天数
    is_reminder_active: false,///是否提醒
    remind_before_period:3
})
const onOk = () => {
    console.log("formData", formData.value)
    updatemenstrual(formData.value)
}
const changeSwitch = (val: boolean) => {
    console.log(val)

    // updatemenstrual({
    //     is_period: val,
    // });
}
const updatemenstrual = (parames) => {
    // parames={
    //     "record_date": "2023-11-15",
    //     "is_period": true,
    //     "flow_level": 5,
    //     "pain_level": 3,
    //     "mood": "平静"
    // }
    console.log("parames", parames);
    ajax.post("/menstrual/add", parames).then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
        }
    })
}
// 根据日期查询
const getByDate = () => {
}

</script>