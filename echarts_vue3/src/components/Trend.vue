<!-- 商家销量趋势折线图 -->
<template>
  <div class="com-container">
    <div class="title" :style="{fontSize: titleFontSize / 2 + 'px'}">
      <span>{{ showTitle }}</span>
      <i class="iconfont arr" @click="showChoice = !showChoice" :class="{'arr_active': showChoice}" :style="{ marginLeft: titleFontSize / 2 + 'px'}">
        &#xe807;
      </i>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{item.text || ''}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendDom"></div>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref, inject } from 'vue'
import * as echarts from 'echarts'
// import { get } from '../utils/request'
export default {
  name: 'Trend',
  setup () {
    // 获取socket实例
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调函数
    SocketServiceInstance.registerCallBack('trendData', getData)
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const trendDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)
    const selectTypes = computed(() => {
      return allData.value?.type.filter(item => {
        return item.key !== choiceType.value
      })
    })
    const showChoice = ref(false)
    const choiceType = ref('map')
    const showTitle = computed(() => {
      return allData.value?.[choiceType.value]?.title
    })

    function initChart () {
      chartInstance.value = echarts.init(trendDom.value, null)
      const initOption = {
        color: [
          'rgba(11, 168, 44, 1)',
          'rgba(44, 111, 222, 1)',
          'rgba(22, 242, 222, 1)',
          'rgba(254, 33, 22, 1)',
          'rgba(250, 107, 0, 1)'
        ],
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        axisLabel: {
          color: '#fff'
        },
        grid: {
          left: '3%',
          top: '34%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        legend: {
          top: '20%',
          icon: 'circle',
          textStyle: {
            color: '#fff'
          }
        }
      }
      unwarp(chartInstance.value).setOption(initOption)
    }

    function getData (data) {
    // async function getData () {
    //   const { data } = await get('/api/data/trend')
      allData.value = data
      updateChart()
    }

    function updateChart () {
      const colorArr = [
        [
          'rgba(11, 168, 44, 0)',
          'rgba(44, 111, 222, 0)',
          'rgba(22, 242, 222, 0)',
          'rgba(254, 33, 22, 0)',
          'rgba(250, 107, 0, 0)'
        ],
        [
          'rgba(11, 168, 44, 1)',
          'rgba(44, 111, 222, 1)',
          'rgba(22, 242, 222, 1)',
          'rgba(254, 33, 22, 1)',
          'rgba(250, 107, 0, 1)'

        ]
      ]
      const timeArr = allData.value.common.month
      const valueArr = allData.value[choiceType.value].data
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const seriesArr = valueArr.map((item, index) => {
        return {
          type: 'line',
          name: item.name,
          data: item.data,
          stack: choiceType.value,
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colorArr[1][index]
            }, {
              offset: 1,
              color: colorArr[0][index]
            }])
          },
          emphasis: {
            focus: 'series'
          }
        }
      })
      const dataOption = {
        xAxis: [{
          data: timeArr
        }],
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = trendDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: titleFontSize.value / 2,
          itemHeight: titleFontSize.value / 2,
          itemGap: titleFontSize.value,
          textStyle: {
            fontSize: titleFontSize.value / 2
          }
        }
      }
      unwarp(chartInstance.value).setOption(adapterOption)
      chartInstance.value.resize()
    }

    const handleSelect = (currentType) => {
      choiceType.value = currentType
      updateChart()
      showChoice.value = false
    }

    onMounted(() => {
      initChart()
      // getData()
      SocketServiceInstance.send({
        action: 'getData',
        socketType: 'trendData',
        chartName: 'trend',
        value: ''
      })
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
      SocketServiceInstance.unRegisterCallBack('trendData')
    })

    return {
      trendDom,
      selectTypes,
      showChoice,
      choiceType,
      showTitle,
      titleFontSize,

      handleSelect,
      screenAdapter
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 999;
    color: #fff;

    .arr {
      transform: scale(0.8, 0.8);
      display: inline-block;
      &:hover {
        cursor: pointer;
      }
    }
    .arr_active {
      transform: rotate(90deg) scale(0.8, 0.8);
    }

    .select-item {
      // background-color: #222733;
      &:hover {
        cursor: pointer;
        background-color: rgba(0,0,0,.1);
      }
    }
  }
</style>
