const WebSocket = require('ws')

const wss = new WebSocket.Server({
  port: 4001,
});

module.exports.listen = () => {
  wss.on('connection', client => {
    console.log('client connetcion')
    // listen message from client
    wss.on('message', msg => {
      console.log('get message from client : ', msg)
      let payload = JSON.parse(msg)
      // send message to client
      client.send('hello ! -- from websocket service')
    })
  })
}