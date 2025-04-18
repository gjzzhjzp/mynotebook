<template>
    <view class=" flex-align-center flex-justify-between">
        <nut-popover v-model:visible="showSearchType" :list="searchlist" location="bottom-start" @choose="chooseSearch"
            :offset="[0, -70]">
            <template #reference>
                <view class="flex-align-center fontWeight blackColor">
                    <view class="font14 ">
                        {{ searchlist[checkSearchType].name }}
                    </view>
                    <view class="iconfont icon-you font16"></view>
                </view>
            </template>
        </nut-popover>
        <view class="">
            <view class="font14 blackColor fontWeight flex-align-center" @click="showCalender = true">
                <view>{{ [thismonth.yearshow, thismonth.monthShow, thismonth.dayshow][checkSearchType] }}
                </view>
                <view class="iconfont icon-you font16"></view>
            </view>
            <nut-popup v-model:visible="showCalender" position="bottom">
                <yearPicker v-if="checkSearchType == 0" :val="[selectedDate.year]" @confirm="chooseDateYear"></yearPicker>
                <nut-date-picker v-else-if="checkSearchType == 1" :max-date="new Date()" type="year-month"
                    v-model="thismonth.month" :three-dimensional="false" @confirm="chooseDate"></nut-date-picker>
                <nut-date-picker v-else-if="checkSearchType == 2" :max-date="new Date()" type="date"
                    v-model="thismonth.day" :three-dimensional="false" @confirm="chooseDate"></nut-date-picker>
            </nut-popup>
        </view>
    </view>
</template>
<script setup lang="ts">
import date_formatter from '../../common/date_formatter'
import { ref, reactive, onMounted, watch } from 'vue';
import yearPicker from "./yearPicker.vue"
const showSearchType = ref(false);
const showCalender = ref(false);
const thismonth = ref({
    year: new Date(),
    yearshow: date_formatter(new Date(), 'yyyy年'),
    month: new Date(),
    monthShow: date_formatter(new Date(), 'yyyy年MM月'),
    day: new Date(),
    dayshow: date_formatter(new Date(), 'yyyy年MM月dd日')
})
const searchlist = ref([
    {
        name: '按年查询',
        value: 0
    },
    {
        name: '按月查询',
        value: 1
    },
    {
        name: '按天查询',
        value: 2
    }
])
// 已选中的日期
const selectedDate = ref({
    year: new Date().getFullYear() || 0,
    month: new Date().getMonth() + 1 || 0,
    day: 0
})
const checkSearchType = ref(1);
const emit = defineEmits(['search'])
const chooseSearch = (item) => {
    console.log("chooseSearch", item);
    checkSearchType.value = item.value;
    if (item.value == 0) {
        selectedDate.value.month = 0;
        selectedDate.value.day = 0;
        thismonth.value.year = new Date();
        thismonth.value.yearshow = date_formatter(new Date(), 'yyyy年');
    } else if (item.value == 1) {
        selectedDate.value.month = new Date().getMonth() + 1
        selectedDate.value.day = 0;
        thismonth.value.month = new Date()
        thismonth.value.monthShow = date_formatter(new Date(), 'yyyy年MM月');
    } else if (item.value == 2) {
        selectedDate.value.month = new Date().getMonth() + 1;
        selectedDate.value.day = new Date().getDate();
        thismonth.value.day = new Date();
        thismonth.value.dayshow = date_formatter(new Date(), 'yyyy年MM月dd日');
    }
    emit('search', {
        checkSearchType: checkSearchType.value,
        selectedDate:selectedDate.value
    })
}
const chooseDate = (e: any) => {
    console.log("e", e);
    selectedDate.value.year = e.selectedValue[0];
    selectedDate.value.month = e.selectedValue[1];
    selectedDate.value.day = e.selectedValue[2];
    thismonth.value.year = new Date(e.selectedValue[0]);
    thismonth.value.yearshow = date_formatter(new Date(e.selectedValue[0],0,1), 'yyyy年');
    thismonth.value.month = new Date(e.selectedValue[0])
    thismonth.value.monthShow = date_formatter(new Date(e.selectedValue[0], e.selectedValue[1] - 1,1), 'yyyy年MM月');
    thismonth.value.day = new Date(e.selectedValue[0], e.selectedValue[1] - 1, e.selectedValue[2]);
    thismonth.value.dayshow = date_formatter(new Date(e.selectedValue[0], e.selectedValue[1] - 1, e.selectedValue[2]), 'yyyy年MM月dd日');
    showCalender.value = false;
    emit('search', {
        checkSearchType: checkSearchType.value,
        selectedDate:selectedDate.value
    })
}
const chooseDateYear=(e)=> {
    console.log("e", e);
    // debugger;
    selectedDate.value.year = e;
    selectedDate.value.month = 0;
    selectedDate.value.day =0;
    thismonth.value.year = new Date(e);
    thismonth.value.yearshow = date_formatter(new Date(e,0,1), 'yyyy年');
    showCalender.value = false;
    emit('search', {
        checkSearchType: checkSearchType.value,
        selectedDate:selectedDate.value
    })
}
</script>