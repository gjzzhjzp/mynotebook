<template>
    <nut-dialog :title="title" v-model:visible="visible1" :no-footer="true">
       <slot>{{ content }}</slot>
    </nut-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const visible1 = ref(false);
defineProps({
    content: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
});
const open = () => {
    visible1.value = true;
};
const close = () => {
    visible1.value = false;
};
defineExpose({
    open,
    close
});
</script>