<template>
    <view class="common-actionSheet">
        <nut-popup v-model:visible="show" position="bottom" :round="true">
            <view class="p-t-10 m-b-20">
                <view class="p-a-15 flex-center-center font16 blackColor" v-for="(item) in menuItems" :key="item.val"
                    @click="choose(item)">
                    {{ item.name }}
                </view>
            </view>
        </nut-popup>
        <!-- <nut-action-sheet v-model:visible="show" :menu-items="menuItems" @choose="choose" /> -->
    </view>


</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
const show = ref(false)

const props = defineProps({
    type: {
        type: String,
        default: "account"
    },
    text: {
        type: String,
        default: "账单"
    }
})

let menuItems = ref([
    {
        name: '编辑' + props.text,
        val: "update"
    },
    {
        name: '删除' + props.text,
        val: "delete"
    }
])
onMounted(() => {
    if (props.type == "memo") {
        menuItems.value.push({
            name: "设为已办",
            val: "complate"
        })
    }
})
const emits = defineEmits(['update', 'delete', 'complate'])
const open = () => {
    show.value = true
}
const close = () => {
    show.value = false
}
const choose = (item) => {
    if (item.val == "update") {
        emits('update')
    } else if (item.val == "complate") {
        emits('complate')
    } else if (item.val == "delete") {
        if (props.type == "memo") {
            emits('delete')
        } else {
            Taro.showModal({
                title: '提示',
                content: '确认删除？',
                success: function (res) {
                    if (res.confirm) {
                        emits('delete')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }

    } else {
        console.log("其他");
    }
}
defineExpose({
    open,
    close
})
</script>
<style></style>