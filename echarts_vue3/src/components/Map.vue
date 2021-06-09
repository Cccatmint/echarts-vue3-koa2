<!-- 商户分布地图 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapDom"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import * as echarts from 'echarts'
// import { get } from '../utils/request'
import { getChinaMapJson, getProvinceMapJson } from '../utils/getMapJson'
import { getProvinceMapInfo } from '../utils/map_utils'

const useGetChinaMapEffect = (mapData) => {
  const getChinaMap = async () => {
    mapData.value = await getChinaMapJson()
  }
  return { getChinaMap }
}

export default {
  name: 'Map',
  setup () {
    // 获取socket实例
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调函数
    SocketServiceInstance.registerCallBack('mapData', getData)
    const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj) // 解包proxy 否则与echarts兼容性不好
    const mapDom = ref(null)
    const chartInstance = ref(null)
    const allData = ref(null) // 服务器返回的原始数
    const titleFontSize = ref(0)
    const mapData = ref(null)

    const { getChinaMap } = useGetChinaMapEffect(mapData)

    const revertMap = () => {
      // 双击后回到中国地图
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      unwarp(chartInstance.value).setOption(revertOption)
    }
    async function initChart () {
      chartInstance.value = echarts.init(mapDom.value, null)
      await getChinaMap()
      // map click addEventListener
      chartInstance.value.on('click', async (e) => {
        const provinceInfo = getProvinceMapInfo(e.name) // provinceInfo = { key: 'hunan', path: 'hunan'}
        // 获取对应点击省份的地图矢量数据
        try {
          const provinceMapData = await getProvinceMapJson(provinceInfo.key)
          echarts.registerMap(provinceInfo.key, provinceMapData)
        } catch (error) {
          // console.log(error) 捕获控制台因为没有更深层的地图而出现的错误，不显示
          return
        }
        // 注册地图
        // 配置为省份地图
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        unwarp(chartInstance.value).setOption(changeOption)
      })
      echarts.registerMap('china', mapData.value)
      const initOption = {
        title: {
          text: '商家分布图',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#00D1CE' // 地图整体颜色
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertival'
        }
      }
      unwarp(chartInstance.value).setOption(initOption)
    }

    function getData (data) {
    // async function getData () {
      // const { data } = await get('/api/data/map')
      allData.value = data
      updateChart()
    }

    function updateChart () {
      // format network data
      // 若要在地图中显示三点数据， 需要给散点的图标添加一个配置， coordinateSystem: 'geo'
      const legendArr = allData.value.map(item => {
        return item.name
      })
      const seriesArr = allData.value.map(item => {
        return {
          type: 'effectScatter', // 涟漪动画
          rippleEffect: {
            scale: 5,
            brushType: 'stroke' // 涟漪为空心样式
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 涟漪动画位置使用地图坐标系
        }
      })
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      // unwarp(chartInstance.value).setOption(dataOption)
      unwarp(chartInstance.value).setOption(dataOption)
    }

    function screenAdapter () {
      titleFontSize.value = mapDom.value.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize.value
          }
        },
        legend: {
          itemWidth: titleFontSize.value / 2,
          itemHeight: titleFontSize.value / 2,
          textStyle: {
            fontSize: titleFontSize.value / 2
          },
          itemGap: titleFontSize.value / 3
        }
      }
      unwarp(chartInstance.value).setOption(adapterOption)
      unwarp(chartInstance.value).resize()
    }

    onMounted(async () => {
      initChart()
      // getData()
      SocketServiceInstance.send({
        action: 'getData',
        socketType: 'mapData',
        chartName: 'map',
        value: ''
      })
      window.addEventListener('resize', screenAdapter)
      setTimeout(() => {
        screenAdapter()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', screenAdapter)
      SocketServiceInstance.unRegisterCallBack('mapData')
    })

    return {
      mapDom,
      mapData,

      revertMap
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
