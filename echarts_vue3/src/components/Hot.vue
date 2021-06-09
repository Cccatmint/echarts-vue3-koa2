<!-- 饼图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hotDom"></div>
    <i class="iconfont arr-left" @click="toLeft" :style="comStyle" role="button">&#xe681;</i>
    <i class="iconfont arr-right" @click="toRight" :style="comStyle" role="button">&#xe682;</i>
    <span class="title" :style="comStyle">{{titleText}}</span>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, inject } from 'vue'
import * as echarts from 'echarts'
// import { get } from '../utils/request'
export default {
  name: 'Hot',
  setup () {
    // 获取socket实例
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调函数
    SocketServiceInstance.registerCallBack('hotproductData', getData)
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const hotDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)
    const currentIndex = ref(0)
    const titleText = computed(() => {
      return allData.value ? allData.value[currentIndex.value].name : ''
    })
    const comStyle = computed(() => {
      return { fontSize: titleFontSize.value + 'px' }
    })

    function initChart () {
      chartInstance.value = echarts.init(hotDom.value, null)
      const initOption = {
        title: {
          text: '热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '10%',
          icon: 'circle'
        },
        tooltip: {
          // tooltip 文字内容
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let str = ''
            thirdCategory.forEach(item => {
              str += `${item.name}: ${parseInt(item.value / total * 100)}%</br>`
            })
            // console.log(arg.data.children) // [{name: 'x', value: 123},{},{}]
            return str
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['20%', '60%'],
            avoidLabelOverlap: false,
            label: {
              // fontSize: '20%',
              show: false,
              position: 'center'
            },
            // 高亮
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      unwarp(chartInstance.value).setOption(initOption)
    }

    function getData (data) {
    // async function getData () {
      // const { data } = await get('/api/data/hotproduct')
      // data = [{name: 'xx', children: [{name: 'yy'},{},{}]},{},{}]
      allData.value = data
      updateChart()
    }

    function updateChart () {
      // format data
      const legendData = allData.value[currentIndex.value].children.map(item => { return item.name })
      const seriesData = allData.value[currentIndex.value].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children // 通过tooltip formatter - arg 获取
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
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize.value
          }
        },
        legend: {
          itemWidth: titleFontSize.value / 2,
          itemHeight: titleFontSize.value
        },
        series: [
          {
            itemStyle: {
              borderRadius: titleFontSize.value / 2,
              borderColor: '#fff',
              borderWidth: titleFontSize.value / 5
            }
          }
        ]
      }
      unwarp(chartInstance.value).setOption(adapterOption)
      unwarp(chartInstance.value).resize()
    }

    const toLeft = () => {
      currentIndex.value--
      if (currentIndex.value < 0) {
        currentIndex.value = allData.value.length - 1
      }
      updateChart()
    }
    const toRight = () => {
      currentIndex.value++
      if (currentIndex.value > allData.value.length - 1) {
        currentIndex.value = 0
      }
      updateChart()
    }

    onMounted(() => {
      initChart()
      // getData()
      SocketServiceInstance.send({
        action: 'getData',
        socketType: 'hotproductData',
        chartName: 'hotproduct',
        value: ''
      })
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
      SocketServiceInstance.unRegisterCallBack('hotproductData')
    })

    return {
      hotDom,
      titleText,
      comStyle,

      toLeft,
      toRight
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-container {
    .iconfont {
      background-color: rgba(0,0,0,.2);
      border-radius: 10%;
    }
    .arr-left {
      position: absolute;
      left: 10%;
      top: 50%;
      transform: translateY(-50%);
      &:hover {
        cursor: pointer;
        box-shadow: 2px 2px 1px rgba(0,0,0,.6);
      }
    }

    .arr-right   {
      position: absolute;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
      &:hover {
        cursor: pointer;
        box-shadow: 2px 2px 1px rgba(0,0,0,.6);
      }
    }

    .title {
      position: absolute;
      right: 10%;
      bottom: 10%;
      padding: 10px;
      color: #fff;
      border-radius: 10%;
      background-color: rgba(0,0,0,.2);
    }
  }
</style>
