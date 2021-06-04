// 读取数据文件的工具
const fs = require('fs') // 引入fs模块以读取文件
module.exports.getFileJsonData = (filePath) => {
  return new Promise((resolve, reject) => {
    // fs.readFile(filePath, 'utf-8', (error, data) => {
      fs.readFile(filePath,'utf8',(error, data) => {
      if(error) {
        // 读取文件失败
        reject(error)
      } else {
        // 读取文件成功
        resolve(data)
      }
    })
  })
}