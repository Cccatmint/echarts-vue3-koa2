 # webSocket 字段约定
 ## service 接收
```json
  {
    "aciton": "getData",
    // aciton 可选值
    //getData - 获取图表数据
    //fullScreen - 全屏事件：某客户端全屏 其他客户端联动全屏
    //themeChange - 主题切换: 某客户端主题切换 其他客户端联动主题切换
    "socketType": "trendData",
    // socketType 前端响应函数标识 可选值
    // trendData sellerData mapData stockData hotData fullScreen themeChange
    "chartName": "trend",
    // 图表数据标识用于确认后端需要传递什么图表数据
    // 可选值 trend seller map rank stock hotproduct 
    "value": ""
  }
```

## client 发送字段
actionn === 'getData' ? A : B

A. 取出chartName 字段 -> 拼接路径 -> 读取json文件内容 -> websocket 在value字段返回值 ,
```json
  {
    "action": "getData",
    "socketType": "trendData",
    "chartName": "trend",
    "value": "",
    "data": "从文件中读取的内容"
  }
```

B.将client的数据原封不动转发给all client （同步操作 - 全屏操作或者主题切换）
