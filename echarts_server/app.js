const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const websocket_service = require('./websocket/websocket_service')

websocket_service.listen()

// my_middleware
const reponse_duration = require('./src/middleware/response_duration')
const reponse_data = require('./src/middleware/response_data')
// const reponse_header = require('./src/middleware/response_header')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(cors({
  origin: (ctx) => { return ctx.header.origin }, // 允许所有跨域请求
  credentials: true // 允许跨域带 cookie
}))
app.use(reponse_duration)
// app.use(reponse_header)
app.use(require('koa-static')(__dirname + '/public'))
app.use(reponse_data)

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())


app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
