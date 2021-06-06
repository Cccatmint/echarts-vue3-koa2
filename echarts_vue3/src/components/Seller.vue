<!-- 商家销量统计横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerDom"></div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { get } from '../utils/request'

export default {
  name: 'Seller',
  setup () {
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const sellerDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const totalPage = ref(0)
    const currentPage = ref(1)
    const timerId = ref(null)
    // method
    // init chartInstance
    const initChart = () => {
      chartInstance.value = echarts.init(sellerDom.value, null)
      // 鼠标监听绑定 鼠标移入停止定时器 移除则再开始
      const initOption = {
        title: {
          text: '商家销售统计',
          textStyle: {
            color: '#f00',
            fontWeight: 'bold'
          }
        },
        grid: {
          show: true,
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true,
          backgroundColor: 'rgba(0,0,0,0.2)'
        },
        xAxis: {
          type: 'value',
          axisPointer: { show: true }
        },
        axisLabel: {
          color: '#0f0'
        },
        yAxis: {
          type: 'category'
        },
        label: {
          show: true, // 柱上文字
          position: 'right', // 文字位置
          textStyle: {
            color: '#f00'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: 'rgba(0,0,0,0.2)'
            }
          }
        },
        series: [{
          type: 'bar',
          itemStyle: {
            // barWidth: 66,
            // borderRadius: [0, 33, 33, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#5052EE'
              },
              {
                offset: 1,
                color: '#AB6EE5'
              }
            ])
          },
          select: {
            itemStyle: {
              borderColor: '#f0f'
            }
          },
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }]
      }
      unwarp(chartInstance.value).setOption(initOption)
      chartInstance.value.on('mouseover', () => {
        clearInterval(timerId.value)
      })
      chartInstance.value.on('mouseout', () => {
        startInterval()
      })
    }
    // getData
    const getData = async () => {
      const { data } = await get('/api/data/seller')
      allData.value = data
      allData.value.sort((a, b) => { return a.value - b.value }) // 排序

      totalPage.value = allData.value.length % 5 === 0 ? allData.value.length / 5 : allData.value / 5 + 1
      updateChart()
    }
    // updateChart
    function updateChart () {
      const start = (currentPage.value - 1) * 5
      const end = currentPage.value * 5
      const showData = allData.value.slice(start, end)
      const sellerNames = showData.map(item => item.name)
      const sellerValues = showData.map(item => item.value)
      const dataoption = {
        yAxis: {
          data: sellerNames
        },
        series: [{
          data: sellerValues
        }]
      }
      unwarp(chartInstance.value).setOption(dataoption)
    }
    // setInterval
    function startInterval () {
      if (timerId.value) {
        clearInterval(timerId.value)
      }
      timerId.value = setInterval(() => {
        currentPage.value++
        if (currentPage.value > totalPage.value) {
          currentPage.value = 1
        }
        updateChart()
      }, 3000)
    }
    const sreenAdapter = () => {
      // console.log(sellerDom.value.offsetWidth)
      const titleFontSize = sellerDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              with: titleFontSize
            }
          }
        },
        series: [{
          barWidth: titleFontSize,
          itemStyle: {
            borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }]
      }
      unwarp(chartInstance.value).setOption(adapterOption)
      chartInstance.value.resize()
    }

    // onMounted
    onMounted(() => {
      initChart()
      getData()
      startInterval()
      window.addEventListener('resize', sreenAdapter)
      setTimeout(() => {
        sreenAdapter()
      }, 100)
    })

    // onBeforeUnmount
    onBeforeUnmount(() => {
      clearInterval(timerId.value)
      window.removeEventListener('resize', sreenAdapter)
    })
    return {
      sellerDom
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
