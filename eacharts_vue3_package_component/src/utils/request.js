import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  timeout: 10000
})

const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, { params })
      .then((response) => { resolve(response.data) },
        err => { reject(err) }
      )
  })
}

const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => { resolve(response) }, err => { reject(err) })
  })
}

// const localInstance = axios.create({
//   // baseURL: 'http://localhost:3002',
//   baseURL: 'http://1.116.13.77:3002', // 生产环境
//   withCredentials: true,
//   timeout: 10000
// })

// const upload = (url, data = {}) => {
//   return new Promise((resolve, reject) => {
//     localInstance.post(url, data, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then((response) => { resolve(response.data) }, err => { reject(err) })
//   })
// }

// const post2 = (url, data = {}) => {
//   return new Promise((resolve, reject) => {
//     localInstance.post(url, data, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }).then((response) => { resolve(response.data) }, err => { reject(err) })
//   })
// }

// const patch2 = (url, data = {}) => {
//   return new Promise((resolve, reject) => {
//     localInstance.patch(url, data, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }).then((response) => { resolve(response.data) }, err => { reject(err) })
//   })
// }

// const get2 = (url, params = {}) => {
//   return new Promise((resolve, reject) => {
//     localInstance.get(url, { params })
//       .then((response) => { resolve(response.data) },
//         err => { reject(err) }
//       )
//   })
// }

export {
  get,
  post
}
