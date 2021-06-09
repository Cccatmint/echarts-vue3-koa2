<template>
  <div class="home">
    <div><Hot /></div>
    <div><Map /></div>
    <div><Rank /></div>
    <div><Seller /></div>
    <div><Stock /></div>
    <div><Trend /></div>
  </div>
</template>

<script>
// @ is an alias to /src
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
export default {
  name: 'Home',
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  }
}
</script>

<style lang="scss">
  .home {
    display: flex;
    width: 100%;
    height: 100%;

    div {
      width: 100px;
      height: 100px;
    }
  }
</style>
