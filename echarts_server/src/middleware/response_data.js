// 处理业务逻辑的中间件，读取某个json文件的数据
const fileUtils = require('../utils/file_utils.js')
const path = require('path')
const { SuccessModel,
  ErrorModel } = require('../response-model/index')
const { Console } = require('console')
module.exports = async (ctx, next) => {
  // localhost:3000/api/data/seller
  const url = ctx.request.url // /api/data/seller
  let filePath = url.replace('/api/data', '') // /seller
  filePath = '../../data' + filePath + '.json' //    ../../data/seller.json
  filePath = path.join(__dirname, filePath) // 文件所处的绝对路径拼接 
  console.log(filePath)
  try {
    const data = await fileUtils.getFileJsonData(filePath) // 读取文件
    JSON.parse(data)
    console.log()
    ctx.response.body = new SuccessModel(JSON.parse(data))
  } catch (error) {
    ctx.response.body = new ErrorModel(999, '读取文件内容失败')
  }
  next()
}