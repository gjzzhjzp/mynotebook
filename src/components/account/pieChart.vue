// 柱状图
<template>
  <view class="bar-chart">
    <e-chart ref="vueref0" canvas-id="bar-canvas" />
    <button @click="refresh">刷新</button>
  </view>
</template>

<script lang="js">
import Taro from "@tarojs/taro";
import { EChart } from 'echarts-taro3-vue'

export default {
  name: 'Bar',
  components: { EChart },
  data() {
    return {
      defaultOption: {
        tooltip: {
          trigger: 'item'
        },
        color:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: ['40%', '70%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            data: [
              { value: 1048, name: '餐饮' },
              { value: 735, name: '交通' },
              { value: 580, name: '购物' },
              { value: 484, name: '娱乐' },
              { value: 300, name: '其他' }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    Taro.nextTick(() => {
      setTimeout(() => {
        this.$refs.vueref0.refresh(this.defaultOption)
      }, 2000);

    })
  },
  methods: {
    refresh(data) {
      this.$refs.vueref0.refresh(this.defaultOption)
    }
  }
}
</script>

<style lang="scss">
.bar-chart {
  width: 100%;
  min-height: 500rpx;
  flex: 1;
}

.ec-canvas {
  height: 500rpx;
}
</style>