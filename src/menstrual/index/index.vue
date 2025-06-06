<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="经期记录"></Header>
        </template>
        <template #body>
            <view class="">
                <!-- v-model="formData.record_date" -->
                <nut-calendar-card @change="onChangeCalendar" v-model="formData.record_date">
                    <!-- <template #top="{ day }">
                        {{ day.date === 8 ? '☺' : '' }}
                    </template> -->
                    <template #default="{ day }">
                        <view
                            v-if="currentMonthRecords.includes(day.date) && day.month == currentMonth && day.year == currentYear"
                            class="menstrual-selected"><text
                                class="icon-drip-full iconfont font30 skinColor menstrual-selected-icon"></text> <text
                                class="menstrual-selected-text">{{ day.date }}</text></view>
                        <view v-else>{{ day.date }}</view>
                    </template>
                    <!-- <template #bottom="{ day }">
                                {{ day.date === 8 ? '节日' : '' }}
                            </template> -->
                </nut-calendar-card>
            </view>
            <view v-if="!futureData.isfuture">
                <nut-form>

                    <nut-form-item label="大姨妈走了" body-align="right" v-if="shouldShowOutPeriodSwitch">
                        <nut-switch v-model="formData.is_out_period" @change="changeSwitchOut"></nut-switch>
                    </nut-form-item>
                    <!-- v-else -->
                    <nut-form-item label="大姨妈来了" body-align="right">
                        <nut-switch v-model="formData.is_period" @change="changeSwitch"></nut-switch>
                    </nut-form-item>
                    <nut-form-item label="流量" body-align="right" v-if="formData.is_period">
                        <nut-rate v-model="formData.flow_level" :custom-icon="llRate" @change="onChangeFlow" />
                    </nut-form-item>
                    <nut-form-item label="痛经" body-align="right" v-if="formData.is_period">
                        <nut-rate v-model="formData.pain_level" :custom-icon="tjRate" @change="onChangePain" />
                    </nut-form-item>
                    <nut-form-item label="经期设置" body-align="right">
                        <view class="flex-align-center flex-justify-end blackColor fontWeight" @click="toSetting()">
                            当前周期{{ formData.cycle_length }}天<text class="iconfont icon-you- font14"></text>
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
import { onBeforeMount, onMounted, ref, h, computed } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
import date_formatter from '../../common/date_formatter'
import Taro from '@tarojs/taro';
interface IMenstrualPeriod {
    start_date: string,
    end_date: string,
    id: number,
}
onBeforeMount(() => {

})
onMounted(() => {
    getMonthlyRecords();
    getMonthlyMenstrualPeriod();
    getByDate();
    getByuser();
})
// 未来的数据
let futureData = ref({
    isfuture: false,///是否未来
    isjq: false,///是否经期
    isyyq: false,///是否易孕期
});
let formData = ref({
    record_date: new Date(),///记录日期
    is_period: false,////是否来大姨妈
    is_out_period: false,///是否出经期
    flow_level: 0,///流量
    pain_level: 0,///痛经
    cycle_length: 28,
    period_length: 5,
})
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const currentMonthRecords = ref([1]);///当月处于经期的日期
const menstrualPeriod = ref<IMenstrualPeriod[]>([]);///已有的经期周期
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
    updatemenstrualPeriod();
    // updatemenstrual({
    //     is_period: val,
    // });
}
// 大姨妈走了，改变经期表的结束日期
const changeSwitchOut = (val: boolean) => {
    console.log(val)
    // updatemenstrual({
    //     is_out_period: val,
    // });
}
const onChangeFlow = (val: number) => {
    console.log(val)
    updatemenstrual({
        flow_level: val,
    });
}
const onChangePain = (val: number) => {
    console.log(val)
    updatemenstrual({
        pain_level: val,
    });
}
const updatemenstrual = (parames) => {
    parames.record_date = date_formatter(formData.value.record_date, 'YYYY-MM-dd');
    console.log("parames", parames);
    ajax.post("/menstrual/add", parames).then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
        }
    })
}
// 更新周期
const updatemenstrualPeriod = () => {
    const start_date = date_formatter(formData.value.record_date, 'YYYY-MM-dd');
    const periodLength = formData.value.period_length || 5; // 默认5天
    let endDate = new Date(formData.value.record_date);
    endDate.setDate(endDate.getDate() + periodLength - 1);
    let endDateStr = date_formatter(endDate, 'YYYY-MM-dd');
    ajax.post("/menstrualPeriod/add", {
        start_date,
        end_date: endDateStr,
    }).then((res) => {
        if (res.code == 200) {
            console.log("updatemenstrualPeriod成功", res.data);
            menstrualPeriod.value.push({
                start_date: res.data.start_date,
                end_date: res.data.end_date,
                id: res.data.id
            });
            getMonthlyRecords();
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
                formData.value.flow_level = res.data.flow_level;
                formData.value.pain_level = res.data.pain_level;
            } else {
                formData.value.flow_level = 0;
                formData.value.pain_level = 0;
            }
            console.log("操作成功", formData.value);
        }
    })
}
const getByuser = () => {
    ajax.get("/menstrualSetting/get").then((res) => {
        if (res.code == 200) {
            console.log("操作成功", res);
            if (res.data) {
                formData.value.cycle_length = res.data.cycle_length;
                formData.value.period_length = res.data.period_length;
            }
        }
    })
}
// 按月获取数据
const getMonthlyRecords = () => {
    ajax.get("/menstrual/getMonthlyRecords", {
        year: currentYear.value,
        month: currentMonth.value,
    }).then((res) => {
        if (res.code == 200) {

            currentMonthRecords.value = res.data.map(dateStr => {
                return parseInt(dateStr.split('-')[2]); // 提取"2"、"3"等日期部分
            });
            console.log("操作成功getMonthlyRecords", currentMonthRecords.value);
        }
    })
}
// 获取当月的周期记录
const getMonthlyMenstrualPeriod = () => {
    ajax.get("/menstrualPeriod/getMonthlyRecords", {
        year: currentYear.value,
        month: currentMonth.value,
    }).then((res) => {
        if (res.code == 200) {
            menstrualPeriod.value = res.data;
            console.log("操作成功getMonthlyMenstrualPeriod", menstrualPeriod.value);
        }
    })
}
// 新增计算属性
const shouldShowPeriodSwitch = computed(() => {
    const currentDate = formData.value.record_date.getDate();

    // 如果不在经期记录中，且不在经期结束5天内，显示"大姨妈来了"
    if (!currentMonthRecords.value.includes(currentDate)) {
        const lastPeriodDay = Math.max(...currentMonthRecords.value);
        return currentDate > lastPeriodDay + 5;
    }
    return false;
});

const shouldShowOutPeriodSwitch = computed(() => {
    const currentDate = formData.value.record_date.getDate();

    // 如果在经期记录中，但不是第一天，或者是在经期结束5天内，显示"大姨妈走了"
    if (currentMonthRecords.value.includes(currentDate)) {
        const firstDay = Math.min(...currentMonthRecords.value);
        return currentDate !== firstDay; // 不是第一天就显示"走了"
    } else {
        const lastPeriodDay = Math.max(...currentMonthRecords.value);
        return currentDate > lastPeriodDay && currentDate <= lastPeriodDay + 5;
    }
});
</script>
<style>
.menstrual-selected {
    position: relative;
}

.menstrual-selected-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24rpx;
    color: #fff;
}
</style>