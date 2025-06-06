
import { ref } from "vue";
import { period } from "../interface/memstrual";
export function usePeriod() {
    const period_length = ref(5);
    const showperiod = ref(false);
    const selectedPeriod = ref(['5']);
    let periodcolumns = ref<period[]>([]);
    for (let i = 2; i <= 14; i++) {
        periodcolumns.value.push({ text: `${i}天`, value: `${i}` })
    }
    const confirmperiod = ({ selectedValue, selectedOptions }) => {
        console.log("confirmperiod", selectedValue, selectedOptions);
        selectedPeriod.value = selectedValue;
        period_length.value = selectedValue[0];
        showperiod.value = false;
    }
    const openperiod = () => {
        showperiod.value = true;
    }
    return { period_length,showperiod, selectedPeriod, periodcolumns, confirmperiod, openperiod }
}
export function useCycle() {
    const cycle_length = ref(28);
    const showcycle = ref(false);
    const selectedCycle = ref(['28']);
    let cyclecolumns = ref<period[]>([]);
    for (let i = 15; i <= 99; i++) {
        cyclecolumns.value.push({ text: `${i}天`, value: `${i}` })
    }
    const confirmcycle = ({ selectedValue, selectedOptions }) => {
        console.log("confirmcycle", selectedValue, selectedOptions);
        selectedCycle.value = selectedValue;
        cycle_length.value = selectedValue[0];
        showcycle.value = false;
    }
    const opencycle = () => {
        showcycle.value = true;
    }
    return { cycle_length,showcycle, selectedCycle, cyclecolumns, confirmcycle, opencycle }
}
export function useRemind() {
    const remind_before_period = ref(3);
    const showremind = ref(false);
    const selectedRemind = ref(['3']);
    let remindcolumns = ref<period[]>([]);
    for (let i = 1; i <= 14; i++) {
        remindcolumns.value.push({ text: `${i}天`, value: `${i}` })
    }
    const confirmremind = ({ selectedValue, selectedOptions }) => {
        console.log("confirmremind", selectedValue, selectedOptions);
        selectedRemind.value = selectedValue;
        remind_before_period.value = selectedValue[0];
        showremind.value = false;
    }
    const openremind = () => {
        showremind.value = true;
    }
    return  { remind_before_period,showremind, selectedRemind, remindcolumns, confirmremind, openremind }
}