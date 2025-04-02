<template>
    <view class="common-actionSheet">
        <nut-action-sheet v-model:visible="show" :menu-items="menuItems" @choose="choose" />
    </view>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
const show = ref(false)

const props = defineProps({
    type: {
        type: String,
        default: "account"
    }
})
const menuItems = [
    {
        name: '编辑' + (props.type == "account" ? "账单" : "备忘录"),
        val: "update"
    },
    {
        name: '删除' + (props.type == "account" ? "账单" : "备忘录"),
        val: "delete"
    }
]
const emits = defineEmits(['update', 'delete'])
const open = () => {
    show.value = true
}
const choose = (item) => {
    if (item.val == "update") {
        emits('update')
    } else if (item.val == "delete") {
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
    } else {
        console.log("其他");
    }
}
defineExpose({
    open,
})
</script>
<style>
.common-actionSheet {
    --nut-actionsheet-item-line-height: 40px;
}
</style>