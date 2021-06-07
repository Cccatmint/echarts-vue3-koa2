<!-- 商家销量趋势折线图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stockDom"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { get } from '../utils/request'
export default {
  name: 'Map',
  setup () {
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const stockDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)

    function initChart () {
      chartInstance.value = echarts.init(stockDom.value, null)
      const initOption = {}
      unwarp(chartInstance.value).setOption(initOption)
    }

    async function getData () {
      const { data } = await get('/api/data/stock')
      console.log(data)
      allData.value = data
      updateChart()
    }

    function updateChart () {
      const dataOption = {}
      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = stockDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {}
      unwarp(chartInstance.value).setOption(adapterOption)
      chartInstance.value.resize()
    }

    onMounted(() => {
      initChart()
      getData()
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
    })

    return {
      stockDom
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
