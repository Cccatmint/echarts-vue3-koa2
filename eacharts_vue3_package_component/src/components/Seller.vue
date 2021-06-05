<!-- 商家销量统计横向柱状图 -->
<template>
  <div class="com-container">
    <Chart :options="ChartOption" />
  </div>
</template>

<script>
import Chart from './common/Chart.vue'
import { get } from '../utils/request'
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'

// 获取数据 & format
const useGetDataEffect = (data) => {
  const getData = async () => {
    const response = await get('/seller')
    data.value = response.data
  }
  return { getData }
}
// 设置图标数据
const useSetOptionEffect = (data, ChartOption) => {
  // 设置ChartOption的值
  const sellerNanme = data.value.map(item => { return item.name })
  const sellerValue = data.value.map(item => { return item.value })
  const setOption = (toSetData) => {
    ChartOption.value = {
      xAxis: {
        type: 'category',
        data: sellerNanme
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: sellerValue,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }]
    }
  }
  return { setOption }
}

export default {
  name: 'Seller',
  components: { Chart },
  setup () {
    const data = ref([])
    const ChartOption = ref({})
    // 获取数据
    const { getData } = useGetDataEffect(data)
    const { setOption } = useSetOptionEffect(data, ChartOption)

    onMounted(() => {
      getData()
      setOption()
    })

    return { ChartOption }
  }
}
</script>

<style lang="scss" scoped>

</style>
