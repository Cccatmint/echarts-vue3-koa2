<!-- 库存销量图 -->

<template>
  <div class="com-container">
    <div class="com-chart" ref="stockDom"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import * as echarts from 'echarts'
// import { get } from '../utils/request'
export default {
  name: 'Stock',

  setup () {
    // 获取socket实例
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调函数
    SocketServiceInstance.registerCallBack('stockData', getData)
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const stockDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)
    const timerId = ref(null)
    let currentIndex = 0

    function initChart () {
      chartInstance.value = echarts.init(stockDom.value, null)
      // 绑定鼠标事件
      chartInstance.value.on('mouseover', () => {
        clearInterval(timerId.value)
      })
      chartInstance.value.on('mouseout', () => {
        startInterval()
      })
      const initOption = {
        title: {
          text: '库存销量占比图',
          left: 20,
          top: 20,
          textStyle: {
            color: '#f00'
          }
        }
      }
      unwarp(chartInstance.value).setOption(initOption)
    }

    function getData (data) {
    // async function getData () {
      // const { data } = await get('/api/data/stock')
      allData.value = data
      updateChart()
      startInterval()
    }

    function updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#b6c9f0', '#afb9c8'],
        ['#ffe5e2', '#ce97b0'],
        ['#f5abc9', '#f4a9a8'],
        ['#fbc6a4', '#e93b81'],
        ['#f2dac3', '#564a4a']
      ]
      const start = currentIndex * 5
      const end = (currentIndex + 1) * 5
      const showData = allData.value.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          name: item.name,
          center: centerArr[index],
          type: 'pie',
          label: {
            show: true,
            color: colorArr[index][1],
            fontWeight: 'bold',
            position: 'center'
          },
          labelLine: {
            show: false
          },
          emphasis: {
            scale: false // 关闭鼠标移入时的放大
          },
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              // label: { show: true },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[index][1]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][0]
                  }
                ])
              }
            },
            {
              label: { show: false },
              value: item.stock,
              itemStyle: {
                color: '#ccc'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }

      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = stockDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize.value
          }
        },
        series: [
          { radius: [titleFontSize.value * 2, titleFontSize.value * 1.125], label: { fontSize: titleFontSize.value / 3 } },
          { radius: [titleFontSize.value * 2, titleFontSize.value * 1.125], label: { fontSize: titleFontSize.value / 3 } },
          { radius: [titleFontSize.value * 2, titleFontSize.value * 1.125], label: { fontSize: titleFontSize.value / 3 } },
          { radius: [titleFontSize.value * 2, titleFontSize.value * 1.125], label: { fontSize: titleFontSize.value / 3 } },
          { radius: [titleFontSize.value * 2, titleFontSize.value * 1.125], label: { fontSize: titleFontSize.value / 3 } }
        ]
      }

      unwarp(chartInstance.value).setOption(adapterOption)
      chartInstance.value.resize()
    }

    function startInterval () {
      if (timerId.value) {
        clearInterval(timerId.value)
      }
      timerId.value = setInterval(() => {
        currentIndex++
        if (currentIndex > 1) {
          currentIndex = 0
        }
        updateChart()
      }, 4000)
    }

    onMounted(() => {
      initChart()
      // getData()
      SocketServiceInstance.send({
        action: 'getData',
        socketType: 'stockData',
        chartName: 'stock',
        value: ''
      })
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
      clearInterval(timerId.value)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
      SocketServiceInstance.unRegisterCallBack('stockData')
    })

    return {
      stockDom
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
