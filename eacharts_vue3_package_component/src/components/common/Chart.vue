<template>
  <div class="container" ref="container"></div>
</template>

<script>
import { onMounted, ref, watch, toRefs } from 'vue'
import * as echarts from 'echarts'
export default {
  name: 'Chart',
  props: {
    options: {
      required: true,
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props) {
    const { options } = toRefs(props) // options -> ref()
    const container = ref(null)
    // 为了在watch中使用 echart 实例，所以其也用ref包起来
    const chart = ref(null)
    // 需要获取DOM对象所以要在onMounted 钩子函数中
    onMounted(() => {
      chart.value = echarts.init(container.value)
      chart.value.setOption(props.options)
    })
    // 数据更新时动态更新视图
    watch(
      options,
      (newOptions) => {
        chart.value.setOption(newOptions)
      },
      { deep: true }
    )
    return { container }
  }
}
</script>

<style lang="scss" scoped>
// echart必须设置宽高才能生效
  .container {
    width: 100%;
    height: 100%;
  }
</style>
