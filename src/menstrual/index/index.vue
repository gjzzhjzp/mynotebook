<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="经期记录"></Header>
        </template>
        <template #body>
            <view class="">
                <nut-calendar-card v-model="formData.record_date" @change="onChangeCalendar">
                    <!-- <template #top="{ day }">
                        {{ day.date === 8 ? '☺' : '' }}
                    </template>
<template #default="{ day }">
                        {{ day.date <= 9 ? `0${day.date}` : day.date }} </template>
<template #bottom="{ day }">
                                {{ day.date === 8 ? '节日' : '' }}
                            </template> -->
                </nut-calendar-card>
            </view>
            <view v-if="!futureData.isfuture">
                <nut-form>
                    <nut-form-item label="大姨妈来了" body-align="right">
                        <nut-switch v-model="formData.is_period" @change="changeSwitch"></nut-switch>
                    </nut-form-item>
                    <nut-form-item label="流量" body-align="right">
                        <nut-rate v-model="formData.flow_level" :custom-icon="llRate" />
                    </nut-form-item>
                    <nut-form-item label="痛经" body-align="right">
                        <nut-rate v-model="formData.pain_level" :custom-icon="tjRate" />
                    </nut-form-item>
                    <nut-form-item label="经期设置" body-align="right">
                        <view class="flex-align-center flex-justify-end blackColor fontWeight" @click="toSetting()">
                            当前周期28天<text class="iconfont icon-you- font14"></text>
                        </view>
                    </nut-form-item>
                </nut-form>
            </view>
            <view class="flex-column-center p-a-20" v-else>
                <view class="font16 fontWeight blackColor">推算当日处于经期</view>
                <view class="font10 m-t-10">不能记录未来</view>
            </view>
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
import Taro from '@tarojs/taro';
onBeforeMount(() => {

})
onMounted(() => {
    getByDate();
})
// 未来的数据
let futureData = ref({
    isfuture: false,///是否未来
    isjq: false,///是否经期
    isyyq: false,///是否易孕期
});
let formData = ref({
    record_date: new Date(),///记录日期
    is_period: false,
    flow_level: 0,///流量
    pain_level: 0,///痛经
})
const llRate = h(
    'div', // type
    { id: 'llRate', class: 'iconfont icon-drip-full font16' }
)
const tjRate = h(
    'div', // type
    { id: 'tjRate', class: 'iconfont icon-shandian1 font16' }
)
const toSetting = () => {
    Taro.navigateTo({
        url: '/menstrual/setting/setting'
    })
}
// 改变日历
const onChangeCalendar = (val: Date) => {
    formData.value.record_date = val;
     // 新增日期校验逻辑
     const today = new Date();
    today.setHours(0, 0, 0, 0); // 清除时间部分
    const selectedDate = new Date(val);
    selectedDate.setHours(0, 0, 0, 0);
    
    futureData.value.isfuture = selectedDate > today;
    getByDate();
}
// 改变是否来大姨妈
const changeSwitch = (val: boolean) => {
    console.log(val)

    updatemenstrual({
        is_period: val,
    });
}
const updatemenstrual = (parames) => {
    // parames={
    //     "record_date": "2023-11-15",
    //     "is_period": true,
    //     "flow_level": 5,
    //     "pain_level": 3,
    //     "mood": "平静"
    // }
    parames.record_date = date_formatter(formData.value.record_date, 'YYYY-MM-dd');
    console.log("parames", parames);
    ajax.post("/menstrual/add", parames).then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
        }
    })
}
// 根据日期查询
const getByDate = () => {
    ajax.get("/menstrual/getByDate", {
        date: date_formatter(formData.value.record_date, 'YYYY-MM-dd'),
    }).then((res) => {
        if (res.code == 200) {
            if (res.data) {
                formData.value.is_period = !!res.data.is_period;
                formData.value.flow_level = res.data.flow_level;
                formData.value.pain_level = res.data.pain_level;
            } else {
                formData.value.is_period = false;
                formData.value.flow_level = 0;
                formData.value.pain_level = 0;
            }
            console.log("操作成功", formData.value);
        }
    })
}

</script>