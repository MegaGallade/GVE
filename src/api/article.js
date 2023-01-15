import request from '@/utils/request'
import axios from 'axios'
let serverUrl = 'http://127.1.1.0:8081'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

// export function getSql(query) {
//   let insurance = query.insurance
//   let uav = query.uav
//   let sort = query.sort
//   if (sort == '-id') { sort = 'desc' }
//   else { sort = 'asc' }
//   let url = `${serverUrl}/insurance/get?insurance=${insurance}&uav=${uav}&sort=${sort}`
//   console.log(url)
//   return axios({
//     url: url,
//     method: 'get',
//   })
// }
export function getSql(query) {
  let url = `${serverUrl}/insurance/get`
  console.log(url, query)
  return axios({
    url: url,
    method: 'get',
    params: { query }
  })
}
export function addSql(query) {
  let url = `${serverUrl}/insurance/add`
  console.log(url, query)
  return axios({
    url: url,
    method: 'get',
    params: { query}
  })
}
export function updateSql(query) {
  let url = `${serverUrl}/insurance/update`
  console.log(url, query)
  return axios({
    url: url,
    method: 'get',
    params: { query }
  })
}
export function delSql(query) {
  let url = `${serverUrl}/insurance/del`
  console.log(url, query)
  return axios({
    url: url,
    method: 'get',
    params: { query }
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
