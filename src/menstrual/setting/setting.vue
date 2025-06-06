<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="经期设置"></Header>
        </template>
        <template #body>
            <view class="p-a-10">
                <nut-cell title="月经持续天数" @click="openperiod()">
                    <template #desc>
                        <view class="flex-align-center flex-justify-end blackColor fontWeight">
                            {{ period_length }}天<text class="iconfont icon-you- font14"></text>
                        </view>
                    </template>
                </nut-cell>
                <nut-cell title="月经周期" sub-title="两次月经开始日间隔几天" @click="opencycle()">
                    <template #desc>
                        <view class="flex-align-center flex-justify-end blackColor fontWeight">
                            {{ cycle_length }}天<text class="iconfont icon-you- font14"></text>
                        </view>
                    </template>
                </nut-cell>
                <nut-cell title="启用提醒">
                    <template #desc>
                        <view class="flex-align-center flex-justify-end blackColor fontWeight">
                            <nut-switch v-model="is_reminder_active" @change="changeSwitch"></nut-switch>
                        </view>
                    </template>
                </nut-cell>
                <nut-cell title="经期开始前提醒天数" v-if="is_reminder_active" @click="openremind()">
                    <template #desc>
                        <view class="flex-align-center flex-justify-end blackColor fontWeight">
                            {{ remind_before_period }}天<text class="iconfont icon-you- font14"></text>
                        </view>
                    </template>
                </nut-cell>
            </view>

            <view class=" flex-center-center">
                <nut-button type="primary" @click="updatemenstrualSetting" style="width: 690rpx;">
                    保存
                </nut-button>
            </view>
        </template>
        <template #footer>
            <nut-popup v-model:visible="showperiod" position="bottom">
                <nut-picker v-model="selectedPeriod" :columns="periodcolumns" title="" @confirm="confirmperiod"
                    @cancel="showperiod = false" />
            </nut-popup>
            <nut-popup v-model:visible="showcycle" position="bottom">
                <nut-picker v-model="selectedCycle" :columns="cyclecolumns" title="" @confirm="confirmcycle"
                    @cancel="showcycle = false" />
            </nut-popup>
            <nut-popup v-model:visible="showremind" position="bottom">
                <nut-picker v-model="selectedRemind" :columns="remindcolumns" title="" @confirm="confirmremind"
                    @cancel="showremind = false" />
            </nut-popup>
        </template>
    </pageScroll>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import { usePeriod, useCycle, useRemind } from '../../hooks/usePicker';
import Taro  from '@tarojs/taro';
onBeforeMount(() => {

})
onMounted(() => {
    getByuser();
})
const is_reminder_active = ref(false);//是否提醒
const { period_length, showperiod, selectedPeriod, periodcolumns, confirmperiod, openperiod } = usePeriod();
const { cycle_length, showcycle, selectedCycle, cyclecolumns, confirmcycle, opencycle } = useCycle();
const { remind_before_period, showremind, selectedRemind, remindcolumns, confirmremind, openremind } = useRemind();

const changeSwitch = (val: boolean) => {
    console.log(val)
    is_reminder_active.value = val;
}
const updatemenstrualSetting = () => {
    let parames = {
        "cycle_length": cycle_length.value,
        "period_length": period_length.value,
        "is_reminder_active": is_reminder_active.value,
        "remind_before_period": remind_before_period.value
    }
    ajax.post("/menstrualSetting/add", parames).then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
            Taro.navigateBack();
        }
    })
}
// 根据用户查询
const getByuser = () => {
    ajax.get("/menstrualSetting/get").then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
            if(res.data){
                cycle_length.value = res.data.cycle_length;
                period_length.value = res.data.period_length;
                remind_before_period.value = res.data.remind_before_period;
                is_reminder_active.value = !!res.data.is_reminder_active;
                selectedPeriod.value = [period_length.value+''];
                selectedCycle.value = [cycle_length.value+''];
                selectedRemind.value = [remind_before_period.value+''];
            }
        }
    })
}

</script>