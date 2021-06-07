<!-- 饼图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hotDom"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { get } from '../utils/request'
export default {
  name: 'Hot',
  setup () {
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const hotDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)

    function initChart () {
      chartInstance.value = echarts.init(hotDom.value, null)
      const initOption = {
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%']
          }
        ]
      }
      unwarp(chartInstance.value).setOption(initOption)
    }

    async function getData () {
      const { data } = await get('/api/data/hotproduct')
      console.log(data)
      // data = [{name: 'xx', children: [{name: 'yy'},{},{}]},{},{}]
      allData.value = data
      updateChart()
    }

    function updateChart () {
      // format data
      const legendData = allData.value[0].children.map(item => { return item.name })
      const seriesData = allData.value[0].children.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = hotDom.value.offsetWidth / 100 * 3.6
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
      hotDom
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
