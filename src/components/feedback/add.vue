<template>
    <nut-dialog title="意见反馈" v-model:visible="visible1" @cancel="onCancel" @ok="onOk">
        <nut-textarea v-model="content" />
    </nut-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const visible1 = ref(false);
const content = ref(false);
const open = () => {
    visible1.value = true;
};
const close = () => {
    visible1.value = false;
};
const onCancel = () => {
    console.log('event cancel');
};
const onOk = () => {
    console.log('event ok');
};
defineExpose({
    open,
    close
});
</script>