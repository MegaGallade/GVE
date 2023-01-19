import axios from 'axios'

const serverUrl = 'http://127.1.1.0:8081'

class Insurance {
  getSql(query) {
    const page = query.page
    const limit = query.limit
    const insurance = query.insurance
    const uav = query.uav
    const state = query.state
    const sort = query.sort
    const url = `${serverUrl}/api/insurance/get?insurance=${insurance}&uav=${uav}&state=${state}&page=${page}&limit=${limit}&sort=${sort}`
    console.log(url, query)
    return axios({
      url: url,
      method: 'get',
      params: {}
    })
  }

  getDueDays() {
    const url = `${serverUrl}/api/insurance/getDueDays`
    return axios({
      url: url,
      method: 'get',
    })
  }
  getTotal() {
    const url = `${serverUrl}/api/insurance/getTotal`
    return axios({
      url: url,
      method: 'get',
    })
  }
  getMaxId() {
    const url = `${serverUrl}/api/insurance/getMaxId`
    return axios({
      url: url,
      method: 'get',
    })
  }
  getInsurance() {
    const url = `${serverUrl}/api/insurance/getInsurance`
    return axios({
      url: url,
      method: 'get',
    })
  }
  getCompany() {
    const url = `${serverUrl}/api/insurance/getCompany`
    return axios({
      url: url,
      method: 'get',
    })
  }
  getUav() {
    const url = `${serverUrl}/api/insurance/getUav`
    return axios({
      url: url,
      method: 'get',
    })
  }

  addSql(query) {
    const url = `${serverUrl}/api/insurance/add`
    console.log(url, query)
    return axios({
      url: url,
      method: 'post',
      data: query
    })
  }
  updateSql(query) {
    const url = `${serverUrl}/api/insurance/update`
    console.log(url, query)
    return axios({
      url: url,
      method: 'post',
      data: query
    })
  }
  updateDays() {
    const url = `${serverUrl}/api/insurance/updateDays`
    return axios({
      url: url,
      method: 'post',
    })
  }
  updateState() {
    const url = `${serverUrl}/api/insurance/updateState`
    return axios({
      url: url,
      method: 'post',
    })
  }
  delSql(query) {
    const url = `${serverUrl}/api/insurance/del`
    console.log(url, query)
    return axios({
      url: url,
      method: 'post',
      data: query
    })
  }
}
export { Insurance }



