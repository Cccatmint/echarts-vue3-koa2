<template>
  <div class="screen-container">
    <div class="screen-header">
      <div class="line-left"></div>
      <div class="title">数据实时监控联动切换</div>
      <div id="time">{{ now }}</div>
      <div class="line-right"></div>
    </div>
    <div class="screen-body">
      <div class="screen-left">
        <div id="left-top" :class="['chart-container', fullScreenStatus.trend === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('trend')">{{ fullScreenStatus.trend === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Trend ref="trend" />
        </div>
        <div id="left-bottom" :class="['chart-container', fullScreenStatus.seller === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('seller')">{{ fullScreenStatus.seller === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Seller ref="seller" />
        </div>
      </div>
      <div class="screen-middle">
        <div id="middle-top" :class="['chart-container', fullScreenStatus.map === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('map')">{{ fullScreenStatus.map === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Map ref="map" />
        </div>
        <div id="middle-bottom" :class="['chart-container', fullScreenStatus.rank === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('rank')">{{ fullScreenStatus.rank === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Rank ref="rank"/>
        </div>
      </div>
      <div class="screen-right">
        <div id="right-top" :class="['chart-container', fullScreenStatus.hot === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('hot')">{{ fullScreenStatus.hot === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Hot ref="hot" />
        </div>
        <div id="right-bottom" :class="['chart-container', fullScreenStatus.stock === true ? 'fullscreen' : '']">
          <i class="iconfont" @click="changeSize('stock')">{{ fullScreenStatus.stock === false ? '&#xe635;' : '&#xe62e;'}}</i>
          <Stock ref="stock" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 组件
import Hot from '@/components/Hot'
import Map from '@/components/Map'
import Rank from '@/components/Rank'
import Seller from '@/components/Seller'
import Stock from '@/components/Stock'
import Trend from '@/components/Trend'

import { reactive, getCurrentInstance, nextTick, inject, onBeforeUnmount, ref, onMounted } from 'vue'
export default {
  name: 'ScreenPage',
  components: { Hot, Map, Rank, Seller, Stock, Trend },
  setup () {
    const now = ref(new Date().toLocaleString())
    let timerId = null
    const fullScreenStatus = reactive({
      trend: false,
      seller: false,
      map: false,
      rank: false,
      hot: false,
      stock: false
    })
    const SocketServiceInstance = inject('SocketServiceInstance')
    // 注册回调
    SocketServiceInstance.registerCallBack('fullScreen', recvData)
    const internalInstance = getCurrentInstance()
    const changeSize = (chartName) => {
      // // 改变当前页面的状态
      // fullScreenStatus[chartName] = !fullScreenStatus[chartName]
      // // 调用组件的screenAdapter 方法
      // // 数据变化渲染完成后再调用
      // nextTick(() => {
      //   internalInstance.refs[chartName].screenAdapter()
      // })
      // 发送数据给服务端
      const targetValue = !fullScreenStatus[chartName]
      SocketServiceInstance.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    }
    function recvData (data) {
      // 通过从服务端接受的数据改变是否全屏
      fullScreenStatus[data.chartName] = data.value
      console.log(data.chartName, data.value)
      nextTick(() => {
        internalInstance.refs[data.chartName].screenAdapter()
      })
    }
    onMounted(() => {
      if (timerId) { clearInterval(timerId) }
      timerId = setInterval(() => {
        now.value = new Date().toLocaleString()
      }, 1000)
    })
    onBeforeUnmount(() => {
      SocketServiceInstance.unRegisterCallBack('fullScreen')
      if (timerId) { clearInterval(timerId) }
    })
    return {
      fullScreenStatus,
      now,

      changeSize
    }
  }
}
</script>

<style lang="scss" scoped>
// fullscreen
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 1000;
}

  .screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: pink;
    color: #fff;
    box-sizing: border-box;

    .screen-header {
      width: 100%;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      position: relative;
      background-color: rgb(226, 111, 130);

      .line-left {
        width: 10px;
        height: 64px;
        position: absolute;
        top: 0; left: 0;
        background-color: rgb(95, 95, 243);
      }
      .line-right {
        width: 10px;
        height: 64px;
        position: absolute;
        top: 0; right: 0;
        background-color: rgb(95, 95, 243);
      }

      .title {
        flex: 1;
        text-align: center;
        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 5px;
          margin-top: 5px;
          background-image: linear-gradient(45deg,rgb(139, 48, 201),rgb(221, 224, 22));
        }
      }

      #time {
        position: absolute;
        right: 20px;
        bottom: 0;
        // justify-self: right;
        // align-self: flex-end;
        color: rgb(179, 207, 206);
        font-size: 1vw;
      }
    }

    .screen-body {
      width: 100%;
      height: 100%;
      display: flex;
      margin-top: 10px;

       .chart-container {
         position: relative;
         box-sizing: border-box;
         background-color: rgb(116, 97, 97);
         border: 5px solid red;
         // 渐变边框
         border-image: linear-gradient(#F80, #2ED) 20 20;

         i.iconfont {
           z-index: 999;
           position: absolute;
           right: 20px;
           top: 20px;
           &:hover {
             cursor: pointer;
           }
         }
       }

      .screen-left {
        height: 100%;
        width: 27.6%;

        #left-top {
          height: 53%;
          position: relative;
        }
        #left-bottom {
          height: 31%;
          margin-top: 25px;
          position: relative;
        }
      }

      .screen-middle {
        height: 100%;
        width: 41.5%;
        margin-left: 1.6%;
        margin-right: 1.6%;

        #middle-top {
          width: 100%;
          height: 56%;
          position: relative;
        }
        #middle-bottom {
          margin-top: 25px;
          width: 100%;
          height: 28%;
          position: relative;
        }
      }

      .screen-right {
        height: 100%;
        width: 27.6%;

        #right-top {
          height: 46%;
          position: relative;
        }
        #right-bottom {
          height: 38%;
          margin-top: 25px;
          position: relative;
        }
      }
    }
  }
</style>
