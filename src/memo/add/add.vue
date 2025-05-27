<template>

    <pageScroll :refresher_enabled="false" style="background-color: #fff">
        <template #nav>
            <Header :title="(isedit ? '编辑' : '新建') + '备忘录'"></Header>
        </template>
        <template #body>
            <nut-config-provider :theme-vars="themeVars">
                <view class=" account-add-container flex-column-left flex-justify-between" style="height: 100%;">
                    <view class="l-account-add m-t-20" style="height: 100%;">
                        <nut-input v-model="formData.title" placeholder="标题" />
                        <nut-textarea v-model="formData.content" class="custom-textarea" placeholder="开始输入内容..." />
                    </view>
                </view>

            </nut-config-provider>
        </template>
        <template #footer>
            <view class="m-t-20 p-a-20 m-b-40">
                <view class="grid-3 gap10 m-b-20 bb-line-1" v-if="formData.previewImages.length > 0">
                    <view class="memo-image" v-for="(item, index) in formData.previewImages">
                        <image :src="item" class="borderRadius10" mode="aspectFill" style="width: 100%;height: 220rpx">
                        </image>
                        <view class="iconfont icon-close font20 whiteColor" @click="deleteImage(index)"></view>
                    </view>
                </view>
                <view class="flex-align-center flex-justify-between p-t-15 p-b-15 bb-line-1" @click="checkImage()">
                    <view class="flex-align-center" style="width: 200rpx;">
                        <view class="font16 iconfont icon-shangchuantupian m-r-5 skinColor"></view>
                        <view>添加图片</view>
                    </view>
                    <view class="iconfont icon-you- font16 skinColor">
                    </view>
                </view>
                <view class="flex-align-center flex-justify-between p-t-15 p-b-15 bb-line-1 m-b-15">
                    <view class="flex-align-center" style="width: 200rpx;">
                        <view class="font16 iconfont icon-shijian m-r-5 skinColor"></view>
                        <view>提醒时间</view>
                    </view>
                    <view>
                        <view class="skinColor" @click="showCalender = true">{{ formData.reminder_time_show ||
        "选择时间" }}
                        </view>
                        <nut-popup v-model:visible="showCalender" position="bottom">
                            <nut-date-picker v-model="formData.reminder_time" type="datetime" :min-date="minDate"
                                :three-dimensional="false" @confirm="chooseDate"></nut-date-picker>
                        </nut-popup>

                    </view>
                </view>

                <view class="flex-align-center flex-justify-between ">
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
import { onMounted, ref, inject } from 'vue';
import ajax from '../../common/ajax';
import Header from '../../components/common/Header.vue';
import basedll from '../../common/basedll';
import pageScroll from '../../components/common/pageScroll.vue';
import date_formatter from '../../common/date_formatter'
import Taro from '@tarojs/taro';
interface FormData {
    id?: number | string,
    title: string,
    content: string,
    reminder_time?: string | number | Date,
    reminder_time_show?: string | number | Date,
    previewImages: string[]
}
const formData = ref<FormData>({
    id: "",
    title: "",
    content: '',
    reminder_time: "",
    reminder_time_show: "",
    previewImages: [],///预览图片
})
// 添加 ConfigProvider 主题配置
const themeVars = ref({
    'textarea-font': '32rpx',  // 字体大小
    'input-font-size': '36rpx'
});
const globalData = ref(Taro.getStorageSync("globalData"));
const showCalender = ref(false);
const minDate = new Date();
const isedit = ref(false);
const emit = defineEmits(['success'])
const chooseDate = (e: any) => {
    console.log("e", e, formData.value.reminder_time);
    // formData.value.reminder_time = e.selectedValue.join("-");
    formData.value.reminder_time_show = date_formatter(formData.value.reminder_time as Date, 'yyyy-MM-dd hh:mm');
    showCalender.value = false;
}
// 在脚本部分添加删除方法
const deleteImage = (index: number) => {
    formData.value.previewImages.splice(index, 1);
}

// 选择图片上传
const checkImage = () => {
    if (formData.value.previewImages.length >= 3) {
        Taro.showToast({
            title: '最多只能上传3张图片',
            icon: 'error',
            duration: 2000
        });
        return;
    }
    Taro.chooseImage({
        count: 3 - formData.value.previewImages.length, // 默认3
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            console.log("res", res);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            formData.value.previewImages = formData.value.previewImages.concat(tempFilePaths);
            console.log("tempFilePaths", tempFilePaths, formData.value);
        }
    })
}
const onOk = async () => {
    if (!formData.value.title) {
        Taro.showToast({
            title: '请输入标题',
            icon: 'error',
            duration: 2000
        });
        return;
    }
    let params = {
        title: formData.value.title,
        content: formData.value.content,
        previewImages: formData.value.previewImages,
        image: ""
    } as FormData
    console.log("params", params, formData.value);
    if (formData.value.reminder_time_show) {
        params.reminder_time = date_formatter(formData.value.reminder_time as Date, 'yyyy-MM-dd hh:mm:ss');
        let tmplIds = [globalData.value.tmplIds.memo];
        const r_result = await basedll.requestSubscribeMessage(tmplIds);
        console.log("r_result", r_result);
        if (!r_result) {
            Taro.showToast({
                title: '备忘录提醒开启失败',
                icon: 'error',
                duration: 2000
            });
            return;
        }
    }
    let url = '/memos/add';
    if (isedit.value) {
        url = '/memos/update';
        params.id = formData.value.id;
    } else {
        delete params.id;
    }
    if (params.previewImages.length > 0) {
        // 分离新旧图片
        const oldImages = params.previewImages
            .filter(item => item.includes(globalData.value.image_dns))
            .map(item => item.replace(globalData.value.image_dns, ''));

        const newImages = params.previewImages
            .filter(item => !item.includes(globalData.value.image_dns));
        // 仅上传新图片
        const uploadTasks = newImages.map(ajax.uploadImage);
        const uploaded = (await Promise.all(uploadTasks)).filter(url => url);

        // 合并图片路径（旧路径直接取数据库存储值，新路径拼接域名）
        params.image = [
            ...oldImages,
            ...uploaded.map(url => url.replace(globalData.value.image_dns, ''))
        ].join(',');
        console.log("params.previewImages", params.image)
    }
    // return;
    ajax.post(url, params).then(res => {
        console.log("res", res);
        if (res.code == 200) {
            Taro.showToast({
                title: (isedit.value ? '编辑' : '添加') + '成功',
                icon: 'success',
                duration: 2000
            });
        } else {
            Taro.showToast({
                title: res.message as string,
                icon: 'error',
                duration: 2000
            });
        }
        emit('success');
        // close();
        Taro.redirectTo({
            url: '/memo/index/index'
        })
    })
}

onMounted(() => {
    const params = Taro.getCurrentInstance().router?.params;
    console.log('路由参数', params);
    if (params?.id) {
        isedit.value = true;
        getList(params.id); // 根据实际接口需求调整参数结构
    }

})
// const visible = ref(false)
const getList = (id) => {
    ajax.get("/memos/list", {
        id: id,
        page: 1,
        rows: 1
    }).then((res) => {
        if (res.code == 200) {
            let currentItem = res.data[0];
            if (currentItem.image) {
                currentItem.previewImages = currentItem.image.split(",").map(item => globalData.value.image_dns + item);
            } else {
                currentItem.previewImages = [];
            }
            open(currentItem);
        }
    })
}
const open = (item) => {
    console.log("item111111111111", item);
    if (item) {
        isedit.value = true;
        formData.value = {
            id: item.id,
            title: item.title,
            content: item.content,
            image: "",
            previewImages: item.previewImages,
            reminder_time: item.reminder_time || "",
            reminder_time_show: item.reminder_time ? date_formatter(item.reminder_time, 'yyyy-MM-dd hh:mm') : ""
        }
    } else {
        isedit.value = false;
        formData.value = {
            id: "",
            title: "",
            content: '',
            image: "",
            previewImages: [],
            reminder_time: "",
            reminder_time_show: ""
        }
    }
    // visible.value = true;
}
const close = () => {
    // visible.value = false;
    Taro.navigateBack({
        delta: 1,
    });
}
</script>

<style>
/* .custom-textarea.nut-textarea__textarea {
    font-size: var(--nut-textarea-font, var(--nut-font-size-2, 14rpx));
    line-height: 1.6;
    padding: 20rpx;
    min-height: 400rpx;
  } */
.memo-image {
    position: relative;
}

.memo-image .iconfont {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
}
</style>