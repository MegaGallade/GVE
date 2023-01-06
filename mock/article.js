const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform'],

    running: '@zip(11)',
    idnumber: '@zip(8)',
    insurance: '@zip(20)',
    "isInsurance|1": false,
    productionOrder: "@zip(12)",
    order: "GBICKX" + "@date(yyMMdd)" + "@zip(3)",
    customer: "@ctitle(8)",
    name: "@ctitle(10)",
    salesman: '@cname',
    activate: "",
    "state|1": ["生效中", "待激活", "已续保", "已失效"],
    "days|1-100": 100,
    "remind|1": ["未生效", "未到期", "已发送", "已续保"],
    "isRemind|1": true,
    "isRenewal|1": true,
    "isActivated|1": true,
    "isDisabled|1": true,
    "version|1": true,
    start_date: "@date()",
    end_date: "@date()",
    dateInProduced: "@date()" + " " + "@time",
    serial: "@zip(16)",
    "detailList|1-5": [{
      serial: "@zip(2)",
      case: "@zip(2)",
    }],
    "serialList|1-5": [{
      serial: "@zip(16)",
      case: "CGBX" + "@zip(8)",
      uav: "6HGUP" + "@zip(8)",
      light: "6HGLT" + "@zip(8)",
      remote: "01GRC" + "@zip(8)",
      interphone: "01GWR" + "@zip(8)",
      wifi: "GBI_" + "@zip(8)",
    }],
    case: "CGBX" + "@zip(8)",
    uav: "6HGUP" + "@zip(8)",
    light: "6HGLT" + "@zip(8)",
    remote: "01GRC" + "@zip(8)",
    interphone: "01GWR" + "@zip(8)",
    wifi: "GBI_" + "@zip(8)",
    remark: "@cparagraph",
    history: "",
    phone: "@zip(11)",
    "plugType|1": ["出", "入"],
    "orderType|1": ["销售", "租赁", "借用", "维修"],
    "companyType|1": ["买方", "卖方", "其他", "特殊"],
    "useType|1": ["生产中", "测试中", "库存中", "可使用", "维修中", "租用中", "已售出", "已废弃", "未知",],
    "deviceType|1": ["照明机组", "广播机组", "直播机组", "其他"],
    "uavType|1": ["照明机", "广播机", "直播机", "机巢机", "航拍机", "其他"],
    company: "@ctitle(6)" + '有限公司',
    address: "@city(true)"
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { insurance, uav, state, company, companyType, uavType, deviceType, importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (insurance && item.insurance.indexOf(insurance) < 0) return false
        if (uav && item.uav.indexOf(uav) < 0) return false
        if (state && item.state !== state) return false

        if (company && item.company.indexOf(company) < 0) return false
        if (companyType && item.companyType !== companyType) return false
        if (deviceType && item.deviceType !== deviceType) return false
        if (uavType && item.uavType !== uavType) return false


        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

