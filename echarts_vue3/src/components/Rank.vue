<!-- 商家销量排行 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rankDom"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, reactive, inject } from 'vue'
import * as echarts from 'echarts'
// import { get } from '../utils/request'
export default {
  name: 'Rank',
  setup () {
    // 获取socket实例
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调函数
    SocketServiceInstance.registerCallBack('rankData', getData)
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const rankDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)
    const colorArr = [
      ['#47597e', '#5e8b7e'],
      ['#b2ab8c', '#dfeeea'],
      ['#a7c4bc', '#dbe6fd']
    ]
    const zoomArr = reactive({ startValue: 0, endValue: 9, timerId: null }) // 图表区域缩放的起点值和终点值，利用定时器实现动画效果

    function initChart () {
      chartInstance.value = echarts.init(rankDom.value, null)
      const initOption = {
        title: {
          text: '商家销量排行',
          top: 20,
          left: 20,
          textStyle: {
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        grid: {
          top: '40%',
          right: '5%',
          bottom: '5%',
          left: '5%',
          containLabel: true
        },
        axisLabel: {
          color: '#fff'
        },
        tooltip: {},
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      unwarp(chartInstance.value).setOption(initOption)
      unwarp(chartInstance.value).on('mouseover', () => { clearInterval(zoomArr.timerId) })
      unwarp(chartInstance.value).on('mouseout', () => { startInterval() })
    }

    // async function getData () {
    function getData (data) {
      // const { data } = await get('/api/data/rank')
      allData.value = data
      // data = [{ name: 'xx省', value: 230 }, ... ]
      allData.value.sort((a, b) => {
        return -a.value + b.value
      })
      updateChart()
      startInterval()
    }

    function updateChart () {
      // provinceArr = ['xx省', 'xx省, ... ]
      const provinceArr = allData.value.map(item => {
        return item.name
      })
      // valueArr = [ 230, 140, ... ]
      const valueArr = allData.value.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        // 区域缩放
        dataZoom: {
          show: false,
          startValue: zoomArr.startValue,
          endValue: zoomArr.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColor = null
                if (arg.data > 230) {
                  targetColor = colorArr[0]
                } else if (arg.data > 120) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              }
            }
          }

        ]
      }
      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = rankDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize.value
          }
        },
        series: [
          {
            barWidth: titleFontSize.value * 2,
            itemStyle: {
              borderRadius: [titleFontSize.value, titleFontSize.value, 0, 0]
            }
          }
        ]
      }
      unwarp(chartInstance.value).setOption(adapterOption)
      chartInstance.value.resize()
    }
    // 动画相关定时器
    function startInterval () {
      if (zoomArr.timerId) { clearInterval(zoomArr.timerId) }
      zoomArr.timerId = setInterval(() => {
        zoomArr.startValue++
        zoomArr.endValue++
        // 边界判断
        if (zoomArr.endValue > allData.value.length - 1) {
          zoomArr.startValue = 0
          zoomArr.endValue = 9
        }
        updateChart()
      }, 2000)
    }

    onMounted(() => {
      initChart()
      // getData()
      SocketServiceInstance.send({
        action: 'getData',
        socketType: 'rankData',
        chartName: 'rank',
        value: ''
      })
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
      clearInterval(zoomArr.timerId)
      // socket 回调函数的取消
      SocketServiceInstance.unRegisterCallBack('rankData')
    })

    return {
      rankDom,
      screenAdapter
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
