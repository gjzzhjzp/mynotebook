<template>
    <pageScroll :refresher_enabled="false">
        <template #nav>
            <Header title="经期记录"></Header>
        </template>
        <template #body>
            <view class="">
                <nut-calendar-card v-model="value" @change="onChange">
                    <template #top="{ day }">
                        {{ day.date === 8 ? '☺' : '' }}
                    </template>
                    <template #default="{ day }">
                        {{ day.date <= 9 ? `0${day.date}` : day.date }} </template>
                            <template #bottom="{ day }">
                                {{ day.date === 8 ? '节日' : '' }}
                            </template>
                </nut-calendar-card>
            </view>
            <view>
                <!-- <view>月经</view> -->
                <nut-form>
                    <nut-form-item label="大姨妈来了">
                        <nut-switch v-model="formData.isaunt"></nut-switch>
                    </nut-form-item>
                    <nut-form-item label="流量">
                        <nut-rate v-model="formData.flow_level" />
                    </nut-form-item>
                    <nut-form-item label="痛经">
                        <nut-rate v-model="formData.pain_level" />
                    </nut-form-item>
                    <nut-form-item label="经期设置">
                        当前周期28天
                    </nut-form-item>
                </nut-form>
            </view>
            <!-- <view>
                <view>经期设置</view>
                <nut-form>
                    <nut-form-item label="大姨妈来了">
                        <nut-switch v-model="formData.isaunt"></nut-switch>
                    </nut-form-item>
                    <nut-form-item label="流量">
                        <nut-rate v-model="formData.flow_level" />
                    </nut-form-item>
                    <nut-form-item label="痛经">
                        <nut-rate v-model="formData.pain_level" />
                    </nut-form-item>
                </nut-form>
            </view> -->
        </template>
        <template #footer>
        </template>
    </pageScroll>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import pageScroll from '../../components/common/pageScroll.vue';
onBeforeMount(() => {

})
onMounted(() => {
    getList();
})
let page = ref<number>(1);
let total = ref<number>(0);
const value = ref(null)
let formData = ref({
    isaunt: false,
    flow_level: 5,///流量
    pain_level: 5,///痛经
})
const onChange = (val: Date) => {
    console.log(val)
}
const getList = () => {
    ajax.get("/feedback/get", {
        page: page.value,
        rows: 20
    }).then((res) => {
        if (res.code == 200) {
        }
    })
}

</script>