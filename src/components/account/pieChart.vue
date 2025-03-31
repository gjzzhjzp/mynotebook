// 柱状图
<template>
  <view class="bar-chart">
    <e-chart ref="vueref0" canvas-id="bar-canvas" />
    <!-- <button @click="refresh">刷新</button> -->
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
      defaultOption: {}
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    list() {
      this.defaultOption = {
        tooltip: {
          trigger: 'item'
        },
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: ['40%', '70%'],
            label: {  // 新增标签配置
              show: true,
              formatter: '{b}: {d}%',  // 显示名称和百分比
              color: '#333',
              fontSize: 12
            },
            labelLine: {  // 标签引导线配置
              show: true,
              length: 10,
              length2: 15
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            data: this.list
          }
        ]
      }
      setTimeout(() => {
        this.$refs.vueref0.refresh(this.defaultOption)
      }, 200);
    }
  },
  mounted() {
    // Taro.nextTick(() => {
    //   setTimeout(() => {
    //     this.$refs.vueref0.refresh(this.defaultOption)
    //   }, 200);
    // })
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