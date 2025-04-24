<template>
    <pageScroll :refresher_enabled="false" style="background-color: #fff">
        <template #nav>
            <Header title="记一笔"></Header>
        </template>
        <template #body>
            <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">

                <view class="l-account-add p-a-20">
                    <view class="flex-align-center flex-justify-between">
                        <view class="flex-align-center fontWeight blackColor" @click="showCalender = true">
                            <view class="font14 ">
                                {{ formData.accountDate_show }}
                            </view>
                            <view class="iconfont icon-you font16"></view>
                        </view>
                        <nut-popup v-model:visible="showCalender" position="bottom">
                            <nut-date-picker v-model="accountDate_date" :three-dimensional="false"
                                @confirm="chooseDate"></nut-date-picker>
                        </nut-popup>
                        <view class="flex-align-center">
                            <view v-for="item in types" :key="item.title" class="m-r-10"
                                @click="checked_type = item.value">
                                <nut-button :type="item.value != checked_type ? 'default' : 'primary'" size="small">{{
        item.title }}</nut-button>
                            </view>
                        </view>
                    </view>
                    <nut-config-provider :theme-vars="themeVars">
                        <view class="m-t-10">
                            <nut-input type="digit" v-model="formData.amount" placeholder="0.00" clearable>
                                <template #left>
                                    <view class="fontWeight blackColor font14">￥</view>
                                </template>
                            </nut-input>
                        </view>
                    </nut-config-provider>
                    <view class="m-t-10">
                        <nut-input v-model="formData.description" placeholder="添加备注..." />
                    </view>

                    <view class="flex-align-center flex-wrap m-t-10">
                        <view class="m-t-20 grid-4">
                            <view v-for="item in categories"
                                class="borderRadius20 flex-column-center flex-justify-center m-b-20"
                                @click="checked_category = item.value">
                                <view
                                    :class="['account_add_item', 'flex-center-center', 'borderRadiusMax', 'p-a-10', item.value == checked_category ? 'skinColorB' : 'tagColorB']">
                                    <view
                                        :class="'iconfont  font24 ' + item.icon + ' ' + (item.value == checked_category ? 'whiteColor ' : 'lightColor ')">
                                    </view>
                                </view>
                                <view class="m-t-10 font14 blackColor">{{ item.name }}</view>
                            </view>
                            <!-- <view class="borderRadius20 flex-column-center flex-justify-center m-b-20"
                                @click="add_custom_fl()">
                                <view
                                    :class="['account_add_item', 'flex-center-center', 'borderRadiusMax', 'p-a-10', 'tagColorB']">
                                    <view class="iconfont  font24  lightColor icon-tianjia fontWeight">
                                    </view>
                                </view>
                                <view class="m-t-10 font14 blackColor">自定义</view>
                            </view> -->
                        </view>
                    </view>

                </view>

            </view>
        </template>
        <template #footer>
            <view class="m-t-20 m-b-40">
                <view class="flex-align-center flex-justify-between m-t-20 p-a-20">
                    <nut-button type="default" class="m-t-10" @click="close" style="width: 300rpx;">
                        取消
                    </nut-button>
                    <nut-button type="primary" class="m-t-10" @click="onOk" style="width: 300rpx;">
                        确定
                    </nut-button>

                </view>
            </view>

        </template>
    </pageScroll>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
// import basedll from '../../common/basedll';
import pageScroll from '../../components/common/pageScroll.vue';
import date_formatter from '../../common/date_formatter'
import Taro from '@tarojs/taro';
interface categoriesData {
    name: string,
    value: string,
    icon?: string
}
interface AccountFormData {
    id?: string;
    amount: string;
    description: string;
    accountDate: string;
    accountDate_show: string;
}

interface AccountItem {
    id: string;
    amount: string;
    description: string;
    date: string;
    category: string;
    type: number;
}
const formData = ref<AccountFormData>({
    id: "",
    amount: '',
    description: '',
    accountDate: "",
    accountDate_show: date_formatter(new Date().getTime(), 'MM月DD日')
})
// 添加 ConfigProvider 主题配置
const themeVars = ref({
    'textarea-font': '36rpx',  // 字体大小
    'input-font-size': '40rpx'
});
const categories = ref<categoriesData[]>([]);
const checked_category = ref("food");
const checked_type = ref("expense");
const accountDate_date = ref<Date>(new Date());
const types = ref([
    {
        title: "支出",
        value: "expense"
    },
    {
        title: "收入",
        value: "income"
    }
])
const isedit = ref(false);
watch(checked_type, () => {
    getCategory();
})
const emit = defineEmits(['success'])
const add_custom_fl = () => {
    Taro.showModal({
        title: '添加自定义分类',
        content: '请输入分类名称',
        editable: true,
        placeholderText: '分类名称',
        success: (res) => {
            if (res.confirm && res.content) {
                // 调用接口添加分类
                ajax.post('/category/add', {
                    name: res.content,
                    value: res.content,
                    type: checked_type.value === 'expense' ? 0 : 1
                }).then(response => {
                    if (response.code === 200) {
                        // 刷新分类列表
                        getCategory();
                        Taro.showToast({ title: '添加成功', icon: 'success' });
                    }
                });
            }
        }
    } as any);
}
const onOk = async () => {
    if (!formData.value.amount) {
        Taro.showToast({
            title: '请输入金额',
            icon: 'error',
            duration: 2000
        });
        return;
    }
    const params = {
        id: isedit.value ? formData.value.id : undefined,
        amount: formData.value.amount,
        description: formData.value.description,
        category: checked_category.value,
        type: checked_type.value == 'expense' ? 0 : 1,
        date: formData.value.accountDate
    };

    try {
        const url = isedit.value ? '/account/update' : '/account/add';
        const res = await ajax.post(url, params);
        // debugger;
        if (res.code == 200) {
            Taro.showToast({
                title: `${isedit.value ? '编辑' : '添加'}成功`,
                icon: 'success',
                duration: 2000
            });

            // emit('success');
            // Taro.navigateBack({
            //     delta: 1,
            // });

            Taro.redirectTo({
                url: '/account/index/index'
            })
        }
        // close();
    } catch (error) {
        Taro.showToast({
            title: error.message || '操作失败',
            icon: 'error',
            duration: 2000
        });
    }
};

const getCategory = async () => {
    await ajax.checkPost();
    const globalData = Taro.getStorageSync("globalData");
    if (globalData.categories) {
        categories.value = globalData.categories[checked_type.value == 'expense' ? 0 : 1]
        checked_category.value = categories.value[0].value;
    }
}
onMounted(() => {
    const params = Taro.getCurrentInstance().router?.params;
    console.log('路由参数', params);
    if (params?.id) {
        getAccountList(params.id); // 根据实际接口需求调整参数结构
    }
    getCategory();
    formData.value.accountDate = date_formatter(new Date().getTime(), 'YYYY-MM-DD');
    console.log("formData", formData.value.accountDate);
})
// const visible = ref(false)
const showCalender = ref(false);
const getAccountList = (id) => {
    ajax.get("/account/get", {
        id,
        page: 1,
        rows: 10
    }).then((res: any) => {
        if (res.code == 200) {
            let currentItem = res.data[0];
            open(currentItem);
        }
    })
}
// const accountDate = ref(date_formatter(String(new Date()),'MM月DD日'));
const chooseDate = (e: any) => {
    console.log("e", e);
    formData.value.accountDate = e.selectedValue.join("-");
    formData.value.accountDate_show = date_formatter(new Date(formData.value.accountDate).getTime(), 'MM月DD日');
    showCalender.value = false;
}
const open = (item?: AccountItem) => {
    console.log("item111111111111", item);
    if (item) {
        isedit.value = true;
        formData.value = {
            id: item.id,
            amount: item.amount,
            description: item.description,
            accountDate: item.date,
            accountDate_show: date_formatter(new Date(item.date).getTime(), 'MM月DD日')
        }
        accountDate_date.value = new Date(item.date);
        checked_category.value = item.category;
        checked_type.value = item.type == 0 ? 'expense' : 'income';
    } else {
        // 重置表单数据
        formData.value = {
            id: "",
            amount: '',
            description: '',
            accountDate: date_formatter(new Date().getTime(), 'YYYY-MM-DD'),
            accountDate_show: date_formatter(new Date().getTime(), 'MM月DD日')
        };
        isedit.value = false;
    }
    // visible.value = true;
}
const close = () => {
    Taro.navigateBack({
        delta: 1,
    });
}
</script>

<style>
.account_add_item {
    height: 60rpx;
    width: 60rpx;
}
</style>