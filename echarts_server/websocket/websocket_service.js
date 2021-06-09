const WebSocket = require('ws')
const path = require('path')
const file_utils = require('../src/utils/file_utils')

const wss = new WebSocket.Server({
  port: 4001,
});

module.exports.listen = () => {
  wss.on('connection', client => {
    console.log('websocket connetion success , port : 4001')
    // listen message from client
    client.on('message', async msg => {
      console.log('get message from client : ', msg)
      let payload = JSON.parse(msg)
      const action = payload.action
      if(action === 'getData') {
          // 获取数据
          // payload.chartName // trend seller map rank stock hot
          let filePath = '../data/' + payload.chartName + '.json'
          filePath = path.join(__dirname, filePath)
          // 读取json文件
          const jsonData = await file_utils.getFileJsonData(filePath)
          // 将json文件给payload传递给客户端
          payload.data = jsonData
          client.send(JSON.stringify(payload))
         }
      
      else {
          // 原封不动的把接受到的数据原封不动转发给所有处于链接状态的客户端
          // wss.clients // 所有客户端的连接，Array
          wss.clients.forEach(client => {
            client.send(msg)
          })

      }
      // send message to client
      client.send(JSON.stringify('hello ! -- from websocket service'))
    })
  })
}