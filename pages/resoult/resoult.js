//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    query: {},
    userInfo: {},
    isAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  onLoad: function (query) {
    this.setData({
      query: query
    })
   
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
