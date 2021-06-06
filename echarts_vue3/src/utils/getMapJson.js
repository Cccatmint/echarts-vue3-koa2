import axios from 'axios'

async function getChinaMapJson () {
  const data = await axios.get('../../map/china.json')
  // console.log(data.data)
  return data.data
}

async function getProvinceMapJson (provinceName) {
  const data = await axios.get(`../../map/province/${provinceName}.json`)
  // console.log(data.data)
  return data.data
}

export { getChinaMapJson, getProvinceMapJson }
