//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    isAuth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  onLoad: function (query) {
   
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
  handletoOrder(e) {
    let {target:{dataset:{id}}} = e
    if (id) {
      wx.navigateTo({
        url: '/pages/orderList/orderList?type='+ id
      })
    }
  },
  bindGetUserInfo(e) {
    let detail = e.detail
    if (detail.userInfo) {
      this.setData({
        isAuth: true,
        userInfo: detail.userInfo
      })

      
      app.globalData.userInfo = detail.userInfo
      wx.setStorageSync('userInfo', detail.userInfo)
    }
  }
  
})
