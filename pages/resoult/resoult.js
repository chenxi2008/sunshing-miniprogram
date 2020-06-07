//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    query: {},
    userInfo: {},
    orderinfo: {},
    isAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  onLoad: function (query) {
    this.setData({
      query: query
    })
    console.log(query)
    if (query.id && query.type != 'padding') {
      this.queryOrder(query.id)
    }
    if (app.globalData.userInfo) {
      this.setData({
        isAuth: true,
        userInfo: app.globalData.userInfo
      })
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  isAuth: true,
                  userInfo: res.userInfo
                })
                app.globalData.userInfo = res.userInfo
                wx.setStorageSync('userInfo', res.userInfo)
              }
            })
          }
        }
      })
    }
  },
  //获取订单信息
  queryOrder(id) {
    wx.request({
      url: app.globalData.baseUrl + '/order/getOrderById',
      data: {
        id: id
      },
      success: res => {
        if (res.data.code == 200) {
          let _res = res.data.data[0]
          _res.begintime = util.getNextDate(_res.createtime) +" "+ _res.begintime
          this.setData({
            orderinfo: res.data.data[0]
          })
        }
      }
    })
  },
  auth (cb) {
    wx.request({
      url: app.globalData.baseUrl + '/auth/flashAccessToken',
      data: {
        openid: app.globalData.openid
      },
      method: 'GET',
      success: res => {
        (res.data.code == 200) && cb()
      }
    })

  },
  bindSubscribe(e) {
    this.auth(() => {
      wx.requestSubscribeMessage({
        tmplIds: ['u7pXsP1G7U2Bc1lDZH1BSxdSGAXbXyYSP9ROHr43x84'],
        success (res) { 
  
        }
      })
    })
  }
})
