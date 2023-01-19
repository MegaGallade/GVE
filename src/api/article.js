import request from '@/utils/request'
import axios from 'axios'

const serverUrl = 'http://127.1.1.0:8081'

export function getSql(query) {
  let page = query.page
  let limit = query.limit
  let insurance = query.insurance
  let uav = query.uav
  let state = query.state
  let sort = query.sort
  let url = `${serverUrl}/api/insurance/get?insurance=${insurance}&uav=${uav}&state=${state}&page=${page}&limit=${limit}&sort=${sort}`
  console.log(url, query)
  return axios({
    url: url,
    method: 'get',
    params: {}
  })
}

export function getTotal() {
  let url = `${serverUrl}/api/insurance/total`
  return axios({
    url: url,
    method: 'get',
  })
}
export function getMaxId() {
  let url = `${serverUrl}/api/insurance/maxId`
  return axios({
    url: url,
    method: 'get',
  })
}

export function addSql(query) {
  let url = `${serverUrl}/api/insurance/add`
  console.log(url, query)
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}
export function updateSql(query) {
  let url = `${serverUrl}/api/insurance/update`
  console.log(url, query)
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}
export function updateDays() {
  let url = `${serverUrl}/api/insurance/updateDays`
  return axios({
    url: url,
    method: 'post',
  })
}
export function updateState() {
  let url = `${serverUrl}/api/insurance/updateState`
  return axios({
    url: url,
    method: 'post',
  })
}
export function delSql(query) {
  let url = `${serverUrl}/api/insurance/del`
  console.log(url, query)
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
